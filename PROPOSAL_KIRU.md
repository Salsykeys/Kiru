# PROPOSAL PENGEMBANGAN SISTEM POINT OF SALE (POS) & E-COMMERCE: KIRU

---

## BAB 1: PENDAHULUAN

### 1.1 Latar Belakang

Industri ritel dan UMKM di Indonesia sedang mengalami transisi besar menuju digitalisasi. Namun, banyak pelaku usaha masih menggunakan pencatatan manual yang lambat, berisiko tinggi terhadap kesalahan hitung, dan sulit untuk memantau inventaris secara _real-time_. Selain itu, tren pembayaran non-tunai (cashless) melalui QRIS dan dompet digital menuntut pedagang untuk memiliki sistem yang terintegrasi. **Kiru** hadir untuk menjembatani celah tersebut dengan menyediakan sistem kasir pintar yang menggabungkan fitur POS tradisional dengan kecanggihan Payment Gateway modern.

### 1.2 Tujuan

1. Menciptakan sistem pencatatan transaksi yang cepat, akurat, dan transparan.
2. Mengintegrasikan berbagai metode pembayaran (QRIS, VA, E-Wallet) dalam satu _platform_.
3. Meningkatkan loyalitas pelanggan melalui sistem poin yang terautomasi.
4. Memberikan kemudahan bagi pemilik bisnis dalam memantau performa penjualan lewat dashboard analitik.

### 1.3 Manfaat

- **Bagi Pedagang**: Mempercepat proses checkout, mengurangi risiko selisih uang, dan manajemen stok yang otomatis.
- **Bagi Pelanggan**: Mendapatkan pilihan pembayaran yang beragam dan memperoleh reward (K-Points) setiap kali berbelanja.
- **Bagi Manajemen**: Memperoleh data valid untuk pengambilan keputusan bisnis (barang paling laku, waktu teramai, dll).

### 1.4 Visi Misi

- **Visi**: Menjadi mitra teknologi utama bagi UMKM Indonesia dalam mewujudkan ekosistem perdagangan digital yang inklusif dan efisien.
- **Misi**:
  1. Menyediakan teknologi POS yang terjangkau namun memiliki fitur kelas industri.
  2. Menjamin keamanan setiap transaksi pelanggan.
  3. Terus berinovasi dalam mengoptimalkan pengalaman belanja online maupun offline.

---

## BAB 2: ANALISIS SWOT

### 2.1 Strengths (Kekuatan)

1. **Integrasi Langsung Midtrans**: Mendukung pembayaran via QRIS dan Virtual Account tanpa perlu konfirmasi manual.
2. **Sistem K-Points**: Memiliki fitur loyalitas bawaan untuk menarik minat pelanggan kembali belanja.
3. **Discovery Algorithm**: Fitur pengacakan produk di etalase yang memastikan semua barang dagangan mendapatkan visibilitas yang merata.
4. **Teknologi Modern & Cepat**: Dibangun dengan Node.js dan React.js yang menjamin performa aplikasi sangat responsif.
5. **UI Premium**: Menggunakan desain profesional berbasis Tabler yang memberikan kesan mahal dan terpercaya bagi pengguna.

### 2.2 Weaknesses (Kelemahan)

1. **Ketergantungan Internet**: Sebagai sistem berbasis cloud, Kiru memerlukan koneksi internet yang stabil untuk transaksi payment gateway.
2. **Keterbatasan Offline Mode**: Belum tersedianya fitur penyimpanan transaksi saat jaringan lokal terputus total.
3. **Brand Awareness Baru**: Sebagai sistem baru di pasar, membutuhkan usaha ekstra dalam membangun kepercayaan publik dibandingkan kompetitor besar.
4. **Kebutuhan Device Spesifik**: Membutuhkan perangkat dengan browser modern untuk menjalankan dashboard dengan optimal.

### 2.3 Opportunities (Peluang)

1. **Peningkatan Pengguna QRIS**: Pertumbuhan eksponensial pengguna QRIS di Indonesia yang diwajibkan oleh pemerintah.
2. **Pertumbuhan UMKM Digital**: Jutaan merchant lokal sedang mencari alternatif software kasir yang lebih terjangkau daripada sistem berlangganan mahal.
3. **Ekspansi Fitur**: Peluang mengembangkan integrasi ke printer thermal, barcode scanner hardware, dan jasa pengiriman (logistik).
4. **Kemitraan Strategis**: Peluang bekerja sama dengan bank daerah atau komunitas bisnis lokal untuk implementasi sistem secara massal.

### 2.4 Threats (Ancaman)

1. **Persaingan Ketat**: Adanya pemain besar seperti Moka, Majoo, atau Pawoon yang memiliki modal pemasaran raksasa.
2. **Keamanan Siber**: Ancaman upaya peretasan data transaksi atau serangan DDoS pada server pusat.
3. **Perubahan Regulasi**: Perubahan kebijakan dari Bank Indonesia atau Payment Gateway terkait tarif MDR (Merchant Discount Rate).
4. **Instabilitas Koneksi ISP**: Kualitas internet di beberapa daerah pelosok Indonesia yang masih belum merata.

---

## BAB 3: WEBSITE

### 3.1 Pengertian Website

Website adalah sekumpulan halaman informasi dalam bentuk data digital baik berupa teks, gambar, video, maupun audio yang disediakan melalui jalur koneksi internet. Dalam projek ini, website berfungsi sebagai "pintu masuk" bagi pelanggan untuk memilih produk dan bagi admin untuk mengelola manajemen toko.

### 3.2 Sistem Kasir (Point of Sale/POS)

Point of Sale (POS) adalah sistem yang digunakan untuk memproses transaksi penjualan produk atau jasa secara langsung. Sistem ini mencakup penghitungan harga, manajemen inventaris, dan pembuatan laporan keuangan secara otomatis dalam satu alur kerja terpadu.

### 3.3 Referensi Sistem Sejenis

Dalam pengembangannya, Kiru mengambil referensi fungsionalitas dari sistem sukses seperti:

- **Moka POS**: Referensi dalam struktur manajemen inventaris.
- **Majoo**: Referensi dalam integrasi multi-dashboard.
- **Tokopedia/Shopee**: Referensi dalam user experience (UX) keranjang belanja dan alur pembayaran digital.

---

## BAB 4: PROSES PEMBUATAN POS

### 4.1 Konsep POS

Konsep Kiru adalah **"Discovery & Efficient"**. Kiru mengusung tema toko digital yang membantu pelanggan menemukan produk secara dinamis melalui algoritma acak, sekaligus memastikan kasir dapat melayani transaksi dengan kecepatan tinggi melalui integrasi payment gateway tanpa jeda.

### 4.2 Fitur Utama

1. **Multi-Payment Gateway (Midtrans)**: Mendukung GoPay, OVO, QRIS, Alfamart/Indomaret, VA Bank, dan Kartu Kredit/Debit.
2. **K-Points Loyalty System**: Automasi pemberian poin belanja dan tampilan riwayat poin di profil user.
3. **Real-time Inventory**: Pengurangan stok otomatis setiap kali transaksi dinyatakan sukses oleh Midtrans.
4. **Paginated Transaction History**: Pencatatan riwayat belanja yang rapi dan cepat akses dengan sistem paginasi.
5. **Product Discovery Algorithm**: Menampilkan produk secara acak di beranda untuk promosi barang yang merata.

### 4.3 Alat & Teknologi

1. **Backend**: Node.js & Express.js (Sebagai server API utama).
2. **Database**: MySQL dengan Prisma ORM (Untuk manajemen data relasional yang aman).
3. **Frontend**: React.js dengan Vite (Untuk UI yang cepat dan reaktif).
4. **State Management**: Zustand (Untuk mengelola keranjang belanja dan data sesi customer).
5. **Styling**: Vanilla CSS & Tailwind/Bootstrap (Untuk tampilan responsif dan estetik).
6. **Payment SDK**: Midtrans Client JS & Node.js SDK.

### 4.4 Tahapan Pengembangan

1. **Analisis Kebutuhan**: Mendata barang, kategori, dan alur poin.
2. **Perancangan Database**: Membuat skema tabel (User, Product, Order, Detail) di Prisma.
3. **Pembangunan API (Backend)**: Membuat endpoint login, transaksi, dan notifikasi payment.
4. **Pembangunan Dashboard (Frontend)**: Membuat tampilan kasir dan etalase customer.
5. **Integrasi Payment**: Menghubungkan Snap Midtrans dengan alur checkout.
6. **Testing & QA**: Uji coba sandbox transaksi dan perbaikkan bug scroll/UI.

---

## BAB 5: PEMASARAN

### 5.1 Tujuan Pemasaran

1. Memperoleh setidaknya 50 merchant aktif dalam 6 bulan pertama.
2. Membangun brand "Kiru" sebagai sistem POS paling ringan dan terjangkau bagi UMKM.
3. Menciptakan komunitas pengguna yang loyal melalui sistem referral.

### 5.2 Teknik Pemasaran

- **Social Media Marketing**: Menggunakan TikTok dan Instagram untuk tutorial penggunaan kasir Kiru.
- **Trial Period**: Memberikan akses gratis selama 30 hari bagi merchant baru.
- **Direct Approach**: Mendatangi UMKM/toko fisik lokal untuk mendemonstrasikan efisiensi sistem.
- **SEO Optimization**: Memastikan website Kiru muncul di hasil pencarian sistem kasir modern.

---

## BAB 6: KEUANGAN / PEMBIAYAAN

### 6.1 Rincian Kebutuhan Dana

1. **Sewa Server (VPS)**: Rp 1.500.000 / Tahun.
2. **Domain .com/.id**: Rp 200.000 / Tahun.
3. **Maintenance & Bug Fixing**: Rp 3.000.000 / Tahun.
4. **Pemasaran/Ads**: Rp 2.000.000 (Initial).
5. **Biaya Integrasi API**: Tergantung volume transaksi (MDR Midtrans).

### 6.2 Sumber Pendanaan

- **Modal Mandiri (Bootstrapping)**: Dana pribadi dari founder untuk pengembangan awal.
- **Program Hibah UMKM/Pemerintah**: Pengajuan pendanaan inovasi teknologi.
- **Sistem Bagi Hasil**: Kerjasama dengan investor lokal.

### 6.3 Keuntungan

- **Subscription Fee**: Biaya bulanan/tahunan dari merchant.
- **Markup Fee**: Biaya administrasi kecil per transaksi dari customer.
- **Premium Feature Upgrade**: Biaya tambahan untuk fitur laporan advance atau multi-cabang.

---

## BAB 7: PENUTUP

### 7.1 Kesimpulan

Kiru adalah solusi strategis bagi UMKM yang ingin bertransformasi ke arah digital. Dengan fitur yang lengkap (POS, E-Commerce, Payment Gateway, K-Points) dan dibangun dengan teknologi terdepan, Kiru memiliki potensi besar untuk bersaing di pasar nasional.

### 7.2 Saran / Harapan

Diharapkan sistem ini dapat terus dikembangkan dengan penambahan fitur integrasi perangkat keras (hardware) dan AI untuk prediksi stok barang. Dukungan dari berbagai pihak sangat diperlukan untuk mewujudkan visi Kiru sebagai pilar teknologi UMKM Indonesia.

---

**Disusun Oleh:** [Ahmad Faisal dan Yuddi Chrisnaldi / Developer Team Kiru]
**Tanggal:** 8 Maret 2026
