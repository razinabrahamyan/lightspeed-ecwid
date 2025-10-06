<template>
  <div class="min-h-screen bg-[#eef2f5] text-gray-900">
    <div class="max-w-6xl mx-auto px-4">
      <header class="sticky top-0 z-10 -mx-4 px-4">
        <div class=" mb-4 rounded-2xl bg-white/70 backdrop-blur border border-white shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
          <div class="flex items-center gap-6 px-5 py-4">
            <RouterLink to="/" class="text-2xl font-semibold tracking-wide">Task Shop<span class="text-blue-500">.</span></RouterLink>
            <nav class="hidden md:flex items-center gap-6 text-sm text-gray-600">
              <RouterLink to="/" class="hover:text-gray-900">Shop</RouterLink>
              <RouterLink to="/category/0" class="hover:text-gray-900">Categories</RouterLink>
            </nav>
            <div class="ml-auto flex items-center gap-4 w-full md:w-auto">
              <div class="flex-1 md:flex-none relative">
                <input type="text" placeholder="Search" class="w-full md:w-72 rounded-full border border-gray-200 bg-gray-50 pl-9 pr-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              </div>
              <RouterLink to="/cart" class="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 border border-gray-200">
                🛒
                <span v-if="itemCount" class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] leading-[18px] text-center">{{ itemCount }}</span>
              </RouterLink>
            </div>
          </div>
        </div>
      </header>

      <main class="py-6">
        <div class="rounded-3xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-white">
          <div class="p-6 md:p-8">
            <RouterView />
          </div>
        </div>
      </main>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCartStore } from './stores/cart'

const cart = useCartStore()
const { itemCount } = storeToRefs(cart)
</script>


