import $ from "jquery";
import Tree from "./components/Tree";
import Dust from "./components/Dust";
/* eslint-env jquery */

// Particle effect for trees to resemble Stranger Things forest view
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

// Setting up the array for trees
const treeArray = [];
const dustArray = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
});

const createObject = (objectArray, ParticleObject, particleMax) => {
  for (let i = 0; i < particleMax; i += 1) {
    const particleObject = new ParticleObject();
    objectArray.push(particleObject);
  }

  // Sort the array by width so the smaller trees appear in the background :D
  objectArray.sort((a, b) => a.width - b.width);
};

const drawTree = treeObject => {
  context.beginPath();

  // Base color for the trunk
  const baseGradient = context.createLinearGradient(
    treeObject.positionX,
    0,
    treeObject.positionX + treeObject.width,
    2
  );
  baseGradient.addColorStop(0.5, "hsl(204, 80%, 10%)");
  baseGradient.addColorStop(0.9, "hsl(204, 95%, 15%)");
  baseGradient.addColorStop(1, "hsl(204, 90%, 12.5%)");

  // Check for the inverse and get the absolute value so thinner trees have less saturation
  const depthOverlay = Math.abs(treeObject.width / 100 - 1).toFixed(2);
  treeObject.height = parseInt(
    canvas.height * (treeObject.width / 100) + canvas.height * 0.6
  );

  // Bottom shadow of tree
  const overlayGradient = context.createLinearGradient(0, canvas.height, 0, 20);
  overlayGradient.addColorStop(0.2, "hsla(204, 80%, 15%, 1)");
  overlayGradient.addColorStop(
    0.9,
    `hsla(204, 10%, ${30 * depthOverlay}%, ${depthOverlay})`
  );

  context.fillStyle = baseGradient;
  context.fillRect(
    treeObject.positionX,
    0,
    treeObject.width,
    treeObject.height
  );
  context.fillStyle = overlayGradient;
  context.fillRect(
    treeObject.positionX,
    0,
    treeObject.width,
    treeObject.height
  );

  context.closePath();
  moveTree(treeObject);
};

const drawDust = dustObject => {
  context.save();
  // Running this before it's draw to determine opacity
  moveDust(dustObject);

  context.beginPath();
  context.arc(
    dustObject.positionX,
    dustObject.positionY,
    dustObject.width,
    0,
    2 * Math.PI
  );
  context.fillStyle = `rgba(255, 255, 255, ${dustObject.opacity})`;
  context.shadowBlur = 10;
  context.shadowColor = "white";
  context.fill();

  context.closePath();
  context.restore();
};

const moveTree = treeObject => {
  treeObject.positionX += parseInt((treeObject.width / 150) * 3 + 1);
  if (treeObject.positionX > canvas.width) {
    treeObject.positionX = 0 - treeObject.width;
  }
};

const moveDust = dustObject => {
  dustObject.positionX += parseInt((dustObject.width / 4) * 3 + 1);
  dustObject.positionY += -1;

  if (dustObject.positionX > canvas.width)
    dustObject.positionX = 0 - dustObject.width;
  if (dustObject.positionY < 0) {
    dustObject.positionY = canvas.height - dustObject.width;
    dustObject.opacity = 0;
  } else if (dustObject.positionY > 0 && dustObject.opacity < 1.0) {
    dustObject.opacity += 0.005;
  }
};

const drawStage = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0, n = dustArray.length, m = 0; i < n; i++) {
    if (i % 6 == 0) {
      drawTree(treeArray[m]);
      m++;
    }
    drawDust(dustArray[i]);
  }

  requestAnimationFrame(drawStage);
};

/* ---------------------------------------------
  Lights
  --------------------------------------------- */

const BulbElement = 1;
const BulbDefaultColor = "#A3A2A2";
let interval;
let index = 0;
let selectedText = [];
let timeout;

const BulbColor = {
  A: "#ffeb04",
  B: "#e60227",
  C: "#05a2f1",
  D: "#70b21d",
  E: "#ad0073",
  F: "#00a131",
  G: "#f5a300",
  H: "#e75000",
  I: "#0082ce",
  J: "#1C48AB",
  K: "#5C87AA",
  L: "#E7FFFF",
  M: "#EECA42",
  N: "#34CECE",
  O: "#B7078E",
  P: "#C9E3E2",
  Q: "#D3499F",
  R: "#ECECEA",
  S: "#E9A321",
  T: "#F7BF12",
  U: "#2CA5D0",
  V: "#C0467F",
  W: "#0394CB",
  X: "#FBBD2E",
  Y: "#E68FD6",
  Z: "#73BEA9",
};

function reset() {
  $("#go_for_it")[0].disabled = false;
  $("#go_for_it").removeClass("send-it");
  selectedText = [];
  index = 0;
  clearInterval(interval);
}

function blink(i) {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    if (i < selectedText.length) {
      $(`#b${selectedText[i]}`)[0].children[
        BulbElement
      ].style.fill = BulbDefaultColor;
      if (i === selectedText.length - 1) reset();
    }
  }, 500);
}

function showLetters() {
  if (index < selectedText.length) {
    $(`#b${selectedText[index]}`)[0].children[BulbElement].style.fill =
      BulbColor[selectedText[index].toUpperCase()];
    blink(index);
    if (index !== selectedText.length - 1) index += 1;
  }
}

function setTextReady() {
  selectedText = $("#i_text")
    .val()
    .split("");
  if (!$("#go_for_it").selected && selectedText.length > 0) {
    interval = setInterval(showLetters, 1000);
    $("#go_for_it")[0].disabled = true;
  }
}

// Sparkles

function inputAnimation() {
  $("#i_text")
    .focus(function() {
      $(this)
        .parent()
        .addClass("is-focus");
    })
    .blur(function() {
      $(this)
        .parent()
        .removeClass("is-focus");
    });

  $("#i_text").on("blur", () => {
    $(this)
      .parent()
      .removeClass("is-focus is-type");
  });

  $("#i_text").on("keydown", function(event) {
    $(this)
      .parent()
      .addClass("is-type");
    if (event.which === 8 && $(this).val() === "") {
      $(this)
        .parent()
        .removeClass("is-type");
    }
  });
}

// Paralax
function parallaxScroll() {
  const scrolled = $(window).scrollTop();
  console.log("run");
  $("#parallax-lvl-0").css("top", `${0 - scrolled * 0.25}px`);
  $("#parallax-lvl-1").css("top", `${0 - scrolled * 0.5}px`);
  $("#parallax-lvl-2").css("top", `${0 - scrolled * 0.75}px`);
  $("#parallax-lvl-3").css("top", `${0 - scrolled * 0.9}px`);
}

/* ---------------------------------------------
		Height 100%
		--------------------------------------------- */
function jsHeightInit() {
  (function($) {
    $(".js-height-full").height($(window).height());
    $(".js-height-parent").each(function() {
      $(this).height(
        $(this)
          .parent()
          .first()
          .height()
      );
    });
  })(jQuery);
}

$(document).ready(() => {
  $(window).trigger("resize");
  $("#go_for_it").on("click", setTextReady);
  $("#go_for_it").on("click", function() {
    $(this).addClass("send-it");

    setTimeout(() => {
      $("#go_for_it").removeClass("send-it");
    }, 1000);
  });
  inputAnimation();
  createObject(treeArray, Tree, 15);
  createObject(dustArray, Dust, 90);
  drawStage();
});

$(window).resize(() => {
  jsHeightInit();
});

$(window).on("scroll", () => {
  console.log("run");
  parallaxScroll();
});

console.clear();

class Grain {
  constructor(el) {
    /**
     * Options
     * Increase the pattern size if visible pattern
     */
    this.patternSize = 200;
    this.patternScaleX = 1000;
    this.patternScaleY = 1000;
    this.patternRefreshInterval = 5;
    this.patternAlpha = 18;

    /**
     * Create canvas
     */
    this.canvas = el;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.scale(this.patternScaleX, this.patternScaleY);

    /**
     * Create a canvas that will be used to generate grain and used as a
     * pattern on the main canvas.
     */
    this.patternCanvas = document.createElement("canvas");
    this.patternCanvas.width = this.patternSize;
    this.patternCanvas.height = this.patternSize;
    this.patternCtx = this.patternCanvas.getContext("2d");
    this.patternData = this.patternCtx.createImageData(
      this.patternSize,
      this.patternSize
    );
    this.patternPixelDataLength = this.patternSize * this.patternSize * 4; // rgba = 4

    /**
     * Prebind prototype function, so later its easier to user
     */
    this.resize = this.resize.bind(this);
    this.loop = this.loop.bind(this);

    this.frame = 0;

    window.addEventListener("resize", this.resize);
    this.resize();

    window.requestAnimationFrame(this.loop);
  }

  resize() {
    this.canvas.width = window.innerWidth * devicePixelRatio;
    this.canvas.height = window.innerHeight * devicePixelRatio;
  }

  update() {
    const {
      patternPixelDataLength,
      patternData,
      patternAlpha,
      patternCtx,
    } = this;

    // put a random shade of gray into every pixel of the pattern
    for (let i = 0; i < patternPixelDataLength; i += 4) {
      // const value = (Math.random() * 255) | 0;
      const value = Math.random() * 255;

      patternData.data[i] = value;
      patternData.data[i + 1] = value;
      patternData.data[i + 2] = value;
      patternData.data[i + 3] = patternAlpha;
    }

    patternCtx.putImageData(patternData, 0, 0);
  }

  draw() {
    const { ctx, patternCanvas, canvas, viewHeight } = this;
    const { width, height } = canvas;

    // clear canvas
    ctx.clearRect(0, 0, width, height);

    // fill the canvas using the pattern
    ctx.fillStyle = ctx.createPattern(patternCanvas, "repeat");
    ctx.fillRect(0, 0, width, height);
  }

  loop() {
    // only update grain every n frames
    const shouldDraw = ++this.frame % this.patternRefreshInterval === 0;
    if (shouldDraw) {
      this.update();
      this.draw();
    }

    window.requestAnimationFrame(this.loop);
  }
}

/**
 * Initiate Grain
 */

const el = document.querySelector(".grain");
const grain = new Grain(el);
(function() {
  let i;

  const NUM_CONFETTI = 350;

  const COLORS = [
    [85, 71, 106],
    [174, 61, 99],
    [219, 56, 83],
    [244, 92, 68],
    [248, 182, 70],
  ];

  const PI_2 = 2 * Math.PI;

  const canvas = document.getElementById("world");

  const context = canvas.getContext("2d");

  window.w = 0;

  window.h = 0;

  const resizeWindow = function() {
    window.w = canvas.width = window.innerWidth;
    return (window.h = canvas.height = window.innerHeight);
  };

  window.addEventListener("resize", resizeWindow, false);

  window.onload = function() {
    return setTimeout(resizeWindow, 0);
  };

  const range = function(a, b) {
    return (b - a) * Math.random() + a;
  };

  const drawCircle = function(x, y, r, style) {
    context.beginPath();
    context.arc(x, y, r, 0, PI_2, false);
    context.fillStyle = style;
    return context.fill();
  };

  let xpos = 0.5;

  document.onmousemove = function(e) {
    return (xpos = e.pageX / w);
  };

  window.requestAnimationFrame = (function() {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback) {
        return window.setTimeout(callback, 1000 / 60);
      }
    );
  })();

  const Confetti = (function() {
    function Confetti() {
      this.style = COLORS[~~range(0, 5)];
      this.rgb = `rgba(${this.style[0]},${this.style[1]},${this.style[2]}`;
      this.r = ~~range(2, 6);
      this.r2 = 2 * this.r;
      this.replace();
    }

    Confetti.prototype.replace = function() {
      this.opacity = 0;
      this.dop = 0.03 * range(1, 4);
      this.x = range(-this.r2, w - this.r2);
      this.y = range(-20, h - this.r2);
      this.xmax = w - this.r;
      this.ymax = h - this.r;
      this.vx = range(0, 2) + 8 * xpos - 5;
      return (this.vy = 0.7 * this.r + range(-1, 1));
    };

    Confetti.prototype.draw = function() {
      let ref;
      this.x += this.vx;
      this.y += this.vy;
      this.opacity += this.dop;
      if (this.opacity > 1) {
        this.opacity = 1;
        this.dop *= -1;
      }
      if (this.opacity < 0 || this.y > this.ymax) {
        this.replace();
      }
      if (!((ref = this.x) > 0 && ref < this.xmax)) {
        this.x = (this.x + this.xmax) % this.xmax;
      }
      return drawCircle(
        ~~this.x,
        ~~this.y,
        this.r,
        `${this.rgb},${this.opacity})`
      );
    };

    return Confetti;
  })();

  const confetti = (function() {
    let j;
    let ref;
    const results = [];
    for (
      i = j = 1, ref = NUM_CONFETTI;
      ref >= 1 ? j <= ref : j >= ref;
      i = ref >= 1 ? ++j : --j
    ) {
      results.push(new Confetti());
    }
    return results;
  })();

  window.step = function() {
    let c;
    let j;
    let len;

    requestAnimationFrame(step);
    context.clearRect(0, 0, w, h);
    const results = [];
    for (j = 0, len = confetti.length; j < len; j += 1) {
      c = confetti[j];
      results.push(c.draw());
    }
    return results;
  };

  step();
}.call(this));
