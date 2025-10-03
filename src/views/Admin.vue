<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

const router = useRouter();
const userEmail = ref("");
const loading = ref(false);
const editingId = ref(null);
const services = ref([]);

/* 表单：新增 priceText（价格文字） */
const form = reactive({
  code: "",
  title: "",
  price: 0, // 数字价格（单位 AUD）
  priceText: "", // 价格文字（若填写将优先生效）
  tagline: "",
  badge: "",
  bulletsText: "",
  guaranteesText: "",
  advantagesText: "",
  ctaText: "Book Now",
  ctaType: "primary",
  published: true,
  order: 100,
});

let offAuth, offSnap;

onMounted(() => {
  offAuth = onAuthStateChanged(auth, (u) => {
    if (!u) return router.replace("/login");
    userEmail.value = u.email || "";
  });

  const colRef = collection(db, "services");
  const qy = query(colRef, orderBy("order", "asc"));
  offSnap = onSnapshot(qy, (snap) => {
    services.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  });
});

onBeforeUnmount(() => {
  offAuth && offAuth();
  offSnap && offSnap();
});

async function handleLogout() {
  await signOut(auth);
  router.replace("/login");
}

async function userDetail() {
  router.replace("/customer");
}

function parseLines(s) {
  return String(s || "")
    .split("\n")
    .map((v) => v.trim())
    .filter(Boolean);
}

function resetForm() {
  editingId.value = null;
  Object.assign(form, {
    code: "",
    title: "",
    price: 0,
    priceText: "",
    tagline: "",
    badge: "",
    bulletsText: "",
    guaranteesText: "",
    advantagesText: "",
    ctaText: "Book Now",
    ctaType: "primary",
    published: true,
    order: 100,
  });
}

async function saveService() {
  loading.value = true;
  try {
    const payload = {
      code: form.code.trim(),
      title: form.title.trim(),
      price: Number(form.price) || 0,
      priceText: form.priceText.trim() || null, // << 新增：价格文字
      tagline: form.tagline.trim(),
      badge: form.badge.trim() || null,
      bullets: parseLines(form.bulletsText),
      guarantees: parseLines(form.guaranteesText),
      advantages: parseLines(form.advantagesText),
      cta: { text: form.ctaText.trim(), type: form.ctaType },
      published: !!form.published,
      order: Number(form.order) || 100,
      updatedAt: serverTimestamp(),
      ...(editingId.value ? {} : { createdAt: serverTimestamp() }),
    };

    if (!editingId.value) {
      await addDoc(collection(db, "services"), payload);
    } else {
      await updateDoc(doc(db, "services", editingId.value), payload);
    }
    resetForm();
  } finally {
    loading.value = false;
  }
}

function editRow(row) {
  editingId.value = row.id;
  Object.assign(form, {
    code: row.code || "",
    title: row.title || "",
    price: row.price ?? 0,
    priceText: row.priceText || "", // << 新增
    tagline: row.tagline || "",
    badge: row.badge || "",
    bulletsText: (row.bullets || []).join("\n"),
    guaranteesText: (row.guarantees || []).join("\n"),
    advantagesText: (row.advantages || []).join("\n"),
    ctaText: row.cta?.text || "Book Now",
    ctaType: row.cta?.type || "primary",
    published: !!row.published,
    order: row.order ?? 100,
  });
}

async function removeRow(id) {
  if (!confirm("确定删除这条服务吗？")) return;
  await deleteDoc(doc(db, "services", id));
  if (editingId.value === id) resetForm();
}

/* 小工具：把服务对象格式化为展示用价格 */
function displayPrice(s) {
  // 如果有 priceText，就直接展示它；否则展示数字价格
  if (s.priceText) return s.priceText;
  const n = Number(s.price) || 0;
  return `AUD $${n}`;
}
</script>

<template>
  <section class="admin">
    <header class="bar">
      <h1>Admin · Services</h1>
      <div class="right">
        <span class="user">{{ userEmail }}</span>
        <button class="logout" @click="handleLogout">退出</button>
        <button class="logout" @click="userDetail">用户详情</button>
      </div>
    </header>

    <div class="grid">
      <!-- 左：表单 -->
      <div class="panel">
        <h2>{{ editingId ? "编辑服务" : "新增服务" }}</h2>
        <div class="form">
          <label><span>标题</span><input v-model="form.title" /></label>

          <div class="row2">
            <label class="col">
              <span>价格（数字，AUD）</span>
              <input type="number" v-model.number="form.price" min="0" />
            </label>
            <label class="col">
              <span>价格文字（可选，如：按Offer佣金计费/面议）</span>
              <input
                v-model="form.priceText"
                placeholder="填写则优先展示此文字"
              />
            </label>
          </div>

          <!-- <label
            ><span>副标题/时长</span><input v-model="form.tagline"
          /></label> -->

          <label
            ><span>核心优势与服务亮点</span>
            <textarea rows="5" v-model="form.bulletsText" />
          </label>

          <label
            ><span>效果保障</span>
            <textarea rows="3" v-model="form.guaranteesText" />
          </label>

          <!-- 如需恢复市场优势，在此解除注释 -->
          <!--
          <label><span>市场优势</span>
            <textarea rows="3" v-model="form.advantagesText" />
          </label>
          -->

          <label class="row">
            <input type="checkbox" v-model="form.published" />
            <span>上架（前台展示）</span>
          </label>

          <label
            ><span>排序</span>
            <input type="number" v-model.number="form.order" />
          </label>

          <div class="actions">
            <button class="btn" :disabled="loading" @click="saveService">
              {{ loading ? "保存中…" : editingId ? "保存修改" : "新增" }}
            </button>
            <button class="btn ghost" @click="resetForm">清空</button>
          </div>
        </div>
      </div>

      <!-- 右：列表 -->
      <div class="panel">
        <h2>当前服务（{{ services.length }}）</h2>
        <table class="table">
          <thead>
            <tr>
              <th class="col-title">标题</th>
              <th class="col-price">价格/文字</th>
              <th class="col-status">状态</th>
              <th class="col-ops">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in services" :key="s.id">
              <td class="col-title">{{ s.title }}</td>
              <td class="col-price">{{ displayPrice(s) }}</td>
              <td class="col-status">{{ s.published ? "上架" : "下架" }}</td>
              <td class="ops col-ops">
                <button @click="editRow(s)">编辑</button>
                <button class="danger" @click="removeRow(s.id)">删除</button>
              </td>
            </tr>
            <tr v-if="!services.length">
              <td class="empty" colspan="4">暂无数据</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<style scoped>
.admin {
  padding: 20px;
}
.bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
h1 {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
}
.right {
  display: flex;
  gap: 10px;
  align-items: center;
}
.user {
  color: #666;
  font-size: 14px;
}
.logout {
  padding: 8px 12px;
  border: 1px solid rgba(31, 31, 41, 0.15);
  background: #fff;
  border-radius: 10px;
  cursor: pointer;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 16px;
}
.panel {
  background: #fff;
  border: 1px solid rgba(31, 31, 41, 0.12);
  border-radius: 14px;
  padding: 16px;
}
h2 {
  margin: 0 0 12px;
  font-size: 18px;
}

.form {
  display: grid;
  gap: 10px;
}
label {
  display: grid;
  gap: 6px;
}
label > span {
  font-size: 13px;
  color: #666;
}
input,
textarea,
select {
  padding: 10px 12px;
  border: 1px solid rgba(31, 31, 41, 0.15);
  border-radius: 10px;
  outline: none;
}

/* 两列布局：价格数字 + 价格文字 */
.row2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.actions {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}
.btn {
  padding: 10px 14px;
  border-radius: 10px;
  border: 0;
  background: #7e57c2;
  color: #fff;
  font-weight: 800;
  cursor: pointer;
}
.btn.ghost {
  background: #eee;
  color: #333;
}

.table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
th,
td {
  padding: 10px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  vertical-align: middle;
}
th {
  text-align: left;
  color: #444;
  font-weight: 700;
}
.empty {
  text-align: center;
  color: #777;
}

.col-title {
  width: 42%;
}
.col-price {
  width: 22%;
}
.col-status {
  width: 16%;
}
.col-ops {
  width: 20%;
}

.ops button {
  margin-right: 6px;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid rgba(31, 31, 41, 0.15);
  background: #fff;
  cursor: pointer;
}
.ops .danger {
  border-color: #e57373;
  color: #e57373;
}

@media (max-width: 980px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .row2 {
    grid-template-columns: 1fr;
  }
}
</style>
