# Bank Prompt: Video Remotion via Claude Code

Semua prompt di bawah ini dipakai dari dalam folder proyek Remotion, dengan skill resmi Remotion (`remotion-best-practices`, dari github.com/remotion-dev/skills) sudah terpasang. Salin, ganti bagian yang perlu, lalu tempel ke Claude Code. Selalu tutup dengan permintaan render dan verifikasi supaya hasilnya tercek, bukan sekadar kode jadi.

## 1. Video vertikal untuk Shorts dan Reels

```text
Gunakan skill resmi remotion-best-practices. Buat komposisi vertikal 1080x1920, 30 fps, 270 frame (9 detik), bernama PromoVertikal.

Frame 0-90: latar gelap, satu kalimat hook besar masuk kata per kata dengan spring: "Bikin video tanpa kamera."
Frame 90-180: tiga poin manfaat muncul bergantian dari bawah, masing masing satu baris pendek: "Tulis kodenya sekali", "Render jadi MP4", "Ubah teks, render ulang".
Frame 180-270: kartu penutup berisi nama channelku "[NAMA CHANNEL]" dan ajakan "Follow untuk tutorial berikutnya".

Font tebal, kontras tinggi, aman dibaca di layar HP. Semua animasi dari useCurrentFrame. Render hasil akhirnya dan verifikasi dengan ekstrak frame pada detik 1, 4, dan 8.
```

## 2. Grafik data dari angka sendiri

```text
Gunakan skill resmi remotion-best-practices. Buat komposisi 1920x1080, 30 fps, 360 frame, bernama GrafikData, yang memvisualkan data berikut sebagai grafik batang animasi:

[TEMPEL DATA KAMU, misalnya: Januari 120, Februari 185, Maret 240, April 310]

Judul di atas: "[JUDUL GRAFIK]". Setiap batang tumbuh dari 0 ke nilainya dengan interpolate, angka di ujung batang menghitung naik mengikuti pertumbuhan, batang tertinggi diberi warna aksen berbeda. Beri jeda 10 frame antar batang. Di akhir, tampilkan satu kalimat kesimpulan: "[KALIMAT KESIMPULAN]". Render dan verifikasi.
```

## 3. Intro channel 5 detik

```text
Gunakan skill resmi remotion-best-practices. Buat komposisi intro 1920x1080, 30 fps, 150 frame (5 detik), bernama IntroChannel. Lingkaran logo sederhana (inisial "[INISIAL]" di tengah lingkaran) membesar dengan spring dari tengah layar, nama channel "[NAMA CHANNEL]" muncul huruf per huruf di bawahnya, lalu tagline "[TAGLINE]" memudar masuk. Palet warna: latar [WARNA LATAR], aksen [WARNA AKSEN], teks putih. Tutup dengan fade out 15 frame terakhir. Render dan verifikasi dengan ekstrak frame detik 1 dan 4.
```

## 4. Lower third untuk video rekaman

```text
Gunakan skill resmi remotion-best-practices. Buat komposisi 1920x1080, 30 fps, 240 frame, bernama LowerThird, dengan latar transparan (jangan isi background). Pada frame 20, panel lower third meluncur masuk dari kiri bawah: baris pertama nama "[NAMA]" tebal, baris kedua jabatan "[JABATAN]" lebih kecil, garis aksen warna [WARNA] di sisi kiri panel. Panel diam sampai frame 200, lalu meluncur keluar. Render sebagai video dengan alpha bila formatnya mendukung, atau render still pada frame 60 untuk kucek tampilannya.
```

## 5. Hitung mundur dan pengumuman

```text
Gunakan skill resmi remotion-best-practices. Buat komposisi 1080x1080, 30 fps, 450 frame, bernama HitungMundur. Angka 5 sampai 1 muncul satu per satu di tengah layar, masing masing membesar dengan spring lalu mengecil dan hilang, 60 frame per angka. Setelah angka terakhir, tampilkan teks pengumuman: "[TEKS PENGUMUMAN]" dengan subteks "[TEKS TAMBAHAN]". Warna angka bergantian dari palet [WARNA 1, WARNA 2, WARNA 3]. Render dan verifikasi dengan ekstrak 3 frame.
```

## 6. Memoles hasil yang sudah ada

Prompt lanjutan setelah render pertama, apa pun komposisinya:

```text
Render terakhir bagus, ubah tiga hal ini saja:
1. Adegan pertama diperlambat, beri tambahan 20 frame sebelum teks kedua masuk.
2. Warna aksen diganti dari [WARNA LAMA] ke [WARNA BARU] di semua adegan.
3. Adegan penutup ditambah fade out 15 frame.
Jangan ubah hal lain. Render ulang dan verifikasi frame yang berubah.
```

## Tips menulis prompt video

- Sebutkan selalu: ukuran (atau orientasi), fps, durasi dalam frame atau detik, dan nama komposisi.
- Tulis teks yang tampil **persis** di dalam prompt. Claude tidak bisa menebak teks yang kamu mau.
- Bagi video per adegan dengan rentang frame. Ini memaksa struktur `Sequence` yang rapi.
- Minta satu gaya gerakan saja per elemen: spring untuk masuk memantul, interpolate linear untuk grafik dan progress.
- Selalu akhiri dengan "render dan verifikasi" supaya Claude memeriksa hasil akhirnya sendiri.
