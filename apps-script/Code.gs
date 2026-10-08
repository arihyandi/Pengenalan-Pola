/**
 * Detektif Pola: penerima riwayat jawaban dan pembuat raport per kelas.
 *
 * Cara pakai (ringkas, lihat README.md untuk langkah lengkap):
 * 1. Buat Google Sheets baru, lalu buka Ekstensi -> Apps Script.
 * 2. Tempel seluruh isi file ini, simpan.
 * 3. Terapkan -> Deployment baru -> Jenis: Aplikasi web.
 *    Jalankan sebagai: Saya. Yang memiliki akses: Siapa saja.
 * 4. Salin URL Web App ke config.js (googleSheetsUrl) di GitHub.
 *
 * Data siswa masuk ke tab "Jawaban" dan "Ringkasan". Setiap kali siswa
 * menyelesaikan satu ronde, raport kelasnya diperbarui di file Google Sheets
 * tersendiri ("Raport Detektif Pola - Kelas 7A", dan seterusnya) di folder
 * Drive "Raport Detektif Pola". Semua file hanya bisa dibuka pemilik akun
 * (guru); siswa hanya bisa mengirim data, tidak bisa membacanya.
 *
 * Nama kelas digabung tanpa membedakan huruf besar/kecil dan spasi berlebih
 * ("7a", "7A", " 7A " menjadi "7A"). Nama siswa dicatat apa adanya.
 */

var SHEET_JAWABAN = 'Jawaban';
var SHEET_RINGKASAN = 'Ringkasan';
var SHEET_DAFTAR = 'Daftar Raport';
var FOLDER_RAPORT = 'Raport Detektif Pola';

var HEADER_JAWABAN = ['Waktu', 'Nama', 'Kelas', 'Tingkat', 'Ronde', 'No', 'Jenis Pola', 'Soal', 'Jawaban Siswa', 'Kunci', 'Hasil'];
var HEADER_RINGKASAN = ['Mulai', 'Selesai', 'Nama', 'Kelas', 'Tingkat', 'Benar', 'Jumlah Soal', 'Nilai', 'Bintang', 'Ronde'];
var HEADER_DAFTAR = ['Kelas', 'Jumlah Siswa', 'Diperbarui', 'File Raport'];

var LEVELS = ['Sangat Mudah', 'Mudah', 'Sedang', 'Sulit', 'Sangat Sulit'];
var LULUS = 0.85; // benar minimal 85% untuk lulus satu tingkat

// ---------- Penerima data dari game ----------

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var d = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var nama = rapikanNama_(d.nama);
    var kelas = rapikanKelas_(d.kelas);
    if (d.type === 'jawaban') {
      sheet_(ss, SHEET_JAWABAN, HEADER_JAWABAN).appendRow([
        d.waktu, nama, kelas, d.tingkat, d.ronde, d.no, d.jenis, d.soal, d.jawaban, d.kunci, d.hasil,
      ].map(clean_));
    } else if (d.type === 'ringkasan') {
      sheet_(ss, SHEET_RINGKASAN, HEADER_RINGKASAN).appendRow([
        d.mulai, d.selesai, nama, kelas, d.tingkat, d.benar, d.total, d.nilai, d.bintang, d.ronde,
      ].map(clean_));
      perbaruiRaportKelas_(kelas);
    }
    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err);
  } finally {
    lock.releaseLock();
  }
}

// Hanya menampilkan status; tidak pernah mengembalikan data siswa.
function doGet() {
  return ContentService.createTextOutput('Detektif Pola: penerima riwayat aktif.');
}

// Menu di Google Sheets untuk memperbarui semua raport secara manual.
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Detektif Pola')
    .addItem('Perbarui semua raport', 'perbaruiSemuaRaport')
    .addToUi();
}

function perbaruiSemuaRaport() {
  var data = kumpulkanNilai_(null);
  Object.keys(data).sort().forEach(function (kelas) {
    tulisRaport_(kelas, data[kelas]);
  });
}

function perbaruiRaportKelas_(kelas) {
  var data = kumpulkanNilai_(kelas);
  if (data[kelas]) tulisRaport_(kelas, data[kelas]);
}

// ---------- Perhitungan nilai ----------

function rapikanNama_(s) {
  return String(s === null || s === undefined ? '' : s).replace(/\s+/g, ' ').trim();
}

function rapikanKelas_(s) {
  return rapikanNama_(s).toUpperCase();
}

function predikat_(n) {
  if (n > 90) return 'A';
  if (n > 80) return 'B';
  if (n > 70) return 'C';
  return 'D';
}

var KET_PREDIKAT = { A: 'Sangat baik', B: 'Baik', C: 'Cukup', D: 'Perlu bimbingan' };
var WARNA_PREDIKAT = { A: '#C8EBD9', B: '#D6E2FF', C: '#FFF1BF', D: '#F9D4D4' };

// Mengelompokkan isi tab Ringkasan: { kelas: { nama: { nama, tingkat: [...] } } }
function kumpulkanNilai_(kelasFilter) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_RINGKASAN);
  var out = {};
  if (!sh || sh.getLastRow() < 2) return out;
  var rows = sh.getRange(2, 1, sh.getLastRow() - 1, HEADER_RINGKASAN.length).getValues();
  rows.forEach(function (r) {
    var nama = rapikanNama_(r[2]);
    var kelas = rapikanKelas_(r[3]);
    var m = String(r[4]).match(/Tingkat\s*(\d+)/i);
    var benar = Number(r[5]);
    var total = Number(r[6]);
    if (!nama || !kelas || !m || !total) return;
    if (kelasFilter && kelas !== kelasFilter) return;
    var lv = Number(m[1]) - 1;
    if (lv < 0 || lv >= LEVELS.length) return;
    out[kelas] = out[kelas] || {};
    var s = out[kelas][nama];
    if (!s) {
      s = out[kelas][nama] = { nama: nama, tingkat: LEVELS.map(function () { return { coba: 0, benar: 0, total: 0 }; }) };
    }
    var t = s.tingkat[lv];
    t.coba++;
    if (!t.total || benar / total > t.benar / t.total) {
      t.benar = benar;
      t.total = total;
    }
  });
  return out;
}

function hitungRaport_(siswa) {
  var list = Object.keys(siswa).map(function (k) {
    var s = siswa[k];
    var nilai = s.tingkat.map(function (t) { return t.coba ? Math.round((t.benar / t.total) * 100) : null; });
    var lulus = s.tingkat.filter(function (t) { return t.coba && t.benar >= Math.ceil(t.total * LULUS - 1e-9); }).length;
    var akhir = Math.round(nilai.reduce(function (a, n) { return a + (n || 0); }, 0) / LEVELS.length);
    var dikerjakan = s.tingkat.filter(function (t) { return t.coba; }).length;
    return { nama: s.nama, nilai: nilai, lulus: lulus, akhir: akhir, predikat: predikat_(akhir), dikerjakan: dikerjakan };
  });
  list.sort(function (a, b) {
    return b.akhir - a.akhir || b.lulus - a.lulus || a.nama.localeCompare(b.nama, 'id');
  });
  var rank = 0;
  list.forEach(function (r, i) {
    if (i === 0 || r.akhir !== list[i - 1].akhir || r.lulus !== list[i - 1].lulus) rank = i + 1;
    r.peringkat = rank;
  });
  return list;
}

// ---------- Penulisan file raport per kelas ----------

function tulisRaport_(kelas, siswa) {
  var list = hitungRaport_(siswa);
  var file = fileRaport_(kelas);
  var sh = file.getSheets()[0];
  sh.setName('Raport');
  sh.clear();

  var waktu = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'd MMM yyyy, HH:mm');
  sh.getRange(1, 1).setValue('Raport Detektif Pola - Kelas ' + kelas).setFontSize(16).setFontWeight('bold');
  sh.getRange(2, 1).setValue('Diperbarui ' + waktu + ' · ' + list.length + ' siswa');
  sh.getRange(3, 1).setValue(
    'Nilai tiap tingkat = ronde terbaik. Nilai akhir = rata-rata 5 tingkat (belum dikerjakan = 0). ' +
    'Predikat: A di atas 90, B di atas 80, C di atas 70, D 70 ke bawah. Lulus tingkat jika benar minimal 85%.'
  ).setFontColor('#5A6A85');

  var header = ['Peringkat', 'Nama', 'Tingkat 1', 'Tingkat 2', 'Tingkat 3', 'Tingkat 4', 'Tingkat 5',
    'Tingkat Lulus', 'Nilai Akhir', 'Predikat', 'Keterangan'];
  sh.getRange(5, 1, 1, header.length).setValues([header])
    .setFontWeight('bold').setBackground('#17233A').setFontColor('#FFFFFF');

  if (list.length) {
    var values = list.map(function (r) {
      return [r.peringkat, r.nama].concat(r.nilai.map(function (n) { return n === null ? '–' : n; }))
        .concat([r.lulus + ' dari ' + LEVELS.length, r.akhir, r.predikat,
          KET_PREDIKAT[r.predikat] + (r.dikerjakan < LEVELS.length ? ' (baru ' + r.dikerjakan + ' dari 5 tingkat)' : '')]);
    });
    sh.getRange(6, 1, values.length, header.length).setValues(values.map(function (row) { return row.map(clean_); }));
    sh.getRange(6, 10, values.length, 1).setBackgrounds(list.map(function (r) { return [WARNA_PREDIKAT[r.predikat]]; }))
      .setFontWeight('bold').setHorizontalAlignment('center');
    sh.getRange(6, 3, values.length, 7).setHorizontalAlignment('center');
  }
  sh.setFrozenRows(5);
  sh.autoResizeColumns(1, header.length);

  catatDaftar_(kelas, list.length, waktu, file.getUrl());
}

// Satu file Google Sheets untuk setiap kelas, disimpan di folder Drive guru.
function fileRaport_(kelas) {
  var props = PropertiesService.getScriptProperties();
  var key = 'raport:' + kelas;
  var id = props.getProperty(key);
  if (id) {
    try {
      var f = DriveApp.getFileById(id);
      if (!f.isTrashed()) return SpreadsheetApp.openById(id);
    } catch (err) {
      // File terhapus atau tidak bisa dibuka: buat yang baru.
    }
  }
  var file = SpreadsheetApp.create('Raport Detektif Pola - Kelas ' + kelas);
  DriveApp.getFileById(file.getId()).moveTo(folderRaport_());
  props.setProperty(key, file.getId());
  return file;
}

function folderRaport_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('folder');
  if (id) {
    try {
      var f = DriveApp.getFolderById(id);
      if (!f.isTrashed()) return f;
    } catch (err) {
      // Folder hilang: buat ulang.
    }
  }
  var folder = DriveApp.createFolder(FOLDER_RAPORT);
  props.setProperty('folder', folder.getId());
  return folder;
}

// Tab "Daftar Raport" di spreadsheet utama berisi tautan ke setiap file kelas.
function catatDaftar_(kelas, jumlah, waktu, url) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = sheet_(ss, SHEET_DAFTAR, HEADER_DAFTAR);
  var row = [kelas, jumlah, waktu, '=HYPERLINK("' + url + '","Buka raport ' + kelas.replace(/"/g, '') + '")'];
  var last = sh.getLastRow();
  if (last >= 2) {
    var kelasList = sh.getRange(2, 1, last - 1, 1).getValues();
    for (var i = 0; i < kelasList.length; i++) {
      if (rapikanKelas_(kelasList[i][0]) === kelas) {
        sh.getRange(i + 2, 1, 1, row.length).setValues([row]);
        return;
      }
    }
  }
  sh.appendRow(row);
}

// ---------- Utilitas ----------

function sheet_(ss, name, header) {
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(header);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, header.length).setFontWeight('bold');
  }
  return sh;
}

// Cegah teks dari siswa dibaca sebagai rumus spreadsheet.
function clean_(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string' && /^[=+\-@]/.test(v)) return "'" + v;
  return v;
}
