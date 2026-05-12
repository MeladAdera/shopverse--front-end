import type { InternalAxiosRequestConfig } from 'axios';
import type { Product } from '@/types/product';
import {
  initDemoState,
  getDemoProducts,
  getReviews,
  addReview,
  deleteReview,
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
  getClientOrders,
  getOrderById,
  cancelOrder,
  checkoutFromCart,
  getAdminOrders,
  getAdminOrderDetail,
  updateAdminOrderStatus,
  getUsers,
  getUserById,
  setUserActive,
  updateUser,
  buildDashboardStats,
  deleteProduct,
  upsertProductFromForm,
  paginateCategories,
  getDemoCategoryById,
  createDemoCategory,
  updateDemoCategory,
  deleteDemoCategory,
} from './demoState';

const ts = () => new Date().toISOString();

function ok<T>(data: T, message = 'OK') {
  return { success: true, message, timestamp: ts(), data };
}

function getPath(config: InternalAxiosRequestConfig): string {
  const raw = (config.url || '/').split('?')[0];
  return raw.startsWith('/') ? raw : `/${raw}`;
}

function parseJsonBody(config: InternalAxiosRequestConfig): Record<string, unknown> {
  const d = config.data;
  if (!d) return {};
  if (typeof d === 'string') {
    try {
      return JSON.parse(d) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  if (typeof d === 'object' && !(d instanceof FormData)) {
    return d as Record<string, unknown>;
  }
  return {};
}

async function formDataToRecord(config: InternalAxiosRequestConfig): Promise<Record<string, unknown>> {
  const d = config.data;
  if (!(d instanceof FormData)) return parseJsonBody(config);
  const out: Record<string, unknown> = {};
  d.forEach((value, key) => {
    if (typeof value === 'string') out[key] = value;
  });
  return out;
}

function paginate<T>(items: T[], page: number, limit: number) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const slice = items.slice((page - 1) * limit, page * limit);
  return {
    products: slice,
    pagination: { page, limit, total, totalPages },
  };
}

function filterProducts(list: Product[], p: Record<string, unknown>): Product[] {
  let out = [...list];
  const categoryId = p.category_id != null ? Number(p.category_id) : undefined;
  if (categoryId && !Number.isNaN(categoryId)) {
    out = out.filter((x) => x.category_id === categoryId);
  }
  const search = (p.search as string)?.toLowerCase()?.trim();
  if (search) {
    out = out.filter(
      (x) =>
        x.name.toLowerCase().includes(search) ||
        x.description.toLowerCase().includes(search) ||
        x.brand.toLowerCase().includes(search)
    );
  }
  const minP = p.min_price != null ? Number(p.min_price) : undefined;
  const maxP = p.max_price != null ? Number(p.max_price) : undefined;
  if (minP != null && !Number.isNaN(minP)) out = out.filter((x) => x.price >= minP);
  if (maxP != null && !Number.isNaN(maxP)) out = out.filter((x) => x.price <= maxP);
  const brand = p.brand as string | undefined;
  if (brand) out = out.filter((x) => x.brand.toLowerCase() === brand.toLowerCase());
  const color = p.color as string | undefined;
  if (color) out = out.filter((x) => x.color === color);
  const gender = p.gender as string | undefined;
  if (gender) out = out.filter((x) => x.gender === gender);
  const lastDays = p.last_days != null ? Number(p.last_days) : undefined;
  if (lastDays && !Number.isNaN(lastDays)) {
    const cutoff = Date.now() - lastDays * 86400000;
    out = out.filter((x) => new Date(x.created_at).getTime() >= cutoff);
  }
  const sort = p.sort as string | undefined;
  if (sort === 'newest') out.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  else if (sort === 'popular') out.sort((a, b) => b.sales_count - a.sales_count);
  else if (sort === 'price_asc') out.sort((a, b) => a.price - b.price);
  else if (sort === 'price_desc') out.sort((a, b) => b.price - a.price);
  return out;
}

function mergeParams(config: InternalAxiosRequestConfig): Record<string, unknown> {
  const q: Record<string, unknown> = { ...(config.params as Record<string, unknown> | undefined) };
  const url = config.url || '';
  const qi = url.indexOf('?');
  if (qi >= 0) {
    const sp = new URLSearchParams(url.slice(qi + 1));
    sp.forEach((v, k) => {
      q[k] = v;
    });
  }
  return q;
}

export async function handleDemoRequest(config: InternalAxiosRequestConfig): Promise<unknown> {
  initDemoState();
  const method = (config.method || 'get').toLowerCase();
  const path = getPath(config);
  const params = mergeParams(config);

  const wrapCart = (cart: ReturnType<typeof getCart>) =>
    ok(cart, 'Cart OK');

  // —— Auth ——
  if (method === 'post' && path === '/auth/login') {
    const body = parseJsonBody(config);
    const email = String(body.email || '');
    const isAdmin = email.toLowerCase().includes('admin');
    const user = {
      id: isAdmin ? '1' : '2',
      name: isAdmin ? 'Demo Admin' : 'Demo Shopper',
      email: email || 'user@demo.shopverse',
      role: isAdmin ? 'admin' : 'user',
      active: true,
    };
    return ok({
      access_token: 'demo-access-token',
      refresh_token: 'demo-refresh-token',
      user,
    });
  }
  if (method === 'post' && path === '/auth/register') {
    const body = parseJsonBody(config);
    const user = {
      id: '99',
      name: String(body.name || 'New User'),
      email: String(body.email || 'user@demo.shopverse'),
      role: 'user' as const,
      active: true,
    };
    return ok({
      access_token: 'demo-access-token',
      refresh_token: 'demo-refresh-token',
      user,
    });
  }
  if (method === 'post' && path === '/auth/logout') {
    return ok({ message: 'Logged out' });
  }
  if (method === 'get' && path === '/auth/profile') {
    const raw = localStorage.getItem('user');
    const user = raw
      ? JSON.parse(raw)
      : { id: '2', name: 'Guest', email: 'guest@demo.shopverse', role: 'user', active: true };
    return { user };
  }
  if (method === 'post' && path === '/auth/refresh-token') {
    const raw = localStorage.getItem('user');
    const user = raw ? JSON.parse(raw) : { id: '2', name: 'Demo', email: 'demo@', role: 'user' };
    return {
      access_token: 'demo-access-token',
      refresh_token: 'demo-refresh-token',
      user,
    };
  }

  // —— Products (public / admin list) ——
  const productsBrandMatch = path.match(/^\/products\/brand\/(.+)$/);
  if (method === 'get' && productsBrandMatch) {
    const brand = decodeURIComponent(productsBrandMatch[1]);
    const filtered = filterProducts(getDemoProducts(), { ...params, brand });
    return ok({ products: filtered, pagination: { page: 1, limit: filtered.length, total: filtered.length, totalPages: 1 } });
  }

  if (method === 'get' && path === '/products/top-selling') {
    const limit = params.limit != null ? Number(params.limit) : 10;
    const sorted = [...getDemoProducts()].sort((a, b) => b.sales_count - a.sales_count);
    return ok({ products: sorted.slice(0, limit) });
  }

  if (method === 'get' && /^\/products\/\d+\/reviews$/.test(path)) {
    const id = parseInt(path.split('/')[2], 10);
    return ok(getReviews(id));
  }

  if (method === 'get' && /^\/products\/\d+$/.test(path)) {
    const id = parseInt(path.split('/')[2], 10);
    const product = getDemoProducts().find((p) => p.id === id);
    if (!product) return { success: false, message: 'Not found', timestamp: ts(), data: null };
    return ok(product);
  }

  if (method === 'get' && path === '/products') {
    const page = params.page != null ? Number(params.page) : 1;
    const limit = params.limit != null ? Number(params.limit) : 12;
    const filtered = filterProducts(getDemoProducts(), params);
    return ok(paginate(filtered, page, limit || 12));
  }

  if (method === 'get' && /^\/products\/category\/\d+$/.test(path)) {
    const cid = parseInt(path.split('/').pop()!, 10);
    const page = params.page != null ? Number(params.page) : 1;
    const limit = params.limit != null ? Number(params.limit) : 12;
    const filtered = filterProducts(getDemoProducts(), { ...params, category_id: cid });
    return ok(paginate(filtered, page, limit));
  }

  if (method === 'get' && path === '/products/stats') {
    const list = getDemoProducts();
    return ok({
      total_products: list.length,
      in_stock: list.filter((p) => p.stock > 0).length,
      out_of_stock: list.filter((p) => p.stock <= 0).length,
      inactive_products: list.filter((p) => !p.active).length,
      total_sales: list.reduce((s, p) => s + p.sales_count, 0),
    });
  }

  if (method === 'post' && path === '/products/advanced-search') {
    const body = parseJsonBody(config);
    const page = body.page != null ? Number(body.page) : 1;
    const limit = body.limit != null ? Number(body.limit) : 12;
    const filtered = filterProducts(getDemoProducts(), body as Record<string, unknown>);
    return ok(paginate(filtered, page, limit));
  }

  if (method === 'post' && /^\/products\/\d+\/reviews$/.test(path)) {
    const id = parseInt(path.split('/')[2], 10);
    const body = parseJsonBody(config);
    addReview(id, Number(body.rating), String(body.comment || ''));
    return ok({ message: 'Review added' });
  }

  if (method === 'delete' && /^\/reviews\/\d+$/.test(path)) {
    const rid = parseInt(path.split('/').pop()!, 10);
    deleteReview(rid);
    return ok({ message: 'Deleted' });
  }

  // —— Cart ——
  if (method === 'get' && (path === '/cart' || path === '/cart/')) {
    return wrapCart(getCart());
  }
  if (method === 'get' && path === '/cart/count') {
    const c = getCart();
    return ok({ count: c.items_count });
  }
  if (method === 'post' && path === '/cart/items') {
    const body = parseJsonBody(config);
    return wrapCart(addCartItem(Number(body.product_id), Number(body.quantity) || 1));
  }
  if (method === 'put' && /^\/cart\/items\/\d+$/.test(path)) {
    const itemId = parseInt(path.split('/').pop()!, 10);
    const body = parseJsonBody(config);
    return wrapCart(updateCartItem(itemId, Number(body.quantity)));
  }
  if (method === 'delete' && /^\/cart\/items\/\d+$/.test(path)) {
    const itemId = parseInt(path.split('/').pop()!, 10);
    return wrapCart(removeCartItem(itemId));
  }
  if (method === 'delete' && path === '/cart/clear') {
    clearCart();
    return ok({ message: 'Cleared' });
  }

  // —— Orders (client) ——
  if (method === 'get' && path === '/orders') {
    const page = params.page != null ? Number(params.page) : 1;
    const limit = params.limit != null ? Number(params.limit) : 10;
    const status = params.status as string | undefined;
    let orders = getClientOrders();
    if (status) orders = orders.filter((o) => o.status === status);
    const { products: slice, pagination } = paginate(orders, page, limit);
    return ok({ orders: slice, pagination });
  }
  if (method === 'get' && /^\/orders\/\d+$/.test(path)) {
    const id = parseInt(path.split('/').pop()!, 10);
    const o = getOrderById(id);
    if (!o) return { success: false, message: 'Order not found', timestamp: ts(), data: null };
    return ok({
      ...o,
      items: o.items || [],
    });
  }
  if (method === 'post' && path === '/orders/checkout') {
    const body = parseJsonBody(config);
    const res = checkoutFromCart({
      shipping_address: String(body.shipping_address || ''),
      shipping_city: String(body.shipping_city || ''),
      shipping_phone: body.shipping_phone != null ? String(body.shipping_phone) : undefined,
    });
    return ok({
      order_id: res.order_id,
      total_amount: res.total_amount,
      status: 'pending',
      created_at: ts(),
    });
  }
  if (method === 'put' && /^\/orders\/\d+\/cancel$/.test(path)) {
    const id = parseInt(path.split('/')[2], 10);
    cancelOrder(id);
    return ok({ message: 'Cancelled' });
  }

  // —— Admin ——
  if (method === 'get' && path === '/admin/dashboard/stats') {
    return ok(buildDashboardStats());
  }
  if (method === 'get' && path === '/admin/orders/stats') {
    const orders = getAdminOrders();
    return ok({
      total: orders.length,
      pending: orders.filter((o) => o.status === 'pending').length,
      processing: orders.filter((o) => o.status === 'processing').length,
      shipped: orders.filter((o) => o.status === 'shipped').length,
      delivered: orders.filter((o) => o.status === 'delivered').length,
      cancelled: orders.filter((o) => o.status === 'cancelled').length,
      total_revenue: orders.reduce((s, o) => s + parseFloat(o.total_amount), 0),
    });
  }
  if (method === 'get' && path.startsWith('/admin/orders')) {
    if (/^\/admin\/orders\/\d+$/.test(path)) {
      const id = parseInt(path.split('/').pop()!, 10);
      const detail = getAdminOrderDetail(id);
      if (!detail) return { success: false, message: 'Not found', timestamp: ts(), data: null };
      return ok(detail);
    }
    const page = params.page != null ? Number(params.page) : 1;
    const limit = params.limit != null ? Number(params.limit) : 10;
    const status = params.status as string | undefined;
    const search = (params.search as string)?.toLowerCase() || '';
    let orders = getAdminOrders();
    if (status) orders = orders.filter((o) => o.status === status);
    if (search) {
      orders = orders.filter(
        (o) =>
          o.customer_name.toLowerCase().includes(search) ||
          String(o.id).includes(search)
      );
    }
    const { products: slice, pagination } = paginate(orders, page, limit);
    return ok({ orders: slice, pagination });
  }

  if (method === 'put' && /^\/admin\/orders\/\d+\/status$/.test(path)) {
    const id = parseInt(path.split('/')[3], 10);
    const body = parseJsonBody(config);
    updateAdminOrderStatus(id, String(body.status || 'processing'));
    return ok(null);
  }

  if (method === 'get' && path === '/admin/users') {
    const page = params.page != null ? Number(params.page) : 1;
    const limit = params.limit != null ? Number(params.limit) : 10;
    const users = getUsers();
    const { products: slice, pagination } = paginate(users, page, limit);
    return ok({ users: slice, pagination });
  }
  if (method === 'get' && /^\/admin\/users\/\d+$/.test(path)) {
    const id = parseInt(path.split('/').pop()!, 10);
    const u = getUserById(id);
    if (!u) return { success: false, message: 'User not found', timestamp: ts(), data: null };
    return ok(u);
  }
  if (method === 'put' && /^\/admin\/users\/\d+\/status$/.test(path)) {
    const id = parseInt(path.split('/')[3], 10);
    const body = parseJsonBody(config);
    setUserActive(id, Boolean(body.active));
    return ok(null);
  }
  if (method === 'put' && /^\/admin\/users\/\d+$/.test(path) && !path.includes('/status')) {
    const id = parseInt(path.split('/').pop()!, 10);
    const body = parseJsonBody(config);
    updateUser(id, body as Record<string, unknown>);
    return ok(getUserById(id));
  }

  if (method === 'get' && path.startsWith('/admin/categories')) {
    if (/^\/admin\/categories\/\d+$/.test(path)) {
      const id = parseInt(path.split('/').pop()!, 10);
      const c = getDemoCategoryById(id);
      if (!c) return { success: false, message: 'Not found', timestamp: ts(), data: null };
      return ok({ ...c, product_count: parseInt(c.products_count || '0', 10) });
    }
    const page = params.page != null ? Number(params.page) : 1;
    const limit = params.limit != null ? Number(params.limit) : 10;
    const { categories, pagination } = paginateCategories(page, limit);
    return ok({ categories, pagination });
  }
  if (method === 'post' && path === '/admin/categories') {
    const body = parseJsonBody(config);
    const c = createDemoCategory({
      name: String(body.name || 'New category'),
      image_url: String(body.image_url || ''),
    });
    return ok({ ...c, product_count: 0 });
  }
  if (method === 'put' && /^\/admin\/categories\/\d+$/.test(path)) {
    const id = parseInt(path.split('/').pop()!, 10);
    const body = parseJsonBody(config);
    const c = updateDemoCategory(id, { name: body.name as string, image_url: body.image_url as string });
    if (!c) return { success: false, message: 'Not found', timestamp: ts(), data: null };
    return ok(c);
  }
  if (method === 'delete' && /^\/admin\/categories\/\d+$/.test(path)) {
    const id = parseInt(path.split('/').pop()!, 10);
    deleteDemoCategory(id);
    return ok(null);
  }

  // —— Admin products (same paths, mutate catalog) ——
  if (method === 'delete' && /^\/products\/\d+$/.test(path)) {
    const id = parseInt(path.split('/').pop()!, 10);
    deleteProduct(id);
    return ok({ id });
  }
  if (method === 'post' && path === '/products') {
    const fields = await formDataToRecord(config);
    const p = upsertProductFromForm(null, fields);
    return ok(p);
  }
  if (method === 'put' && /^\/products\/\d+$/.test(path) && !/\/stock$|\/status$|\/images$/.test(path)) {
    const id = parseInt(path.split('/')[2], 10);
    const fields = await formDataToRecord(config);
    const p = upsertProductFromForm(id, fields);
    return ok(p);
  }
  if (method === 'put' && /^\/products\/\d+\/stock$/.test(path)) {
    const id = parseInt(path.split('/')[2], 10);
    const body = parseJsonBody(config);
    const p = getDemoProducts().find((x) => x.id === id);
    if (!p) return { success: false, message: 'Not found', timestamp: ts(), data: null };
    p.stock = Number(body.stock);
    return ok(p);
  }
  if (method === 'put' && /^\/products\/\d+\/status$/.test(path)) {
    const id = parseInt(path.split('/')[2], 10);
    const body = parseJsonBody(config);
    const p = getDemoProducts().find((x) => x.id === id);
    if (!p) return { success: false, message: 'Not found', timestamp: ts(), data: null };
    p.active = Boolean(body.active);
    return ok(p);
  }
  if (method === 'put' && /^\/products\/\d+\/images$/.test(path)) {
    const id = parseInt(path.split('/')[2], 10);
    const p = getDemoProducts().find((x) => x.id === id);
    if (!p) return { success: false, message: 'Not found', timestamp: ts(), data: null };
    return ok(p);
  }

  // filterService direct (not axios) — handled in filterService.ts

  console.warn('[Demo API] Unhandled request:', method, path);
  return {
    success: false,
    message: `Demo mode: no handler for ${method.toUpperCase()} ${path}`,
    timestamp: ts(),
    data: null,
  };
}
