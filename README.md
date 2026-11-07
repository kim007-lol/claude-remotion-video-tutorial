# Tutorial: Bikin Video Pakai Claude Code + Remotion

Cara membuat video programatis dengan Remotion (React yang dirender jadi MP4), di mana **Claude Code yang menulis seluruh kodenya** untukmu. Kamu cukup mendeskripsikan video yang kamu mau dalam bahasa biasa, Claude menulis komponen React-nya, Remotion me-render-nya jadi file MP4.

Semua yang dipakai tutorial ini adalah proyek open source resmi Remotion di GitHub:

- **Proyek utamanya:** [github.com/remotion-dev/remotion](https://github.com/remotion-dev/remotion)
- **Skill resminya untuk Claude Code:** [github.com/remotion-dev/skills](https://github.com/remotion-dev/skills), dengan skill utama bernama `remotion-best-practices`
- **Dokumentasi resminya:** [remotion.dev/docs](https://www.remotion.dev/docs), halaman skill di [remotion.dev/docs/ai/skills](https://www.remotion.dev/docs/ai/skills)

Repo tutorial ini sendiri hanya berisi: tutorial lengkap ini, bank prompt siap salin di [`PROMPTS.md`](PROMPTS.md), dan satu contoh komposisi kecil di folder [`example/`](example/) yang ditulis khusus untuk tutorial ini. Tidak ada file proyek lain yang disertakan, semua rujukan kode mengarah ke repo open source resmi di atas.

---

## Cara kerjanya, singkatnya

- **Remotion** adalah framework React open source: satu video adalah satu komponen React. Remotion membuka komponen itu di Chromium, memotretnya frame demi frame, lalu menyatukannya menjadi MP4.
- Karena video adalah kode, semua animasi harus **deterministik**: tampilan elemen di frame ke-N hanya boleh bergantung pada nomor frame, bukan pada jam atau timer. Itulah kenapa animasi ditulis dari `useCurrentFrame()` dengan `interpolate()` dan `spring()`, bukan CSS animation.
- **Claude Code + skill resmi Remotion** adalah penulis kodenya. Skill resmi itu mengajarkan Claude aturan main Remotion (animasi berbasis frame, sequencing, render, audio, caption, dan lain lain) supaya kode yang ditulisnya langsung benar cara, bukan sekadar terlihat benar di preview.

## Prasyarat

| Kebutuhan | Keterangan |
| --- | --- |
| Node.js 18 atau lebih baru | Cek dengan `node -v` |
| npm | Ikut dengan Node.js |
| Claude Code | Terpasang dan sudah login (`claude` di terminal) |
| ffmpeg | Opsional, untuk memeriksa hasil render (ffprobe dan ekstrak frame) |
| Ruang disk | Sekitar 500 MB untuk node_modules dan Chromium bawaan Remotion |

---

## Langkah 1: Pasang skill resmi Remotion ke Claude Code

Skill resminya diterbitkan tim Remotion di repo [remotion-dev/skills](https://github.com/remotion-dev/skills). Cara memasangnya, pilih salah satu:

**Cara A, dari dalam proyek Remotion (paling mudah):**

```bash
npx remotion skills add
```

**Cara B, CLI skills umum, bisa dari folder mana saja:**

```bash
npx skills add remotion-dev/skills
```

Untuk mengambil hanya skill utamanya:

```bash
npx skills add https://github.com/remotion-dev/skills --skill remotion-best-practices
```

**Cara C, sebagai plugin Claude Code:**

```bash
claude plugin marketplace add remotion-dev/claude-code-plugin
claude plugin install remotion@remotion
```

Setelah terpasang, panggil skill-nya di dalam Claude Code dengan awalan garis miring, misalnya:

```text
/remotion-best-practices Buatkan video promo untuk toko rekaman
```

Skill `remotion-best-practices` adalah payung yang mencakup skill skill Remotion lain (membuat proyek, markup dan animasi, studio, render, dokumentasi). Daftar lengkapnya ada di halaman resmi [Agent Skills Remotion](https://www.remotion.dev/docs/ai/skills).

## Langkah 2: Buat proyek Remotion dari nol

Cara resmi, memakai scaffolding dari proyek open source-nya:

```bash
npx create-video@latest
```

Ikuti pilihannya (template kosong sudah cukup), lalu masuk ke folder proyek dan jalankan `npm install` bila diminta.

Atau cara manual penuh, tanpa scaffolding:

```bash
mkdir video-saya
cd video-saya
npm init -y
npm install remotion @remotion/cli react react-dom
mkdir src
```

Atau langsung pakai contoh kecil dari repo ini:

```bash
cp -r example/* video-saya/
cd video-saya
npm install
```

## Langkah 3: Pahami tiga file intinya

Satu proyek Remotion minimal hanya butuh tiga file di `src/`.

**`src/index.ts`**, titik masuk yang mendaftarkan root:

```tsx
import {registerRoot} from 'remotion';
import {Root} from './Root';
registerRoot(Root);
```

**`src/Root.tsx`**, deklarasi videonya: id, durasi, fps, dan ukuran:

```tsx
import React from 'react';
import {Composition} from 'remotion';
import {ContohHalo} from './Composition';
export const Root: React.FC = () => (
  <Composition id="ContohHalo" component={ContohHalo} durationInFrames={300} fps={30} width={1920} height={1080} />
);
```

300 frame pada 30 fps berarti video 10 detik. Untuk video vertikal Shorts atau Reels, ganti `width` ke 1080 dan `height` ke 1920.

**`src/Composition.tsx`**, isi videonya. Pola dasarnya:

- `AbsoluteFill` adalah kanvas satu adegan.
- `Sequence from={...} durationInFrames={...}` memotong komposisi jadi adegan adegan berurutan.
- `useCurrentFrame()` memberi nomor frame saat ini. Semua gerakan dihitung dari angka ini.
- `interpolate(frame, [mulai, selesai], [nilaiAwal, nilaiAkhir])` memetakan frame ke nilai animasi, selalu dengan `extrapolateLeft: 'clamp'` dan `extrapolateRight: 'clamp'` supaya nilai tidak lari keluar rentang.
- `spring({frame, fps, config})` memberi gerakan memantul yang natural untuk teks masuk.

Kode lengkap komposisi contoh tutorial ini (2 adegan: judul masuk dengan spring, lalu progress bar animasi) ada di [`example/src/Composition.tsx`](example/src/Composition.tsx). Untuk contoh yang jauh lebih lengkap, baca source code proyek resminya langsung di [remotion-dev/remotion](https://github.com/remotion-dev/remotion) dan template template di dokumentasinya.

## Langkah 4: Minta Claude Code menulis videomu

Buka Claude Code di folder proyek, pastikan skill resminya terpasang, lalu deskripsikan videonya sejelas kamu mendeskripsikan ke manusia. Prompt yang baik menyebut: ukuran dan orientasi, durasi, adegan per adegan, teks persisnya, warna, dan gaya gerakan.

Contoh prompt utama:

```text
Gunakan skill remotion-best-practices. Buat komposisi Remotion bernama PromoProduk, 1920x1080, 30 fps, 450 frame (15 detik), di src/Composition.tsx dan daftarkan di src/Root.tsx.

Adegan 1 (frame 0-150): teks kinetik di tengah layar. Kata "VIDEO" besar warna putih masuk dengan spring, lalu "DARI KODE." warna pink di bawahnya, lalu kalimat kecil "Tanpa kamera. Tanpa timeline manual."
Adegan 2 (frame 150-300): judul "Satu komponen React = satu video", lalu 4 grafik batang horizontal berlabel Script 92, Animasi 76, Render 88, Upload 64, masing masing menganimasikan lebar dan angka persennya dari 0.
Adegan 3 (frame 300-450): lingkaran berputar masuk dengan spring, teks "REMOTION", dan subteks "React yang dirender jadi MP4".

Latar gradasi biru gelap. Semua animasi wajib dari useCurrentFrame dengan interpolate dan spring, tanpa CSS transition. Setelah selesai, render dan verifikasi hasilnya dengan ffprobe dan ekstrak 3 frame.
```

Variasi prompt lain yang siap pakai ada di [`PROMPTS.md`](PROMPTS.md): video vertikal untuk Shorts, grafik data dari angka sendiri, intro channel, lower third, dan video hitung mundur.

Aturan saat memoles hasil: minta perubahan satu per satu dalam bahasa hasil, bukan bahasa kode. Contoh: "adegan 2 terlalu cepat, beri jeda 15 frame antar batang" jauh lebih efektif daripada mengedit angka sendiri kalau kamu belum paham polanya.

## Langkah 5: Preview sebelum render

```bash
npx remotion studio src/index.ts
```

Remotion Studio terbuka di browser: kamu bisa menggeser playhead, melihat tiap frame, dan mengganti nilai di panel properti. Render penuh hanya dilakukan setelah preview terlihat benar, karena render 1080p memakan waktu beberapa menit.

Untuk cek cepat satu frame tanpa render penuh:

```bash
npx remotion still src/index.ts ContohHalo out/cek-frame.png --frame=60
```

## Langkah 6: Render jadi MP4

```bash
npx remotion render src/index.ts ContohHalo out/contoh-halo.mp4
```

**Catatan untuk server Linux, VPS, dan VM headless:** unduhan Chromium bawaan Remotion kadang macet di jaringan tertentu. Kalau render menggantung di tahap unduh browser, arahkan ke Chromium lain yang sudah ada di mesin, misalnya headless shell milik Playwright:

```bash
npx remotion render src/index.ts ContohHalo out/contoh-halo.mp4 \
  --browser-executable /path/ke/chrome-headless-shell
```

Dan kalau `npx remotion` mengeluh tidak bisa menentukan executable, instalasinya belum lengkap. Pasang ulang paket intinya lalu panggil binary lokalnya:

```bash
npm install @remotion/cli remotion react react-dom
./node_modules/.bin/remotion render src/index.ts ContohHalo out/contoh-halo.mp4
```

## Langkah 7: Verifikasi hasilnya

Jangan percaya render selesai hanya dari pesan sukses. Periksa dua hal:

```bash
# 1. File valid, durasi dan resolusi benar
ffprobe -v error -show_entries format=duration -show_entries stream=width,height,codec_name out/contoh-halo.mp4

# 2. Isi frame benar, ekstrak frame dari tiap adegan
ffmpeg -y -ss 2 -i out/contoh-halo.mp4 -frames:v 1 frame-1.png
ffmpeg -y -ss 7 -i out/contoh-halo.mp4 -frames:v 1 frame-2.png
```

Buka PNG itu. Kalau teks, warna, dan urutan adegannya sesuai rencana, video selesai.

---

## Aturan emas animasi Remotion

1. **Satu sumber kebenaran: nomor frame.** Semua gerakan dihitung dari `useCurrentFrame()`.
2. **Dilarang** CSS `transition`, CSS `animation`, `setTimeout`, `setInterval`, dan nilai acak (`Math.random()`) di dalam komposisi. Semuanya membuat frame tidak konsisten dan hasil render berkedip atau salah posisi.
3. **`interpolate` selalu di-clamp** di kedua ujungnya.
4. **Teks masuk terasa hidup dengan `spring`**, bukan geser linear. Atur `damping` dan `stiffness` untuk rasa berat atau ringannya.
5. **Satu adegan satu komponen, dipotong dengan `Sequence`.** Durasi total komposisi adalah jumlah semua adegan.
6. **Render still dulu, render penuh kemudian.** Menghemat banyak waktu.

## Troubleshooting

| Gejala | Penyebab | Solusi |
| --- | --- | --- |
| Render macet saat mengunduh Chromium | Unduhan browser bawaan terputus | Pakai `--browser-executable` menunjuk Chromium atau Playwright headless shell yang sudah ada |
| `npx remotion` tidak menemukan executable | Instalasi paket belum lengkap | `npm install @remotion/cli remotion react react-dom`, lalu pakai `./node_modules/.bin/remotion` |
| Animasi berkedip atau loncat | Ada CSS transition, timer, atau `Math.random()` di komposisi | Ganti semuanya dengan perhitungan dari `useCurrentFrame()` |
| Teks meluber keluar layar | Ukuran font dan padding tidak dihitung dari lebar komposisi | Kecilkan font, beri `padding` pada `AbsoluteFill`, cek dengan render still di beberapa frame |
| Hasil render buram | Resolusi komposisi lebih kecil dari target | Samakan `width` dan `height` di `Root.tsx` dengan target akhir (1920x1080 atau 1080x1920) |
| Render sangat lambat | Komposisi panjang pada resolusi penuh | Turunkan dulu ke 720p untuk draf dengan `--scale=0.5`, render penuh hanya untuk final |

## Ide video yang cocok dengan pola ini

- Intro dan bumper channel (logo, judul, musik)
- Video data: grafik batang, counter, dan peringkat yang menganimasi dari angka asli
- Kinetic typography untuk Shorts dan Reels (vertikal 1080x1920)
- Promo produk: tangkapan layar plus teks manfaat yang masuk bergantian
- Lower third, kartu judul, dan transisi untuk video rekaman biasa

## Struktur repo ini

```text
.
├── README.md        Tutorial ini
├── PROMPTS.md       Bank prompt siap salin untuk Claude Code
└── example/
    ├── package.json Dependensi contoh
    └── src/
        ├── index.ts       Titik masuk
        ├── Root.tsx       Deklarasi komposisi
        └── Composition.tsx Contoh komposisi 2 adegan, ditulis untuk tutorial ini
```

## Sumber resmi

- Proyek open source Remotion: https://github.com/remotion-dev/remotion
- Skill resmi untuk agen AI: https://github.com/remotion-dev/skills
- Dokumentasi: https://www.remotion.dev/docs
- Halaman Agent Skills: https://www.remotion.dev/docs/ai/skills

## Lisensi

Tutorial dan contoh di repo ini berlisensi MIT. Remotion adalah proyek terpisah dengan lisensinya sendiri, lihat repo resminya di atas.
