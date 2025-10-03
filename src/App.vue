<script setup>
import NavBar from "./components/NavBar.vue";
import CursorBuddy from "@/components/CursorBuddy.vue";
</script>

<template>
  <NavBar />
  <router-view />
  <!-- 自定义鼠标（桌面端自动启用，移动端自动禁用） -->
  <CursorBuddy />
</template>

<!-- 注意：这里不要 scoped，这是全局规则 -->
<style>
/* 仅在桌面端隐藏系统光标；移动端不影响 */
@media (pointer: fine) {
  html.desktop-cursor,
  html.desktop-cursor body,
  html.desktop-cursor * {
    cursor: none !important;
  }
  /* 交互元素沿用自定义光标（inherit），避免系统光标重新出现 */
  html.desktop-cursor a,
  html.desktop-cursor button,
  html.desktop-cursor [role="button"],
  html.desktop-cursor input,
  html.desktop-cursor select,
  html.desktop-cursor textarea,
  html.desktop-cursor label {
    cursor: inherit !important;
  }
}
</style>
