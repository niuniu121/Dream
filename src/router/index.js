import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/HomeView.vue";
import Login from "../views/LoginPage.vue";
import Admin from "../views/Admin.vue";
import OurServices from '../views/OurServices.vue'
import ContractPage from '../views/ContractPage.vue'
import CustomerDeatail from '../views/CustomerDeatail.vue'
import TeamPage from '../views/TeamPage.vue'
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/services", component: OurServices },
  { path: "/contract", component: ContractPage },
  { path: "/customer", component: CustomerDeatail },
  { path: "/team", component: TeamPage },
  { path: "/admin", component: Admin, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (!to.meta.requiresAuth) return next();
  const user = await new Promise((resolve) => {
    const off = onAuthStateChanged(auth, (u) => { off(); resolve(u); });
  });
  user ? next() : next("/login");
});

export default router;
