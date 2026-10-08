// Pengaturan Detektif Pola.
//
// googleSheetsUrl: isi dengan URL Web App dari Google Apps Script (lihat
// folder apps-script/ dan README.md) agar semua jawaban siswa terkumpul di
// satu Google Sheets milik guru. Biarkan kosong ("") jika riwayat cukup
// disimpan di perangkat masing-masing.
//
// pinGuru: hash PIN untuk Mode guru (peringkat kelas, raport Excel, riwayat
// semua siswa). Yang disimpan hanya hash, bukan PIN-nya. Untuk mengganti PIN,
// buka Mode guru di game, pilih "Ganti PIN", lalu salin baris yang ditampilkan
// ke file ini.
window.DETEKTIF_POLA_CONFIG = {
  pinGuru: { salt: "e580daee1a31eff931fa4634", iter: 20000, hash: "2be3862fa0eddc262e2ed7f149daf7802e8226b4a6ff2964142d194bc763741c" },
  googleSheetsUrl: "https://script.google.com/macros/s/AKfycby12C8b-ma_y_P5wgNmgH7lLyiLaDHHHzf6yERvxsS54JzcPrVgvqe7OU_SaMwJ0Lp8gA/exec",
};
