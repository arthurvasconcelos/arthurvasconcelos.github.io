---
title: "Por que seus testes de Custom Elements falham silenciosamente no Vitest"
description: "Duas pegadinhas nada óbvias que fazem testes de Custom Elements parecerem corretos enquanto estão completamente quebrados, e como corrigi-las."
date: 2026-05-03
translationKey: "custom-element-vitest-silent-failures"
machineTranslated: true
---

Recentemente construí o [`a11y-hud`](https://github.com/arthurvasconcelos/a11y-hud), um overlay de acessibilidade agnóstico de framework que roda auditorias do axe-core dentro de uma aplicação web em execução. O núcleo dele é um Custom Element `<a11y-hud>` com Shadow DOM. Escrever testes unitários para ele no Vitest com jsdom acabou sendo mais interessante do que eu esperava, e não no bom sentido. Estas são as duas falhas que me custaram mais tempo.

## A configuração

O elemento se registra como efeito colateral quando seu módulo carrega:

```typescript
export class A11yHudElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    // sets data-theme, renders the panel, starts the scan...
  }
}

customElements.define("a11y-hud", A11yHudElement);
```

No arquivo de teste:

```typescript
import { A11yHudElement } from "./element.js";

it("registers as a custom element", () => {
  expect(customElements.get("a11y-hud")).toBeDefined(); // undefined
});
```

Este teste falha. `customElements.get("a11y-hud")` retorna `undefined`, como se `customElements.define` nunca tivesse sido chamado. Nenhum erro de import, nenhum erro de módulo, nada no console. A linha de import está bem ali. A chamada de define simplesmente não aconteceu.

---

## Problema 1: o esbuild descarta um import que você nunca usa

O Vitest entrega arquivos TypeScript ao esbuild, que os transpila um por vez, sem informação de tipos. Isso importa aqui, porque o esbuild não tem como saber se `A11yHudElement` é uma classe ou uma interface. A regra do próprio TypeScript é que um import usado apenas como tipo é apagado da saída, e o esbuild copia essa regra da única forma que consegue: se um nome importado nunca é usado como valor no arquivo, o import inteiro é removido.

No teste acima, `A11yHudElement` é importado mas nunca referenciado. O bloco `it` só chama `customElements.get("a11y-hud")`. Então o esbuild trata o import como somente-tipo e o apaga. A saída é um arquivo sem import nenhum, `element.ts` nunca carrega e `customElements.define` nunca roda. Você pode ver isso por conta própria passando o teste pelo `esbuild --loader=ts`: a linha de import simplesmente some.

A correção que escolhi é uma linha:

```typescript
import { A11yHudElement } from "./element.js";

void A11yHudElement; // uses the import as a value, so esbuild keeps it

it("registers as a custom element", () => {
  expect(customElements.get("a11y-hud")).toBeDefined(); // defined
});
```

`void expr` avalia a expressão e descarta o resultado, o que basta para tornar o import um import de valor. Há duas alternativas mais limpas, dependendo do gosto. Um import puro de efeito colateral, `import "./element.js"`, diz exatamente o que você quer dizer e não pode ser eliminado. Ou defina `verbatimModuleSyntax: true` no seu tsconfig: o esbuild respeita isso e para de descartar imports, e o TypeScript então te obriga a escrever `import type` para os que são só tipo. Eu escolheria essa opção num projeto novo. Num projeto existente com muitos imports mistos, a linha com `void` é a opção pragmática.

Isso não morde no build de produção, porque nada ali importa a classe sem usá-la. Só aparece nos testes, onde importar um módulo puramente pelo efeito colateral de registro é algo normal de se fazer.

---

## Problema 2: o jsdom reporta erros de ciclo de vida num lugar onde você não está olhando

Com o primeiro problema resolvido, o elemento se registrava, mas vários testes que dependiam do `connectedCallback` ainda estouravam o tempo limite. Especificamente, testes que esperavam `el.dataset.theme` ser definido ficavam parados pelos 1000 ms inteiros e falhavam. Aqui está uma versão simplificada do `connectedCallback`:

```typescript
connectedCallback() {
  this._applyResolvedTheme(); // sets dataset.theme
  this._render();
  void this._runScan();
}

private _applyResolvedTheme() {
  this.dataset.theme = resolveTheme(this._theme);
}
```

E `resolveTheme` chama `matchMedia`:

```typescript
export function resolveTheme(theme: Theme): ResolvedTheme {
  if (matchMedia("(prefers-contrast: more)").matches) return "high-contrast";
  // ...
}
```

O jsdom não implementa `window.matchMedia`. Chamá-lo lança `TypeError: matchMedia is not a function`. Então `_applyResolvedTheme` lança a exceção, `dataset.theme` nunca é definido e o teste espera até estourar o tempo.

A parte que torna isso difícil de depurar é onde o erro vai parar. `document.body.appendChild(el)` não lança nada. O teste não falha na linha que causou o problema. Ele falha por timeout, com uma mensagem sobre `dataset.theme` ainda estar undefined, o que aponta para a lógica de tema e não para o `matchMedia`. O `TypeError` até é impresso, mas pelo Vitest, como um bloco "Unhandled Error" depois da execução inteira, sem nenhuma ligação com o teste que estourou o tempo. E se o arquivo de teste que você está olhando por acaso não faz asserções sobre nada a jusante da exceção, ele passa, com o erro parado no fim da saída como um aviso vago sobre falsos positivos.

Esse é o comportamento conforme a especificação. A [especificação de Custom Elements](https://html.spec.whatwg.org/multipage/custom-elements.html#invoke-custom-element-reactions) diz que uma exceção lançada de um callback de ciclo de vida (`connectedCallback`, `attributeChangedCallback` e assim por diante) deve ser reportada, não propagada para o que a disparou. O jsdom faz exatamente isso: captura o erro e o reporta do mesmo jeito que um navegador reporta uma exceção não tratada de um manipulador de evento. Num navegador essa é a decisão certa, porque um elemento quebrado não deveria derrubar a página. Num teste, significa que o stack trace e a asserção que falhou são duas coisas diferentes em dois lugares diferentes.

A correção é fazer um stub de `window.matchMedia` num arquivo de setup do Vitest, que roda uma vez antes de qualquer arquivo de teste:

```typescript [src/test-setup.ts]
if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    value: (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
    configurable: true,
    writable: true,
  });
}
```

Já que você está lá, faça um stub de `scrollIntoView` também. O jsdom também não implementa esse, e ele vai aparecer como o mesmo tipo de erro não tratado e desconectado no momento em que um teste exercitar um fluxo de destaque ou rolagem:

```typescript
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
```

---

## O checklist

Se você está testando Custom Elements no Vitest com jsdom, faça estas três coisas de antemão e pule a sessão de depuração:

1. **Garanta que o módulo do elemento realmente carrega.** Ou `void MyElement` depois do import, ou um `import "./my-element.js"` puro, ou `verbatimModuleSyntax: true` no tsconfig. Sem um desses, o esbuild descarta um import que nunca vê sendo usado como valor.

2. **Faça um stub de `window.matchMedia`** no seu `setupFiles`. Qualquer callback de ciclo de vida que toque em media queries vai lançar uma exceção, e ela não vai cair no teste que depende dele.

3. **Faça um stub de `Element.prototype.scrollIntoView`** no seu `setupFiles`, pelo mesmo motivo.

```typescript [vitest.config.ts]
export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["src/test-setup.ts"],
  },
});
```

Os dois problemas se somam. O esbuild removendo um import não deixa rastro nenhum, e o jsdom reportando erros de ciclo de vida fora de banda deixa um rastro que não aponta para o teste que quebrou. Depois que você conhece os dois modos de falha, o caminho de depuração é curto. Antes de conhecê-los, os dois parecem iguais vistos de fora: `customElements.get("my-element")` retorna `undefined`, ou `dataset.theme` nunca aparece, e nada na saída ao lado do teste que falhou te diz por quê.
