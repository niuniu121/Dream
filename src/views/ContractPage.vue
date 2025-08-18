<template>
  <section class="page">
    <div class="card">
      <div class="detailNumber">Our contact information: 0424 827 818</div>
      <h1>Submit Your Request</h1>
      <p class="sub">
        Please leave your contact details and request. We will get back to you
        shortly.
      </p>

      <form class="form" @submit.prevent="handleSubmit">
        <label>
          <span>Name *</span>
          <input v-model.trim="form.name" placeholder="Your name" required />
        </label>

        <label>
          <span>WeChat / Other Contact </span>
          <input
            v-model.trim="form.contact"
            placeholder="WeChat ID / Alternative contact"
            required
          />
        </label>

        <div class="grid2">
          <label>
            <span>Email</span>
            <input
              v-model.trim="form.email"
              type="email"
              placeholder="demo@example.com"
            />
          </label>

          <label>
            <span>Phone</span>
            <input
              v-model.trim="form.phone"
              type="tel"
              placeholder="+61 4xx xxx xxx"
            />
          </label>
        </div>

        <div>
          <label></label>
        </div>

        <label>
          <span>Request Details *</span>
          <textarea
            v-model.trim="form.request"
            rows="5"
            placeholder="Please describe your request"
            required
          ></textarea>
        </label>

        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
        <p v-if="okMsg" class="ok">{{ okMsg }}</p>

        <button class="btn" :disabled="submitting || !isValid">
          {{ submitting ? "Submitting…" : "Submit" }}
        </button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { reactive, computed, ref } from "vue";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const form = reactive({
  name: "",
  contact: "",
  email: "",
  phone: "",
  request: "",
});

const submitting = ref(false);
const errorMsg = ref("");
const okMsg = ref("");

// Basic validation: must have name / contact / request; email must be valid if provided
const emailOk = computed(() => {
  if (!form.email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
});

const isValid = computed(() => {
  return form.name && form.contact && form.request && emailOk.value;
});

function reset() {
  form.name = "";
  form.contact = "";
  form.email = "";
  form.phone = "";
  form.request = "";
}

async function handleSubmit() {
  errorMsg.value = "";
  okMsg.value = "";
  if (!isValid.value) {
    errorMsg.value =
      "Please fill in all required fields and check the email format.";
    return;
  }
  submitting.value = true;
  try {
    await addDoc(collection(db, "customer_requests"), {
      name: form.name,
      contact: form.contact,
      email: form.email || null,
      phone: form.phone || null,
      request: form.request,
      status: "new", // new | in_progress | done
      createdAt: serverTimestamp(),
    });
    okMsg.value = "Submitted successfully. We’ll contact you soon!";
    reset();
  } catch (e) {
    console.error(e);
    errorMsg.value = "Submission failed. Please try again later.";
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.page {
  min-height: 80vh;
  display: grid;
  place-items: center;
  padding: 40px 16px;
  background:
    radial-gradient(900px 380px at 10% -10%, #f2ecff 0%, transparent 60%),
    radial-gradient(900px 380px at 100% -10%, #f3f0ff 0%, transparent 60%),
    #fbfbfd;
}
.card {
  width: min(820px, 92vw);
  background: #fff;
  border: 1px solid rgba(18, 16, 39, 0.08);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(18, 16, 39, 0.06);
  padding: 22px 20px;
}
.detailNumber {
  font-weight: bold;
  font-size: 30px;
  color: #666;
}
h1 {
  margin: 0 0 6px;
  font-size: 22px;
  font-weight: 900;
}
.sub {
  margin: 0 0 16px;
  color: #68707c;
}
.form {
  display: grid;
  gap: 12px;
}
.grid2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
@media (max-width: 640px) {
  .grid2 {
    grid-template-columns: 1fr;
  }
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
textarea {
  padding: 10px 12px;
  border: 1px solid rgba(18, 16, 39, 0.12);
  border-radius: 10px;
  outline: none;
  background: #fff;
}
.btn {
  width: 140px;
  justify-self: start;
  padding: 10px 14px;
  border-radius: 12px;
  border: 0;
  background: linear-gradient(135deg, #8b6adf, #6e4fc6);
  color: #fff;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 8px 18px rgba(126, 87, 194, 0.22);
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.error {
  color: #d93025;
  font-size: 13px;
  margin: 4px 0 0;
}
.ok {
  color: #127c39;
  font-size: 13px;
  margin: 4px 0 0;
}
</style>
