# 🍽️ Dapoer Tiny — Artisan Culinary & Kitchen Website

Website e-commerce kuliner modern, hangat, dan elegan untuk **Dapoer Tiny**. Didesain dengan tata letak editorial mewah berstandar tinggi yang terinspirasi dari referensi desain Dribbble kelas dunia, dengan skema warna utama **putih bersih dan cokelat karamel `#A55704`**.

---

## 🎨 Palet Warna Proyek (Color Palette)

| Elemen | Kode Warna | Deskripsi Visual |
| :--- | :--- | :--- |
| **Primary Accent** | `#A55704` | Cokelat karamel hangat (tombol utama, badge, harga, aksen) |
| **Primary Hover** | `#8A4802` | Cokelat tua untuk interaksi tombol |
| **Espresso Dark** | `#24150B` | Teks judul pekat, top bar, & footer mewah |
| **Pure White** | `#FFFFFF` | Background kartu produk, modal, navigasi |
| **Cream Neutral** | `#FAF6F0` | Latar belakang lembut yang nyaman di mata |
| **Warm Tint** | `#F5EEE6` | Aksen tombol icon, container thumbnail |

---

## 📂 Struktur Berkas (Project Structure)

```
Dapoer-Tiny/
├── .vscode/
│   ├── settings.json       # Konfigurasi VS Code (auto-format, tab size 2, live server)
│   └── extensions.json     # Rekomendasi ekstensi VS Code (Live Server, Prettier)
├── index.html              # Struktur semantik HTML5 lengkap
├── styles.css              # Styling CSS modern (CSS Variables, Flexbox, Grid, Animasi)
├── script.js               # Logika interaktif JavaScript lengkap & responsif
└── README.md               # Dokumentasi panduan proyek
```

---

## ✨ Fitur-Fitur Interaktif & Modern

1. **Slide-Over Cart Drawer (Keranjang Belanja Geser)**:
   - Panel keranjang belanja interaktif yang meluncur halus dari sisi kanan.
   - Penambahan menu dari hero, grid 2x2, koleksi menu, maupun quick view.
   - Kontrol kuantitas item (+ / -), hapus item, dan pengosongan keranjang.
   - **Free Delivery Progress Tracker**: Indikator otomatis bebas ongkir untuk pesanan di atas Rp 150.000.
   - **Checkout Langsung ke WhatsApp**: Otomatis menghasilkan rincian teks pesanan rapi dan membuka chat WhatsApp resmi Dapoer Tiny.
   - Data keranjang tersimpan otomatis di `localStorage` (tidak hilang saat refresh).

2. **Pencarian Cepat & Filter Menu Real-Time**:
   - Kolom pencarian instan (*live search*) untuk mencari menu berdasarkan nama/bahan.
   - Tab kategori dinamis (**Semua Menu**, **Main Course**, **Bakery & Pastry**, **Dessert**).

3. **Quick View Modal (Lihat Cepat Menu)**:
   - Pop-up modal detail hidangan saat kursor mengarah ke kartu menu.
   - Menampilkan foto HD, deskripsi bahan alami, keunggulan gizi, dan tombol tambah pesanan langsung.

4. **Spotlight Dish Interaktif**:
   - Galeri foto multi-sudut (*thumbnail image switcher*).
   - Pemilih porsi dinamis (**1 Porsi Personal**, **Paket Duo**, **Family Pack**, **Party Platter**) yang otomatis memperbarui kalkulasi harga.
   - Counter jumlah porsi (+ / -).

5. **Wishlist / Menu Favorit**:
   - Tombol favorit hati beranimasi dengan counter badge pada navigasi.

6. **Scroll Reveal Animations**:
   - Efek kemunculan elemen yang mulus (*glide-in fade*) saat halaman digulir berkat `IntersectionObserver`.

7. **Floating WhatsApp Assistance Button**:
   - Tombol mengambang dengan efek pulsing glow di pojok kanan bawah untuk konsultasi pesanan langsung.

8. **Responsif Sepenuhnya (Mobile, Tablet, Desktop)**:
   - Drawer navigasi hamburger untuk layar ponsel.

---

## 💻 Cara Membuka & Menjalankan di Visual Studio Code (VS Code)

### Cara 1: Menggunakan Terminal / Shortcut
1. Buka aplikasi **VS Code**.
2. Pilih menu **File > Open Folder...** (atau tekan `Cmd + O` di Mac / `Ctrl + O` di Windows).
3. Pilih folder:
   ```
   /Users/iwayanmahendra/Documents/Dapoer-Tiny
   ```
4. Folder akan langsung terbuka dengan pengaturan `.vscode` yang telah disiapkan otomatis.

### Cara 2: Menjalankan dengan Live Server (Direkomendasikan)
1. Di VS Code, buka panel Ekstensi (`Cmd + Shift + X`).
2. Pasang ekstensi **Live Server** (oleh Ritwick Dey) jika belum terpasang.
3. Buka berkas [index.html](file:///Users/iwayanmahendra/Documents/Dapoer-Tiny/index.html).
4. Klik kanan di dalam editor [index.html](file:///Users/iwayanmahendra/Documents/Dapoer-Tiny/index.html), lalu pilih **"Open with Live Server"** (atau klik tombol **Go Live** di pojok kanan bawah jendela VS Code).
5. Browser Anda akan otomatis terbuka di `http://127.0.0.1:5500/` dengan fitur *live-reload*.

### Cara 3: Membuka Langsung di Browser
Klik dua kali berkas [index.html](file:///Users/iwayanmahendra/Documents/Dapoer-Tiny/index.html) melalui Finder / File Explorer untuk langsung melihat website di browser favorit Anda.
