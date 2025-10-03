<script setup>
import { computed, ref, onMounted } from "vue";

/* 自动加载 /src/assets 里所有 photo*.jpg|jpeg|png */
const rawMap = import.meta.glob("../assets/photo*.{jpg,jpeg,png}", {
  eager: true,
  as: "url",
});

function getIndexFromPath(p) {
  const m = String(p).match(/photo(\d+)\.(jpg|jpeg|png)$/i);
  return m ? Number(m[1]) : 9999;
}

const members = computed(() =>
  Object.entries(rawMap)
    .map(([path, url]) => ({
      id: getIndexFromPath(path),
      name: `Member ${getIndexFromPath(path)}`,
      title: "",
      avatar: url,
    }))
    .sort((a, b) => a.id - b.id)
);

const loaded = ref(new Set());
function handleLoad(i) {
  loaded.value.add(i);
}

onMounted(() => {
  const els = document.querySelectorAll(".card");
  els.forEach((el, i) => {
    el.animate(
      [
        { opacity: 0, transform: "translateY(8px) scale(.985)" },
        { opacity: 1, transform: "translateY(0) scale(1)" },
      ],
      {
        duration: 320,
        delay: 40 * i,
        easing: "cubic-bezier(.2,.65,.2,1)",
        fill: "both",
      }
    );
  });
});
</script>

<template>
  <section class="team">
    <div class="container">
      <header class="hero">
        <h1>Our Team</h1>
        <p>DreamBridge · 一起成就更好的你</p>
      </header>

      <div class="grid">
        <article
          v-for="(m, idx) in members"
          :key="m.id || idx"
          class="card"
          :aria-label="m.name"
          tabindex="0"
        >
          <div class="avatar-wrap">
            <div class="skeleton" v-show="!loaded.has(idx)" />
            <img
              class="avatar"
              :src="m.avatar"
              :alt="m.name"
              loading="lazy"
              @load="handleLoad(idx)"
            />
          </div>
          <h3 class="name">{{ m.name }}</h3>
          <p v-if="m.title" class="title">{{ m.title }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* 色板：采用你说的第二张图风格的紫色 */
:root,
:host {
  --bg: #f7f7fb;
  --text: #15161a;
  --muted: #6b7280;
  --card: #ffffff;
  --primary: #6e4fc6; /* 主题紫 */
  --primary-weak: rgba(110, 79, 198, 0.06);
  --ring: rgba(110, 79, 198, 0.32);
  --shadow:
    0 10px 26px rgba(18, 16, 39, 0.08), 0 2px 10px rgba(18, 16, 39, 0.05);
  --radius: 18px;
}

/* 背景保持轻渐变 */
.team {
  background:
    radial-gradient(900px 380px at 98% -10%, #f2efff 0%, transparent 60%),
    radial-gradient(900px 380px at 5% -10%, #efe9ff 0%, transparent 60%),
    var(--bg);
  min-height: 100vh;
  padding: 56px 0 80px;
  -webkit-font-smoothing: antialiased;
}

.container {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 22px;
}

.hero {
  text-align: center;
  margin-bottom: 22px;
}
.hero h1 {
  margin: 0 0 6px;
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 900;
}
.hero p {
  margin: 0;
  color: var(--muted);
  font-size: 14px;
}

/* 网格 */
.grid {
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
@media (max-width: 980px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 720px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 480px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.card {
  background: var(--card);
  border: 1px solid rgba(18, 16, 39, 0.1);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 14px;
  text-align: center;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    border-color 0.22s ease,
    background 0.22s ease;
  outline: none; /* 去掉默认黑色/蓝色 focus 框 */
}
.card:hover {
  transform: translateY(-4px);
  border-color: var(--ring);
  box-shadow: 0 16px 38px rgba(110, 79, 198, 0.2);
  background: #fff;
}
/* 仅键盘聚焦时显示紫色高亮环（无黑框） */
.card:focus-visible {
  box-shadow:
    0 0 0 3px var(--ring),
    var(--shadow);
  border-color: rgba(110, 79, 198, 0.5);
}

/* —— 关键：让图片完整展示且居中 —— */
.avatar-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1; /* 统一卡片高度 */
  border-radius: 14px;
  overflow: hidden;
  background: var(--primary-weak); /* 柔和紫底，contain 时留白更美观 */
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
}

/* 骨架 */
.skeleton {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #eceaf6 25%, #f6f4ff 37%, #eceaf6 63%);
  background-size: 400% 100%;
  animation: shimmer 1.1s infinite linear;
  border-radius: 14px;
}
@keyframes shimmer {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: -135% 0;
  }
}

/* 图片完整可见 + 居中，不裁切 */
.avatar {
  max-width: 92%;
  max-height: 92%;
  width: auto;
  height: auto;
  object-fit: contain; /* 完整显示 */
  object-position: center center; /* 居中对齐 */
  display: block;
  transition: transform 0.22s ease;
}
.card:hover .avatar {
  transform: scale(1.02);
}

.name {
  margin: 10px 0 2px;
  font-weight: 900;
  color: var(--text);
  font-size: 16px;
}
.title {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}

/* 减少动画偏好：禁用过渡/骨架 */
@media (prefers-reduced-motion: reduce) {
  .card,
  .avatar {
    transition: none !important;
  }
  .skeleton {
    animation: none !important;
  }
}
</style>
