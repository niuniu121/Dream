<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const router = useRouter();

const email = ref("");
const password = ref("");
const showPwd = ref(false);
const loading = ref(false);
const errorMsg = ref("");

function mapError(e) {
  const code = e?.code || "";
  // 常见错误码
  if (code === "auth/invalid-email") return "邮箱格式不正确";
  if (code === "auth/user-not-found") return "用户不存在";
  if (code === "auth/wrong-password") return "密码错误";
  if (code === "auth/too-many-requests") return "尝试过多，请稍后再试";
  if (
    code === "auth/api-key-not-valid" ||
    code.startsWith("auth/invalid-api-key")
  )
    return "API Key 不正确：请确认使用 Firebase 项目中的 Web API 密钥，并检查 GCP 的 Key 限制。";
  return e?.message || "登录失败，请稍后再试";
}

async function handleLogin() {
  errorMsg.value = "";

  const mail = email.value.trim();
  const pass = password.value.trim();

  if (!mail || !pass) {
    errorMsg.value = "请输入邮箱和密码";
    return;
  }

  loading.value = true;
  try {
    await signInWithEmailAndPassword(auth, mail, pass);
    router.push("/admin");
  } catch (e) {
    errorMsg.value = mapError(e);
    // 可选：方便排错
    console.error("Login error:", e);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <section class="login">
    <div class="card">
      <h1>Admin Login</h1>

      <form @submit.prevent="handleLogin">
        <label class="field">
          <span>邮箱</span>
          <input
            class="input"
            v-model="email"
            type="email"
            placeholder="you@example.com"
            autocomplete="username"
            required
          />
        </label>

        <label class="field">
          <span>密码</span>
          <div class="control">
            <input
              class="input"
              :type="showPwd ? 'text' : 'password'"
              v-model="password"
              placeholder="••••••••"
              autocomplete="current-password"
              required
            />
            <button
              class="eye"
              type="button"
              @click="showPwd = !showPwd"
              :aria-pressed="showPwd"
              :aria-label="showPwd ? '隐藏密码' : '显示密码'"
            >
              {{ showPwd ? "隐藏" : "显示" }}
            </button>
          </div>
        </label>

        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

        <button
          class="btn"
          type="submit"
          :disabled="loading || !email?.trim() || !password?.trim()"
        >
          {{ loading ? "登录中…" : "登录" }}
        </button>
      </form>
    </div>
  </section>
</template>

<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
}
.login {
  min-height: 72vh;
  display: grid;
  place-items: center;
  padding: 32px 16px;
  background:
    radial-gradient(900px 420px at 80% -10%, #f3efff 0%, transparent 60%),
    #fbfbfd;
}
.card {
  width: min(92vw, 440px);
  background: #fff;
  border: 1px solid rgba(126, 87, 194, 0.18);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(20, 16, 41, 0.08);
  padding: 22px 22px 24px;
}
h1 {
  margin: 0 0 14px;
  font-size: 22px;
  font-weight: 800;
  color: #1f1f29;
}
form {
  margin: 0;
}
.field {
  display: grid;
  gap: 8px;
  margin: 12px 0;
}
.field > span {
  color: #666a73;
  font-size: 13px;
}
.input {
  width: 100%;
  height: 42px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(31, 31, 41, 0.15);
  background: #fff;
  outline: none;
  font-size: 14px;
}
.input:focus {
  border-color: #7e57c2;
  box-shadow: 0 0 0 3px rgba(126, 87, 194, 0.12);
}
.control {
  position: relative;
}
.eye {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  border: 1px solid rgba(31, 31, 41, 0.12);
  background: #fff;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
}
.btn {
  width: 100%;
  margin-top: 10px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 0;
  color: #fff;
  background: #7e57c2;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 8px 18px rgba(126, 87, 194, 0.25);
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.error {
  color: #d93025;
  font-size: 13px;
  margin: 8px 0;
}
</style>
