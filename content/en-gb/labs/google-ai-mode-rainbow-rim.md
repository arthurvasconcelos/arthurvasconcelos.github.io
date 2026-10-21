---
title: Google's cursor-following rainbow rim
description: How the "AI Mode" button on google.com paints a rainbow along its border that follows your cursor — and why the colours change depending on which way you move.
date: 2026-08-12
tags: ["css", "conic-gradient", "mask", "reverse-engineering"]
translationKey: google-ai-mode-rainbow-rim
---

The "AI Mode" button on google.com does something lovely on hover: a slice of
rainbow lights up its border and slides along with your cursor. Sweep left to
right and it reads green → teal → blue. Sweep back and it reads red → orange →
yellow → green. Same button, same gradient, different colours.

I pulled the CSS apart to find out how. It turns out to be five ideas stacked on
top of each other, and only one of them is a real trick.

::lab-demo{title="AI Mode button" caption="Hover and sweep across it — then flip direction."}
:ai-mode-button
::

## 1. It is not a border

The first surprise: nothing here draws a border. The glow layer fills the
**whole** pill, and then an opaque inner pill — inset by exactly one pixel —
is painted on top of it.

```css
.glow    { position: absolute; inset: 0; }      /* rainbow fills the pill */
.surface { position: absolute; inset: 1px;      /* covers all but the rim */
           background: #303134;
           border-radius: 100px; }
```

Only the 1px that the inner pill fails to cover survives, and that reads as a
glowing border. On hover Google adds `filter: blur(2px)` to that inner surface,
which softens its edge and lets the rim bleed inwards a little.

No `mask-composite` ring maths, no `border-image`, no SVG stroke. Just occlusion.

## 2. One rainbow, painted once, only ever rotated

The colours come from a single circular element carrying a `conic-gradient`.
It is never recoloured at runtime — the only thing that ever changes is its
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

Notice that the interesting part only occupies 34%–73% of the turn — 140° out
of 360°. Everything outside that is flat `#3186ff`: a single 220° arc of blue
spanning the 0°/360° seam. That padding matters later.

## 3. A conic gradient used as a mask carves out the comet

The parent of the wheel masks it down to a single arc, using two more conic
gradients combined with `mask-composite: intersect`:

```css
.window {
  mask-image:
    conic-gradient(from var(--window), transparent 0, transparent 50%,
                   black 68%, black 75%, transparent 89%),
    conic-gradient(from var(--window), black 30%, transparent 50%, black 70%);
  mask-composite: intersect;
}
```

Work the stops out in degrees and the intersection is not the tight arc it
looks like. `intersect` composites the layers with Porter-Duff `source-in`, so
where both gradients ramp their alphas **multiply**. That leaves a long,
quadratically soft tail: alpha leaves zero at **180°**, climbs slowly at first —
the product of two rising ramps — reaches full at **252°**, holds a plateau to
**270°**, then falls away by **320°**. That is a comet **140° wide** — 39% of a
turn — most of it very faint tail.
The crisp core layer uses a tighter first mask (`transparent 62%, black 82%`),
so it starts at **223°** and peaks at **295°**, well past the bloom's plateau.

I got this wrong on my first pass — I read only the plateau, called the window
68° wide, and could not then explain why one direction shows six colours. The
ramp is the whole story.

So the entire effect boils down to two angles:

- `--window` — where the comet is
- `--wheel` — which colours sit under it

## 4. The actual trick: `scale: 7 1.5`

Here is the part I did not expect. A conic sweep is circular. A button is a
wide, flat pill. Rotating a conic gradient inside a pill would normally send
the highlight around a tight ellipse, not gliding along the long top edge.

Google fixes this by scaling the masked element non-uniformly:

```css
.window { scale: 7 1.5; }
```

Stretching x by 7 squashes angular space. Run the numbers on a 220 × 44 pill:
the top-right corner of the pill sits at unscaled coordinates
`(110 / 7, −22 / 1.5)` ≈ `(15.7, −14.7)`, which is only **47° off vertical**.
The pill's entire top edge spans about ±47° — so a rotation of well under a
quarter turn walks the highlight from one end to the other, and the arc hugs
the edge instead of looking like a pie slice.

That also makes the cursor mapping straightforward: undo the scale, and take
the angle.

```js
const angle = Math.atan2(px / scaleX, -py / scaleY) * 180 / Math.PI;
const window = angle - 286;   // 286° sits between the bloom plateau (252–270°)
                              // and the core peak (295°)
```

## 5. Two copies for the bloom

The whole stack is rendered twice inside the pill: once with `filter: blur(5px)`
and a wide mask window, once with `filter: blur(1px)` and a tighter one. The
first is the halo, the second the bright core. Together they give the effect its
depth — a crisp filament sitting inside a soft glow.

## Why the colours depend on direction

This was the part that took the longest to work out, and my first answer was
wrong.

My initial guess was that the wheel *lags* behind the window — a spring, with
the residual flipping sign depending on travel direction. That produces a
direction-dependent tint, but it is speed-dependent: the colours drift while you
move and settle back when you slow down. On the real button they do not. Sweep
slowly or quickly, the palette for a given direction is rock steady.

Which means the wheel is not lagging. It is **locked** to the window:

```js
wheel = window + offset;                       // both rotate together
offset = direction > 0 ? 0 : 45;               // the only thing direction changes
```

Because the two rotate as one, the slice of rainbow under the comet never
drifts while you sweep.

Now put the offset together with that 140° comet. It is exactly as wide as the
colour band — both span 39% of a turn — but that does **not** mean each
direction sees all of it, because the two windows sit in different places. Run
the mask alpha across Google's stops and the asymmetry is stark:

| stop | band° | → (offset 0°) | ← (offset 45°) |
| --- | --- | --- | --- |
| blue | 122° | — | — |
| violet | 133° | — | — |
| pink | 140° | — | .01 |
| red | 148° | — | .03 |
| red | 173° | — | .31 |
| orange | 180° | — | .43 |
| amber | 187° | .01 | .58 |
| yellow | 202° | .10 | .93 |
| lime | 209° | .18 | **1.00** |
| green | 220° | .34 | **1.00** |
| green | 234° | .63 | .82 |
| teal | 252° | **1.00** | .46 |
| cyan | 259° | **1.00** | .32 |
| blue | 263° | **1.00** | .25 |

Moving right, the window covers band degrees 180°–263° — only **59%** of the
band. Everything before orange — blue, violet, pink, red — sits outside it and
is not dimmed but absent. Moving left, the window covers 135°–263°, or **91%**,
and everything from pink onwards catches at least a little light.

That is why moving right reads as barely-there yellow into green into a bright
teal-and-blue tip, while moving left reads as a full rainbow peaking on
yellow-green. It is the same band both times, lit differently. Reverse direction
and the offset eases from one value to the other, crossfading rather than
snapping.

There is a second reason the right-hand sweep ends so blue. The crisp core layer
peaks at 295°, and with offset 0° that lands at band degree 295° — past the
band's end at 263°, out in the flat blue filler. So moving right, the sharp
filament is pure `#3186ff` and only the softer bloom behind it carries colour.
Moving left the same peak lands at 250°, right on the teal.

A consequence worth noting if you build one of these: the two windows overlap by
95° of their 140° width, roughly two thirds, so the directions **cannot** be
given independent palettes. There is one band, and the offsets only choose where
the light falls on it.

But that is not the same as having no per-direction control. Take "bright" to
mean alpha ≥ 0.9 and the two zones are completely disjoint — moving right lights
band degrees 245°–263°, moving left 200°–230°. So each direction's dominant
colours are yours to choose independently; it is only the faint tails that are
shared. In the demo above, the arrows under each swatch show how strongly the
bloom's window lights that stop in each direction, which turns "which colours
does this direction show?" into something you can just read off.

This also explains a detail from earlier: those two custom properties. If the
offset were a single constant, `--wheel` would be redundant — you would only
need `--window`. The second property exists precisely because the offset moves.
And that 219° arc of flat blue in the gradient is what keeps the comet from
flashing a hard seam when it wanders past the end of the band — with a 140°
comet there is always somewhere safe for it to sit.

## Worth stealing

The reusable ideas here, independent of rainbows:

- **Occlusion beats ring maths.** An opaque inner element inset by _n_ pixels is
  a simpler, cheaper "glowing border" than any masked ring.
- **Non-uniform scale as a coordinate transform.** `scale: 7 1.5` turns a
  circular angular space into one that tracks a rectangle's edge. Undo the scale
  in JS to map the cursor back.
- **Animate rotations, not colours.** One static gradient plus two angles is far
  cheaper than rebuilding gradients per frame, and both angles are registerable
  as `<angle>` via `@property`, so they can be transitioned by CSS.

Open the wiring panel on the demo above — the glow stays lit while it is open —
and drag `scale X` down towards 1: you can watch the angular space un-squash
and the highlight collapse back into a circular sweep. That single slider is
the whole trick.
