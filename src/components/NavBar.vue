<template>
  <header class="navbar">
    <div class="container">
      <!-- Logo -->
      <div class="logo">
        <img src="/logoDB.png" alt="DreamBridge Logo" />
        <span class="brand-text">DreamBridge</span>
      </div>

      <!-- Hamburger (Mobile) -->
      <button class="hamburger" @click="toggleMenu">
        <span :class="{ open: isOpen }"></span>
        <span :class="{ open: isOpen }"></span>
        <span :class="{ open: isOpen }"></span>
      </button>

      <!-- Navigation Links -->
      <nav :class="['nav-links', { open: isOpen }]">
        <router-link to="/" class="nav-item" @click="closeMenu"
          >Home</router-link
        >
        <router-link to="/contact" class="nav-item" @click="closeMenu"
          >Introduction</router-link
        >
        <router-link to="/services" class="nav-item" @click="closeMenu"
          >Services</router-link
        >
        <router-link to="/blog" class="nav-item" @click="closeMenu"
          >Blog</router-link
        >
        <router-link to="/contact" class="nav-item" @click="closeMenu"
          >Contact</router-link
        >
        <a href="#book" class="book-btn mobile-only" @click="closeMenu"
          >Book Appointment</a
        >
      </nav>

      <!-- CTA Button (Desktop only) -->
      <div class="cta-button desktop-only">
        <a href="#book" class="book-btn">Book Appointment</a>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";
const isOpen = ref(false);
const toggleMenu = () => (isOpen.value = !isOpen.value);
const closeMenu = () => (isOpen.value = false);
</script>

<style scoped>
/* 通用样式 */
.navbar {
  background-color: #fff;
  border-bottom: 1px solid #eee;
  padding: 12px 24px;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.logo {
  display: flex;
  align-items: center;
}

.logo img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.brand-text {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-left: 10px;
}

/* Desktop nav */
.nav-links {
  display: flex;
  gap: 20px;
  transition: all 0.3s ease-in-out;
}

.nav-item {
  color: #555;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}
.nav-item:hover,
.router-link-exact-active {
  color: #a175aa;
}

/* Button */
.book-btn {
  background-color: #a175aa;
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  text-decoration: none;
  font-weight: bold;
  transition: background 0.3s;
}
.book-btn:hover {
  background-color: #8d6591;
}

/* Hamburger */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  border: none;
  background: none;
  cursor: pointer;
}
.hamburger span {
  width: 25px;
  height: 3px;
  background-color: #333;
  transition: all 0.3s ease;
}
.hamburger span.open:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}
.hamburger span.open:nth-child(2) {
  opacity: 0;
}
.hamburger span.open:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* Mobile menu */
@media (max-width: 768px) {
  .nav-links {
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    background-color: #a175aa;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 20px 0;
    transform: translateY(-200%);
    opacity: 0;
    pointer-events: none;
  }

  .nav-links.open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }

  .nav-item {
    color: white;
    font-size: 1.1rem;
  }

  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: inline-block;
  }

  .hamburger {
    display: flex;
  }
}

/* Desktop only item */
@media (min-width: 769px) {
  .mobile-only {
    display: none;
  }
}
</style>
