const API = "http://180.93.52.142:3007"

/* ─── Generic CRUD ─── */
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })
  if (!res.ok) throw new Error(`API Error: ${res.status}`)
  return res.json()
}

/* ─── Products ─── */
export const productApi = {
  getAll: () => request<any[]>(`${API}/products`),
  get: (id: string) => request<any>(`${API}/products/${id}`),
  create: (data: any) => request<any>(`${API}/products`, { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<any>(`${API}/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`${API}/products/${id}`, { method: "DELETE" }),
}

/* ─── News ─── */
export const newsApi = {
  getAll: () => request<any[]>(`${API}/news`),
  get: (id: string) => request<any>(`${API}/news/${id}`),
  create: (data: any) => request<any>(`${API}/news`, { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<any>(`${API}/news/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`${API}/news/${id}`, { method: "DELETE" }),
}

/* ─── News Categories ─── */
export const newsCategoryApi = {
  getAll: () => request<any[]>(`${API}/newsCategories`),
  create: (data: any) => request<any>(`${API}/newsCategories`, { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<any>(`${API}/newsCategories/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`${API}/newsCategories/${id}`, { method: "DELETE" }),
}

/* ─── Experience ─── */
export const experienceApi = {
  getAll: () => request<any[]>(`${API}/experience`),
  get: (id: string) => request<any>(`${API}/experience/${id}`),
  create: (data: any) => request<any>(`${API}/experience`, { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<any>(`${API}/experience/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`${API}/experience/${id}`, { method: "DELETE" }),
}

/* ─── Company ─── */
export const companyApi = {
  get: () => request<any>(`${API}/company`),
  update: (data: any) => request<any>(`${API}/company`, { method: "PUT", body: JSON.stringify(data) }),
}

/* ─── Config APIs (Objects) ─── */
export const heroApi = {
  get: () => request<any>(`${API}/hero`),
  update: (data: any) => request<any>(`${API}/hero`, { method: "PUT", body: JSON.stringify(data) }),
}

export const aboutApi = {
  get: () => request<any>(`${API}/about`),
  update: (data: any) => request<any>(`${API}/about`, { method: "PUT", body: JSON.stringify(data) }),
}

export const settingsApi = {
  get: () => request<any>(`${API}/settings`),
  update: (data: any) => request<any>(`${API}/settings`, { method: "PUT", body: JSON.stringify(data) }),
}

/* ─── Config APIs (Arrays) ─── */
export const statsApi = {
  getAll: () => request<any[]>(`${API}/stats`),
  get: (id: string) => request<any>(`${API}/stats/${id}`),
  create: (data: any) => request<any>(`${API}/stats`, { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<any>(`${API}/stats/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`${API}/stats/${id}`, { method: "DELETE" }),
}

export const partnersApi = {
  getAll: () => request<any[]>(`${API}/partners`),
  get: (id: string) => request<any>(`${API}/partners/${id}`),
  create: (data: any) => request<any>(`${API}/partners`, { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<any>(`${API}/partners/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`${API}/partners/${id}`, { method: "DELETE" }),
}

/* ─── Contacts (CRM) ─── */
export const contactsApi = {
  getAll: () => request<any[]>(`${API}/contacts`),
  get: (id: string) => request<any>(`${API}/contacts/${id}`),
  create: (data: any) => request<any>(`${API}/contacts`, { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<any>(`${API}/contacts/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => request<void>(`${API}/contacts/${id}`, { method: "DELETE" }),
}

/* ─── Analytics ─── */
export const analyticsApi = {
  get: () => request<any>(`${API}/analytics`),
  update: (data: any) => request<any>(`${API}/analytics`, { method: "PUT", body: JSON.stringify(data) }),
}
