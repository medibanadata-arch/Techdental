export const API_BASE = "https://tech-dental-api.rec-techdentalcare.workers.dev";

export const getAdminHeaders = (adminKey: string) => ({
  "Content-Type": "application/json",
  "x-admin-key": adminKey,
});

// Generic Fetch Wrapper
async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || `HTTP error ${res.status}`);
  }
  return json;
}

// 1. DOCTORS
export const apiGetDoctors = (all = true) => 
  fetchJson<{ success: boolean; data: any[] }>(`${API_BASE}/api/doctors${all ? "?all=1" : ""}`);

export const apiCreateDoctor = (data: any, key: string) =>
  fetchJson<{ success: boolean; id: number; message: string }>(`${API_BASE}/api/doctors`, {
    method: "POST",
    headers: getAdminHeaders(key),
    body: JSON.stringify(data),
  });

export const apiUpdateDoctor = (id: number, data: any, key: string) =>
  fetchJson<{ success: boolean; message: string }>(`${API_BASE}/api/doctors/${id}`, {
    method: "PUT",
    headers: getAdminHeaders(key),
    body: JSON.stringify(data),
  });

export const apiDeleteDoctor = (id: number, key: string) =>
  fetchJson<{ success: boolean; message: string }>(`${API_BASE}/api/doctors/${id}`, {
    method: "DELETE",
    headers: getAdminHeaders(key),
  });

// 2. PAGES
export const apiGetPages = (all = true) =>
  fetchJson<{ success: boolean; data: any[] }>(`${API_BASE}/api/pages${all ? "?all=1" : ""}`);

export const apiCreatePage = (data: any, key: string) =>
  fetchJson<{ success: boolean; id: number; message: string; slug: string }>(`${API_BASE}/api/pages`, {
    method: "POST",
    headers: getAdminHeaders(key),
    body: JSON.stringify(data),
  });

export const apiUpdatePage = (id: number, data: any, key: string) =>
  fetchJson<{ success: boolean; message: string }>(`${API_BASE}/api/pages/${id}`, {
    method: "PUT",
    headers: getAdminHeaders(key),
    body: JSON.stringify(data),
  });

export const apiDeletePage = (id: number, key: string) =>
  fetchJson<{ success: boolean; message: string }>(`${API_BASE}/api/pages/${id}`, {
    method: "DELETE",
    headers: getAdminHeaders(key),
  });

// 3. POSTS
export const apiGetPosts = (all = true) =>
  fetchJson<{ success: boolean; data: any[] }>(`${API_BASE}/api/posts${all ? "?all=1" : ""}`);

export const apiGetPostBySlug = (slug: string, all = false) =>
  fetchJson<{ success: boolean; data: any }>(`${API_BASE}/api/posts/${encodeURIComponent(slug)}${all ? "?all=1" : ""}`);

export const apiCreatePost = (data: any, key: string) =>
  fetchJson<{ success: boolean; id: number; message: string; slug: string }>(`${API_BASE}/api/posts`, {
    method: "POST",
    headers: getAdminHeaders(key),
    body: JSON.stringify(data),
  });

export const apiUpdatePost = (id: number, data: any, key: string) =>
  fetchJson<{ success: boolean; message: string }>(`${API_BASE}/api/posts/${id}`, {
    method: "PUT",
    headers: getAdminHeaders(key),
    body: JSON.stringify(data),
  });

export const apiDeletePost = (id: number, key: string) =>
  fetchJson<{ success: boolean; message: string }>(`${API_BASE}/api/posts/${id}`, {
    method: "DELETE",
    headers: getAdminHeaders(key),
  });

// 4. PRICING
export const apiGetPricing = () =>
  fetchJson<{ success: boolean; data: any[] }>(`${API_BASE}/api/pricing`);

export const apiCreatePricing = (data: any, key: string) =>
  fetchJson<{ success: boolean; id: number; message: string }>(`${API_BASE}/api/pricing`, {
    method: "POST",
    headers: getAdminHeaders(key),
    body: JSON.stringify(data),
  });

export const apiUpdatePricing = (id: number, data: any, key: string) =>
  fetchJson<{ success: boolean; message: string }>(`${API_BASE}/api/pricing/${id}`, {
    method: "PUT",
    headers: getAdminHeaders(key),
    body: JSON.stringify(data),
  });

export const apiDeletePricing = (id: number, key: string) =>
  fetchJson<{ success: boolean; message: string }>(`${API_BASE}/api/pricing/${id}`, {
    method: "DELETE",
    headers: getAdminHeaders(key),
  });

// 5. LOCATIONS & MAPS
export const apiGetLocations = () =>
  fetchJson<{ success: boolean; data: any[] }>(`${API_BASE}/api/locations`);

export const apiCreateLocation = (data: any, key: string) =>
  fetchJson<{ success: boolean; id: number; message: string }>(`${API_BASE}/api/locations`, {
    method: "POST",
    headers: getAdminHeaders(key),
    body: JSON.stringify(data),
  });

export const apiUpdateLocation = (id: number, data: any, key: string) =>
  fetchJson<{ success: boolean; message: string }>(`${API_BASE}/api/locations/${id}`, {
    method: "PUT",
    headers: getAdminHeaders(key),
    body: JSON.stringify(data),
  });

export const apiDeleteLocation = (id: number, key: string) =>
  fetchJson<{ success: boolean; message: string }>(`${API_BASE}/api/locations/${id}`, {
    method: "DELETE",
    headers: getAdminHeaders(key),
  });

// 6. FEATURED IMAGES / GALLERY
export const apiGetFeaturedImages = (all = false) =>
  fetchJson<{ success: boolean; data: any[] }>(`${API_BASE}/api/featured-images${all ? "?all=1" : ""}`);

export const apiCreateFeaturedImage = (data: any, key: string) =>
  fetchJson<{ success: boolean; id: number; message: string }>(`${API_BASE}/api/featured-images`, {
    method: "POST",
    headers: getAdminHeaders(key),
    body: JSON.stringify(data),
  });

export const apiUpdateFeaturedImage = (id: number, data: any, key: string) =>
  fetchJson<{ success: boolean; message: string }>(`${API_BASE}/api/featured-images/${id}`, {
    method: "PUT",
    headers: getAdminHeaders(key),
    body: JSON.stringify(data),
  });

export const apiDeleteFeaturedImage = (id: number, key: string) =>
  fetchJson<{ success: boolean; message: string }>(`${API_BASE}/api/featured-images/${id}`, {
    method: "DELETE",
    headers: getAdminHeaders(key),
  });

export const apiReorderFeaturedImages = (items: { id: number; sort_order: number }[], key: string) =>
  fetchJson<{ success: boolean; message: string }>(`${API_BASE}/api/featured-images/reorder`, {
    method: "POST",
    headers: getAdminHeaders(key),
    body: JSON.stringify({ items }),
  });

export const apiIncrementFeaturedImageView = (id: number) =>
  fetchJson<{ success: boolean; view_count?: number }>(`${API_BASE}/api/featured-images/${id}/view`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  }).catch(() => ({ success: false })); // Silently fail if endpoint doesn't exist

// 7. APPOINTMENTS
export const apiGetAppointments = (key: string) =>
  fetchJson<{ success: boolean; count: number; data: any[] }>(`${API_BASE}/api/appointments`, {
    headers: getAdminHeaders(key),
  });

export const apiCreateAppointment = (data: any) =>
  fetchJson<{ success: boolean; id: number; message: string }>(`${API_BASE}/api/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const apiUpdateAppointmentStatus = (id: number, status: string, key: string) =>
  fetchJson<{ success: boolean; message: string }>(`${API_BASE}/api/appointments/${id}/status`, {
    method: "PUT",
    headers: getAdminHeaders(key),
    body: JSON.stringify({ status }),
  });

export const apiDeleteAppointment = (id: number, key: string) =>
  fetchJson<{ success: boolean; message: string }>(`${API_BASE}/api/appointments/${id}`, {
    method: "DELETE",
    headers: getAdminHeaders(key),
  });

// 8. USERS & AUTH
export const apiLogin = (credentials: { username: string; password: string }) =>
  fetchJson<{ success: boolean; user?: any; error?: string }>(`${API_BASE}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

export const apiGetUsers = (key: string) =>
  fetchJson<{ success: boolean; count: number; data: any[] }>(`${API_BASE}/api/users`, {
    headers: getAdminHeaders(key),
  });

export const apiCreateUser = (data: any, key: string) =>
  fetchJson<{ success: boolean; id: number; message: string }>(`${API_BASE}/api/users`, {
    method: "POST",
    headers: getAdminHeaders(key),
    body: JSON.stringify(data),
  });

export const apiUpdateUser = (id: number, data: any, key: string) =>
  fetchJson<{ success: boolean; message: string }>(`${API_BASE}/api/users/${id}`, {
    method: "PUT",
    headers: getAdminHeaders(key),
    body: JSON.stringify(data),
  });

export const apiDeleteUser = (id: number, key: string) =>
  fetchJson<{ success: boolean; message: string }>(`${API_BASE}/api/users/${id}`, {
    method: "DELETE",
    headers: getAdminHeaders(key),
  });

// 9. MEDIA LIBRARY
export const apiGetMedia = (search?: string) =>
  fetchJson<{ success: boolean; count: number; data: any[] }>(
    `${API_BASE}/api/media${search ? `?search=${encodeURIComponent(search)}` : ""}`
  );

export const apiCreateMedia = (data: any, key: string) =>
  fetchJson<{ success: boolean; id: number; message: string; data?: any }>(`${API_BASE}/api/media`, {
    method: "POST",
    headers: getAdminHeaders(key),
    body: JSON.stringify(data),
  });

export const apiUpdateMedia = (id: number, data: any, key: string) =>
  fetchJson<{ success: boolean; message: string }>(`${API_BASE}/api/media/${id}`, {
    method: "PUT",
    headers: getAdminHeaders(key),
    body: JSON.stringify(data),
  });

export const apiDeleteMedia = (id: number, key: string) =>
  fetchJson<{ success: boolean; message: string }>(`${API_BASE}/api/media/${id}`, {
    method: "DELETE",
    headers: getAdminHeaders(key),
  });




