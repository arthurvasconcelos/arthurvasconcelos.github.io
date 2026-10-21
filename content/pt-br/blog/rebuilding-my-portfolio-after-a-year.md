---
title: "Reconstruindo meu portfólio depois de um ano de abandono"
description: "A história específica e um pouco constrangedora do que acontece quando você deixa passar um ano entre commits no seu próprio portfólio."
date: 2026-05-01
translationKey: "rebuilding-my-portfolio-after-a-year"
machineTranslated: true
---

Estou com este repositório aberto agora mesmo, e o último commit antes do trabalho deste ano é de maio de 2025. A mensagem é "ClientOnly behaving weirdly with icons". Foi o fim de uma maratona de um dia em que migrei o site para Nuxt, esbarrei num bug de ícones, fiz o commit e depois não abri o repositório de novo por onze meses.

Este não é um post sobre produtividade. Não vou contar sobre o meu sistema para manter projetos pessoais vivos. Eu não tenho um. O que eu tenho é um portfólio que continuou dizendo "Atualmente na Kognity" meses depois de eu ter saído de lá, um `console.log("app.vue:", colorMode)` indo para produção e uma cor de destaque principal que era literalmente `#ff0000`.

Não era uma escolha de design. Vermelho puro, parado na configuração do app, sem nada em volta que sugerisse que um dia eu pretendia voltar ali. Imagino que o eu do passado achou que eu ia lembrar. Não lembrei.

## Como estava quando voltei

A primeira coisa que notei quando finalmente sentei com isso em abril: uma base de código que estava majoritariamente bem, mas cheia de pequenos constrangimentos. O vermelho. O `console.log`. Um `README2.md` (conteúdo: a documentação boilerplate do Nuxt, copiada do template inicial e aparentemente nunca mais aberta). Um arquivo `deploy.bat` num Mac que faz deploy para Linux. Um componente de rodapé importado em lugar nenhum, sem fazer nada. Dez PRs do Dependabot abertos que eu tinha marcado como aprovados e nunca mergeei.

O instinto quando você vê esse tipo de coisa no seu próprio código é se sentir mal. Eu aprendi, na maior parte do tempo, a tratar isso como evidência sedimentada de prioridades passadas. O código funcionava o suficiente para manter o site no ar; consertá-lo nunca foi urgente o bastante para acontecer de fato.

O que eu senti de verdade: se este fosse o repositório de outra pessoa e eu estivesse fazendo code review, teria muitos comentários.

## O trabalho prático

Migrei do Yarn 1 para o pnpm (o Yarn 1 não é mantido há anos; eu já queria fazer isso nos projetos pessoais), resolvi todos os PRs do Dependabot de uma vez e apaguei os arquivos mortos. Adicionei ESLint e Prettier, já que, de alguma forma, não havia linter nenhum. Nada empolgante. Necessário.

A parte mais interessante: tirar conteúdo hardcoded de dentro dos componentes Vue. Meu histórico profissional estava num arquivo `.vue`. Adicionar um novo emprego significava editar a marcação de um componente. Atualizar aquilo parecia mais atrito do que valia a pena, que é exatamente o motivo de ainda dizer Kognity quando voltei.

Movi tudo para arquivos de dados tipados: `work-experiences.ts`, `skills.ts`, `projects.ts`. Os componentes agora são só apresentação. Atualizar o conteúdo é só atualizar um array; não há motivo para mexer num componente.

Também matei as barras de porcentagem de habilidades. "TypeScript: 90%". Eu odeio aquilo. Os números são inventados e convidam a dois tipos de falha: ou você subestima e parece estar se protegendo, ou superestima e convida alguém a te sabatinar exatamente no limite que você alegou. Troquei por chips categóricos: Linguagens, Front-end, Back-end etc. Mais honesto, menos manipulável.

## A i18n que eu subestimei

O site agora está em inglês, português e sueco. Moro na Suécia, cresci no Brasil, trabalho em inglês. Fazia sentido cobrir os três.

Configurar o `@nuxtjs/i18n` não foi a parte difícil. A parte difícil foi escrever as traduções de verdade. Especificamente, escrever minha experiência profissional em sueco de um jeito que não soe obviamente como se tivesse passado por um tradutor.

Meu sueco é funcional: consigo ter a maioria das conversas, inclusive conversas de trabalho quando surgem. Mas o registro formal é diferente do registro de conversa. Gastei mais tempo na bio profissional em sueco do que em todo o resto junto. Ainda não está perfeita.

O português foi mais fácil (obviamente), mas teve seus próprios casos de borda. "Tech Lead" no software brasileiro costuma ser só "Tech Lead" mesmo, como empréstimo, mas "Senior Front-End Engineer" vira "Engenheiro Front-End Sênior" e há opiniões de verdade na comunidade sobre se esse decalque está correto. Eu tenho opiniões. Fiz escolhas. Algum desenvolvedor brasileiro vai ler isso e ter uma opinião.

## O que ficou de fora

Considerei uma seção de projetos que puxasse automaticamente a atividade do GitHub. Decidi que não: dados puxados automaticamente são preguiça e as listas resultantes são ruído. A página de projetos agora tem um conjunto curado: o [Overseer](https://github.com/arthurvasconcelos/overseer), a CLI em Go que uso todo dia para as partes chatas do meu fluxo de trabalho (briefings matinais, notas de standup, identidades git, status de repositórios), seus SDKs em Python e TypeScript, a biblioteca sqlalchemy-seedling que construí para um fluxo de seeding que eu repetia entre projetos, e uma seção de legado para as duas bibliotecas de componentes Vue que publiquei em 2018 e que ainda têm alguns usuários.

Também considerei um redesign visual mais significativo. Deixei praticamente como estava. O fundo em gradiente escuro funciona bem. Nem tudo precisa ser repensado.

## Por que estou escrevendo isso

Eu quero um blog. Não um blog de tutoriais, há tutoriais melhores do que os que eu escreveria para quase qualquer assunto. Mais como isto: relatos específicos sobre o que estou construindo de fato, o que deu errado, quais decisões eu revisitaria.

A reconstrução do site foi o ponto de partida natural. É meta de um jeito com o qual consigo conviver, porque também é genuinamente o que venho trabalhando, e escrever as decisões me obriga a ter opiniões sobre elas em vez de só fazer as coisas.

Mais posts vêm por aí. Tenho anotações sobre a construção do Overseer, algumas ideias sobre os padrões de TypeScript que uso na Platform24 e que diferem do que vejo na maioria das bases de código Vue e React, e provavelmente algumas coisas sobre Estocolmo que não têm nada a ver com código.

O blog está no ar. É um lugar bom o suficiente para começar.
