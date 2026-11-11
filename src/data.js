// Tanggal PO ditutup (ubah sesuai kebutuhan)
export const PO_END = new Date('2026-11-25T23:59:59+07:00')

export const GROUPS = ['Semua', 'NOVA7', 'LUNAR GIRLS', 'STELLA-9']

const g = { NOVA7: ['#ff2f9c', '#2a0a2e'], 'LUNAR GIRLS': ['#2b2b34', '#0e0d14'], 'STELLA-9': ['#6a4fd6', '#8aa2e6'] }
const mk = (id, name, group, type, price, stock) =>
  ({ id, name, group, type, price, stock, colors: g[group] })

export const CARDS = [
  mk(1, 'KAI-R', 'NOVA7', 'Fotokard Album Ver. A', 18000, 12),
  mk(2, 'JIHO', 'NOVA7', 'Fotokard Album Ver. A', 18000, 6),
  mk(3, 'SEN', 'NOVA7', 'Lucky Draw Edisi Silver', 45000, 4),
  mk(4, 'REI', 'NOVA7', 'Fotokard Album Ver. B', 18000, 0),
  mk(5, 'YUNA', 'LUNAR GIRLS', 'Fotokard Album Ver. A', 20000, 10),
  mk(6, 'HANA', 'LUNAR GIRLS', 'Pre-order Benefit Pink', 38000, 7),
  mk(7, 'SOO', 'LUNAR GIRLS', 'Fotokard Album Ver. B', 20000, 5),
  mk(8, 'EUN', 'LUNAR GIRLS', 'Lucky Draw Edisi Silver', 48000, 2),
  mk(9, 'MIRA', 'STELLA-9', 'Fotokard Album Ver. A', 17000, 15),
  mk(10, 'DAMI', 'STELLA-9', 'Fotokard Album Ver. B', 17000, 7),
  mk(11, 'RIN', 'STELLA-9', 'Pre-order Benefit Pink', 35000, 4),
  mk(12, 'NARI', 'STELLA-9', 'Lucky Draw Edisi Silver', 42000, 1),
]

export const HERO_CARDS = [
  { name: 'YUNA', group: 'LUNAR GIRLS', back: 'Yuna · Lunar Girls', no: '07', tone: 'dusk', rot: -9, x: -92, y: -8 },
  { name: 'KAI-R', group: 'NOVA7', back: 'Kai-R · Nova7', no: '01', tone: 'aurora', rot: 0, x: 0, y: 0 },
  { name: 'MIRA', group: 'STELLA-9', back: 'Mira · Stella-9', no: '09', tone: 'mist', rot: 9, x: 92, y: 44 },
]

export const STEPS = [
  ['Pilih kartu', 'Tambahkan photocard ke keranjang sebelum slot habis.'],
  ['Isi data', 'Masukkan nama, nomor WhatsApp, dan alamat pengiriman.'],
  ['Bayar DP 50%', 'Transfer sesuai kode order, lalu kirim bukti ke WhatsApp admin.'],
  ['Tunggu & lunasi', 'Pelunasan saat barang tiba. Estimasi 3–4 minggu setelah PO ditutup.'],
]

export const FAQ = [
  ['Apakah photocard dijamin official?', 'Ya, semua kartu berasal dari album dan merchandise resmi. Kami tidak menjual fotokopi atau unofficial.'],
  ['Bisa batal setelah bayar DP?', 'DP tidak dapat dikembalikan setelah PO ditutup, karena barang sudah dipesan ke supplier.'],
  ['Berapa ongkir lokal?', 'Flat Rp15.000 se-Indonesia, gratis untuk belanja di atas Rp200.000.'],
  ['Bagaimana jika kartu rusak saat tiba?', 'Kirim video unboxing maksimal 2×24 jam. Kami bantu klaim atau ganti.'],
]
