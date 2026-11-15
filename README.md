# Portfolio — Matthew Filbert Angelus (React + Vite)

Website portfolio satu halaman dengan 8 section: Home, About, Skills, Projects, Experience, Achievements, Personality Gallery, Contact.
Tema: old money, effortless, timeless. Burgundy dan cream dengan aksen emas pasir.

## Menjalankan

```bash
npm install
npm run dev       # development di http://localhost:5173
npm run build     # hasil produksi di folder dist/
npm run preview   # cek hasil build
```

Butuh Node.js 18 atau lebih baru.

## Struktur

```
src/
├── main.jsx            # entry point
├── App.jsx             # menyusun semua section
├── data.js             # SEMUA KONTEN ada di sini
├── hooks.js            # useInView, useCountUp, useScrollSpy, useScrollY
├── styles.css          # design tokens + gaya semua komponen
└── components/         # Navbar, Hero, About, Skills, Projects,
                        # Experience, Achievements, Gallery, Contact,
                        # Footer, BackToTop, Reveal, SectionHead
```

## Yang wajib diganti sebelum publish

Semua ada di `src/data.js`:

1. `CONTACT`: email, WhatsApp, LinkedIn, Instagram (sekarang masih placeholder).
2. `PROFILE.photo`: taruh foto di folder `public/` lalu isi, contoh `"/foto-matthew.jpg"`.
3. `GALLERY[].image`: sama, isi path foto untuk tiap kotak gallery.
4. Cerita About, proyek, pengalaman, pencapaian, dan statistik adalah **konten sampel**. Ganti dengan data asli.

## Deploy

- **Vercel / Netlify:** hubungkan repo, build command `npm run build`, output directory `dist`.
- **GitHub Pages:** jalankan `npm run build`, lalu publish isi folder `dist/` (sudah memakai `base: "./"`).

## Catatan

- Form kontak membuka aplikasi email pengunjung lewat `mailto:`. Untuk pengiriman langsung tanpa aplikasi email, pakai layanan seperti Formspree atau Netlify Forms.
- Animasi otomatis dimatikan bila pengguna mengaktifkan *reduce motion* di perangkatnya.
