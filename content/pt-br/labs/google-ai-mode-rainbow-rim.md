---
title: A borda arco-íris do Google que segue o cursor
description: Como o botão "AI Mode" do google.com pinta um arco-íris ao longo da borda que acompanha o seu cursor — e por que as cores mudam dependendo da direção em que você se move.
date: 2026-08-12
tags: ["css", "conic-gradient", "mask", "reverse-engineering"]
translationKey: google-ai-mode-rainbow-rim
machineTranslated: true
---

O botão "AI Mode" do google.com faz algo adorável no hover: uma fatia de
arco-íris acende na borda e desliza junto com o cursor. Passe da esquerda para a
direita e ela vai de verde → turquesa → azul. Volte e ela vai de vermelho →
laranja → amarelo → verde. Mesmo botão, mesmo gradiente, cores diferentes.

Desmontei o CSS para descobrir como. Acabou sendo cinco ideias empilhadas uma
sobre a outra, e só uma delas é um truque de verdade.

::lab-demo{title="Botão AI Mode" caption="Passe o mouse e deslize por ele — depois inverta a direção."}
:ai-mode-button
::

## 1. Não é uma borda

A primeira surpresa: nada aqui desenha uma borda. A camada de brilho preenche a
pílula **inteira**, e então uma pílula interna opaca — recuada em exatamente um
pixel — é pintada por cima.

```css
.glow    { position: absolute; inset: 0; }      /* rainbow fills the pill */
.surface { position: absolute; inset: 1px;      /* covers all but the rim */
           background: #303134;
           border-radius: 100px; }
```

Só o 1px que a pílula interna não cobre sobrevive, e isso se lê como uma borda
brilhante. No hover o Google adiciona `filter: blur(2px)` a essa superfície
interna, o que suaviza a aresta e deixa o aro sangrar um pouco para dentro.

Nenhuma matemática de anel com `mask-composite`, nenhum `border-image`, nenhum
traço SVG. Só oclusão.

## 2. Um arco-íris, pintado uma vez, só rotacionado

As cores vêm de um único elemento circular carregando um `conic-gradient`. Ele
nunca é recolorido em tempo de execução — a única coisa que muda é o seu
`rotate`:

```css
.wheel {
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  rotate: var(--wheel);
  background: conic-gradient(
    #3186ff 34%, #9378ff 37%, #f96bd6 39%, #fc413d 41%, #fc413d 48%,
    #ff6b2b 50%, #fec700 52%, #ffdb0f 56%, #88de42 58%, #0ebc5f 61%,
    #0ebc5f 65%, #2eaab2 70%, #00a9bb 72%, #3186ff 73%, #3186ff 100%);
}
```

Repare que a parte interessante ocupa só de 34% a 73% da volta — 140° de 360°.
Todo o resto é `#3186ff` chapado: um único arco de 220° de azul atravessando a
emenda de 0°/360°. Esse preenchimento importa mais adiante.

## 3. Um gradiente cônico usado como máscara recorta o cometa

O pai da roda a mascara até sobrar um único arco, usando mais dois gradientes
cônicos combinados com `mask-composite: intersect`:

```css
.window {
  mask-image:
    conic-gradient(from var(--window), transparent 0, transparent 50%,
                   black 68%, black 75%, transparent 89%),
    conic-gradient(from var(--window), black 30%, transparent 50%, black 70%);
  mask-composite: intersect;
}
```

Converta os stops para graus e a interseção não é o arco apertado que parece.
`intersect` compõe as camadas com `source-in` de Porter-Duff, então onde os dois
gradientes fazem rampa os alfas se **multiplicam**. Isso deixa uma cauda longa e
quadraticamente suave: o alfa sai do zero em **180°**, sobe devagar no começo —
o produto de duas rampas ascendentes — chega ao máximo em **252°**, mantém um
platô até **270°** e depois cai até **320°**. Isso é um cometa de **140° de
largura** — 39% de uma volta — a maior parte dele uma cauda muito tênue.
A camada de núcleo nítido usa uma primeira máscara mais justa (`transparent
62%, black 82%`), então começa em **223°** e atinge o pico em **295°**, bem
depois do platô do brilho.

Errei isso na primeira tentativa — li só o platô, chamei a janela de 68° de
largura e depois não consegui explicar por que uma direção mostra seis cores. A
rampa é a história inteira.

Então o efeito inteiro se resume a dois ângulos:

- `--window` — onde o cometa está
- `--wheel` — quais cores estão embaixo dele

## 4. O truque de verdade: `scale: 7 1.5`

Aqui está a parte que eu não esperava. Uma varredura cônica é circular. Um botão
é uma pílula larga e achatada. Rotacionar um gradiente cônico dentro de uma
pílula normalmente mandaria o destaque ao redor de uma elipse apertada, não
deslizando pela aresta superior comprida.

O Google resolve isso escalando o elemento mascarado de forma não uniforme:

```css
.window { scale: 7 1.5; }
```

Esticar x por 7 comprime o espaço angular. Faça as contas numa pílula de 220 ×
44: o canto superior direito da pílula fica nas coordenadas sem escala
`(110 / 7, −22 / 1.5)` ≈ `(15.7, −14.7)`, o que é só **47° fora da vertical**.
A aresta superior inteira da pílula abrange cerca de ±47° — então uma rotação
de bem menos de um quarto de volta leva o destaque de uma ponta à outra, e o
arco abraça a aresta em vez de parecer uma fatia de pizza.

Isso também torna o mapeamento do cursor direto: desfaça a escala e pegue o
ângulo.

```js
const angle = Math.atan2(px / scaleX, -py / scaleY) * 180 / Math.PI;
const window = angle - 286;   // 286° sits between the bloom plateau (252–270°)
                              // and the core peak (295°)
```

## 5. Duas cópias para o brilho

A pilha inteira é renderizada duas vezes dentro da pílula: uma com
`filter: blur(5px)` e uma janela de máscara larga, outra com `filter: blur(1px)`
e uma mais justa. A primeira é o halo, a segunda o núcleo brilhante. Juntas, dão
profundidade ao efeito — um filamento nítido dentro de um brilho suave.

## Por que as cores dependem da direção

Essa foi a parte que demorou mais para entender, e minha primeira resposta
estava errada.

Meu palpite inicial era que a roda ficava *atrasada* em relação à janela — uma
mola, com o resíduo trocando de sinal dependendo da direção do movimento. Isso
produz um tom dependente da direção, mas é dependente da velocidade: as cores
derivam enquanto você se move e voltam ao lugar quando você desacelera. No botão
real, não. Deslize devagar ou rápido, a paleta de uma dada direção é
absolutamente estável.

O que significa que a roda não está atrasada. Ela está **travada** à janela:

```js
wheel = window + offset;                       // both rotate together
offset = direction > 0 ? 0 : 45;               // the only thing direction changes
```

Como as duas rotacionam como uma só, a fatia de arco-íris sob o cometa nunca
deriva enquanto você desliza.

Agora junte o offset com aquele cometa de 140°. Ele tem exatamente a largura da
faixa de cores — ambos abrangem 39% de uma volta — mas isso **não** significa
que cada direção vê tudo, porque as duas janelas ficam em lugares diferentes.
Calcule o alfa da máscara ao longo dos stops do Google e a assimetria é gritante:

| stop | faixa° | → (offset 0°) | ← (offset 45°) |
| --- | --- | --- | --- |
| azul | 122° | — | — |
| violeta | 133° | — | — |
| rosa | 140° | — | .01 |
| vermelho | 148° | — | .03 |
| vermelho | 173° | — | .31 |
| laranja | 180° | — | .43 |
| âmbar | 187° | .01 | .58 |
| amarelo | 202° | .10 | .93 |
| lima | 209° | .18 | **1.00** |
| verde | 220° | .34 | **1.00** |
| verde | 234° | .63 | .82 |
| turquesa | 252° | **1.00** | .46 |
| ciano | 259° | **1.00** | .32 |
| azul | 263° | **1.00** | .25 |

Movendo para a direita, a janela cobre os graus 180°–263° da faixa — só **59%**
dela. Tudo antes do laranja — azul, violeta, rosa, vermelho — fica fora e não é
atenuado, mas ausente. Movendo para a esquerda, a janela cobre 135°–263°, ou
**91%**, e tudo a partir do rosa pega pelo menos um pouco de luz.

É por isso que mover para a direita se lê como um amarelo quase imperceptível
virando verde virando uma ponta turquesa-e-azul brilhante, enquanto mover para a
esquerda se lê como um arco-íris completo com pico no amarelo-esverdeado. É a
mesma faixa nas duas vezes, iluminada de forma diferente. Inverta a direção e o
offset transita suavemente de um valor para o outro, fazendo um crossfade em vez
de um salto.

Há um segundo motivo para a varredura à direita terminar tão azul. A camada de
núcleo nítido atinge o pico em 295°, e com offset 0° isso cai no grau 295° da
faixa — depois do fim da faixa em 263°, lá no preenchimento azul chapado. Então,
movendo para a direita, o filamento nítido é `#3186ff` puro e só o brilho mais
suave atrás dele carrega cor. Movendo para a esquerda, o mesmo pico cai em 250°,
bem em cima do turquesa.

Uma consequência que vale notar se você construir um desses: as duas janelas se
sobrepõem em 95° dos seus 140° de largura, cerca de dois terços, então as
direções **não podem** receber paletas independentes. Há uma única faixa, e os
offsets só escolhem onde a luz cai nela.

Mas isso não é o mesmo que não ter nenhum controle por direção. Considere
"brilhante" como alfa ≥ 0.9 e as duas zonas são completamente disjuntas —
movendo para a direita acendem os graus 245°–263° da faixa, movendo para a
esquerda 200°–230°. Então as cores dominantes de cada direção são suas para
escolher de forma independente; só as caudas tênues são compartilhadas. Na demo
acima, as setas sob cada amostra mostram com que intensidade a janela do brilho
acende aquele stop em cada direção, o que transforma "quais cores essa direção
mostra?" em algo que você simplesmente lê.

Isso também explica um detalhe de antes: aquelas duas custom properties. Se o
offset fosse uma única constante, `--wheel` seria redundante — você só precisaria
de `--window`. A segunda propriedade existe precisamente porque o offset se
move. E aquele arco de 219° de azul chapado no gradiente é o que impede o
cometa de piscar uma emenda dura quando ele passa do fim da faixa — com um cometa
de 140° sempre há um lugar seguro para ele ficar.

## Vale roubar

As ideias reutilizáveis aqui, independentes de arco-íris:

- **Oclusão vence matemática de anel.** Um elemento interno opaco recuado em _n_
  pixels é uma "borda brilhante" mais simples e mais barata do que qualquer anel
  mascarado.
- **Escala não uniforme como transformação de coordenadas.** `scale: 7 1.5`
  transforma um espaço angular circular num que acompanha a aresta de um
  retângulo. Desfaça a escala no JS para mapear o cursor de volta.
- **Anime rotações, não cores.** Um gradiente estático mais dois ângulos é muito
  mais barato do que reconstruir gradientes a cada frame, e os dois ângulos
  podem ser registrados como `<angle>` via `@property`, então o CSS consegue
  fazer a transição deles.

Abra o painel de bastidores na demo acima — o brilho fica aceso enquanto ele
está aberto — e arraste `scale X` para baixo em direção a 1: você pode ver o
espaço angular se descomprimir e o destaque voltar a ser uma varredura circular.
Esse único slider é o truque inteiro.
