---
title: "Why your Custom Element tests fail silently in Vitest"
description: "Two non-obvious gotchas that make Custom Element tests look correct while being completely broken, and how to fix them."
date: 2026-05-03
translationKey: "custom-element-vitest-silent-failures"
---

I recently built [`a11y-hud`](https://github.com/arthurvasconcelos/a11y-hud), a framework-agnostic accessibility overlay that runs axe-core audits inside a running web app. The core of it is a `<a11y-hud>` Custom Element with a Shadow DOM. Writing unit tests for it in Vitest with jsdom turned out to be more interesting than I expected, and not in a good way. These are the two failures that cost me the most time.

## The setup

The element registers itself as a side effect when its module loads:

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

In the test file:

```typescript
import { A11yHudElement } from "./element.js";

it("registers as a custom element", () => {
  expect(customElements.get("a11y-hud")).toBeDefined(); // undefined
});
```

This test fails. `customElements.get("a11y-hud")` returns `undefined`, as if `customElements.define` was never called. No import error, no module error, nothing in the console. The import line is right there. The define call just didn't happen.

---

## Problem 1: esbuild drops an import you never use

Vitest hands TypeScript files to esbuild, which transpiles them one file at a time without type information. That matters here, because esbuild has no way of knowing whether `A11yHudElement` is a class or an interface. TypeScript's own rule is that an import used only as a type gets erased from the output, and esbuild copies that rule the only way it can: if an imported name is never used as a value in the file, the whole import is removed.

In the test above, `A11yHudElement` is imported but never referenced. The `it` block only calls `customElements.get("a11y-hud")`. So esbuild treats the import as type-only and deletes it. The output is a file with no import at all, `element.ts` never loads, and `customElements.define` never runs. You can see this yourself by piping the test through `esbuild --loader=ts`: the import line is simply gone.

The fix I went with is one line:

```typescript
import { A11yHudElement } from "./element.js";

void A11yHudElement; // uses the import as a value, so esbuild keeps it

it("registers as a custom element", () => {
  expect(customElements.get("a11y-hud")).toBeDefined(); // defined
});
```

`void expr` evaluates the expression and throws away the result, which is enough to make the import a value import. There are two cleaner alternatives, depending on taste. A bare side-effect import, `import "./element.js"`, says exactly what you mean and can't be elided. Or set `verbatimModuleSyntax: true` in your tsconfig: esbuild honours it and stops dropping imports, and TypeScript then forces you to write `import type` for the type-only ones. I'd pick that for a new project. In an existing one with a lot of mixed imports, the `void` line is the pragmatic option.

This doesn't bite in the production build, because nothing there imports the class without using it. It only shows up in tests, where importing a module purely for its registration side effect is a normal thing to do.

---

## Problem 2: jsdom reports lifecycle errors somewhere you're not looking

With the first problem fixed, the element registered, but several tests that depended on `connectedCallback` were still timing out. Specifically, tests that waited for `el.dataset.theme` to be set would sit there for the full 1000 ms and fail. Here's a simplified version of `connectedCallback`:

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

And `resolveTheme` calls `matchMedia`:

```typescript
export function resolveTheme(theme: Theme): ResolvedTheme {
  if (matchMedia("(prefers-contrast: more)").matches) return "high-contrast";
  // ...
}
```

jsdom does not implement `window.matchMedia`. Calling it throws `TypeError: matchMedia is not a function`. So `_applyResolvedTheme` throws, `dataset.theme` is never set, and the test waits until it times out.

The part that makes this hard to debug is where the error ends up. `document.body.appendChild(el)` does not throw. The test doesn't fail at the line that caused the problem. It fails on a timeout, with a message about `dataset.theme` still being undefined, which points you at the theme logic rather than at `matchMedia`. The `TypeError` does get printed, but by Vitest, as an "Unhandled Error" block after the whole run, with no link back to the test that timed out. And if the test file you're looking at doesn't happen to assert on anything downstream of the throw, it passes, with the error sitting at the bottom of the output as a vague warning about false positives.

This is spec-compliant behaviour. The [Custom Elements spec](https://html.spec.whatwg.org/multipage/custom-elements.html#invoke-custom-element-reactions) says that an exception thrown from a lifecycle callback (`connectedCallback`, `attributeChangedCallback`, and so on) must be reported, not propagated to whatever triggered it. jsdom does exactly that: it catches the error and reports it the same way a browser reports an uncaught exception from an event handler. In a browser this is the right call, because one broken element shouldn't take down the page. In a test it means the stack trace and the failing assertion are two different things in two different places.

The fix is to stub `window.matchMedia` in a Vitest setup file, which runs once before any test file:

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

While you're in there, also stub `scrollIntoView`. jsdom doesn't implement that one either, and it will surface as the same kind of detached unhandled error the moment a test exercises a highlight or scroll flow:

```typescript
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
```

---

## The checklist

If you're testing Custom Elements in Vitest with jsdom, do these three things upfront and skip the debugging session:

1. **Make sure the element module actually loads.** Either `void MyElement` after the import, a bare `import "./my-element.js"`, or `verbatimModuleSyntax: true` in tsconfig. Without one of these, esbuild drops an import it never sees used as a value.

2. **Stub `window.matchMedia`** in your `setupFiles`. Any lifecycle callback that touches media queries will throw, and the throw won't land in the test that depends on it.

3. **Stub `Element.prototype.scrollIntoView`** in your `setupFiles`, for the same reason.

```typescript [vitest.config.ts]
export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["src/test-setup.ts"],
  },
});
```

The two problems compound. esbuild removing an import leaves no trace at all, and jsdom reporting lifecycle errors out of band leaves a trace that doesn't point at the test that broke. Once you know both failure modes, the debugging path is short. Before you know them, both look the same from the outside: `customElements.get("my-element")` returns `undefined`, or `dataset.theme` never shows up, and nothing in the output next to the failing test tells you why.
