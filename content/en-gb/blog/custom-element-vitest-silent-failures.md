---
title: "Why your Custom Element tests fail silently in Vitest"
description: "Two non-obvious gotchas that make Custom Element tests look correct while being completely broken — and how to fix them."
date: 2026-05-03
translationKey: "custom-element-vitest-silent-failures"
---

I recently built [`a11y-hud`](https://github.com/arthurvasconcelos/a11y-hud), a framework-agnostic accessibility overlay that runs axe-core audits inside a running web app. The core of it is a `<a11y-hud>` Custom Element with a Shadow DOM. Writing unit tests for it in Vitest with jsdom turned out to be much more interesting than I expected — in the bad way. Here are the two failures that cost me the most time.

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
  expect(customElements.get("a11y-hud")).toBeDefined(); // ❌ undefined
});
```

This test fails. `customElements.get("a11y-hud")` returns `undefined` — as if `customElements.define` was never called. But there's no import error, no module error, nothing in the console. The import succeeded. The define call just… didn't happen.

---

## Problem 1: esbuild defers module execution when you don't use the export

Vitest uses esbuild to transform TypeScript. When it sees a named export that is imported but never referenced in the test body, it can skip executing that module's side effects entirely.

In the test above, `A11yHudElement` is imported but never used. The `it` block only calls `customElements.get("a11y-hud")` — it doesn't touch `A11yHudElement` directly. From esbuild's perspective, the import is dead code. The module is never executed. `customElements.define` never runs.

**The fix is one line:**

```typescript
import { A11yHudElement } from "./element.js";

void A11yHudElement; // forces the module to execute

it("registers as a custom element", () => {
  expect(customElements.get("a11y-hud")).toBeDefined(); // ✅
});
```

`void expr` evaluates the expression and discards the result. It's enough to tell esbuild that the import is live, so the module executes, the side effect runs, and the element is registered.

This only happens in Vitest's test environment. At build time, tsup's `text` loader and bundler configuration treat the module correctly. It's purely a Vitest/esbuild interaction.

---

## Problem 2: jsdom silently swallows lifecycle callback errors

With the first problem fixed, the element registered — but several tests that relied on `connectedCallback` behaviour were still timing out. Specifically, tests that waited for `el.dataset.theme` to be defined would sit there for the full 1000 ms and fail. Here's a simplified version of `connectedCallback`:

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

jsdom does not implement `window.matchMedia`. Calling it throws a `TypeError: matchMedia is not a function`. So `_applyResolvedTheme` throws, `dataset.theme` is never set, and the test waits forever.

But here's the subtle part: **there is no error in the test output**. No `TypeError`, no stack trace, nothing. The test just times out.

The reason is that this is actually spec-compliant behaviour. The [Custom Elements spec](https://html.spec.whatwg.org/multipage/custom-elements.html#concept-upgrade-an-element) requires that errors thrown inside lifecycle callbacks (`connectedCallback`, `attributeChangedCallback`, etc.) are caught and reported as uncaught exceptions rather than propagated to the caller. jsdom follows this spec, which means `document.body.appendChild(el)` does not throw even when `connectedCallback` throws internally. The error is swallowed.

This is the right behaviour in a browser — you don't want a single misbehaving element to bring down the whole page. But in tests, it makes Custom Element debugging surprisingly hard.

**The fix:** stub `window.matchMedia` in the test setup file. Since Vitest supports a `setupFiles` option, this runs once before any tests:

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

While you're in the setup file, also stub `scrollIntoView` — jsdom doesn't implement that either, and it will surface as an unhandled error the moment any test exercises a highlight/scroll flow:

```typescript
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
```

---

## The checklist

If you're testing Custom Elements in Vitest with jsdom, do these three things upfront and save yourself the debugging session:

1. **Access every imported element class** with `void MyElement` at the top of each test file that imports it. Without this, esbuild may not execute the module.

2. **Stub `window.matchMedia`** in your `setupFiles`. Any lifecycle callback that touches media queries will throw silently if this isn't present.

3. **Stub `Element.prototype.scrollIntoView`** in your `setupFiles`. jsdom doesn't implement it and the error will appear at an inconvenient time.

```typescript [vitest.config.ts]
export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["src/test-setup.ts"],
  },
});
```

The combination of esbuild deferring execution and jsdom silently catching lifecycle errors makes Custom Element test failures look completely different from what they actually are. Once you know these two failure modes, the debugging path is straightforward — but before you know them, both failures look like the same thing: `customElements.get("my-element")` returns `undefined` and nothing in the output tells you why.
