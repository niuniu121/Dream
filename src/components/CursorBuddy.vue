<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import defaultSvg from "@/assets/cursor/buddy-default.svg";
import handSvg from "@/assets/cursor/buddy-hand.svg";

/** ====== 可调参数 ====== */
// 0.1：很柔和（慢）｜0.25：淡平滑｜0.45：更跟手｜1：完全 1:1 跟随
const LERP = 0.45;
// 需要识别为“可交互”的元素选择器（悬停时切手势）
const INTERACTIVE =
  "a,button,[role='button'],.btn,input,select,textarea,label,[data-cursor]";

/** ====== 状态 ====== */
const x = ref(window.innerWidth / 2);
const y = ref(window.innerHeight / 2);
let tx = x.value,
  ty = y.value; // 目标位置
const visible = ref(false);
const isDown = ref(false);
const isFocus = ref(false);
let rafId = 0;
let enabled = true;

/** ====== 工具 ====== */
function matchesInteractive(el) {
  while (el) {
    if (el.matches?.(INTERACTIVE)) return true;
    el = el.parentElement;
  }
  return false;
}

/** ====== 事件 ====== */
function onMove(e) {
  tx = e.clientX;
  ty = e.clientY;
  visible.value = true;
  isFocus.value = matchesInteractive(e.target);
}
function onDown() {
  isDown.value = true;
}
function onUp() {
  isDown.value = false;
}
function onLeave() {
  visible.value = false;
}

/** ====== 动画帧：只用 JS 插值，取消 CSS 过渡 ====== */
function tick() {
  x.value += (tx - x.value) * LERP;
  y.value += (ty - y.value) * LERP;
  rafId = requestAnimationFrame(tick);
}

/** ====== 计算样式 ====== */
const style = computed(() => {
  const scale = isDown.value || isFocus.value ? 0.92 : 1;
  const rot = isFocus.value ? -8 : 0;
  // 直接 translate3d 触发 GPU，加上 -16 实现居中
  return {
    transform: `translate3d(${x.value - 16}px, ${y.value - 16}px, 0) scale(${scale}) rotate(${rot}deg)`,
  };
});

/** ====== 生命周期 ====== */
onMounted(() => {
  // 粗指针（移动端）禁用，不影响触屏
  if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) {
    enabled = false;
    return;
  }
  // 隐藏系统光标
  document.documentElement.classList.add("desktop-cursor");

  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("mousedown", onDown, { passive: true });
  window.addEventListener("mouseup", onUp, { passive: true });
  window.addEventListener("mouseleave", onLeave, { passive: true });

  tick();
});

onBeforeUnmount(() => {
  if (!enabled) return;
  document.documentElement.classList.remove("desktop-cursor");
  cancelAnimationFrame(rafId);
  window.removeEventListener("mousemove", onMove);
  window.removeEventListener("mousedown", onDown);
  window.removeEventListener("mouseup", onUp);
  window.removeEventListener("mouseleave", onLeave);
});
</script>

<template>
  <!-- 固定层，不占布局；高 z-index；不接收事件 -->
  <div v-show="visible" class="cursor-buddy" :style="style" aria-hidden="true">
    <img
      :src="isDown || isFocus ? handSvg : defaultSvg"
      alt=""
      class="img"
      width="32"
      height="32"
      draggable="false"
    />
  </div>
</template>

<style scoped>
.cursor-buddy {
  position: fixed;
  left: 0;
  top: 0;
  width: 32px;
  height: 32px;
  z-index: 2147483647; /* 顶层 */
  pointer-events: none;
  will-change: transform; /* 提示浏览器优化 transform */
  /* 注意：不再使用 transition，避免“二次平滑”导致跟手慢 */
  filter: drop-shadow(0 3px 10px rgba(110, 79, 198, 0.25));
}
.img {
  display: block;
  width: 100%;
  height: 100%;
}

/* 降级——系统偏好减少动画时，直接 1:1 跟随（在 JS 里把 LERP 改 1 更彻底） */
@media (prefers-reduced-motion: reduce) {
  .cursor-buddy {
    filter: none;
  }
}
</style>
