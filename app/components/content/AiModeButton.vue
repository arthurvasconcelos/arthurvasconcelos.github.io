<script setup lang="ts">
/**
 * Reproduction of the cursor-following rainbow rim on Google's "AI Mode" button.
 *
 * The mechanics, in short:
 *  - ONE static conic-gradient wheel holds the whole rainbow; it is only rotated.
 *  - A pair of conic-gradients used as a mask reveals an arc of that wheel. The
 *    intersect multiplies the layers' alphas (Porter-Duff source-in), so the
 *    comet is ~140deg wide with a quadratically soft tail: faint from 180deg,
 *    full between 252deg and 270deg, gone by 320deg. The crisp core layer uses
 *    a tighter mask that starts at 223deg and peaks at 295deg.
 *  - The masked element is scaled non-uniformly (7, 1.5) so an angular sweep
 *    slides along the long edge of a pill instead of around a circle.
 *  - The glow fills the pill; an opaque inner pill inset by 1px covers all but
 *    the rim. No ring maths required.
 *  - The wheel is locked to the mask window with a phase offset, and that offset
 *    is the only thing the travel direction changes.
 *
 * The comet and the colour band are exactly as wide (both 39% of a turn), but
 * the two windows sit in different places, so the directions are NOT symmetric.
 * Moving right lights band 180-263deg (59% of the band — everything before
 * orange is absent, not merely dim); moving left lights 135-263deg (91%):
 *
 *   offset  0deg -> amber(.01) yellow(.10) lime(.18) green(.34/.63) teal(1.0)
 *                   cyan(1.0) blue(1.0)
 *   offset 45deg -> pink(.01) red(.03/.31) orange(.43) amber(.58) yellow(.93)
 *                   lime(1.0) green(1.0/.82) teal(.46) cyan(.32) blue(.25)
 *
 * The core layer's 295deg peak also lands past the band end (263deg) at offset
 * 0, out in the flat blue filler — which is why the rightward sweep tips blue.
 */

const { t } = useI18n();
const { showWiring } = useLabWiring();

/** Puts the cursor between the bloom plateau (252-270deg) and the core peak (295deg). */
const WINDOW_CENTRE = 286;
/** Degrees of angular travel before we trust a new direction. */
const DEADZONE = 0.15;

type BandStop = { c: string; at: number };

/**
 * Google's stop list verbatim, with `at` as a percentage across the band arc.
 * Their spacing is deliberately uneven — the flat red and green runs, the sharp
 * teal-to-blue return — so positions are stored rather than spread evenly.
 */
const BAND_DEFAULT: BandStop[] = [
  { c: "#3186ff", at: 0 },
  { c: "#9378ff", at: 7.7 },
  { c: "#f96bd6", at: 12.8 },
  { c: "#fc413d", at: 17.9 },
  { c: "#fc413d", at: 35.9 },
  { c: "#ff6b2b", at: 41 },
  { c: "#fec700", at: 46.2 },
  { c: "#ffdb0f", at: 56.4 },
  { c: "#88de42", at: 61.5 },
  { c: "#0ebc5f", at: 69.2 },
  { c: "#0ebc5f", at: 79.5 },
  { c: "#2eaab2", at: 92.3 },
  { c: "#00a9bb", at: 97.4 },
  { c: "#3186ff", at: 100 },
];
const FILLER_DEFAULT = "#3186ff";
/** Where the rainbow sits on the wheel; the rest is filler (Google: 34%-73%). */
const BAND_START = 122;
const BAND_END = 263;

const scaleX = ref(7);
const scaleY = ref(1.5);
const bloom = ref(5);
const rim = ref(1);
const offsetRight = ref(0);
const offsetLeft = ref(45);
const flip = ref(0.12);

const xray = ref(false);
const unmasked = ref(false);

const band = ref<BandStop[]>(BAND_DEFAULT.map((s) => ({ ...s })));
const filler = ref(FILLER_DEFAULT);

const MIN_STOPS = 2;
const MAX_STOPS = 20;

type PaletteId = "band" | "filler";

const selectedId = ref<PaletteId>("band");
const selectedIndex = ref(0);
const editor = reactive({ h: 0, s: 0, l: 0 });

const selectedHex = computed(() =>
  selectedId.value === "filler"
    ? filler.value
    : (band.value[selectedIndex.value]?.c ?? FILLER_DEFAULT),
);

/**
 * Alpha of the bloom mask at `psi` degrees from the comet's origin. The two
 * mask layers intersect, which multiplies their alphas (Porter-Duff source-in):
 * layer A ramps 180..244.8 and fades 270..320.4, layer B ramps 180..252. The
 * result is a quadratically soft climb to full at 252, a plateau to 270, then
 * a linear fade to nothing by 320.
 */
function maskAlpha(psi: number): number {
  const t = ((psi % 360) + 360) % 360;
  if (t <= 180 || t >= 320.4) return 0;
  const a = t < 244.8 ? (t - 180) / 64.8 : t <= 270 ? 1 : 1 - (t - 270) / 50.4;
  const b = t < 252 ? (t - 180) / 72 : 1;
  return a * b;
}

/**
 * How brightly each direction lights each stop. The two windows overlap by 95deg
 * of their 140deg width (83deg of that inside the band), so the directions
 * cannot have separate palettes — but their bright zones (alpha >= .9) are
 * disjoint, 245-263deg vs 200-230deg, so each direction's dominant colours are
 * yours to set.
 */
const stopLighting = computed(() =>
  band.value.map((stop) => {
    const deg = BAND_START + ((BAND_END - BAND_START) * stop.at) / 100;
    return {
      right: maskAlpha(deg + offsetRight.value),
      left: maskAlpha(deg + offsetLeft.value),
    };
  }),
);

/** Keeps a dragged stop between its neighbours so the band stays ordered. */
const positionBounds = computed(() => ({
  min: band.value[selectedIndex.value - 1]?.at ?? 0,
  max: band.value[selectedIndex.value + 1]?.at ?? 100,
}));

const selectionLabel = computed(() =>
  selectedId.value === "filler" ? "the filler" : `band colour ${selectedIndex.value + 1}`,
);

function selectSwatch(id: PaletteId, index = 0) {
  selectedId.value = id;
  selectedIndex.value = index;
  Object.assign(editor, hexToHsl(selectedHex.value));
}

/** Writes the editor's HSL back into whichever swatch is selected. */
function applyEditor() {
  const hex = hslToHex(editor.h, editor.s, editor.l);
  if (selectedId.value === "filler") {
    filler.value = hex;
    return;
  }
  band.value = band.value.map((s, i) => (i === selectedIndex.value ? { ...s, c: hex } : s));
}

function movePosition(at: number) {
  const { min, max } = positionBounds.value;
  const clamped = Math.min(max, Math.max(min, at));
  band.value = band.value.map((s, i) => (i === selectedIndex.value ? { ...s, at: clamped } : s));
}

function addStop() {
  if (band.value.length >= MAX_STOPS) return;
  const index = selectedId.value === "band" ? selectedIndex.value : band.value.length - 1;
  const current = band.value[index];
  if (!current) return;

  // Drop the new stop midway to the next one, so it is visible straight away.
  const next = band.value[index + 1]?.at ?? 100;
  const copy = [...band.value];
  copy.splice(index + 1, 0, { c: current.c, at: (current.at + next) / 2 });
  band.value = copy;
  selectSwatch("band", index + 1);
}

function removeStop() {
  if (band.value.length <= MIN_STOPS) return;
  const index = selectedId.value === "band" ? selectedIndex.value : band.value.length - 1;
  band.value = band.value.filter((_, i) => i !== index);
  selectSwatch("band", Math.min(index, band.value.length - 1));
}

function resetColours() {
  band.value = BAND_DEFAULT.map((s) => ({ ...s }));
  filler.value = FILLER_DEFAULT;
  selectSwatch("band", 0);
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const match = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex.trim());
  if (!match) return { h: 0, s: 0, l: 50 };

  const r = Number.parseInt(match[1]!, 16) / 255;
  const g = Number.parseInt(match[2]!, 16) / 255;
  const b = Number.parseInt(match[3]!, 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;
  if (delta) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h: number, s: number, l: number): string {
  const sat = s / 100;
  const light = l / 100;
  const c = (1 - Math.abs(2 * light - 1)) * sat;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = light - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g] = [c, x];
  else if (h < 120) [r, g] = [x, c];
  else if (h < 180) [g, b] = [c, x];
  else if (h < 240) [g, b] = [x, c];
  else if (h < 300) [r, b] = [x, c];
  else [r, b] = [c, x];

  const channel = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${channel(r)}${channel(g)}${channel(b)}`;
}

selectSwatch("band", 0);

/**
 * One band of colour spread evenly across BAND_START..BAND_END, filler for the
 * rest of the turn. The comet and the band are equally wide (39% of a turn),
 * but the two windows are offset from each other: moving left sees 91% of the
 * band, moving right only 59%. The offset decides both which colours are lit at
 * all and which land under the bright plateau. That is also why the two
 * directions cannot have independent palettes: their windows overlap by 95deg.
 */
const wheelGradient = computed(() => {
  const stops = [`${filler.value} 0deg`, `${filler.value} ${BAND_START}deg`];

  for (const stop of band.value) {
    const deg = BAND_START + ((BAND_END - BAND_START) * stop.at) / 100;
    stops.push(`${stop.c} ${deg.toFixed(1)}deg`);
  }

  // Short run back to the filler so an edited end colour never leaves a seam.
  stops.push(`${filler.value} ${Math.min(360, BAND_END + 10)}deg`, `${filler.value} 360deg`);

  return `conic-gradient(${stops.join(",")})`;
});

const rootVars = computed(() => ({
  "--aim-sx": String(scaleX.value),
  "--aim-sy": String(scaleY.value),
  "--aim-bloom": `${bloom.value}px`,
  "--aim-rim": `${rim.value}px`,
  "--aim-wheel-gradient": wheelGradient.value,
}));

const buttonEl = ref<HTMLElement | null>(null);
const anglesEl = ref<HTMLElement | null>(null);
const readoutEl = ref<HTMLElement | null>(null);

const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

let targetWindow = 0;
let currentWindow = 0;
let offset = 0;
let direction = 1;
let hasPointer = false;
let raf = 0;

/** Keep the eased value continuous across the 0/360 seam. */
function unwrap(target: number, current: number): number {
  let d = (target - current) % 360;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return current + d;
}

function onPointerMove(event: PointerEvent) {
  const el = buttonEl.value;
  if (!el) return;

  const rect = el.getBoundingClientRect();
  const px = event.clientX - (rect.left + rect.width / 2);
  const py = event.clientY - (rect.top + rect.height / 2);

  // Undo the non-uniform scale to get the cursor's angle in the conic's own space.
  const angle = (Math.atan2(px / scaleX.value, -py / scaleY.value) * 180) / Math.PI;
  const next = unwrap(angle - WINDOW_CENTRE, currentWindow);

  if (!hasPointer) {
    hasPointer = true;
    currentWindow = next;
  } else if (Math.abs(next - targetWindow) > DEADZONE) {
    direction = Math.sign(next - targetWindow);
  }
  targetWindow = next;
}

function frame() {
  const follow = reducedMotion.value ? 1 : 0.35;
  const flipRate = reducedMotion.value ? 1 : flip.value;

  currentWindow += (targetWindow - currentWindow) * follow;
  const wanted = direction > 0 ? offsetRight.value : offsetLeft.value;
  offset += (wanted - offset) * flipRate;

  const wheel = currentWindow + offset;
  anglesEl.value?.style.setProperty("--aim-window", `${currentWindow.toFixed(2)}deg`);
  anglesEl.value?.style.setProperty("--aim-wheel", `${wheel.toFixed(2)}deg`);

  if (readoutEl.value) {
    const deg = (a: number) =>
      `${(((a % 360) + 360) % 360).toFixed(1).padStart(5)}°`;
    readoutEl.value.textContent =
      `--window ${deg(currentWindow)}   --wheel ${deg(wheel)}   ` +
      `dir ${direction > 0 ? "→" : "←"}   offset ${offset.toFixed(1).padStart(5)}°`;
  }

  raf = requestAnimationFrame(frame);
}

onMounted(() => {
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  raf = requestAnimationFrame(frame);
});

onBeforeUnmount(() => {
  window.removeEventListener("pointermove", onPointerMove);
  cancelAnimationFrame(raf);
});
</script>

<template>
  <div
    class="flex w-full flex-col items-center gap-8"
    :class="{ 'is-xray': xray, 'is-unmasked': unmasked, 'is-wired': showWiring }"
    :style="rootVars"
  >
    <div class="flex flex-col items-center gap-5">
      <button ref="buttonEl" type="button" class="ai-mode">
        <span class="glow" aria-hidden="true">
          <span ref="anglesEl" class="angles">
            <span class="layer bloom"><span class="window"><span class="wheel" /></span></span>
            <span class="layer core"><span class="window"><span class="wheel" /></span></span>
          </span>
        </span>
        <span class="surface" aria-hidden="true" />
        <span class="label">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M9.5 3a6.5 6.5 0 1 1-4.6 11.1L2 17l1.4 1.4 2.9-2.9A6.5 6.5 0 0 1 9.5 3zm0 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zM18 2l.9 2.6L21.5 5.5 18.9 6.4 18 9l-.9-2.6L14.5 5.5l2.6-.9L18 2z"
            />
          </svg>
          AI&nbsp;Mode
        </span>
      </button>

      <p class="max-w-sm text-center text-sm text-slate-400">
        {{ t("labs.aiMode.hint") }}
      </p>
    </div>

    <div v-if="showWiring" class="w-full max-w-lg">
      <p
        ref="readoutEl"
        class="mb-5 text-center font-jetbrains text-xs whitespace-pre text-slate-500 tabular-nums"
      />

      <div class="grid grid-cols-[9rem_1fr_3rem] items-center gap-x-4 gap-y-2 text-xs text-slate-400">
        <label for="aim-scale-x">scale X (angle squash)</label>
        <input id="aim-scale-x" v-model.number="scaleX" type="range" min="1" max="14" step="0.1" class="accent-violet-500">
        <output class="knob-value">{{ scaleX }}</output>

        <label for="aim-scale-y">scale Y</label>
        <input id="aim-scale-y" v-model.number="scaleY" type="range" min="0.5" max="4" step="0.1" class="accent-violet-500">
        <output class="knob-value">{{ scaleY }}</output>

        <label for="aim-bloom">bloom blur</label>
        <input id="aim-bloom" v-model.number="bloom" type="range" min="0" max="16" step="0.5" class="accent-violet-500">
        <output class="knob-value">{{ bloom }}</output>

        <label for="aim-rim">rim width</label>
        <input id="aim-rim" v-model.number="rim" type="range" min="0" max="6" step="0.5" class="accent-violet-500">
        <output class="knob-value">{{ rim }}</output>

        <label for="aim-offset-r">offset → (moving right)</label>
        <input id="aim-offset-r" v-model.number="offsetRight" type="range" min="-40" max="140" step="1" class="accent-violet-500">
        <output class="knob-value">{{ offsetRight }}</output>

        <label for="aim-offset-l">offset ← (moving left)</label>
        <input id="aim-offset-l" v-model.number="offsetLeft" type="range" min="-40" max="140" step="1" class="accent-violet-500">
        <output class="knob-value">{{ offsetLeft }}</output>

        <label for="aim-flip">direction crossfade</label>
        <input id="aim-flip" v-model.number="flip" type="range" min="0.02" max="1" step="0.01" class="accent-violet-500">
        <output class="knob-value">{{ flip }}</output>

        <label class="col-span-3 flex items-center gap-2">
          <input v-model="xray" type="checkbox" class="accent-violet-500">
          x-ray: unscale, unblur, show the real circle
        </label>
        <label class="col-span-3 flex items-center gap-2">
          <input v-model="unmasked" type="checkbox" class="accent-violet-500">
          drop the mask (see the whole wheel)
        </label>

        <p class="col-span-3 mt-4 text-[11px] leading-relaxed text-slate-500">
          {{ t("labs.aiMode.coloursNote") }}
        </p>

        <span id="aim-band-label">band colours</span>
        <span class="flex flex-wrap items-end gap-1.5" role="group" aria-labelledby="aim-band-label">
          <span v-for="(stop, i) in band" :key="`band${i}`" class="flex flex-col items-center gap-1">
            <button
              type="button"
              class="swatch"
              :class="{ 'is-selected': selectedId === 'band' && selectedIndex === i }"
              :style="{ background: stop.c }"
              :title="`${stop.c} at ${stop.at.toFixed(1)}% — lit → ${Math.round((stopLighting[i]?.right ?? 0) * 100)}%, ← ${Math.round((stopLighting[i]?.left ?? 0) * 100)}%`"
              :aria-label="`Edit band colour ${i + 1}`"
              :aria-pressed="selectedId === 'band' && selectedIndex === i"
              @click="selectSwatch('band', i)"
            />
            <span class="flex gap-0.5 font-jetbrains text-[9px] leading-none" aria-hidden="true">
              <span :style="{ opacity: 0.12 + 0.88 * (stopLighting[i]?.right ?? 0) }">→</span>
              <span :style="{ opacity: 0.12 + 0.88 * (stopLighting[i]?.left ?? 0) }">←</span>
            </span>
          </span>
          <button
            type="button"
            class="stepper"
            :disabled="band.length <= MIN_STOPS"
            aria-label="Remove the selected band colour"
            @click="removeStop"
          >
            −
          </button>
          <button
            type="button"
            class="stepper"
            :disabled="band.length >= MAX_STOPS"
            aria-label="Duplicate the selected band colour"
            @click="addStop"
          >
            +
          </button>
        </span>
        <output class="knob-value">{{ band.length }}</output>

        <span>rest of the wheel</span>
        <span class="flex gap-1.5">
          <button
            type="button"
            class="swatch"
            :class="{ 'is-selected': selectedId === 'filler' }"
            :style="{ background: filler }"
            aria-label="Edit the filler colour"
            :aria-pressed="selectedId === 'filler'"
            @click="selectSwatch('filler')"
          />
        </span>
        <span />

        <div class="col-span-3 mt-1 rounded-lg bg-slate-950/50 p-3 ring-1 ring-slate-700">
          <div class="mb-2.5 flex items-center justify-between gap-3">
            <span>editing {{ selectionLabel }}</span>
            <span class="flex items-center gap-2 font-jetbrains text-slate-300">
              <span class="swatch pointer-events-none" :style="{ background: selectedHex }" />
              {{ selectedHex }}
            </span>
          </div>

          <div class="grid grid-cols-[5rem_1fr_2.5rem] items-center gap-x-3 gap-y-1.5">
            <label for="aim-hue">hue</label>
            <input id="aim-hue" v-model.number="editor.h" type="range" min="0" max="360" step="1" class="accent-violet-500" @input="applyEditor">
            <output class="knob-value">{{ editor.h }}</output>

            <label for="aim-sat">saturation</label>
            <input id="aim-sat" v-model.number="editor.s" type="range" min="0" max="100" step="1" class="accent-violet-500" @input="applyEditor">
            <output class="knob-value">{{ editor.s }}</output>

            <label for="aim-light">lightness</label>
            <input id="aim-light" v-model.number="editor.l" type="range" min="0" max="100" step="1" class="accent-violet-500" @input="applyEditor">
            <output class="knob-value">{{ editor.l }}</output>

            <template v-if="selectedId === 'band' && band[selectedIndex]">
              <label for="aim-position">position</label>
              <input
                id="aim-position"
                :value="band[selectedIndex]!.at"
                type="range"
                min="0"
                max="100"
                step="0.1"
                class="accent-violet-500"
                @input="movePosition(Number(($event.target as HTMLInputElement).value))"
              >
              <output class="knob-value">{{ band[selectedIndex]!.at.toFixed(1) }}</output>
            </template>
          </div>

          <p v-if="selectedId === 'band'" class="mt-2.5 text-[11px] leading-relaxed text-slate-500">
            Lit
            <strong class="text-slate-300">
              → {{ Math.round((stopLighting[selectedIndex]?.right ?? 0) * 100) }}%
            </strong>
            moving right,
            <strong class="text-slate-300">
              ← {{ Math.round((stopLighting[selectedIndex]?.left ?? 0) * 100) }}%
            </strong>
            moving left. Two stops sharing a colour make a flat run — that is how
            the red and green plateaus in Google's band are built.
          </p>
        </div>

        <div class="col-span-3">
          <UButton size="xs" color="neutral" variant="subtle" class="font-jetbrains" @click="resetColours">
            {{ t("labs.aiMode.resetColours") }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@property --aim-window {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: true;
}
@property --aim-wheel {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: true;
}

.ai-mode {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 0 20px;
  line-height: 1;
  border: 0;
  border-radius: 100px;
  background: transparent;
  color: #e8eaed;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

/* The opaque inner surface: it covers the glow except for a `--aim-rim` ring. */
.surface {
  position: absolute;
  inset: var(--aim-rim);
  border-radius: 100px;
  background: #303134;
  clip-path: inset(0 round 100px);
  transition: filter 0.2s;
}
.ai-mode:hover .surface {
  filter: blur(2px);
}

.label {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.label svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.glow {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 0;
  opacity: 0.6;
}
.angles {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.25s;
  will-change: --aim-window, --aim-wheel, opacity;
}
.ai-mode:hover .angles,
.ai-mode:focus-visible .angles,
.is-wired .angles {
  opacity: 1;
}

/* Clip to the pill and soften. Two instances: wide bloom + tight core. */
.layer {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
  backface-visibility: hidden;
  transform: translateZ(0);
  filter: blur(var(--aim-bloom));
}
.layer.core {
  filter: blur(1px);
}

/* The comet window, stretched over the pill by the non-uniform scale. */
.window {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  scale: var(--aim-sx) var(--aim-sy);
  -webkit-mask-image:
    conic-gradient(
      from var(--aim-window),
      transparent 0,
      transparent 50%,
      black 68%,
      black 75%,
      transparent 89%
    ),
    conic-gradient(from var(--aim-window), black 30%, transparent 50%, black 70%);
  mask-image:
    conic-gradient(
      from var(--aim-window),
      transparent 0,
      transparent 50%,
      black 68%,
      black 75%,
      transparent 89%
    ),
    conic-gradient(from var(--aim-window), black 30%, transparent 50%, black 70%);
  -webkit-mask-composite: source-in, xor;
  mask-composite: intersect;
}
.core .window {
  -webkit-mask-image:
    conic-gradient(
      from var(--aim-window),
      transparent 0,
      transparent 62%,
      black 82%,
      transparent 89%
    ),
    conic-gradient(from var(--aim-window), black 30%, transparent 50%, black 70%);
  mask-image:
    conic-gradient(
      from var(--aim-window),
      transparent 0,
      transparent 62%,
      black 82%,
      transparent 89%
    ),
    conic-gradient(from var(--aim-window), black 30%, transparent 50%, black 70%);
}

/* The colours. Never recoloured at runtime — only rotated. */
.wheel {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  bottom: auto;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  translate: 0 -50%;
  rotate: var(--aim-wheel);
  backface-visibility: hidden;
  transform: translateZ(0);
  background: var(--aim-wheel-gradient);
}

/* Teaching views */
.is-xray .surface {
  opacity: 0.12;
}
.is-xray .layer {
  overflow: visible;
  filter: none;
}
.is-xray .window {
  scale: 1 1;
}
.is-xray .ai-mode {
  outline: 1px dashed rgb(255 255 255 / 0.35);
}
.is-unmasked .window {
  -webkit-mask-image: none;
  mask-image: none;
}

.knob-value {
  text-align: right;
  font-family: var(--font-jetbrains);
  font-variant-numeric: tabular-nums;
  color: var(--color-slate-300);
}

.swatch {
  width: 34px;
  height: 26px;
  border: 1px solid #3c4043;
  border-radius: 6px;
  cursor: pointer;
}
.swatch.is-selected {
  outline: 2px solid var(--color-violet-400);
  outline-offset: 2px;
}

.stepper {
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #3c4043;
  border-radius: 6px;
  background: #35363a;
  color: var(--color-slate-300);
  line-height: 1;
  cursor: pointer;
}
.stepper:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.stepper:not(:disabled):hover {
  background: #3c4043;
}
</style>
