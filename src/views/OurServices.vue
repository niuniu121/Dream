<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { gsap } from "gsap";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

/* ============== 数据状态 ============== */
const rawPlans = ref([]);
let unsubscribe = null;

function mapDoc(d) {
  const x = d.data() || {};
  return {
    id: d.id,
    code: x.code || "",
    title: x.title || "",
    price: typeof x.price === "number" ? x.price : Number(x.price) || 0,
    priceText: x.priceText || "",
    duration: x.tagline || x.duration || "",
    badge: x.badge || "",
    bullets: Array.isArray(x.bullets) ? x.bullets : [],
    guarantees: Array.isArray(x.guarantees) ? x.guarantees : [],
    cta: x.cta || { text: "Book Now", type: "primary" },
    published:
      typeof x.published === "boolean"
        ? x.published
        : typeof x.active === "boolean"
          ? x.active
          : true,
    order: typeof x.order === "number" ? x.order : 999,
  };
}

function subscribe() {
  const qy = query(collection(db, "services"), orderBy("order", "asc"));
  unsubscribe = onSnapshot(qy, (snap) => {
    rawPlans.value = snap.docs
      .map(mapDoc)
      .filter((it) => it.published !== false);
  });
}

/* 文案切段 */
const SPLIT_RE = /[。；;、，,·•\-—]+/g;
function splitLines(arr) {
  const out = [];
  for (const s of arr || []) {
    const parts = String(s)
      .split(SPLIT_RE)
      .map((t) => t.trim())
      .filter(Boolean);
    out.push(...parts);
  }
  return out;
}

const plans = computed(() =>
  rawPlans.value.map((p) => ({ ...p, bulletsSplit: splitLines(p.bullets) }))
);

function displayPrice(p) {
  return p.priceText ? p.priceText : `AUD $${p.price}`;
}

onMounted(() => {
  subscribe();
  gsap.from(".hero", { opacity: 0, y: 8, duration: 0.5, ease: "power2.out" });
  gsap.from(".card", {
    opacity: 0,
    y: 18,
    duration: 0.45,
    ease: "power2.out",
    stagger: 0.05,
    delay: 0.05,
  });
});

onBeforeUnmount(() => unsubscribe && unsubscribe());
</script>

<template>
  <section class="services">
    <div class="container">
      <header class="hero">
        <h1>Services</h1>
        <p>DreamBridge 求职加速｜毕业生专属</p>
      </header>

      <div class="grid">
        <article v-for="p in plans" :key="p.id || p.code" class="card">
          <div v-if="p.code || p.badge" class="card-top">
            <div v-if="p.code" class="pill">{{ p.code }}</div>
            <span v-if="p.badge" class="badge">{{ p.badge }}</span>
          </div>

          <h3 class="title">{{ p.title }}</h3>

          <div class="price-line">
            <span class="price">{{ displayPrice(p) }}</span>
            <span v-if="p.duration" class="dot">•</span>
            <span v-if="p.duration" class="duration">{{ p.duration }}</span>
          </div>

          <ul class="bullets">
            <li v-for="(b, i) in p.bulletsSplit" :key="i">
              <span class="clamp-3">{{ b }}</span>
            </li>
          </ul>

          <div v-if="p.guarantees?.length" class="guarantees">
            <h4>效果保障</h4>
            <ul>
              <li v-for="(g, gi) in p.guarantees" :key="gi">
                <span class="clamp-3">{{ g }}</span>
              </li>
            </ul>
          </div>

          <div class="actions">
            <button
              :class="[
                'btn',
                p.cta?.type === 'primary' && 'btn-primary',
                p.cta?.type === 'outline' && 'btn-outline',
                p.cta?.type === 'ghost' && 'btn-ghost',
              ]"
            >
              {{ p.cta?.text || "Book Now" }}
            </button>
            <button class="btn btn-ghost subtle">了解详情</button>
          </div>

          <svg class="blob" viewBox="0 0 200 200" aria-hidden="true">
            <path
              d="M38.7,-59.3C51.2,-51.4,63.3,-41.1,68.5,-28.4C73.7,-15.7,72.1,-0.7,67.4,12.2C62.7,25.1,54.9,35.8,44.8,45.8C34.8,55.8,22.5,65.1,8.2,71.1C-6.1,77.2,-22.5,80.1,-37.2,75C-51.9,69.9,-64.8,56.8,-71.1,41.3C-77.4,25.8,-77.1,7.9,-74.7,-9.5C-72.3,-26.9,-67.7,-43.9,-56.9,-53.2C-46.1,-62.5,-29.1,-64,-13.5,-64.6C2.2,-65.2,17.6,-64.8,38.7,-59.3Z"
              fill="currentColor"
            />
          </svg>
        </article>
      </div>

      <footer class="note"><p>*人工咨询</p></footer>
    </div>
  </section>
</template>

<style scoped>
/* —— 主题与间隙 —— */
:root,
:host {
  --primary: #6e4fc6; /* 第二张图的紫 */
  --bg-light: #f1eeff; /* 更明显的浅紫底 */
  --shadow:
    0 12px 28px rgba(18, 16, 39, 0.08), 0 3px 12px rgba(18, 16, 39, 0.05);
  --ring: rgba(110, 79, 198, 0.3);
  --gap: 40px; /* 间隙更大更通透 */
  --radius: 18px;
  --radius-sm: 12px;
  --muted: #6b7280;
  --text: #15161a;
}

/* 渐变背景：左上浅、右上深，保证缝隙显色 */
.services {
  /* 紫色渐变背景，间隙才能显现 */
  background: linear-gradient(135deg, #f6f0ff 0%, #e8e0ff 50%, #f6f0ff 100%);
  min-height: 100vh;
  padding: 64px 0 90px;
}

.services .grid {
  display: grid !important;
  grid-template-columns: repeat(3, 1fr);
  gap: 36px; /* 横向+纵向都留出紫色间隙 */
  padding: 8px; /* 让边缘也能露出一点紫色 */
  background: transparent; /* 关键：间隙透出 services 的背景 */
}

.services .card {
  background: #fff; /* 卡片必须是白色 */
  border: 1px solid rgba(18, 16, 39, 0.08);
  border-radius: 18px;
  box-shadow:
    0 12px 28px rgba(18, 16, 39, 0.08),
    0 3px 12px rgba(18, 16, 39, 0.05);
  margin: 0 !important; /* 防止 margin 把间隙填掉 */
}

/* 如果你有全局 .container 白底，这里强制透明，免得把缝隙盖白 */
.container {
  background: transparent !important;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 22px;
}

.hero {
  text-align: center;
  margin-bottom: 18px;
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

/* —— 关键：真实可见的“紫色缝隙” —— */
.grid {
  display: grid !important;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: var(--gap) !important;
  row-gap: var(--gap) !important;
  /* 让缝隙露出父级 section 的紫色；不要任何白色背景 */
  background: transparent !important;
  margin-top: 18px;
  /* 轻微 padding 让四周也留一点紫色边 */
  padding: 4px;
}
@media (max-width: 980px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

/* 卡片：白底对比、圆角、阴影 */
.card {
  position: relative;
  margin: 0 !important; /* 不用 margin，全部交给 gap 控制 */
  background: #fff;
  border: 1px solid rgba(18, 16, 39, 0.1);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 20px 20px 18px;
  display: grid;
  grid-template-rows: auto auto auto 1fr auto;
  overflow: hidden;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    border-color 0.22s ease;
}
.card:hover {
  transform: translateY(-4px);
  border-color: var(--ring);
  box-shadow: 0 20px 46px rgba(110, 79, 198, 0.22);
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
}
.pill {
  background: #fff;
  color: var(--primary);
  border: 1px solid var(--primary);
  font-weight: 900;
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 999px;
  box-shadow: 0 1px 6px rgba(110, 79, 198, 0.18);
}
.badge {
  background: var(--primary);
  color: #fff;
  font-size: 11px;
  border-radius: 10px;
  padding: 4px 8px;
  white-space: nowrap;
}

.title {
  margin: 6px 0 4px;
  font-size: 18px;
  font-weight: 900;
  color: var(--text);
}
.price-line {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: 13px;
  margin-bottom: 8px;
}
.price {
  color: var(--text);
  font-weight: 900;
  font-size: 20px;
}
.dot {
  opacity: 0.45;
}
.duration {
  opacity: 0.9;
}

.bullets {
  margin: 0 0 12px;
  padding-left: 18px;
  color: #1f2026;
  line-height: 1.55;
  font-size: 13px;
}
.bullets li {
  margin: 6px 0;
}
.clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.guarantees {
  margin: 8px 0 14px;
  padding: 10px 12px;
  background: rgba(110, 79, 198, 0.08);
  border-left: 3px solid var(--primary);
  border-radius: var(--radius-sm);
}
.guarantees h4 {
  margin: 0 0 6px;
  font-size: 13px;
  font-weight: 900;
  color: var(--primary);
}
.guarantees ul {
  margin: 0;
  padding-left: 16px;
  font-size: 13px;
  line-height: 1.55;
  color: #1f2026;
}
.guarantees li {
  margin: 4px 0;
}

.actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: auto;
}
.btn {
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid transparent;
  font-weight: 900;
  cursor: pointer;
  font-size: 13px;
  letter-spacing: 0.2px;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease,
    color 0.18s ease,
    border-color 0.18s ease;
}
.btn-primary {
  background: linear-gradient(135deg, #8b6adf, #6e4fc6);
  color: #fff;
  box-shadow: 0 8px 18px rgba(110, 79, 198, 0.28);
}
.btn-outline {
  background: #fff;
  color: var(--primary);
  border-color: var(--primary);
}
.btn-ghost {
  background: rgba(17, 18, 23, 0.04);
  color: #1e1f24;
  border-color: rgba(31, 31, 41, 0.08);
}
.btn:hover {
  transform: translateY(-1px);
}
.subtle {
  font-weight: 800;
}

.blob {
  position: absolute;
  right: -22px;
  bottom: -26px;
  width: 140px;
  color: rgba(110, 79, 198, 0.1);
  pointer-events: none;
}

.note {
  margin-top: 30px;
  text-align: center;
  color: var(--muted);
  font-size: 12px;
}

/* 降级处理 */
@media (prefers-reduced-motion: reduce) {
  .card,
  .btn {
    transition: none !important;
  }
}
</style>
