# LAPORAN PERENCANAAN PRODUKSI PERANGKAT LUNAK

Nama Produk: Aplikasi Terintegrasi Point of Sales (POS) & E-Commerce "Kiru Superstore" (Geraiku)
Bidang: Rekayasa Perangkat Lunak / Web Development

---

Deskripsi Singkat Produk
"Kiru Superstore" adalah sebuah sistem Point of Sales (Kasir) yang terintegrasi dengan platform E-Commerce untuk pelanggan. Aplikasi ini memungkinkan kasir melakukan transaksi offline dengan barcode scanner, sementara pelanggan dapat berbelanja secara mandiri melalui website, mendapatkan K-Points (sistem loyalitas), dan melakukan pembayaran digital melalui gerbang pembayaran (Midtrans).

---

Analisis Kebutuhan (Requirements)

A. Alat dan Bahan (Software & Hardware):
*   Perangkat Keras: Laptop/PC (RAM min. 8GB), Thermal Scanner (opsional).
*   Perangkat Lunak (Environment): Node.js, Git, Visual Studio Code, Web Browser.
*   Teknologi Web (Tech Stack): 
    *   *Frontend:* React.js (dengan state management Zustand).
    *   *Backend:* Node.js dengan framework Express.js.
    *   *Database & ORM:* MySQL dan Prisma ORM.
    *   *Third-Party API:* Midtrans untuk Payment Gateway.

B. Kebutuhan Fitur (Spesifikasi Produk):
*   Sistem Kasir (Admin/Kasir): Kelola produk, stok, kategori, checkout keranjang pelanggan, cetak struk/nota otomatis, dan rekapitulasi profit.
*   Sistem Pelanggan: Katalog produk online, keranjang belanja (cart), checkout online dengan Midtrans, sistem K-Points (poin cashback/diskon), dan pelacakan riwayat transaksi (*order history*).

---

Tahap Perancangan (Desain)
*   Perancangan Database (ERD): Membuat skema tabel (User, Customer, Product, Category, Transaction, TransactionDetail, Cart, Profit, dll) beserta relasi antar tabel menggunakan pendekatan skema Prisma.
*   Perancangan Antarmuka (UI/UX): Menerapkan desain *modern glassmorphism* dan responsif (bisa diakses lewat HP atau PC) dengan warna *brand* yang konsisten (Warna biru dan kontras tinggi untuk keterbacaan yang jelas).
*   Perancangan Flow Sistem: Merancang alur program (*flowchart*) ketika kasir men-scan barang, atau ketika customer berbelanja. Alur mencakup: login -> tambah ke keranjang -> bayar -> validasi Midtrans -> kurangi stok & tambah riwayat K-Points pelanggan.

---

Tahap Pembuatan (Proses Produksi / Implementasi)
Proses pengerjaan dibagi menjadi bagian *Frontend* dan *Backend* yang dikerjakan secara paralel:

1.  Setup Environment & Database: Inisialisasi proyek Node.js, setup Prisma Studio, dan membuat serta menerapkan struktur tabel (Products, Users, Transactions) ke *local database*.
2.  Pembuatan API (Backend - Node.js):
    *   Membuat *routing* dan RESTful API endpoint (misal: `/api/products`, `/api/checkout`).
    *   Membuat pemrograman fungsional seperti *Controller* (`TransactionController` untuk meng-generate invoice transaksi dan `CheckoutController` untuk mengantarkan data keranjang berbelanja ke API Payment Gateway Midtrans).
3.  Pembuatan Antarmuka (Frontend - React):
    *   Membangun komponen halaman berbasis React (`index.jsx`, `Payment.jsx`, `profile.jsx`).
    *   Menghubungkan *Frontend* agar dapat mengonsumsi API (*fetching data*) dari *Backend* menggunakan fungsi bawaan seperti `useEffect` dipadukan dengan manajemen *State* yang baik.
    *   Pemrograman logika khusus: Implementasi sistem kalkulasi diskon loyalitas K-Points (dengan aturan deduksi maksimal 50% dari total tagihan pesanan).

---

Tahap Pengujian (Testing / Quality Control)
Melakukan serangkaian pengujian (*testing*) sebelum dirilis ke pengguna:
*   Functional Testing: Memastikan scanner barcode bekerja secara efisien tanpa efek ganda pada interaksi antarmuka (mencegah pemindaian trigger "enter" yang salah), serta menguji form input tidak memproses jika nominal uang tidak mencukupi harga jual produk.
*   Integration Testing: Mengecek status *callback/webhook* Midtrans Sandbox; memastikan transaksi berstatus "Pending" secara otomatis ter-update dan berubah menjadi status "Selesai" jika pelanggan telah melunasi pembayaran (memengaruhi pengurangan stok dan penyerahan poin profit aplikasi).
*   Debugging: Mengatasi galat *error trigger* sinkron (React Cascading Renders) dan melacak status HTTP 400/500 *Internal Server Error* saat simulasi sistem *checkout* berjalan.

---

Rencana Penyebaran & Evaluasi (Deployment)
*   Versioning: Merekam jejak versi perangkat lunak (versioning control) dan mengunggah kode perancangan (*source code*) Frontend & Backend secara berkala ke repositori Git (seperti GitHub).
*   Hosting: Menerbitkan API (Node.js) serta aplikasi web (*React build*) di layanan hosting cloud (seperti Serverless Vercel atau hostinger terpadu) agar dapat digunakan dan diakses publik sebagai bagian dari UAT (User Acceptance Testing) tahap akhir.
*   Update & Maintenance: Melakukan evaluasi berkala mengenai waktu unduh (*load time*) sistem antarmuka maupun waktu pemrosesan respons dari Midtrans.
