import { Order, FAQItem, Testimonial, Sparepart } from './types';

export const SHOP_INFO = {
  name: 'ServisPro',
  tagline: 'Solusi Cepat, Transparan, & Bergaransi untuk Gadget Anda',
  address: 'Jl. Tekno Raya No. 45, Kebayoran Baru, Jakarta Selatan',
  whatsapp: '6281234567890',
  whatsappDisplay: '+62 812-3456-7890',
  email: 'support@servispro.id',
  hours: 'Senin - Sabtu: 09.00 - 18.00 WIB',
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'SP-2026-61842',
    customerName: 'Budi Santoso',
    customerWhatsapp: '081234567811',
    customerEmail: 'budi.santoso@example.com',
    category: 'HP',
    brandType: 'Samsung Galaxy S23 Ultra',
    complaint: 'Layar berkedip hijau setelah jatuh ringan. Touchscreen masih responsif tapi sedikit bergaris putih di bagian bawah.',
    method: 'Antar ke Toko',
    status: 'Sedang Diperbaiki',
    technicianNotes: 'Perlu diganti modul LCD assembly original Samsung. Suku cadang sudah dipesan dan sedang dalam proses pemasangan presisi.',
    repairCost: 1850000,
    createdAt: '2026-06-01 10:15',
  },
  {
    id: 'SP-2026-42913',
    customerName: 'Siti Rahma',
    customerWhatsapp: '085788992211',
    customerEmail: 'siti.rahma@example.com',
    category: 'Laptop',
    brandType: 'Asus ROG Strix G15',
    complaint: 'Suhu sangat panas (overheating) saat bermain game berat seperti Cyberpunk. Kipas terdengar sangat bising dan kadang mati mendadak.',
    method: 'Antar ke Toko',
    status: 'Selesai Siap Diambil',
    technicianNotes: 'Dilakukan repaste menggunakan thermal paste premium liquid metal, serta pembersihan debu tebal pada heatsink dan dual fan. Stress test suhu turun dari 95°C ke 78°C.',
    repairCost: 450000,
    createdAt: '2026-06-02 09:30',
  },
  {
    id: 'SP-2026-17382',
    customerName: 'Aditya Pratama',
    customerWhatsapp: '089911223344',
    customerEmail: 'aditya.pratama@example.com',
    category: 'Konsol Game',
    brandType: 'PlayStation 5 Disc Edition',
    complaint: 'Drive optik tidak mau menarik piringan kaset (CD). Ada bunyi klik berulang ketika mencoba memasukkan kaset.',
    method: 'Antar ke Toko',
    status: 'Menunggu Antrean',
    technicianNotes: 'Menunggu antrean untuk dibongkar casing luar guna pengecekan mekanisme pengait internal optical drive.',
    repairCost: 0,
    createdAt: '2026-06-03 14:20',
  },
  {
    id: 'SP-2026-88541',
    customerName: 'Rina Wijaya',
    customerWhatsapp: '087812123434',
    customerEmail: 'rina.wijaya@example.com',
    category: 'TV',
    brandType: 'Xiaomi TV A2 43 Inch',
    complaint: 'Suara siaran TV terdengar jernih, namun layar gelap gulita (tidak ada gambar sama sekali). Backlight mati.',
    method: 'Panggil Teknisi',
    status: 'Sedang Dicek',
    technicianNotes: 'Teknisi sedang melakukan investigasi apakah kerusakan terjadi pada papan mainboard backlight driver atau langsung pada rangkaian LED strip di dalam panel.',
    repairCost: 0,
    createdAt: '2026-06-03 16:45',
  },
  {
    id: 'SP-2026-31950',
    customerName: 'Dian Kusuma',
    customerWhatsapp: '081399008877',
    customerEmail: 'dian.kusuma@example.com',
    category: 'HP',
    brandType: 'Apple iPhone 13 Pro',
    complaint: 'Kamera belakang bergetar hebat saat membuka aplikasi kamera bawaan maupun Instagram. Fokus tidak bisa mengunci.',
    method: 'Panggil Teknisi',
    status: 'Gagal Diperbaiki',
    technicianNotes: 'Sensor stabilizer OIS fisik pada kamera utama mengalami kerusakan mekanis parah akibat benturan keras. Pemilik memutuskan untuk tidak mengganti modul kamera karena biaya melebihi anggaran.',
    repairCost: 150000,
    createdAt: '2026-05-31 11:00',
  },
];

export const ADVANTAGES = [
  {
    title: 'Garansi Resmi Toko',
    description: 'Kami memberikan garansi tertulis hingga 90 hari untuk setiap penggantian suku cadang.',
    icon: 'ShieldCheck',
  },
  {
    title: 'Teknisi Sertifikasi',
    description: 'Gadget Anda ditangani langsung oleh teknisi berpengalaman dan bersertifikasi di bidang mikro-soldering.',
    icon: 'UserCheck',
  },
  {
    title: 'Transparan & Jujur',
    description: 'Biaya dihitung transparan di awal, rekam proses servis, dan tidak ada biaya tersembunyi.',
    icon: 'Eye',
  },
  {
    title: 'Layanan Jemput-Antar',
    description: 'Malas keluar rumah? Pilih metode Panggil Teknisi untuk servis langsung di tempat Anda.',
    icon: 'Truck',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Hendra Wijaya',
    role: 'Karyawan Swasta',
    comment: 'Puas banget servis Laptop Asus di sini. Penjelasan kerusakannya detail, pengerjaannya cepat cuma 1 hari, dan harganya sangat masuk akal dibanding service center resmi.',
    rating: 5,
    date: '3 hari yang lalu',
  },
  {
    name: 'Siska Amelia',
    role: 'Mahasiswi UI',
    comment: 'Respons admin sangat ramah lewat WhatsApp. Nyobain servis iPhone ganti baterai, teknisinya datang ke kosan, pengerjaan rapi dan dikasih garansi 3 bulan. Recommended!',
    rating: 5,
    date: '1 minggu yang lalu',
  },
  {
    name: 'Rahmat Hidayat',
    role: 'Gamer & Streamer',
    comment: 'PS5 stick analog drift langsung sembuh dalam beberapa jam. Teknisi benar-benar ngerti sirkuit kelistrikan dan sparepart yang diganti asli bagus. Mantap!',
    rating: 5,
    date: '2 minggu yang lalu',
  },
];

export const FAQS: FAQItem[] = [
  {
    question: 'Berapa lama waktu pengerjaan servis?',
    answer: 'Waktu pengerjaan bergantung pada jenis kerusakan. Untuk kerusakan ringan seperti ganti baterai atau layar HP berkisar antara 1 - 3 jam. Sedangkan untuk kerusakan berat pada motherboard, laptop mati total, atau konsol game memerlukan waktu analisa intensif sekitar 1 - 3 hari kerja.',
  },
  {
    question: 'Apakah ada biaya pengecekan jika barang tidak jadi diperbaiki?',
    answer: 'Di ServisPro, kami menerapkan tarif cek senilai Rp 50.000 untuk HP/Konsol dan Rp 100.000 untuk Laptop jika barang akhirnya batal diservis setelah didiagnosa. Namun, jika Anda menyetujui rekomendasi perbaikan kami, biaya cek tersebut GRATIS (hanya membayar biaya servis + sparepart).',
  },
  {
    question: 'Bagaimana sistem klaim garansi servis?',
    answer: 'Cukup bawa Nota Servis fisik atau tunjukkan ID Order digital Anda ke toko kami. Garansi berlaku selama 45 - 90 hari (tergantung suku cadang) terhitung sejak tanggal barang diambil. Garansi mencakup kerusakan pada sparepart yang sama yang kami ganti sebelumnya, selama tidak ada kerusakan fisik tambahan/human error seperti jatuh atau terkena air.',
  },
  {
    question: 'Bagaimana metode Panggil Teknisi bekerja?',
    answer: 'Setelah Anda mengisi form booking dengan memilih metode "Panggil Teknisi", admin kami akan memverifikasi alamat dan jadwal kedatangan via WhatsApp. Teknisi bersertifikasi kami akan datang ke alamat Anda berbekal alat diagnosa lengkap untuk menyelesaikan pengerjaan langsung di tempat Anda (khusus untuk kerusakan yang memungkinkan dikerjakan secara mobile).',
  },
];

export const INITIAL_SPAREPARTS: Sparepart[] = [
  { id: 'SPART-001', name: 'LCD Screen iPhone 13 Pro', price: 1200000, stock: 5 },
  { id: 'SPART-002', name: 'Battery Samsung S23 Ultra', price: 350000, stock: 12 },
  { id: 'SPART-003', name: 'Liquid Metal Thermal Paste', price: 150000, stock: 25 },
  { id: 'SPART-004', name: 'Joystick Analog PS5', price: 90000, stock: 18 },
  { id: 'SPART-005', name: 'LED Backlight Strip TV 43"', price: 250000, stock: 8 },
  { id: 'SPART-006', name: 'Universal IC Power Chip', price: 75000, stock: 30 }
];
