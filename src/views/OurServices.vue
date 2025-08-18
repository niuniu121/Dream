<script setup>
import { onMounted, ref } from "vue";
import { gsap } from "gsap";

/* ================== 数据 ================== */
const plans = ref([
  {
    code: "A",
    title: "极速诊断包",
    price: 99,
    duration: "45 分钟",
    badge: "热门",
    bullets: [
      "猎头视角简历/LinkedIn 扫描报告",
      "竞争力差距分析（3 大盲区定位）",
      "24 小时内交付可执行方案",
    ],
    cta: { text: "Book Now", type: "primary" },
  },
  {
    code: "B1",
    title: "面试护航包",
    price: 899,
    duration: "48 小时蜕变",
    bullets: [
      "简历/求职信重构（高转化模板）",
      "LinkedIn 头条三黄金关键词",
      "模拟面试 + 实时评分卡反馈",
    ],
    cta: { text: "Book Now", type: "primary" },
  },
  {
    code: "B2",
    title: "人脉破局包",
    price: 1999,
    duration: "7 天冲刺",
    badge: "直推",
    bullets: [
      "B1 全服务 + 50-100 精英人脉代拓",
      "岗位匹配内推（300+ 合作企业）",
      "两版简历并行（多赛道推进）",
    ],
    cta: { text: "Request to Book", type: "outline" },
  },
  {
    code: "C",
    title: "铂金保障包",
    price: 5999,
    duration: "含签证支持",
    badge: "保障",
    bullets: [
      "B2 全服务 + 工作机会担保",
      "无限次简历迭代",
      "无 offer 退款 $3,000",
    ],
    cta: { text: "Request to Book", type: "outline" },
  },
  {
    code: "D",
    title: "自由拼装包",
    price: 299,
    duration: "起",
    bullets: [
      "模块化精准强化（简历/面试/谈薪）",
      "1 小时聚焦训练（含 STAR 速成）",
      "24/7 弹性预约，拒绝捆绑",
    ],
    cta: { text: "Explore Plans", type: "ghost" },
  },
]);

onMounted(() => {
  gsap.from(".services .container", {
    opacity: 0,
    duration: 0.6,
    ease: "power2.out",
  });

  gsap.from(".hero > *", {
    y: 12,
    opacity: 0,
    duration: 0.7,
    ease: "power3.out",
    stagger: 0.08,
    delay: 0.1,
  });

  gsap.from(".card", {
    y: 22,
    opacity: 0,
    duration: 0.65,
    ease: "power3.out",
    stagger: 0.08,
    delay: 0.2,
  });
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
        <article v-for="p in plans" :key="p.code" class="card">
          <div class="banner">
            <div class="pill">{{ p.code }}</div>
            <span v-if="p.badge" class="badge">{{ p.badge }}</span>
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
          </div>

          <div class="body">
            <h3 class="title">{{ p.title }}</h3>

            <div class="price-line">
              <span class="price">${{ p.price }}</span>
              <span class="sep">•</span>
              <span class="duration">{{ p.duration }}</span>
            </div>

            <ul class="bullets">
              <li v-for="b in p.bullets" :key="b">{{ b }}</li>
            </ul>

            <div class="actions">
              <button
                :class="[
                  'btn',
                  p.cta.type === 'primary' && 'btn-primary',
                  p.cta.type === 'outline' && 'btn-outline',
                  p.cta.type === 'ghost' && 'btn-ghost',
                ]"
              >
                {{ p.cta.text }}
              </button>
              <a class="link" href="javascript:void(0)">了解详情</a>
            </div>
          </div>
        </article>
      </div>

      <footer class="note">
        <p>*人工咨询</p>
      </footer>
    </div>
  </section>
</template>

<style scoped>
:root,
:host {
  --bg: #fbfbfd;
  --card: #ffffff;
  --text: #1f1f29;
  --muted: #666a73;
  --primary: #7e57c2;
  --primary-weak: #ede7f6;
  --ring: rgba(126, 87, 194, 0.25);
  --shadow: 0 6px 24px rgba(20, 16, 41, 0.06), 0 2px 8px rgba(20, 16, 41, 0.04);
  --radius: 18px;
}

.services {
  /* 顶部柔和渐变，避免上方空荡 */
  background:
    radial-gradient(950px 420px at 10% -10%, #f1eaff 0%, transparent 60%),
    radial-gradient(900px 420px at 100% -10%, #f3efff 0%, transparent 60%),
    var(--bg);
  min-height: 100vh;
  padding: 56px 0 84px;
}

/* 更宽容器：移动端紧凑，桌面端舒展 */
.container {
  max-width: clamp(980px, 86vw, 1280px);
  margin: 0 auto;
  padding: 0 24px;
}

.hero {
  text-align: center;
  margin-bottom: 10px;
}
.hero h1 {
  font-size: clamp(28px, 3.2vw, 40px);
  letter-spacing: 0.4px;
  color: var(--text);
  margin: 0 0 6px;
  font-weight: 800;
}
.hero p {
  color: var(--muted);
  font-size: 15px;
  margin: 0;
}

/* 自适应网格：自动填满横向空间 */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 28px;
  margin-top: 28px;
}

/* ===== 卡片 ===== */
.card {
  background: var(--card);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition:
    transform 0.35s ease,
    box-shadow 0.35s ease,
    border-color 0.35s ease;
  border: 1px solid transparent;
}
.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 36px rgba(20, 16, 41, 0.12);
  border-color: var(--ring);
}

.banner {
  position: relative;
  height: 110px;
  background: linear-gradient(180deg, var(--primary-weak), #fff 80%);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 14px 14px 0;
}
.pill {
  background: #fff;
  color: var(--primary);
  border: 1px solid var(--primary);
  font-weight: 700;
  font-size: 13px;
  padding: 6px 10px;
  border-radius: 999px;
  box-shadow: 0 2px 8px rgba(126, 87, 194, 0.18);
}
.badge {
  margin-left: auto;
  background: var(--primary);
  color: #fff;
  font-size: 12px;
  border-radius: 10px;
  padding: 6px 10px;
  align-self: center;
}
.blob {
  position: absolute;
  right: -18px;
  bottom: -18px;
  width: 120px;
  color: rgba(126, 87, 194, 0.16);
  pointer-events: none;
}

.body {
  padding: 18px 18px 16px;
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  gap: 10px;
}
.title {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: 0.2px;
}

.price-line {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: 14px;
}
.price {
  color: var(--text);
  font-weight: 800;
  font-size: 22px;
}
.sep {
  opacity: 0.4;
}
.duration {
  opacity: 0.9;
}

.bullets {
  margin: 6px 0 0;
  padding-left: 18px;
  color: var(--text);
  line-height: 1.6;
}
.bullets li {
  margin: 6px 0;
}

.actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

/* ===== 按钮 ===== */
.btn {
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid transparent;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}
.btn-primary {
  background: var(--primary);
  color: #fff;
  box-shadow: 0 6px 16px rgba(126, 87, 194, 0.25);
}
.btn-primary:hover {
  transform: translateY(-2px);
}
.btn-outline {
  background: #fff;
  color: var(--primary);
  border-color: var(--primary);
}
.btn-outline:hover {
  background: var(--primary-weak);
}
.btn-ghost {
  background: transparent;
  color: var(--text);
  border-color: rgba(31, 31, 41, 0.12);
}
.btn-ghost:hover {
  background: #f7f7fb;
}

.link {
  color: var(--muted);
  font-weight: 600;
  text-decoration: none;
}
.link:hover {
  color: var(--text);
}

.note {
  margin-top: 26px;
  color: var(--muted);
  font-size: 13px;
  text-align: center;
}

/* 移动端间距微调 */
@media (max-width: 680px) {
  .services {
    padding-top: 42px;
  }
  .body {
    padding: 16px;
  }
}
</style>
