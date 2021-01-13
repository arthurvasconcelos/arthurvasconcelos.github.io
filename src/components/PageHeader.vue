<template>
  <header class="pageHeader" ref="headerContainer">
    <canvas id="grid-canvas" ref="gridCanvas"></canvas>
    <h1 class="pageHeaderTitle">{{ title }}</h1>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from "vue";
import { Circ, TweenLite } from "gsap";
import { bus } from "@/bus";

interface Target {
  x: number;
  y: number;
}

interface Points extends Target {
  originX: number;
  originY: number;
  closest: Points[];
  active: number;
  circle?: Circle;
}

class Circle {
  public active = 0;
  ctx!: CanvasRenderingContext2D;
  pos!: Points;
  rad!: number;
  color!: string;

  constructor(
    ctx: CanvasRenderingContext2D,
    pos: Points,
    rad: number,
    color: string
  ) {
    this.ctx = ctx;
    this.pos = pos;
    this.rad = rad;
    this.color = color;
  }

  public draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.pos.x, this.pos.y, this.rad, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = `rgba(156,217,249,${this.active})`;
    this.ctx.fill();
  }
}

export default defineComponent({
  name: "PageHeader",
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup() {
    const headerContainer = ref<HTMLElement | null>(null);
    const gridCanvas = ref<HTMLCanvasElement | null>(null);
    const width = ref<number>(0);
    const height = ref<number>(0);
    const ctx = ref<CanvasRenderingContext2D | null>(null);
    const points = ref<Points[]>([]);
    const target = ref<Target>({ x: 0, y: 0 });
    const animateHeader = ref<boolean>(false);

    // Event Handlers

    function mouseMove(e: MouseEvent) {
      let posx, posy;
      posx = posy = 0;

      if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
      } else if (e.clientX || e.clientY) {
        posx =
          e.clientX +
          document.body.scrollLeft +
          document.documentElement.scrollLeft;
        posy =
          e.clientY +
          document.body.scrollTop +
          document.documentElement.scrollTop;
      }

      target.value.x = posx;
      target.value.y = posy;
    }

    function scrollCheck() {
      const statement = document.body.scrollTop > height.value;
      animateHeader.value = statement ? false : true;
    }

    function resize() {
      if (headerContainer.value && gridCanvas.value) {
        width.value = headerContainer.value.offsetWidth;
        height.value = headerContainer.value.offsetHeight;
        gridCanvas.value.width = width.value;
        gridCanvas.value.height = height.value;
      }
    }

    // Util
    function getDistance(p1: Target, p2: Target) {
      return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }

    // Canvas manipulation
    function drawLines(p: Points) {
      if (!p.active) return;

      for (const i in p.closest) {
        if (ctx.value) {
          ctx.value.beginPath();
          ctx.value.moveTo(p.x, p.y);
          ctx.value.lineTo(p.closest[i].x, p.closest[i].y);
          ctx.value.strokeStyle = "rgba(156,217,249," + p.active + ")";
          ctx.value.stroke();
        }
      }
    }

    // Animation
    function shiftPoint(p: Points) {
      TweenLite.to(p, 1 + 1 * Math.random(), {
        x: p.originX - 50 + Math.random() * 100,
        y: p.originY - 50 + Math.random() * 100,
        ease: Circ.easeInOut,
        onComplete: () => {
          shiftPoint(p);
        }
      });
    }

    function animate() {
      if (animateHeader.value) {
        ctx.value?.clearRect(0, 0, width.value, height.value);

        for (const i in points.value) {
          // detect points in range
          if (Math.abs(getDistance(target.value, points.value[i])) < 4000) {
            points.value[i].active = 0.3;
            (points.value[i].circle as Circle).active = 0.6;
          } else if (
            Math.abs(getDistance(target.value, points.value[i])) < 20000
          ) {
            points.value[i].active = 0.1;
            (points.value[i].circle as Circle).active = 0.3;
          } else if (
            Math.abs(getDistance(target.value, points.value[i])) < 40000
          ) {
            points.value[i].active = 0.02;
            (points.value[i].circle as Circle).active = 0.1;
          } else {
            points.value[i].active = 0;
            (points.value[i].circle as Circle).active = 0;
          }

          drawLines(points.value[i]);
          points.value[i].circle?.draw();
        }
      }

      requestAnimationFrame(animate);
    }

    // Inits

    function initHeader() {
      width.value = headerContainer.value?.offsetWidth || 0;
      height.value = headerContainer.value?.offsetHeight || 0;
      target.value = {
        x: width.value / 2,
        y: height.value / 2
      };

      if (gridCanvas.value) {
        gridCanvas.value.width = width.value;
        gridCanvas.value.height = height.value;
      }

      if (gridCanvas.value) ctx.value = gridCanvas.value.getContext("2d");

      // create points
      for (let x = 0; x < width.value; x = x + width.value / 20) {
        for (let y = 0; y < height.value; y = y + height.value / 20) {
          const px = x + (Math.random() * width.value) / 20;
          const py = y + (Math.random() * height.value) / 20;
          const p = {
            x: px,
            originX: px,
            y: py,
            originY: py,
            closest: [],
            active: 0,
          };

          points.value.push(p);
        }
      }

      // for each point find the 5 closest points
      for (let i = 0; i < points.value.length; i++) {
        const closest = [];
        const p1 = points.value[i];

        for (let j = 0; j < points.value.length; j++) {
          const p2 = points.value[j];

          if (!(p1 == p2)) {
            let placed = false;

            for (let k = 0; k < 5; k++) {
              if (!placed) {
                if (closest[k] == undefined) {
                  closest[k] = p2;
                  placed = true;
                }
              }
            }

            for (let k = 0; k < 5; k++) {
              if (!placed) {
                if (getDistance(p1, p2) < getDistance(p1, closest[k])) {
                  closest[k] = p2;
                  placed = true;
                }
              }
            }
          }
        }

        p1.closest = closest;
      }

      // assign a circle to each point
      if (ctx.value)
        for (const i in points.value) {
          const c = new Circle(
            ctx.value,
            points.value[i],
            2 + Math.random() * 2,
            "rgba(255, 255, 255, 0.3)"
          );
          points.value[i].circle = c;
        }
    }

    function initAnimation() {
      animate();
      for (const i in points.value) {
        shiftPoint(points.value[i]);
      }
    }

    // Event Listeners

    function addListeners() {
      bus.on("windowMouseMove", e => mouseMove(e as MouseEvent));
      bus.on("windowScroll", scrollCheck);
      bus.on("windowResize", resize);
    }

    function removeListeners() {
      bus.off("windowMouseMove", () => null);
      bus.off("windowScroll", () => null);
      bus.off("windowResize", () => null);
    }

    onMounted(function() {
      initHeader();
      initAnimation();
      addListeners();
    });

    onBeforeUnmount(function() {
      removeListeners();
    });

    return { headerContainer, gridCanvas };
  }
});
</script>

<style lang="scss">
@import "../styles/variables";
@import "../styles/mixins";

.pageHeader {
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
  // background-color: #1B2735;
  height: 250px;
  position: relative;
  width: 100%;
}

.pageHeaderTitle {
  @include applyFont($weight: 700);
  box-sizing: border-box;
  color: #ffffff;
  font-size: 3rem;
  left: 50%;
  margin: 0;
  padding: 0 1rem;
  position: absolute;
  text-align: center;
  text-shadow: 2px 2px 1px #090a0f;
  text-transform: uppercase;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
  width: 100%;
}
</style>
