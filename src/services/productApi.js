const BASE_URL = 'https://dummyjson.com/products';
const REQUEST_TIMEOUT_MS = 12000;

async function request(url, signal) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const abortFromCaller = () => controller.abort();
  signal?.addEventListener('abort', abortFromCaller, { once: true });
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`API trả về lỗi ${response.status}.`);
    const data = await response.json();
    if (!Array.isArray(data.products)) throw new Error('Dữ liệu sản phẩm không hợp lệ.');
    return data;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abortFromCaller);
  }
}

export function getProducts(limit = 10, skip = 0, signal) {
  return request(`${BASE_URL}?limit=${limit}&skip=${skip}`, signal);
}

export function searchProducts(query, limit = 10, skip = 0, signal) {
  return request(`${BASE_URL}/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`, signal);
}

export async function getProductById(id, signal) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const abortFromCaller = () => controller.abort();
  signal?.addEventListener('abort', abortFromCaller, { once: true });
  try {
    const response = await fetch(`${BASE_URL}/${id}`, { signal: controller.signal });
    if (!response.ok) throw new Error(`Không tải được sản phẩm (${response.status}).`);
    return await response.json();
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abortFromCaller);
  }
}

export function isAbortError(error) {
  return error?.name === 'AbortError';
}
