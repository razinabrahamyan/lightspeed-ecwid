<template>
  <div class="space-y-8">
    <nav class="text-sm text-gray-500 flex items-center gap-2">
      <RouterLink to="/" class="hover:text-gray-700">Home</RouterLink>
      <span>›</span>
      <RouterLink to="/" class="hover:text-gray-700">Shop</RouterLink>
      <span>›</span>
      <span class="text-gray-700">Category</span>
    </nav>
    <h1 class="text-3xl font-semibold">Category</h1>
    <section v-if="subcategories.length">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
        <RouterLink
          v-for="c in subcategories.slice(0, 2)"
          :key="c.id"
          :to="{ name: 'category', params: { id: c.id } }"
          class="block rounded-2xl bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden hover:shadow-[0_14px_40px_rgba(0,0,0,0.08)] transition"
        >
          <img v-if="c.imageUrl" :src="c.imageUrl" alt="" class="w-full aspect-[16/10] object-cover rounded-t-2xl" />
          <div class="p-5">
            <div class="text-lg md:text-xl font-semibold">{{ c.name }}</div>
            <div class="mt-1 text-sm text-gray-500">Explore</div>
          </div>
        </RouterLink>
      </div>
    </section>

    <section>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="p in products"
          :key="p.id"
          class="rounded-2xl bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-4 flex flex-col"
        >
          <RouterLink :to="{ name: 'product', params: { id: p.id } }" class="block">
            <img v-if="p.imageUrl" :src="p.imageUrl" alt="" class="w-full aspect-[4/3] object-cover rounded-xl" />
          </RouterLink>
          <div class="mt-3 flex-1">
            <RouterLink :to="{ name: 'product', params: { id: p.id } }" class="font-medium block">{{ p.name }}</RouterLink>
            <div class="text-sm text-gray-500">${{ p.price.toFixed(2) }}</div>
            <div class="mt-2 text-xs text-gray-400">★★★★★☆☆☆☆☆</div>
          </div>
          <div class="mt-3">
            <template v-if="qty(p.id) > 0">
              <div class="flex items-center justify-between">
                <div class="text-sm text-gray-500">In cart</div>
                <div class="flex items-center gap-2">
                  <button class="w-8 h-8 rounded-full border text-gray-600" @click="dec(p.id)">−</button>
                  <div class="w-6 text-center">{{ qty(p.id) }}</div>
                  <button class="w-8 h-8 rounded-full border text-gray-600" @click="inc(p.id)">+</button>
                </div>
              </div>
            </template>
            <button v-else class="w-full rounded-full bg-teal-400 text-white text-sm py-2 hover:bg-teal-500" @click="addToCart(p)">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { getSubcategories, getProducts, type Category, type Product } from '../api/ecwid'
import { useCartStore } from '../stores/cart'

const route = useRoute()
const subcategories = ref<Category[]>([])
const products = ref<Product[]>([])
const cart = useCartStore()

async function load() {
  const id = Number(route.params.id)
  ;[subcategories.value, products.value] = await Promise.all([
    getSubcategories(id),
    getProducts({ category: id, limit: 24 }),
  ])
}

onMounted(load)
watch(() => route.params.id, load)

function addToCart(p: Product) {
  cart.add({ productId: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl })
}
const qty = (id: number) => cart.quantityByProductId(id)
const inc = (id: number) => cart.inc(id)
const dec = (id: number) => cart.dec(id)
</script>


