---
title: "Varför dina Custom Element-tester misslyckas tyst i Vitest"
description: "Två icke-uppenbara fallgropar som får Custom Element-tester att se korrekta ut medan de är helt trasiga, och hur man åtgärdar dem."
date: 2026-05-03
translationKey: "custom-element-vitest-silent-failures"
machineTranslated: true
---

Jag byggde nyligen [`a11y-hud`](https://github.com/arthurvasconcelos/a11y-hud), ett ramverksoberoende tillgänglighetsoverlay som kör axe-core-granskningar inuti en körande webbapp. Kärnan är ett Custom Element, `<a11y-hud>`, med Shadow DOM. Att skriva enhetstester för det i Vitest med jsdom visade sig vara mer intressant än jag väntat mig, och inte på ett bra sätt. Det här är de två felen som kostade mig mest tid.

## Uppsättningen

Elementet registrerar sig själv som en sidoeffekt när dess modul laddas:

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

I testfilen:

```typescript
import { A11yHudElement } from "./element.js";

it("registers as a custom element", () => {
  expect(customElements.get("a11y-hud")).toBeDefined(); // undefined
});
```

Det här testet misslyckas. `customElements.get("a11y-hud")` returnerar `undefined`, som om `customElements.define` aldrig anropats. Inget importfel, inget modulfel, ingenting i konsolen. Importraden står ju där. Define-anropet skedde bara aldrig.

---

## Problem 1: esbuild tar bort en import du aldrig använder

Vitest lämnar TypeScript-filer till esbuild, som transpilerar dem en fil i taget utan typinformation. Det spelar roll här, eftersom esbuild inte har någon möjlighet att veta om `A11yHudElement` är en klass eller ett interface. TypeScripts egen regel är att en import som bara används som typ raderas ur utdata, och esbuild kopierar den regeln på det enda sätt det kan: om ett importerat namn aldrig används som ett värde i filen tas hela importen bort.

I testet ovan importeras `A11yHudElement` men refereras aldrig. `it`-blocket anropar bara `customElements.get("a11y-hud")`. Så esbuild behandlar importen som typ-only och raderar den. Resultatet är en fil utan någon import alls, `element.ts` laddas aldrig och `customElements.define` körs aldrig. Du kan se det själv genom att köra testet genom `esbuild --loader=ts`: importraden är helt enkelt borta.

Lösningen jag valde är en rad:

```typescript
import { A11yHudElement } from "./element.js";

void A11yHudElement; // uses the import as a value, so esbuild keeps it

it("registers as a custom element", () => {
  expect(customElements.get("a11y-hud")).toBeDefined(); // defined
});
```

`void expr` evaluerar uttrycket och slänger resultatet, vilket räcker för att göra importen till en värdeimport. Det finns två renare alternativ, beroende på smak. En ren sidoeffektsimport, `import "./element.js"`, säger exakt vad du menar och kan inte elimineras. Eller sätt `verbatimModuleSyntax: true` i din tsconfig: esbuild respekterar det och slutar ta bort importer, och TypeScript tvingar dig då att skriva `import type` för de som bara är typer. Det skulle jag välja i ett nytt projekt. I ett befintligt projekt med många blandade importer är `void`-raden det pragmatiska valet.

Det här biter inte i produktionsbygget, eftersom ingenting där importerar klassen utan att använda den. Det dyker bara upp i tester, där det är helt normalt att importera en modul enbart för dess registreringssidoeffekt.

---

## Problem 2: jsdom rapporterar livscykelfel någonstans där du inte tittar

Med det första problemet löst registrerades elementet, men flera tester som berodde på `connectedCallback` fick fortfarande timeout. Närmare bestämt satt tester som väntade på att `el.dataset.theme` skulle sättas kvar hela 1000 ms och misslyckades. Här är en förenklad version av `connectedCallback`:

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

Och `resolveTheme` anropar `matchMedia`:

```typescript
export function resolveTheme(theme: Theme): ResolvedTheme {
  if (matchMedia("(prefers-contrast: more)").matches) return "high-contrast";
  // ...
}
```

jsdom implementerar inte `window.matchMedia`. Att anropa det kastar `TypeError: matchMedia is not a function`. Så `_applyResolvedTheme` kastar, `dataset.theme` sätts aldrig och testet väntar tills det får timeout.

Det som gör det här svårt att felsöka är var felet hamnar. `document.body.appendChild(el)` kastar inte. Testet misslyckas inte på raden som orsakade problemet. Det misslyckas på en timeout, med ett meddelande om att `dataset.theme` fortfarande är undefined, vilket pekar dig mot temalogiken snarare än mot `matchMedia`. `TypeError`-felet skrivs visserligen ut, men av Vitest, som ett "Unhandled Error"-block efter hela körningen, utan någon koppling tillbaka till testet som fick timeout. Och om testfilen du tittar på råkar inte göra några assertions på något nedströms från kastet, så passerar den, med felet liggande längst ner i utdata som en vag varning om falska positiver.

Det här är spec-enligt beteende. [Custom Elements-specifikationen](https://html.spec.whatwg.org/multipage/custom-elements.html#invoke-custom-element-reactions) säger att ett undantag som kastas från en livscykel-callback (`connectedCallback`, `attributeChangedCallback` och så vidare) ska rapporteras, inte propageras till det som utlöste det. jsdom gör exakt det: det fångar felet och rapporterar det på samma sätt som en webbläsare rapporterar ett ofångat undantag från en händelsehanterare. I en webbläsare är det rätt beslut, eftersom ett trasigt element inte ska ta ner hela sidan. I ett test innebär det att stacktracen och den misslyckade assertionen är två olika saker på två olika ställen.

Lösningen är att stubba `window.matchMedia` i en Vitest-setupfil, som körs en gång före alla testfiler:

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

När du ändå är där, stubba även `scrollIntoView`. jsdom implementerar inte heller den, och den dyker upp som samma sorts frikopplade ohanterade fel så fort ett test går igenom ett highlight- eller scrollflöde:

```typescript
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
```

---

## Checklistan

Om du testar Custom Elements i Vitest med jsdom, gör de här tre sakerna från början och hoppa över felsökningssessionen:

1. **Se till att elementmodulen faktiskt laddas.** Antingen `void MyElement` efter importen, en ren `import "./my-element.js"` eller `verbatimModuleSyntax: true` i tsconfig. Utan något av dessa tar esbuild bort en import som det aldrig ser användas som värde.

2. **Stubba `window.matchMedia`** i dina `setupFiles`. Varje livscykel-callback som rör media queries kommer att kasta, och kastet landar inte i testet som beror på den.

3. **Stubba `Element.prototype.scrollIntoView`** i dina `setupFiles`, av samma anledning.

```typescript [vitest.config.ts]
export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["src/test-setup.ts"],
  },
});
```

De två problemen förstärker varandra. Att esbuild tar bort en import lämnar inga spår alls, och att jsdom rapporterar livscykelfel vid sidan av lämnar ett spår som inte pekar på testet som gick sönder. När du väl känner till båda felsätten är felsökningsvägen kort. Innan du känner till dem ser båda likadana ut utifrån: `customElements.get("my-element")` returnerar `undefined`, eller `dataset.theme` dyker aldrig upp, och ingenting i utdata bredvid det misslyckade testet berättar varför.
