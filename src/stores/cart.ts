import { defineStore } from 'pinia'

export type CartItem = {
  productId: number
  name: string
  price: number
  imageUrl?: string
  qty: number
}

type CartState = {
  items: CartItem[]
}

const STORAGE_KEY = 'ecwid_cart'

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: loadFromStorage(),
  }),
  getters: {
    itemCount: (state) => state.items.reduce((sum, i) => sum + i.qty, 0),
    totalPrice: (state) => state.items.reduce((sum, i) => sum + i.price * i.qty, 0),
    quantityByProductId: (state) => (productId: number) =>
      state.items.find((i) => i.productId === productId)?.qty ?? 0,
  },
  actions: {
    add(item: Omit<CartItem, 'qty'>) {
      const existing = this.items.find((i) => i.productId === item.productId)
      if (existing) existing.qty += 1
      else this.items.push({ ...item, qty: 1 })
      saveToStorage(this.items)
    },
    inc(productId: number) {
      const it = this.items.find((i) => i.productId === productId)
      if (it) {
        it.qty += 1
        saveToStorage(this.items)
      }
    },
    dec(productId: number) {
      const it = this.items.find((i) => i.productId === productId)
      if (it) {
        it.qty = Math.max(1, it.qty - 1)
        saveToStorage(this.items)
      }
    },
    remove(productId: number) {
      this.items = this.items.filter((i) => i.productId !== productId)
      saveToStorage(this.items)
    },
    changeQty(productId: number, qty: number) {
      const it = this.items.find((i) => i.productId === productId)
      if (!it) return
      it.qty = Math.max(1, qty)
      saveToStorage(this.items)
    },
    clear() {
      this.items = []
      saveToStorage(this.items)
    },
  },
})

function loadFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

function saveToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // ignore
  }
}


