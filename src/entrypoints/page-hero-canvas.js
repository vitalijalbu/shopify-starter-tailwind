(function () {
  function initCanvas(canvas) {
    if (!canvas) return;
    if (canvas.dataset.pixelInit === "1") return;
    canvas.dataset.pixelInit = "1";
    var ctx = canvas.getContext("2d");
    var img = new Image();
    img.decoding = "async";
    var bgSrc = canvas.getAttribute("data-bg-src");
    if (!bgSrc) {
      canvas.style.opacity = "0";
      return;
    }
    img.src = bgSrc;

    var rafId = null;
    var dpr = Math.max(1, window.devicePixelRatio || 1);
    var steps = [
      [1, 0],
      [1, -1],
      [0, -1],
      [-1, 0],
      [-1, 1],
      [0, 1],
      [0, 0],
    ];
    var stepIndex = 0;
    var alpha = 1;

    function resize() {
      var rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(2, Math.round(rect.width * dpr));
      canvas.height = Math.max(2, Math.round(rect.height * dpr));
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }

    function draw(offsetX, offsetY) {
      var cw = canvas.clientWidth || canvas.width / dpr;
      var ch = canvas.clientHeight || canvas.height / dpr;
      ctx.clearRect(0, 0, cw, ch);
      ctx.imageSmoothingEnabled = false;
      var blockCols = 24;
      var blockW = Math.max(1, Math.round(cw / blockCols));
      var blockH = blockW; // squares
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, offsetX * blockW, offsetY * blockH, cw, ch);
      ctx.globalAlpha = 1;
    }

    function animate() {
      var prefersReduce =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduce) {
        alpha = 0; // no animation, overlay hidden
        draw(0, 0);
        return;
      }
      var tPerStep = 160; // ms per step
      var lastTime = performance.now();
      var acc = 0;
      function loop(now) {
        acc += now - lastTime;
        lastTime = now;
        while (acc >= tPerStep) {
          acc -= tPerStep;
          stepIndex = Math.min(stepIndex + 1, steps.length - 1);
          if (stepIndex >= steps.length - 2) {
            alpha = Math.max(0, alpha - 0.3);
          }
        }
        var s = steps[stepIndex];
        draw(s[0], s[1]);
        if (stepIndex < steps.length - 1 || alpha > 0) {
          rafId = requestAnimationFrame(loop);
        } else {
          canvas.style.opacity = "0";
        }
      }
      rafId = requestAnimationFrame(loop);
    }

    function start() {
      resize();
      if (img.complete) {
        animate();
      } else {
        img.onload = animate;
        img.onerror = function () {
          canvas.style.opacity = "0";
        };
      }
    }

    var ro;
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(function () {
        resize();
      });
      ro.observe(canvas);
    } else {
      window.addEventListener("resize", resize);
    }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden && rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      } else if (!rafId) {
        animate();
      }
    });

    start();
  }

  function initAll() {
    var canvases = document.querySelectorAll(
      'canvas[data-pixel-canvas="true"]'
    );
    canvases.forEach(initCanvas);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
