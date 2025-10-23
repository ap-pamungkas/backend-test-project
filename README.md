# 🧩 Backend Developer Test Project — Product CRUD & Authentication

Proyek ini adalah **tes untuk fullstack** yang dibangun dengan arsitektur **monolitik**, menggunakan **Node.js**, **Express.js**, dan **MongoDB**.

---

## 🌟 Ringkasan Proyek

### 🔑 Fitur Utama
| Modul | Endpoint | Keterangan |
|--------|-----------|------------|
| **Authentication** | `POST /api/auth/register`<br>`POST /api/auth/login`<br>`GET /api/auth/me`<br>`POST /api/auth/logout` | Registrasi, Login menggunakan JWT (disimpan di httpOnly cookie), dan otentikasi sesi. |
| **Product CRUD** | `GET`, `POST`, `GET/:id`, `PATCH/:id`, `DELETE/:id` | Operasi CRUD lengkap untuk entitas Product. |
| **Keamanan Data** | — | Setiap Product terikat pada `ownerId`, memastikan hanya pemilik dapat memperbarui atau menghapus datanya. |
| **Presentation (UI)** | `/` | Antarmuka pengguna sederhana berbasis **HTML/Vue.js** yang disajikan dari server yang sama. |

---

## 💡 Pendekatan & Proses Berpikir

### 1️⃣ Struktur & Modularitas
Struktur proyek dibuat modular untuk memisahkan tanggung jawab (Separation of Concerns):

<pre>  
src/
├── app.js              # Konfigurasi utama Express
├── server.js           # Titik masuk server
├── modules/
│   ├── auth/
│   └── products/
├── middlewares/
├── config/
└── routes.js           # Router utama
tests/
├── helpers
│   ├── request.js
├── auth.test.js
└── products.test.js
 </pre>

- `service.js`: berisi logika bisnis, validasi input, dan interaksi database.
- `route.js`: hanya mendefinisikan endpoint dan middleware terkait.
- `middlewares/`: menyimpan logika keamanan dan penanganan error.

Pendekatan ini membuat kode **lebih bersih, modular, dan maintainable**.

---

### 2️⃣ Pilihan Teknologi
- **Node.js + Express.js** → cepat, ringan, dan populer untuk pengembangan backend modern.
- **MongoDB (Native Driver)** → dipilih karena sederhana dan langsung (tanpa Mongoose/ORM).
- **Zod** → untuk validasi data (DTOs).
- **JWT + httpOnly Cookies** → keamanan sesi pengguna lebih baik terhadap serangan XSS.

---

### 3️⃣ Keamanan & Validasi
- **Authentication:** JWT disimpan di `httpOnly cookie` agar tidak bisa diakses lewat JavaScript (mencegah XSS).
- **Authorization:** Setiap `PATCH` dan `DELETE` produk memverifikasi kepemilikan (`ownerId` === `req.user.uid`).
- **Validation:** Menggunakan `zod` untuk validasi input yang konsisten di seluruh layanan.
- **Error Handling:** Terpusat di middleware `errorHandler` agar respons error seragam dan mudah dikelola.

---

### 4️⃣ Lapisan Presentasi (UI)
Aplikasi **monolitik penuh**, menyajikan frontend Vue 3 (CDN) dari direktori `public/`.  
UI memungkinkan:
- Registrasi & Login pengguna
- CRUD Produk (Create, Read, Update, Delete)

---

## 🛠️ Panduan Pengaturan Proyek

### 📋 Persyaratan
- **Node.js** v16 atau lebih tinggi  
- **MongoDB** (lokal atau cloud)

---

### 🚀 Instalasi & Setup

#### 1️⃣ Kloning Repositori
```bash
git clone https://github.com/ap-pamungkas/backend-test-project.git
cd backend-test-project
npm install
```

#### 2️⃣ Konfigurasi File .env
Buat file `.env` di root proyek berdasarkan contoh berikut:

```env
MONGO_URI=mongodb://localhost:27017/nama-database-anda
JWT_SECRET=gunakan_kunci_sangat_rahasia_dan_panjang_di_sini
PORT=3000
```

⚠️ Gantilah `MONGO_URI` dan `JWT_SECRET` dengan nilai yang valid dan kuat.

#### 3️⃣ Menjalankan Server
Gunakan nodemon untuk mode pengembangan:

```bash
npm run dev
```

Server akan berjalan di:
http://localhost:3000

---

## 🔗 Struktur API RESTful

Semua endpoint diawali dengan `/api`.

### 🔒 Autentikasi (/api/auth)
| Metode | Rute | Deskripsi | Akses |
|--------|------|-----------|--------|
| POST | `/api/auth/register` | Mendaftarkan pengguna baru. | Public |
| POST | `/api/auth/login` | Login dan mengembalikan JWT di cookie. | Public |
| GET | `/api/auth/me` | Mendapatkan data pengguna yang sedang login. | Protected |
| POST | `/api/auth/logout` | Menghapus sesi (cookie). | Public |

### 📦 Produk (/api/products)
| Metode | Rute | Deskripsi | Akses |
|--------|------|-----------|--------|
| GET | `/api/products` | Mendapat semua produk (mendukung query `?q=keyword`). | Public |
| POST | `/api/products` | Membuat produk baru. | Protected |
| GET | `/api/products/:id` | Mendapat produk berdasarkan ID. | Public |
| PATCH | `/api/products/:id` | Memperbarui produk (hanya oleh Owner). | Protected |
| DELETE | `/api/products/:id` | Menghapus produk (hanya oleh Owner). | Protected |

