<template>
  <div v-if="product" class="space-y-6">
    <nav class="text-sm text-gray-500 flex items-center gap-2">
      <RouterLink to="/" class="hover:text-gray-700">Home</RouterLink>
      <span>›</span>
      <RouterLink to="/" class="hover:text-gray-700">Shop</RouterLink>
      <span>›</span>
      <RouterLink v-if="category" :to="{ name: 'category', params: { id: category.id } }" class="hover:text-gray-700">{{ category.name }}</RouterLink>
      <span v-if="category">›</span>
      <span class="text-gray-700">{{ product.name }}</span>
    </nav>

    <div class="rounded-2xl bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-6 md:p-8">
      <div class="grid md:grid-cols-2 gap-8 items-start">
        <div class="rounded-xl bg-gray-50 p-4 border">
          <div class="border-4 border-gray-200 rounded-lg">
            <img v-if="product.imageUrl" :src="product.imageUrl" class="w-full object-cover rounded" alt="" />
          </div>
        </div>

        <div class="space-y-5">
          <h1 class="text-3xl font-semibold">{{ product.name }}</h1>
          <div class="text-gray-500 max-w-prose" v-html="product.description"></div>
          <div class="text-sm text-gray-400">★★★★★☆☆☆☆☆</div>
          <div class="text-2xl font-bold">${{ product.price.toFixed(2) }}</div>
          <div class="flex gap-3 pt-1 items-center">
            <template v-if="qty(product.id) > 0">
              <div class="flex items-center gap-2">
                <button class="w-9 h-9 rounded-full border text-gray-700" @click="dec(product.id)">−</button>
                <div class="w-6 text-center">{{ qty(product.id) }}</div>
                <button class="w-9 h-9 rounded-full border text-gray-700" @click="inc(product.id)">+</button>
              </div>
            </template>
            <button v-else class="rounded-full px-5 py-2.5 text-white bg-teal-400 hover:bg-teal-500" @click="onAdd">Add to Cart</button>
            <button class="rounded-full px-5 py-2.5 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50">Add to Wishlist</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getProduct, type Product, getCategory } from '../api/ecwid'
import { useCartStore } from '../stores/cart'

const route = useRoute()
const product = ref<Product | null>(null)
const category = ref<{ id: number; name: string } | null>(null)
const cart = useCartStore()

onMounted(async () => {
  const id = Number(route.params.id)
  product.value = await getProduct(id)
  const catId = product.value.categoryIds?.[0]
  if (catId) {
    try {
      const c = await getCategory(catId)
      category.value = { id: c.id, name: c.name }
    } catch {}
  }
})

function onAdd() {
  if (!product.value) return
  cart.add({
    productId: product.value.id,
    name: product.value.name,
    price: product.value.price,
    imageUrl: product.value.imageUrl,
  })
}
const qty = (id: number) => cart.quantityByProductId(id)
const inc = (id: number) => cart.inc(id)
const dec = (id: number) => cart.dec(id)
</script>


