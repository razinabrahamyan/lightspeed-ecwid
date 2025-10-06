<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-semibold">Shopping Cart</h1>

    <div v-if="!items.length" class="text-gray-600">Your cart is empty.</div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <div
          v-for="it in items"
          :key="it.productId"
          class="flex flex-col md:flex-row md:items-center gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
        >
          <div class="flex items-center gap-4">
            <img v-if="it.imageUrl" :src="it.imageUrl" class="w-20 h-20 object-cover rounded-xl border" />
            <div>
              <div class="font-semibold">{{ it.name }}</div>
              <div class="text-xs text-gray-400">★★★★★☆☆☆☆☆</div>
            </div>
          </div>

          <div class="md:ml-auto md:flex md:items-center md:gap-4 border-t md:border-0 pt-3 md:pt-0">
            <div class="flex items-center gap-2">
              <button class="w-8 h-8 rounded-full border text-gray-600" @click="dec(it.productId)">−</button>
              <div class="w-8 text-center">{{ it.qty }}</div>
              <button class="w-8 h-8 rounded-full border text-gray-600" @click="inc(it.productId)">+</button>
            </div>
            <div class="mt-2 md:mt-0 w-full md:w-20 md:text-right font-medium">${{ (it.price * it.qty).toFixed(2) }}</div>
          </div>

          <button class="self-end md:self-auto text-sm text-gray-500 hover:text-red-600" @click="onRemove(it.productId)">Remove</button>
        </div>
      </div>

      <div class="space-y-4">
        <div class="rounded-2xl bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-5">
          <div class="text-lg font-semibold mb-4">Order Summary</div>
          <div class="space-y-2 text-sm">
            <div class="flex items-center justify-between"><span>Subtotal</span><span>${{ totalPrice.toFixed(2) }}</span></div>
            <div class="flex items-center justify-between"><span>Shipping</span><span>${{ shipping.toFixed(2) }}</span></div>
            <div class="border-t my-3"></div>
            <div class="flex items-center justify-between font-semibold text-base"><span>Total</span><span>${{ total.toFixed(2) }}</span></div>
          </div>
          <button
            class="mt-4 w-full rounded-full py-2.5 text-white font-medium bg-gradient-to-r from-teal-400 to-rose-400 hover:opacity-95"
            @click="onCheckout"
          >
            Place Order
          </button>
        </div>

        <div v-if="success" class="rounded-xl bg-green-50 text-green-700 p-4 border border-green-100">
          ✅ Congratulations on your purchase! Your order is confirmed.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCartStore } from '../stores/cart'

const cart = useCartStore()
const { items, totalPrice } = storeToRefs(cart)
const shipping = computed(() => (items.value.length ? 10 : 0))
const total = computed(() => totalPrice.value + shipping.value)
const success = ref(false)

function inc(id: number) {
  cart.inc(id)
}
function dec(id: number) {
  cart.dec(id)
}
function onRemove(id: number) {
  cart.remove(id)
}
function onCheckout() {
  success.value = true
  cart.clear()
}
</script>


