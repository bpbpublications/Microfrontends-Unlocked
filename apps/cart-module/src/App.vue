<script setup lang="ts">
import { inject } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const isEmbedded = inject<boolean>('isEmbedded', false)
</script>

<template>
  <div class="app">
    <header v-if="!isEmbedded" class="app-header">
      <div class="app-header__inner">
        <RouterLink to="/" class="app-header__brand">Shopping Cart</RouterLink>
        <span class="app-header__note">Standalone Module · Vue 3 + Vite</span>
      </div>
    </header>
    <main class="app-main" :class="{ 'app-main--embedded': isEmbedded }">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background-color: var(--primary);
  color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.app-header__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.app-header__brand {
  font-size: 1.3rem;
  font-weight: 700;
  color: white;
  text-decoration: none;
}

.app-header__note {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.7);
  font-style: italic;
}

.app-main {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

.app-main--embedded {
  max-width: 100%;
  padding: 0;
}
</style>
