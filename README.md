# Detektif Pola

Game sederhana untuk materi **Berpikir Komputasional: Pengenalan Pola**.
**Mainkan:** https://arihyandi.github.io/Pengenalan-Pola/

Siswa mengamati sebuah urutan (warna, bentuk, arah panah, angka, atau huruf), menemukan aturannya, lalu memilih jawaban yang mengisi kotak bertanda `?`.

## Cara memainkan

Buka `index.html` di browser. Tidak perlu internet atau instalasi, kecuali untuk font.

- Siswa masuk dengan mengisi **nama** dan **kelas**. Tombol **Keluar** dipakai saat perangkat bergantian dengan siswa lain.
- Pilih salah satu dari 5 tingkat. Soal dalam satu ronde dibuat acak, jadi setiap ronde berbeda.
- Klik jawaban atau tekan tombol `1`–`4`. Tekan `Enter` untuk lanjut.
- Soal yang sulit bisa dilewati dengan tombol **Lewati dulu**. **Daftar soal** menampilkan semua nomor: hijau (benar), merah (salah), kuning (dilewati), putih (belum). Klik nomor untuk kembali ke soal mana pun.
- Pekerjaan tersimpan otomatis di perangkat. Jika halaman ditutup, siswa pindah tingkat, atau keluar lalu masuk lagi dengan nama dan kelas yang sama, pekerjaannya dilanjutkan dari posisi terakhir.
- Ronde selesai saat semua soal sudah dijawab. Tombol **Selesai sekarang** menyelesaikan lebih awal, dan soal yang belum dijawab dihitung salah.
- Setelah menjawab, muncul penjelasan aturan polanya.
- Di akhir ronde ada skor, bintang (maksimal 3), dan skor terbaik per tingkat. Tingkat berikutnya terkunci sampai siswa benar minimal **85%** dari seluruh soal di tingkat sebelumnya (Tingkat 1: 13/15, Tingkat 2: 14/16, Tingkat 3: 15/17, Tingkat 4: 16/18). Kemajuan ini dicatat per siswa (nama + kelas) di perangkat yang dipakai.

## Tingkatan dan jenis pola

| Tingkat | Soal | Jenis pola |
|---------|------|------------|
| 1 · Sangat Mudah | 15 | Warna berulang (AB), bentuk berulang (AB), gambar buah/hewan, ukuran besar–kecil, bilangan +1/+2, huruf berurutan, jumlah titik +1 |
| 2 · Mudah | 16 | Warna dan bentuk (AAB, ABB, ABC), gambar ABC, ukuran, bilangan ditambah, bilangan dikurangi, huruf melompat, titik +1/+2, panah berputar 90° |
| 3 · Sedang | 17 | Pola ganda (bentuk + warna), putaran panah 45°/90°, bilangan dikurangi, pola bertumbuh (+1, +2, +3, ...), huruf melompat 2–3, huruf mundur, angka hilang di tengah, gambar ABCD |
| 4 · Sulit | 18 | Perkalian, Fibonacci, bilangan kuadrat, operasi selang-seling, angka hilang di tengah, pola ganda hilang di tengah, huruf + angka (A1, C2, E3), huruf selang-seling (A, Z, B, Y), putaran 135° |
| 5 · Sangat Sulit | 20 | Bilangan kubik, bilangan segitiga, bilangan prima, selisih berlipat, dua deret diselipkan, huruf bertumbuh, putaran + warna, dua operasi (×2 +1), pola ganda dan Fibonacci hilang di tengah |

## Raport

Tombol **Raport** menampilkan hasil keseluruhan siswa yang sedang masuk:

- **Per tingkat:** jumlah percobaan, jumlah benar terbaik, nilai (0–100), predikat, dan status (Lulus jika benar ≥85%, Belum lulus, atau Belum dikerjakan).
- **Nilai akhir:** rata-rata nilai terbaik di kelima tingkat. Tingkat yang belum dikerjakan bernilai 0.
- **Predikat:** A (Sangat baik) untuk nilai di atas 90, B (Baik) di atas 80, C (Cukup) di atas 70, dan D (Perlu bimbingan) untuk 70 ke bawah.
- **Peringkat kelas:** siswa sekelas yang bermain di perangkat yang sama, diurutkan dari nilai akhir tertinggi. Klik nama untuk membuka raport siswa tersebut.
- **Cetak raport:** mencetak atau menyimpan raport sebagai PDF lewat dialog cetak browser.
- **Unduh raport kelas (Excel):** di bagian *Peringkat kelas*, pilih kelas lalu klik tombol ini. Satu file `.xlsx` per kelas (misalnya *Raport Detektif Pola - Kelas 7A.xlsx*) berisi tiga lembar: **Raport** (peringkat, nilai Tingkat 1–5, tingkat lulus, nilai akhir, predikat berwarna), **Rincian per Tingkat**, dan **Jawaban** (semua jawaban siswa kelas itu). Nama kelas digabung tanpa membedakan huruf besar/kecil. File dibuat dari data di perangkat yang dipakai, jadi cara ini tetap bisa dipakai walaupun Google Sheets belum tersambung.

## Mode guru (PIN)

Data siswa lain hanya bisa dibuka setelah guru menekan **Mode guru** dan memasukkan PIN:

- **Raport:** peringkat kelas, raport siswa lain, dan **Unduh raport kelas (Excel)**.
- **Riwayat:** riwayat semua siswa di perangkat, filter kelas, **Unduh CSV**, dan **Hapus riwayat**.

Tanpa PIN, siswa hanya bisa melihat raport dan riwayatnya sendiri. Mode guru terkunci lagi saat halaman dimuat ulang atau saat menekan **Keluar**. Setelah 5 kali PIN salah, percobaan berikutnya harus menunggu 30 detik.

PIN tidak ditulis di repositori. `config.js` hanya menyimpan *hash* PIN (SHA-256 berulang dengan salt). Untuk mengganti PIN, buka **Mode guru → Ganti PIN**, ketik PIN baru dua kali, lalu salin baris `pinGuru: …` yang muncul ke `config.js` di GitHub dan klik **Commit changes**.

Catatan: karena situs ini statis, PIN berfungsi sebagai pengaman kelas, bukan keamanan tingkat tinggi. Siswa yang sangat paham teknik tetap bisa membaca data yang tersimpan di perangkat yang sama. Untuk raport yang benar-benar hanya bisa dibuka guru, gunakan Google Sheets.

## Riwayat jawaban

Setiap jawaban otomatis tercatat: waktu, nama, kelas, tingkat, soal, jawaban siswa, kunci, dan benar/salah.

- **Di perangkat (selalu aktif).** Tombol **Riwayat** menampilkan ronde yang pernah dimainkan beserta rincian tiap soal. Pilih **Semua siswa di perangkat ini** dan filter kelas untuk melihat semua siswa yang bermain di komputer/HP tersebut. **Unduh CSV** menyimpan riwayat sebagai file yang bisa dibuka di Excel atau Google Sheets. Riwayat ini disimpan di browser (maksimal 300 ronde terakhir) dan hilang jika data browser dihapus.
- **Google Sheets guru (opsional, disarankan).** Jawaban siswa dari semua perangkat terkumpul di Google Drive guru, dan **raport per kelas dibuat otomatis**.

### Menyiapkan raport di Google Sheets

1. Buka [sheets.new](https://sheets.new) untuk membuat Google Sheets baru, misalnya bernama *Detektif Pola - Data*.
2. Buka **Ekstensi → Apps Script**. Hapus isi editor, tempel seluruh isi `apps-script/Code.gs`, lalu klik **Simpan**.
3. Klik **Terapkan → Deployment baru**. Pilih jenis **Aplikasi web**, isi *Jalankan sebagai*: **Saya**, dan *Yang memiliki akses*: **Siapa saja**. Klik **Terapkan**, lalu izinkan akses ke Google Sheets dan Google Drive.
4. Salin **URL aplikasi web** yang berakhiran `/exec`.
5. Di GitHub, buka file `config.js`, klik ikon pensil (**Edit**), lalu tempel URL tadi di antara tanda kutip:
   ```js
   googleSheetsUrl: "https://script.google.com/macros/s/XXXX/exec",
   ```
   Klik **Commit changes** ke branch `master`. Situs akan diperbarui otomatis dalam 1–2 menit.

### Hasil di Google Drive guru

- Tab **Jawaban** (per soal) dan **Ringkasan** (per ronde) di spreadsheet utama.
- Folder **Raport Detektif Pola** berisi **satu file per kelas**, misalnya *Raport Detektif Pola - Kelas 7A*. Isinya peringkat, nama, nilai Tingkat 1–5, jumlah tingkat lulus, nilai akhir, predikat (A/B/C/D), dan keterangan. File diperbarui otomatis setiap ada siswa yang menyelesaikan ronde.
- Tab **Daftar Raport** di spreadsheet utama berisi tautan ke setiap file kelas.
- Menu **Detektif Pola → Perbarui semua raport** di spreadsheet utama dipakai untuk membuat ulang semua raport secara manual.
- **Nama kelas digabung** tanpa membedakan huruf besar/kecil dan spasi berlebih: `7a`, `7A`, dan ` 7A ` masuk ke file **Kelas 7A**. Nama siswa dicatat apa adanya.

### Akses hanya untuk guru

Akun Google sekolah bisa otomatis membagikan file baru ke seluruh domain sekolah (termasuk akun siswa). Karena itu skrip **mengunci akses secara otomatis** saat pertama kali berjalan: spreadsheet data, folder raport, dan setiap file raport kelas diubah menjadi privat (hanya pemilik). Untuk menguncinya segera, buka spreadsheet data, muat ulang halaman, lalu pilih **Detektif Pola → Kunci akses (hanya guru)**. Hasilnya bisa dicek lewat tombol **Bagikan**: bagian *Akses umum* harus bertuliskan **Dibatasi**.

### Siapa yang bisa melihat

Spreadsheet, folder, dan file raport dibuat di akun Google guru dan **tidak dibagikan ke siapa pun**. Siswa hanya bisa *mengirim* jawaban lewat URL aplikasi web; URL itu tidak pernah menampilkan data. Jangan membagikan tautan spreadsheet atau folder raport kepada siswa. Siapa pun yang mengetahui URL aplikasi web bisa mengirim data palsu, jadi URL ini cukup disimpan di `config.js`.

Jika `Code.gs` diperbarui, buka **Terapkan → Kelola deployment → Edit (ikon pensil) → Versi: Versi baru → Terapkan** agar URL tetap sama.

Catatan: login ini hanya untuk mencatat identitas, bukan pengamanan. Siswa bisa menulis nama apa saja, dan siapa pun yang memegang perangkat bisa membuka atau menghapus riwayat di perangkat itu.

## Publikasi (GitHub Pages)

Situs dipublikasikan otomatis oleh workflow `.github/workflows/pages.yml` setiap ada perubahan di branch `master`.

Pengaturan yang perlu dilakukan sekali saja:

1. Buka **Settings → Pages** di repositori ini.
2. Pada **Build and deployment → Source**, pilih **GitHub Actions**.
3. Gabungkan (merge) perubahan ke `master`, atau jalankan workflow secara manual dari tab **Actions → Publikasi ke GitHub Pages → Run workflow**.

Setelah selesai, game bisa dibuka di https://arihyandi.github.io/Pengenalan-Pola/.

Karena game ini hanya satu file `index.html`, file tersebut juga bisa diunggah ke hosting statis lain (Netlify, Vercel, Google Sites lewat embed, atau LMS sekolah).

## Struktur

```
index.html                     # seluruh game (HTML, CSS, dan JavaScript)
config.js                      # pengaturan (URL Google Sheets opsional)
assets/logo-kalam-kudus.png    # logo sekolah (header semua menu dan ikon tab)
assets/vendor/exceljs.min.js   # pustaka pembuat file Excel (ExcelJS 4.4.0, lisensi MIT)
apps-script/Code.gs            # penerima riwayat untuk Google Sheets
.github/workflows/pages.yml    # publikasi otomatis ke GitHub Pages
```
