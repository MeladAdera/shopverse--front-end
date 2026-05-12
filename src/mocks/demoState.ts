import type { Product } from '@/types/product';
import type { Review } from '@/types/product';
import type { Order, OrderItem as ClientOrderItem } from '@/types/order';
import type { AdminOrder, OrderItem as AdminOrderItem } from '@/types/admin.types';
import type { CartItem, CartResponse } from '@/types/cart';
import {
  SEED_PRODUCTS,
  SEED_USERS,
  SEED_CATEGORIES,
  buildDashboardRecentOrders,
  seedReviewsForProduct,
} from './demoSeed';

/** Line item in demo orders (confirmation UI reads `price_at_time`). */
export type DemoOrderItem = ClientOrderItem & { price_at_time?: string };

type DemoOrderRecord = Omit<Order, 'items'> &
  Omit<Partial<AdminOrder>, 'items'> & {
    items?: DemoOrderItem[];
  };

function clone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x)) as T;
}

export let demoProducts: Product[] = [];
export let demoCategories: (typeof SEED_CATEGORIES)[number][] = [];
const reviewsByProduct = new Map<number, Review[]>();
let demoCart: CartResponse = {
  id: 1,
  user_id: 1,
  items_count: 0,
  total_price: 0,
  items: [],
};
/** Client + admin share the same logical orders (fields satisfy both views). */
let demoOrders: DemoOrderRecord[] = [];
let nextOrderId = 600;
let nextReviewId = 9000;
let nextCartItemId = 100;
let initialized = false;

function productById(id: number): Product | undefined {
  return demoProducts.find((p) => p.id === id);
}

function recalcCartTotals() {
  let total = 0;
  let count = 0;
  for (const it of demoCart.items) {
    total += it.item_total;
    count += it.quantity;
  }
  demoCart.total_price = Math.round(total * 100) / 100;
  demoCart.items_count = count;
}

function buildCartItemFromProduct(product: Product, quantity: number, itemId: number): CartItem {
  const price = product.price;
  const itemTotal = Math.round(price * quantity * 100) / 100;
  return {
    id: itemId,
    product_id: product.id,
    product_name: product.name,
    product_price: String(price),
    product_images: product.image_urls || [],
    product_stock: product.stock,
    quantity,
    item_total: itemTotal,
    original_price: String(price),
    category: product.category_name || '',
  };
}

export function initDemoState(): void {
  if (initialized) return;
  initialized = true;
  demoProducts = clone(SEED_PRODUCTS);
  demoCategories = clone(SEED_CATEGORIES);
  reviewsByProduct.clear();
  for (const p of demoProducts) {
    reviewsByProduct.set(p.id, clone(seedReviewsForProduct(p.id)));
  }

  const p1 = productById(1)!;
  const p2 = productById(3)!;
  nextCartItemId = 100;
  demoCart = {
    id: 1,
    user_id: 2,
    items_count: 0,
    total_price: 0,
    items: [
      buildCartItemFromProduct(p1, 1, nextCartItemId++),
      buildCartItemFromProduct(p2, 2, nextCartItemId++),
    ],
  };
  recalcCartTotals();

  const now = new Date().toISOString();
  demoOrders = [
    {
      id: 501,
      user_id: 2,
      total_amount: '129.00',
      status: 'delivered',
      shipping_address: '12 Market Street',
      shipping_city: 'San Francisco',
      shipping_phone: '+1 415 555 0100',
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      updated_at: now,
      items_count: '1',
      customer_name: 'Avery Brooks',
      customer_email: 'avery@example.com',
      payment_status: 'paid',
      city: 'San Francisco',
      items: [
        {
          id: 9001,
          order_id: 501,
          product_id: 3,
          product_name: 'Air Runner Sneakers',
          product_price: 129,
          product_images: productById(3)!.image_urls,
          quantity: 1,
          item_total: 129,
          price_at_time: '129',
        },
      ],
    },
    {
      id: 502,
      user_id: 2,
      total_amount: '72.00',
      status: 'shipped',
      shipping_address: '88 River Road',
      shipping_city: 'Austin',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      updated_at: now,
      items_count: '1',
      customer_name: 'Avery Brooks',
      customer_email: 'avery@example.com',
      payment_status: 'paid',
      city: 'Austin',
      items: [
        {
          id: 9002,
          order_id: 502,
          product_id: 5,
          product_name: 'Linen Summer Dress',
          product_price: 72,
          product_images: productById(5)!.image_urls,
          quantity: 1,
          item_total: 72,
          price_at_time: '72',
        },
      ],
    },
  ];
  nextOrderId = 600;
}

export function getDemoProducts(): Product[] {
  return demoProducts;
}

export function getReviews(productId: number): Review[] {
  return reviewsByProduct.get(productId) || [];
}

export function addReview(productId: number, rating: number, comment: string): Review {
  const list = reviewsByProduct.get(productId) || [];
  const userStr = localStorage.getItem('user');
  const u = userStr ? JSON.parse(userStr) : { id: 2, name: 'Demo User', email: 'user@demo.shopverse' };
  const r: Review = {
    id: nextReviewId++,
    user_id: typeof u.id === 'string' ? parseInt(u.id, 10) || 2 : u.id,
    user_name: u.name || 'Customer',
    product_id: productId,
    rating,
    comment,
    created_at: new Date().toISOString(),
  };
  list.unshift(r);
  reviewsByProduct.set(productId, list);
  return r;
}

export function deleteReview(reviewId: number): boolean {
  for (const [pid, list] of reviewsByProduct.entries()) {
    const idx = list.findIndex((r) => r.id === reviewId);
    if (idx >= 0) {
      list.splice(idx, 1);
      reviewsByProduct.set(pid, list);
      return true;
    }
  }
  return false;
}

export function getCart(): CartResponse {
  return clone(demoCart);
}

export function addCartItem(productId: number, quantity: number): CartResponse {
  const product = productById(productId);
  if (!product) return getCart();
  const existing = demoCart.items.find((i) => i.product_id === productId);
  if (existing) {
    existing.quantity += quantity;
    existing.item_total =
      Math.round(parseFloat(existing.product_price) * existing.quantity * 100) / 100;
  } else {
    demoCart.items.push(buildCartItemFromProduct(product, quantity, nextCartItemId++));
  }
  recalcCartTotals();
  return getCart();
}

export function updateCartItem(itemId: number, quantity: number): CartResponse {
  const it = demoCart.items.find((i) => i.id === itemId);
  if (it) {
    if (quantity <= 0) {
      demoCart.items = demoCart.items.filter((i) => i.id !== itemId);
    } else {
      it.quantity = quantity;
      it.item_total = Math.round(parseFloat(it.product_price) * quantity * 100) / 100;
    }
  }
  recalcCartTotals();
  return getCart();
}

export function removeCartItem(itemId: number): CartResponse {
  demoCart.items = demoCart.items.filter((i) => i.id !== itemId);
  recalcCartTotals();
  return getCart();
}

export function clearCart(): void {
  demoCart.items = [];
  recalcCartTotals();
}

export function getClientOrders(): typeof demoOrders {
  return clone(demoOrders);
}

export function getOrderById(orderId: number): (typeof demoOrders)[0] | undefined {
  return demoOrders.find((o) => o.id === orderId);
}

export function cancelOrder(orderId: number): boolean {
  const o = demoOrders.find((x) => x.id === orderId);
  if (!o || o.status === 'cancelled' || o.status === 'delivered') return false;
  o.status = 'cancelled';
  o.updated_at = new Date().toISOString();
  return true;
}

export function updateAdminOrderStatus(orderId: number, status: string): boolean {
  const o = demoOrders.find((x) => x.id === orderId);
  if (!o) return false;
  o.status = status as Order['status'];
  o.updated_at = new Date().toISOString();
  return true;
}

function buildOrderItemsFromCart(orderId: number): DemoOrderItem[] {
  return demoCart.items.map((it, idx) => ({
    id: 7000 + idx,
    order_id: orderId,
    product_id: it.product_id,
    product_name: it.product_name,
    product_price: parseFloat(it.product_price),
    product_images: it.product_images,
    quantity: it.quantity,
    item_total: it.item_total,
    price_at_time: it.product_price,
  }));
}

export function checkoutFromCart(shipping: {
  shipping_address: string;
  shipping_city: string;
  shipping_phone?: string;
}): { order_id: number; total_amount: string } {
  const id = nextOrderId++;
  const items = buildOrderItemsFromCart(id);
  const total = demoCart.total_price;
  const userStr = localStorage.getItem('user');
  const u = userStr ? JSON.parse(userStr) : { id: 2, name: 'Demo User', email: 'user@demo.shopverse' };
  const uid = typeof u.id === 'string' ? parseInt(u.id, 10) || 2 : u.id;
  const now = new Date().toISOString();
  demoOrders.unshift({
    id,
    user_id: uid,
    total_amount: String(total.toFixed(2)),
    status: 'pending',
    shipping_address: shipping.shipping_address,
    shipping_city: shipping.shipping_city,
    shipping_phone: shipping.shipping_phone,
    created_at: now,
    updated_at: now,
    items_count: String(demoCart.items.reduce((s, i) => s + i.quantity, 0)),
    items,
    customer_name: u.name || 'Customer',
    customer_email: u.email,
    payment_status: 'pending',
    city: shipping.shipping_city,
  });
  clearCart();
  return { order_id: id, total_amount: String(total.toFixed(2)) };
}

export function getAdminOrders(): AdminOrder[] {
  return demoOrders.map((o) => ({
    id: o.id,
    user_id: o.user_id,
    customer_name: o.customer_name || 'Customer',
    customer_email: o.customer_email,
    shipping_address: o.shipping_address,
    city: o.city || o.shipping_city,
    total_amount: o.total_amount,
    status: o.status as AdminOrder['status'],
    payment_status: (o.payment_status || 'pending') as AdminOrder['payment_status'],
    items_count: o.items_count,
    created_at: o.created_at,
    updated_at: o.updated_at,
  }));
}

export function getAdminOrderDetail(orderId: number): AdminOrder | undefined {
  const o = getOrderById(orderId);
  if (!o) return undefined;
  const items: AdminOrderItem[] = (o.items || []).map((it, idx) => ({
    id: it.id || 8000 + idx,
    order_id: o.id,
    product_id: it.product_id,
    product_name: it.product_name,
    product_image: it.product_images?.[0],
    quantity: it.quantity,
    unit_price: String(it.price_at_time ?? it.product_price ?? '0'),
    total_price: String(it.item_total ?? 0),
  }));
  return {
    id: o.id,
    user_id: o.user_id,
    customer_name: o.customer_name || 'Customer',
    customer_email: o.customer_email,
    customer_phone: o.shipping_phone,
    shipping_address: o.shipping_address,
    city: o.city || o.shipping_city,
    total_amount: o.total_amount,
    status: o.status as AdminOrder['status'],
    payment_status: (o.payment_status || 'pending') as AdminOrder['payment_status'],
    items_count: o.items_count,
    created_at: o.created_at,
    updated_at: o.updated_at,
    items,
  };
}

export function getUsers(): typeof SEED_USERS {
  return clone(SEED_USERS);
}

export function getUserById(id: number) {
  return clone(SEED_USERS.find((u) => u.id === id) || null);
}

export function setUserActive(userId: number, active: boolean): boolean {
  const u = SEED_USERS.find((x) => x.id === userId);
  if (!u) return false;
  u.active = active;
  return true;
}

export function updateUser(userId: number, patch: Partial<(typeof SEED_USERS)[0]>): boolean {
  const u = SEED_USERS.find((x) => x.id === userId);
  if (!u) return false;
  Object.assign(u, patch);
  return true;
}

export function buildDashboardStats() {
  const totalRev = demoOrders.reduce((s, o) => s + parseFloat(o.total_amount || '0'), 0);
  return {
    users: {
      total_users: SEED_USERS.length + 120,
      active_users: SEED_USERS.filter((u) => u.active).length + 100,
      admin_users: 3,
      new_users_week: 8,
    },
    products: {
      total_products: demoProducts.length + 40,
      in_stock: demoProducts.filter((p) => p.stock > 0).length + 30,
      out_of_stock: 2,
      inactive_products: 1,
      total_sales: demoProducts.reduce((s, p) => s + p.sales_count, 0),
    },
    orders: {
      total_orders: demoOrders.length + 48,
      pending_orders: demoOrders.filter((o) => o.status === 'pending').length + 4,
      confirmed_orders: 12,
      shipped_orders: demoOrders.filter((o) => o.status === 'shipped').length + 6,
      delivered_orders: demoOrders.filter((o) => o.status === 'delivered').length + 20,
      new_orders_week: 5,
    },
    revenue: {
      total_revenue: Math.round(totalRev * 100) / 100 + 12500,
      confirmed_revenue: 9800,
      revenue_30_days: 4200,
    },
    recent_orders: buildDashboardRecentOrders(),
    summary: {
      total_revenue: Math.round(totalRev * 100) / 100 + 12500,
      total_orders: demoOrders.length + 48,
      total_users: SEED_USERS.length + 120,
      total_products: demoProducts.length + 40,
    },
  };
}

export function deleteProduct(productId: number): boolean {
  const i = demoProducts.findIndex((p) => p.id === productId);
  if (i < 0) return false;
  demoProducts.splice(i, 1);
  return true;
}

export function upsertProductFromForm(
  productId: number | null,
  fields: Record<string, unknown>
): Product {
  const base: Product =
    productId != null
      ? clone(demoProducts.find((p) => p.id === productId) || demoProducts[0])
      : clone(demoProducts[0]);
  const newId = productId ?? Math.max(0, ...demoProducts.map((p) => p.id)) + 1;
  const merged: Product = {
    ...base,
    id: newId,
    name: (fields.name as string) || base.name,
    description: (fields.description as string) || base.description,
    price: fields.price != null ? Number(fields.price) : base.price,
    stock: fields.stock != null ? Number(fields.stock) : base.stock,
    category_id: fields.category_id != null ? Number(fields.category_id) : base.category_id,
    color: (fields.color as string) || base.color,
    size: (fields.size as string) || base.size,
    style: (fields.style as string) || base.style,
    brand: (fields.brand as string) || base.brand,
    gender: (fields.gender as Product['gender']) || base.gender,
    season: (fields.season as Product['season']) || base.season,
    material: (fields.material as string) || base.material,
  };
  if (productId != null) {
    const idx = demoProducts.findIndex((p) => p.id === productId);
    if (idx >= 0) demoProducts[idx] = merged;
    else demoProducts.push(merged);
  } else {
    merged.created_at = new Date().toISOString();
    demoProducts.push(merged);
  }
  return merged;
}

let nextCategoryId = 100;

export function paginateCategories(page: number, limit: number) {
  const total = demoCategories.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const slice = demoCategories.slice((page - 1) * limit, page * limit);
  return {
    categories: clone(slice),
    pagination: { page, limit, total, totalPages },
  };
}

export function getDemoCategoryById(id: number) {
  return clone(demoCategories.find((c) => c.id === id) || null);
}

export function createDemoCategory(data: { name: string; image_url: string }) {
  const cat = {
    id: nextCategoryId++,
    name: data.name,
    image_url: data.image_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
    created_at: new Date().toISOString(),
    products_count: '0',
  };
  demoCategories.push(cat);
  return clone(cat);
}

export function updateDemoCategory(id: number, data: { name?: string; image_url?: string }) {
  const c = demoCategories.find((x) => x.id === id);
  if (!c) return null;
  if (data.name) c.name = data.name;
  if (data.image_url) c.image_url = data.image_url;
  return clone(c);
}

export function deleteDemoCategory(id: number): boolean {
  const i = demoCategories.findIndex((c) => c.id === id);
  if (i < 0) return false;
  demoCategories.splice(i, 1);
  return true;
}

/** Shape used by `filterService` fetch helpers (not axios). */
export function getFilterCategoriesForDemo() {
  return demoCategories.map((c) => ({
    id: c.id,
    name: c.name,
    image_url: c.image_url,
    products_count: c.products_count,
  }));
}
