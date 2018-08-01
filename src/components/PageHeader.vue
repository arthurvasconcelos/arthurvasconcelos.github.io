<template>
  <header class="pageHeader" ref="headerContainer">
    <canvas id="grid-canvas" ref="gridCanvas"></canvas>
    <h1 class="pageHeaderTitle">{{ title }}</h1>
  </header>
</template>

<script>
import { Circ, TweenLite } from "gsap/all";

export default {
  name: "PageHeader",
  props: {
    title: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      width: null,
      height: null,
      canvas: null,
      ctx: null,
      points: null,
      target: null,
      animateHeader: true,
      headerContainer: null
    };
  },
  mounted() {
    this.headerContainer = this.$refs.headerContainer;

    this.initHeader();
    this.initAnimation();
    this.addListeners();
  },
  methods: {
    initHeader() {
      this.width = this.headerContainer.offsetWidth;
      this.height = this.headerContainer.offsetHeight;
      this.target = {
        x: this.width / 2,
        y: this.height / 2
      };
      this.canvas = this.$refs.gridCanvas;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.ctx = this.canvas.getContext("2d");

      // create points
      this.points = [];
      for (let x = 0; x < this.width; x = x + this.width / 20) {
        for (let y = 0; y < this.height; y = y + this.height / 20) {
          const px = x + (Math.random() * this.width) / 20;
          const py = y + (Math.random() * this.height) / 20;
          const p = {
            x: px,
            originX: px,
            y: py,
            originY: py
          };

          this.points.push(p);
        }
      }

      // for each point find the 5 closest points
      for (let i = 0; i < this.points.length; i++) {
        const closest = [];
        const p1 = this.points[i];

        for (let j = 0; j < this.points.length; j++) {
          const p2 = this.points[j];

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
                if (
                  this.getDistance(p1, p2) < this.getDistance(p1, closest[k])
                ) {
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
      for (const i in this.points) {
        const c = new this.Circle(
          this,
          this.points[i],
          2 + Math.random() * 2,
          "rgba(255, 255, 255, 0.3)"
        );
        this.points[i].circle = c;
      }
    },
    initAnimation() {
      this.animate();
      for (const i in this.points) {
        this.shiftPoint(this.points[i]);
      }
    },
    addListeners() {
      this.$events.$on("windowMouseMove", this.mouseMove);
      this.$events.$on("windowScroll", this.scrollCheck);
      this.$events.$on("windowResize", this.resize);
    },

    // Event Handlers
    mouseMove(e) {
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

      this.target.x = posx;
      this.target.y = posy;
    },
    scrollCheck() {
      const statement = document.body.scrollTop > this.height;
      this.animateHeader = statement ? false : true;
    },
    resize() {
      this.width = this.headerContainer.offsetWidth;
      this.height = this.headerContainer.offsetHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    },

    // Animation
    animate() {
      if (this.animateHeader) {
        this.ctx.clearRect(0, 0, this.width, this.height);

        for (const i in this.points) {
          // detect points in range
          if (Math.abs(this.getDistance(this.target, this.points[i])) < 4000) {
            this.points[i].active = 0.3;
            this.points[i].circle.active = 0.6;
          } else if (
            Math.abs(this.getDistance(this.target, this.points[i])) < 20000
          ) {
            this.points[i].active = 0.1;
            this.points[i].circle.active = 0.3;
          } else if (
            Math.abs(this.getDistance(this.target, this.points[i])) < 40000
          ) {
            this.points[i].active = 0.02;
            this.points[i].circle.active = 0.1;
          } else {
            this.points[i].active = 0;
            this.points[i].circle.active = 0;
          }

          this.drawLines(this.points[i]);
          this.points[i].circle.draw();
        }
      }

      requestAnimationFrame(this.animate);
    },
    shiftPoint(p) {
      TweenLite.to(p, 1 + 1 * Math.random(), {
        x: p.originX - 50 + Math.random() * 100,
        y: p.originY - 50 + Math.random() * 100,
        ease: Circ.easeInOut,
        onComplete: () => {
          this.shiftPoint(p);
        }
      });
    },

    // Canvas manipulation
    drawLines(p) {
      if (!p.active) return;

      for (const i in p.closest) {
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(p.closest[i].x, p.closest[i].y);
        this.ctx.strokeStyle = "rgba(156,217,249," + p.active + ")";
        this.ctx.stroke();
      }
    },
    Circle(vm, pos = null, rad = null, color = null) {
      const _this = this;

      // constructor
      (function() {
        _this.vm = vm;
        _this.pos = pos;
        _this.radius = rad;
        _this.color = color;
      })();

      this.draw = function() {
        if (!_this.active) return;

        _this.vm.ctx.beginPath();
        _this.vm.ctx.arc(
          _this.pos.x,
          _this.pos.y,
          _this.radius,
          0,
          2 * Math.PI,
          false
        );
        _this.vm.ctx.fillStyle = "rgba(156,217,249," + _this.active + ")";
        _this.vm.ctx.fill();
      };
    },

    // Util
    getDistance(p1, p2) {
      return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }
  }
};
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
