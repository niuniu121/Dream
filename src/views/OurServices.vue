<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { gsap } from "gsap";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
} from "firebase/firestore";

/* ============== 数据状态 ============== */
const rawPlans = ref([]);
let unsubscribe = null;

function mapDoc(d) {
  const x = d.data();
  return {
    id: d.id,
    code: x.code,
    title: x.title,
    price: x.price,
    duration: x.tagline || x.duration || "",
    badge: x.badge || "",
    bullets: Array.isArray(x.bullets) ? x.bullets : [],
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

/* 订阅（索引缺失或无数据时自动降级） */
async function fallbackLoad() {
  const snap = await getDocs(collection(db, "services"));
  rawPlans.value = snap.docs
    .map(mapDoc)
    .filter((it) => it.published !== false)
    .sort((a, b) => a.order - b.order);
}
function subscribe() {
  const base = collection(db, "services");
  const q = query(
    base,
    where("published", "==", true),
    orderBy("order", "asc")
  );
  unsubscribe = onSnapshot(
    q,
    (snap) => {
      rawPlans.value = snap.docs.map(mapDoc);
      if (!rawPlans.value.length) fallbackLoad();
    },
    () => fallbackLoad()
  );
}

/* 
   把每条 bullets 的长句按中文常见标点切成更短的片段 —— */
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

/* 供模板使用的数据：带分段 bullets */
const plans = computed(() =>
  rawPlans.value.map((p) => ({ ...p, bulletsSplit: splitLines(p.bullets) }))
);

onMounted(() => {
  subscribe();
  gsap.from(".hero", { opacity: 0, y: 8, duration: 0.5, ease: "power2.out" });
  gsap.from(".card", {
    opacity: 0,
    y: 14,
    duration: 0.45,
    ease: "power2.out",
    stagger: 0.05,
    delay: 0.05,
  });
});
onBeforeUnmount(() => {
  if (typeof unsubscribe === "function") unsubscribe();
});
</script>

<template>
  <section class="services">
    <div class="container">
      <header class="hero">
        <h1>Services</h1>
        <p>DreamBridge 求职加速 | 毕业生专属价格表</p>
      </header>

      <div class="grid">
        <article v-for="p in plans" :key="p.id || p.code" class="card">
          <div class="card-top">
            <div class="pill">{{ p.code }}</div>
            <span v-if="p.badge" class="badge">{{ p.badge }}</span>
          </div>

          <h3 class="title">{{ p.title }}</h3>

          <div class="price-line">
            <span class="price">AUD ${{ p.price }}</span>
            <span class="dot">•</span>
            <span class="duration">{{ p.duration }}</span>
          </div>

          <!-- 文案分段 + 每条三行省略 -->
          <ul class="bullets">
            <li v-for="(b, idx) in p.bulletsSplit" :key="idx">
              <span class="clamp-3">{{ b }}</span>
            </li>
          </ul>

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

          <svg
            class="blob"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
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
:root,
:host {
  --bg: #f7f7fb; /* 柔和底色 */
  --card: #ffffff;
  --text: #15161a;
  --muted: #68707c;
  --primary: #7e57c2;
  --ring: rgba(126, 87, 194, 0.22);
  --shadow:
    0 10px 26px rgba(18, 16, 39, 0.07), 0 2px 10px rgba(18, 16, 39, 0.04);
  --radius: 18px;
}

/* 背景更柔和，顶部加微渐变 */
.services {
  background:
    radial-gradient(1000px 420px at 5% -10%, #efe9ff 0%, transparent 60%),
    radial-gradient(900px 380px at 98% -10%, #f2efff 0%, transparent 60%),
    var(--bg);
  min-height: 100vh;
  padding: 56px 0 84px;
}
.container {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 22px;
}

.hero {
  text-align: center;
  margin-bottom: 20px;
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

/* 三列网格（>1100：3列，<=760:2列，<=520:1列） */
.grid {
  display: grid;
  gap: 22px;
  margin-top: 14px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
@media (max-width: 760px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 520px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

/* 卡片更大、更精致 */
.card {
  position: relative;
  background: var(--card);
  border: 1px solid rgba(18, 16, 39, 0.08);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 18px 18px 16px;
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
  box-shadow: 0 16px 38px rgba(18, 16, 39, 0.12);
}

/* 顶部：Code + Badge */
.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  box-shadow: 0 1px 6px rgba(126, 87, 194, 0.18);
}
.badge {
  background: var(--primary);
  color: #fff;
  font-size: 11px;
  border-radius: 10px;
  padding: 4px 8px;
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

/* 文案条目（每条 3 行省略） */
.bullets {
  margin: 0 0 10px;
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

/* 底部按钮区，按钮更好看 */
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
  box-shadow: 0 8px 18px rgba(126, 87, 194, 0.28);
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

/* 装饰 blob（右下角淡紫色） */
.blob {
  position: absolute;
  right: -22px;
  bottom: -26px;
  width: 140px;
  color: rgba(126, 87, 194, 0.1);
  pointer-events: none;
}

.note {
  margin-top: 28px;
  text-align: center;
  color: var(--muted);
  font-size: 12px;
}
</style>
