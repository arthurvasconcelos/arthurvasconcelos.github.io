import type { InjectionKey, Ref } from "vue";

const LAB_WIRING: InjectionKey<Ref<boolean>> = Symbol("lab-wiring");

/**
 * Shared "show the wiring" state for a lab demo.
 *
 * LabDemo owns the toggle; the experiment inside it injects the flag to decide
 * whether to render its knobs. Injecting outside a LabDemo simply yields false,
 * so experiments stay usable standalone.
 */
export function provideLabWiring() {
  const showWiring = ref(false);
  provide(LAB_WIRING, showWiring);
  return { showWiring };
}

export function useLabWiring() {
  const showWiring = inject(LAB_WIRING, undefined) ?? ref(false);
  return { showWiring };
}
