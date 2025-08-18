<template>
  <section class="admin">
    <div class="panel">
      <h1>客户需求（{{ rows.length }}）</h1>

      <table class="table">
        <thead>
          <tr>
            <th class="col-name">姓名</th>
            <th class="col-contact">联系方式</th>
            <th class="col-req">需求</th>
            <th class="col-time">时间</th>
            <th class="col-status">状态</th>
            <th class="col-ops">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.id">
            <td class="col-name">{{ r.name }}</td>
            <td class="col-contact">
              <div class="muted">微信/其他：{{ r.contact }}</div>
              <div v-if="r.email" class="muted">邮箱：{{ r.email }}</div>
              <div v-if="r.phone" class="muted">电话：{{ r.phone }}</div>
            </td>
            <td class="col-req">
              <span class="clamp-3">{{ r.request }}</span>
            </td>
            <td class="col-time">{{ r.createdAtText }}</td>
            <td class="col-status">
              <select v-model="r.status" @change="updateStatus(r)">
                <option value="new">新提交</option>
                <option value="in_progress">处理中</option>
                <option value="done">已完成</option>
              </select>
            </td>
            <td class="col-ops">
              <button class="danger" @click="remove(r.id)">删除</button>
            </td>
          </tr>
          <tr v-if="!rows.length">
            <td colspan="6" class="empty">暂无数据</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const rows = ref([]);
let off = null;

onMounted(() => {
  const q = query(
    collection(db, "customer_requests"),
    orderBy("createdAt", "desc")
  );
  off = onSnapshot(q, (snap) => {
    rows.value = snap.docs.map((d) => {
      const x = d.data();
      const ts = x.createdAt?.toDate ? x.createdAt.toDate() : null;
      const createdAtText = ts
        ? `${ts.getFullYear()}-${String(ts.getMonth() + 1).padStart(2, "0")}-${String(ts.getDate()).padStart(2, "0")} ${String(ts.getHours()).padStart(2, "0")}:${String(ts.getMinutes()).padStart(2, "0")}`
        : "—";
      return { id: d.id, ...x, createdAtText };
    });
  });
});
onBeforeUnmount(() => off && off());

async function updateStatus(r) {
  await updateDoc(doc(db, "customer_requests", r.id), { status: r.status });
}

async function remove(id) {
  if (!confirm("确定删除这条记录吗？")) return;
  await deleteDoc(doc(db, "customer_requests", id));
}
</script>

<style scoped>
.admin {
  padding: 20px;
}
.panel {
  background: #fff;
  border: 1px solid rgba(18, 16, 39, 0.12);
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 6px 20px rgba(18, 16, 39, 0.06);
}
h1 {
  margin: 0 0 12px;
  font-size: 20px;
  font-weight: 900;
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
  vertical-align: top;
  font-size: 14px;
}
th {
  text-align: left;
  color: #454b57;
}

.col-name {
  width: 14%;
}
.col-contact {
  width: 26%;
}
.col-req {
  width: 30%;
}
.col-time {
  width: 14%;
}
.col-status {
  width: 10%;
}
.col-ops {
  width: 6%;
}

.muted {
  color: #667085;
  font-size: 13px;
  line-height: 1.45;
}
.clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

select {
  padding: 6px 8px;
  border: 1px solid rgba(18, 16, 39, 0.18);
  border-radius: 8px;
  background: #fff;
}
button.danger {
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #e57373;
  color: #e57373;
  background: #fff;
  cursor: pointer;
}
.empty {
  text-align: center;
  color: #777;
}
</style>
