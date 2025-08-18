<script setup>
import { db } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

async function testFirestore() {
  try {
    const docRef = await addDoc(collection(db, "testCollection"), {
      msg: "hello DreamBridge",
      createdAt: serverTimestamp(),
    });
    alert("写入成功，doc id = " + docRef.id);
  } catch (e) {
    alert("写入失败: " + e.message);
  }
}
</script>

<template>
  <div>
    <h1>测试 Firebase</h1>
    <button @click="testFirestore">写入一条测试数据</button>
  </div>
</template>
