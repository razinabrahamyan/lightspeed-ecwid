const STORE_ID = 108362264
const PUBLIC_TOKEN = 'public_RiNvjTVVzKLhFNWyzR5fNY68u1GMHLEs'

const BASE_URL = `https://app.ecwid.com/api/v3/${STORE_ID}`

type EcwidListResponse<T> = {
  count: number
  items: T[]
}

export type Category = {
  id: number
  name: string
  imageUrl?: string
  parentId?: number
}

export type Product = {
  id: number
  name: string
  price: number
  description?: string
  imageUrl?: string
  categoryIds?: number[]
}

async function request<T>(path: string, searchParams?: Record<string, string | number | boolean | undefined>): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`)
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, String(value))
    })
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${PUBLIC_TOKEN}`,
    },
  })
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`Ecwid API error ${response.status}: ${text}`)
  }
  return response.json() as Promise<T>
}

export async function getRootCategories(): Promise<Category[]> {
  const res = await request<EcwidListResponse<Category>>('/categories', { parent: 0 })
  return res.items
}

export async function getSubcategories(categoryId: number): Promise<Category[]> {
  const res = await request<EcwidListResponse<Category>>('/categories', { parent: categoryId })
  return res.items
}

export async function getCategory(categoryId: number): Promise<Category> {
  return request<Category>(`/categories/${categoryId}`)
}

export async function getProducts(params?: { category?: number; limit?: number; offset?: number; keyword?: string }): Promise<Product[]> {
  const res = await request<EcwidListResponse<Product>>('/products', {
    category: params?.category,
    limit: params?.limit ?? 24,
    offset: params?.offset ?? 0,
    keyword: params?.keyword,
    withImages: true,
  })
  return res.items.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    description: p.description,
    imageUrl: (p as any).imageUrl ?? (Array.isArray((p as any).images) ? (p as any).images[0]?.url : undefined),
    categoryIds: p.categoryIds,
  }))
}

export async function getProduct(productId: number): Promise<Product> {
  const p = await request<Product>(`/products/${productId}`, { withImages: true })
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    description: p.description,
    imageUrl: (p as any).imageUrl ?? (Array.isArray((p as any).images) ? (p as any).images[0]?.url : undefined),
    categoryIds: p.categoryIds,
  }
}


