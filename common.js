/* 九面玄策 · 共享脚本：播放控制 / REC 计时 / 干扰系统 / 眼睛事件 */
(function () {
  "use strict";

  var site = document.getElementById("site");
  var recBar = document.getElementById("recBar");
  var recTimer = document.getElementById("recTimer");
  var glitchFrame = document.getElementById("glitchFrame");
  var jumpText = document.getElementById("jumpText");

  var isIndex = document.body.classList.contains("is-index");
  var started = !isIndex;  // 内页直接进入"播放中"状态
  var startTime = Date.now();
  var finalFired = false;

  /* ---------- REC 条 ---------- */
  if (recBar) {
    if (!isIndex) {
      recBar.classList.add("show");
    }
    setInterval(function () {
      if (!started || !recTimer) return;
      var s = Math.floor((Date.now() - startTime) / 1000);
      var h = String(Math.floor(s / 3600)).padStart(2, "0");
      var m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
      var sec = String(s % 60).padStart(2, "0");
      recTimer.textContent = h + ":" + m + ":" + sec;
    }, 1000);
  }

  /* ---------- 首页播放 ---------- */
  var playBtn = document.getElementById("playBtn");
  if (playBtn) {
    playBtn.addEventListener("click", function () {
      var intro = document.getElementById("intro");
      started = true;
      startTime = Date.now();
      intro.style.transition = "opacity .9s ease";
      intro.style.opacity = "0";
      setTimeout(function () {
        intro.style.display = "none";
        if (site) site.classList.remove("hidden");
        if (recBar) recBar.classList.add("show");
      }, 850);
      setTimeout(function () { fireFrame(); }, 1500);
      initScares();
    });
  }

  /* ---------- 内页直接启动干扰 ---------- */
  if (!isIndex) setTimeout(initScares, 1200);

  function initScares() {
    scheduleFrame();
    scheduleJump();
    schedulePeek();
    scheduleEyeFlash();
    scheduleIdleWatch();
  }

  /* ---------- 帧闪烁 ---------- */
  function fireFrame() {
    if (!glitchFrame) return;
    glitchFrame.classList.add("on");
    setTimeout(function () { glitchFrame.classList.remove("on"); }, 280);
  }
  function scheduleFrame() {
    var delay = 6000 + Math.random() * 8000;
    setTimeout(function () {
      if (!finalFired) { fireFrame(); scheduleFrame(); }
    }, delay);
  }

  /* ---------- 随机闪现文字 ---------- */
  var phrases = [
    "它 看 见 你 了",
    "你 的 脸 被 记 下 了",
    "数 一 数 你 梦 里 的 人",
    "别 在 午 夜 观 想",
    "面 后 有 面",
    "第 十 面 在 看 你",
    "它 在 你 背 后 读 完 了 这 页",
    "梦 里 的 那 张 脸 不 是 你 的",
    "你 也 是 别 人 的 面 纹",
    "把 头 转 过 来"
  ];
  function showJump() {
    if (!jumpText) return;
    jumpText.textContent = phrases[Math.floor(Math.random() * phrases.length)];
    jumpText.style.left = (5 + Math.random() * 60) + "vw";
    jumpText.style.top = (10 + Math.random() * 70) + "vh";
    jumpText.style.fontSize = (13 + Math.random() * 9) + "px";
    jumpText.classList.remove("show");
    void jumpText.offsetWidth;
    jumpText.classList.add("show");
  }
  function scheduleJump() {
    var delay = 9000 + Math.random() * 10000;
    setTimeout(function () {
      if (!finalFired) { showJump(); scheduleJump(); }
    }, delay);
  }

  /* ---------- 眼睛照片：随鼠标漂浮 ---------- */
  var follow = document.getElementById("eyeFollow");
  var followTarget = { x: -200, y: -200 };
  var followCurrent = { x: -200, y: -200 };
  document.addEventListener("mousemove", function (e) {
    if (!follow) return;
    var offset = 220;
    followTarget.x = e.clientX - 35 - offset * 0.6;
    followTarget.y = e.clientY - 35 + offset * 0.3;
  });
  function tickFollow() {
    if (follow) {
      followCurrent.x += (followTarget.x - followCurrent.x) * 0.06;
      followCurrent.y += (followTarget.y - followCurrent.y) * 0.06;
      follow.style.transform = "translate(" + followCurrent.x + "px," + followCurrent.y + "px)";
    }
    requestAnimationFrame(tickFollow);
  }
  if (follow) {
    tickFollow();
    setTimeout(function () { follow.classList.add("active"); }, 2200);
  }

  /* ---------- 眼睛照片：边缘窥视 ---------- */
  var peeks = document.querySelectorAll(".eye-peek");
  function schedulePeek() {
    if (!peeks.length) return;
    var delay = 12000 + Math.random() * 15000;
    setTimeout(function () {
      if (!finalFired) {
        peeks.forEach(function (p, i) {
          if (Math.random() < 0.5) {
            setTimeout(function () {
              p.classList.add("show");
              setTimeout(function () { p.classList.remove("show"); }, 2600 + Math.random() * 2000);
            }, i * 1200);
          }
        });
        schedulePeek();
      }
    }, delay);
  }

  /* ---------- 眼睛照片：中央闪现（jump scare） ---------- */
  var flash = document.getElementById("eyeFlash");
  function scheduleEyeFlash() {
    if (!flash) return;
    var delay = 22000 + Math.random() * 20000;
    setTimeout(function () {
      if (!finalFired) {
        flash.style.left = (Math.random() * 60 + 10) + "vw";
        flash.style.top = (Math.random() * 50 + 15) + "vh";
        flash.classList.remove("show");
        void flash.offsetWidth;
        flash.classList.add("show");
        fireFrame();
        setTimeout(function () { flash.classList.remove("show"); }, 700);
        scheduleEyeFlash();
      }
    }, delay);
  }

  /* ---------- 无操作凝视：眼睛浮到屏幕中央 ---------- */
  var idle = 0;
  var lastX = 0, lastY = 0;
  document.addEventListener("mousemove", function (e) {
    if (Math.abs(e.clientX - lastX) > 4 || Math.abs(e.clientY - lastY) > 4) {
      lastX = e.clientX; lastY = e.clientY; idle = 0;
    }
  });
  setInterval(function () {
    if (finalFired) return;
    idle += 1;
    if (idle === 9 && flash) {
      flash.style.left = "calc(50vw - 100px)";
      flash.style.top = "calc(50vh - 100px)";
      flash.classList.add("show");
      showJump();
    }
    if (idle === 12 && flash) flash.classList.remove("show");
  }, 1000);

  /* ---------- 滚动渐入 ---------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add("inview");
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".sec").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".sec").forEach(function (el) { el.classList.add("inview"); });
  }

  /* ---------- 文字抖动悬停 ---------- */
  document.querySelectorAll(".glitch-trigger").forEach(function (el) {
    el.addEventListener("mouseenter", function () {
      el.classList.add("glitching");
      if (Math.random() < 0.5) fireFrame();
    });
    el.addEventListener("mouseleave", function () {
      el.classList.remove("glitching");
    });
  });

  /* 四相面质：悬停时偶尔跳出一句耳语 */
  var whispers = [
    "你 是 什 么 材 质 ？",
    "木 会 生 长 。它 也 会 。",
    "铁 挡 得 住 刀 ，挡 不 住 记 忆 。",
    "银 面 的 人 看 得 太 多 ，忘 得 太 少 。",
    "金 面 从 来 不 是 统 御 ，是 吞 噬 。"
  ];
  document.querySelectorAll(".face-card").forEach(function (card) {
    card.addEventListener("mouseenter", function () {
      if (Math.random() < 0.35) showJumpAt(card, whispers[Math.floor(Math.random() * whispers.length)]);
    });
  });
  function showJumpAt(el, text) {
    if (!jumpText) return;
    var r = el.getBoundingClientRect();
    jumpText.textContent = text;
    jumpText.style.left = (r.left + Math.random() * 40) + "px";
    jumpText.style.top = (r.top + Math.random() * 30) + "px";
    jumpText.classList.remove("show");
    void jumpText.offsetWidth;
    jumpText.classList.add("show");
  }

  /* ---------- 键盘彩蛋：连按 9 / 九 ---------- */
  var typeBuf = "";
  document.addEventListener("keydown", function (e) {
    if (finalFired) return;
    var k = e.key;
    if (k === "9" || k === "九") {
      typeBuf += k;
      if (typeBuf.length >= 3) {
        typeBuf = "";
        triggerFinal();
      }
    } else if (/^[a-zA-Z]$/.test(k) || /[0-8]$/.test(k) || /[\u4e00-\u9fff]/.test(k)) {
      typeBuf = "";
    }
  });

  function triggerFinal() {
    finalFired = true;
    var bo = document.getElementById("blackout");
    var boFace = document.getElementById("boFace");
    if (boFace) boFace.textContent = "它 的 面 = 你 的 面";
    if (bo) bo.classList.add("show");
    fireFrame();
    fireFrame();
    document.body.style.overflow = "hidden";
  }

  /* ---------- 接近页面底部触发片尾（仅尾页触发） ---------- */
  if (document.body.classList.contains("is-final")) {
    window.addEventListener("scroll", function () {
      if (finalFired) return;
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 320) {
        finalFired = true;
        var bo = document.getElementById("blackout");
        var boFace = document.getElementById("boFace");
        if (boFace) boFace.textContent = "你 的 面 孔 已 登 记 。";
        setTimeout(function () {
          if (bo) bo.classList.add("show");
          document.body.style.overflow = "hidden";
        }, 4200);
      }
    }, { passive: true });
  }

  /* ---------- 标题随机渗字 ---------- */
  setInterval(function () {
    if (finalFired) return;
    if (Math.random() < 0.15) {
      document.querySelectorAll(".cover-title").forEach(function (t) {
        t.style.transform = "translate(" + (Math.random() * 3 - 1.5) + "px," + (Math.random() * 2 - 1) + "px)";
        setTimeout(function () { t.style.transform = ""; }, 160);
      });
    }
  }, 4500);

  /* ---------- 静态噪声点击：眼睛立刻直盯 ---------- */
  document.body.addEventListener("click", function () {
    if (Math.random() < 0.18 && flash) {
      flash.style.left = "calc(50vw - 100px)";
      flash.style.top = "calc(50vh - 100px)";
      flash.classList.add("show");
      fireFrame();
      setTimeout(function () { flash.classList.remove("show"); }, 700);
    }
  });
})();