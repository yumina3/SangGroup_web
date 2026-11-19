/**
 * Data demo untuk halaman Analitik Penjualan dan Kinerja Agen.
 *
 * Angka di sini adalah snapshot demo yang saling konsisten antar kedua
 * halaman: total pengajuan, deal, nilai penjualan, komisi, dan seri bulanan
 * memakai sumber yang sama. Saat database tersambung, fungsi di bagian bawah
 * tinggal diganti query Prisma/agregasi dengan bentuk data yang sama sehingga
 * komponen tidak perlu diubah.
 *
 * Semua nilai yang dikirim ke client harus serializable (string/angka/array/
 * objek biasa). Ikon disimpan sebagai kunci string, bukan komponen React.
 */

export const ANALYTICS_PERIODS = [
  { value: "month", label: "Bulan Ini (Okt 2026)" },
  { value: "quarter", label: "3 Bulan Terakhir" },
  { value: "year", label: "Tahun Ini (2026)" },
];

const PERIOD_META = {
  month: {
    quarterLabel: "Kuartal IV - 2026",
    chartCaption: "Tren volume pengajuan 6 bulan terakhir (Mei - Okt 2026)",
    trendCaption: "6 bulan terakhir (Mei - Okt 2026)",
  },
  quarter: {
    quarterLabel: "Kuartal IV - 2026",
    chartCaption: "Tren volume pengajuan 3 bulan terakhir (Agu - Okt 2026)",
    trendCaption: "3 bulan terakhir (Agu - Okt 2026)",
  },
  year: {
    quarterLabel: "Tahun 2026",
    chartCaption: "Tren volume pengajuan Januari - Oktober 2026",
    trendCaption: "Januari - Oktober 2026",
  },
};

const SALES_KPIS = {
  month: [
    {
      key: "inquiries",
      label: "Total Pengajuan",
      value: "14",
      unit: "pengajuan minat",
      note: "+27% vs bulan lalu",
      noteTone: "positive",
      noteIcon: "trendUp",
      icon: "inbox",
    },
    {
      key: "deals",
      label: "Deal",
      value: "2",
      unit: "transaksi closing",
      note: "Target Q4 tercapai 100%",
      noteTone: "gold",
      noteIcon: "target",
      icon: "checkCircle",
    },
    {
      key: "value",
      label: "Nilai Penjualan",
      value: "Rp 1,035 M",
      caption: "total nilai transaksi",
      note: "+12% pertumbuhan nilai",
      noteTone: "positive",
      noteIcon: "trendUp",
      icon: "wallet",
    },
    {
      key: "closing",
      label: "Rata-rata Waktu Closing",
      value: "12",
      unit: "hari dari pengajuan awal",
      note: "4 hari lebih cepat dari standar",
      noteTone: "info",
      noteIcon: "clock",
      icon: "clock",
    },
  ],
  quarter: [
    {
      key: "inquiries",
      label: "Total Pengajuan",
      value: "35",
      unit: "pengajuan minat",
      note: "+24% vs kuartal lalu",
      noteTone: "positive",
      noteIcon: "trendUp",
      icon: "inbox",
    },
    {
      key: "deals",
      label: "Deal",
      value: "5",
      unit: "transaksi closing",
      note: "5 dari 8 target kuartal",
      noteTone: "gold",
      noteIcon: "target",
      icon: "checkCircle",
    },
    {
      key: "value",
      label: "Nilai Penjualan",
      value: "Rp 2,58 M",
      caption: "total nilai transaksi",
      note: "+16% pertumbuhan nilai",
      noteTone: "positive",
      noteIcon: "trendUp",
      icon: "wallet",
    },
    {
      key: "closing",
      label: "Rata-rata Waktu Closing",
      value: "13",
      unit: "hari dari pengajuan awal",
      note: "3 hari lebih cepat dari standar",
      noteTone: "info",
      noteIcon: "clock",
      icon: "clock",
    },
  ],
  year: [
    {
      key: "inquiries",
      label: "Total Pengajuan",
      value: "72",
      unit: "pengajuan minat",
      note: "+31% vs tahun lalu",
      noteTone: "positive",
      noteIcon: "trendUp",
      icon: "inbox",
    },
    {
      key: "deals",
      label: "Deal",
      value: "11",
      unit: "transaksi closing",
      note: "11 dari 24 target tahunan",
      noteTone: "gold",
      noteIcon: "target",
      icon: "checkCircle",
    },
    {
      key: "value",
      label: "Nilai Penjualan",
      value: "Rp 5,94 M",
      caption: "total nilai transaksi",
      note: "+21% pertumbuhan nilai",
      noteTone: "positive",
      noteIcon: "trendUp",
      icon: "wallet",
    },
    {
      key: "closing",
      label: "Rata-rata Waktu Closing",
      value: "15",
      unit: "hari dari pengajuan awal",
      note: "1 hari lebih cepat dari standar",
      noteTone: "info",
      noteIcon: "clock",
      icon: "clock",
    },
  ],
};

const SALES_MONTHLY = {
  month: {
    labels: ["Mei", "Jun", "Jul", "Agu", "Sep", "Okt"],
    values: [6, 8, 7, 10, 11, 14],
    peak: "Puncak: 14 Pengajuan di Oktober",
    insight: "Minat beli terus bertumbuh",
    conversionNote: "Tingkat konversi rata-rata 14,3% per kuartal",
  },
  quarter: {
    labels: ["Agu", "Sep", "Okt"],
    values: [10, 11, 14],
    peak: "Puncak: 14 Pengajuan di Oktober",
    insight: "Volume pengajuan naik 40% dalam 3 bulan",
    conversionNote: "Tingkat konversi rata-rata 15,1% per kuartal",
  },
  year: {
    labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt"],
    values: [3, 4, 5, 4, 6, 8, 7, 10, 11, 14],
    peak: "Puncak: 14 Pengajuan di Oktober",
    insight: "Tren pengajuan meningkat sejak awal tahun",
    conversionNote: "Tingkat konversi rata-rata 12,8% per kuartal",
  },
};

const SALES_CLUSTERS = {
  month: {
    total: 14,
    items: [
      {
        name: "Sang Dipa Residence",
        area: "Candisari Hills, Semarang Selatan",
        count: 8,
        percent: 57,
        tone: "forest",
        best: true,
      },
      {
        name: "Sang Wira Residence",
        area: "Tembalang City View",
        count: 4,
        percent: 29,
        tone: "gold",
        best: false,
      },
      {
        name: "Sang Naya Residence",
        area: "Sambiroto Park Avenue",
        count: 2,
        percent: 14,
        tone: "medium",
        best: false,
      },
    ],
    note: "Candisari menyumbang lebih dari separuh total atensi investor.",
  },
  quarter: {
    total: 35,
    items: [
      {
        name: "Sang Dipa Residence",
        area: "Candisari Hills, Semarang Selatan",
        count: 19,
        percent: 54,
        tone: "forest",
        best: true,
      },
      {
        name: "Sang Wira Residence",
        area: "Tembalang City View",
        count: 10,
        percent: 29,
        tone: "gold",
        best: false,
      },
      {
        name: "Sang Naya Residence",
        area: "Sambiroto Park Avenue",
        count: 6,
        percent: 17,
        tone: "medium",
        best: false,
      },
    ],
    note: "Distribusi minat stabil; Candisari tetap menjadi klaster utama.",
  },
  year: {
    total: 72,
    items: [
      {
        name: "Sang Dipa Residence",
        area: "Candisari Hills, Semarang Selatan",
        count: 39,
        percent: 54,
        tone: "forest",
        best: true,
      },
      {
        name: "Sang Wira Residence",
        area: "Tembalang City View",
        count: 20,
        percent: 28,
        tone: "gold",
        best: false,
      },
      {
        name: "Sang Naya Residence",
        area: "Sambiroto Park Avenue",
        count: 13,
        percent: 18,
        tone: "medium",
        best: false,
      },
    ],
    note: "Pola minat tahunan konsisten: Candisari memimpin sepanjang periode.",
  },
};

/**
 * Tujuh properti teratas. Jumlah pengajuan per properti sengaja dijumlahkan
 * agar sama dengan total pengajuan dan distribusi klaster pada tiap periode.
 */
const TOP_PROPERTIES = [
  {
    id: "prp-201",
    title: "Tipe Saura (Villa 2 Lantai)",
    unit: "Kavling B-14",
    area: "LB 140 m² / LT 180 m²",
    cluster: "Sang Dipa",
    location: "Candisari",
    statusLabel: "Tersedia",
    statusTone: "success",
    counts: {
      month: { inquiries: 5, visits: 4 },
      quarter: { inquiries: 13, visits: 10 },
      year: { inquiries: 27, visits: 21 },
    },
  },
  {
    id: "prp-202",
    title: "Tipe Kalandra (Modern Tropis)",
    unit: "Kavling C-08",
    area: "LB 115 m² / LT 150 m²",
    cluster: "Sang Wira",
    location: "Tembalang",
    statusLabel: "Dipesan",
    statusTone: "gold",
    counts: {
      month: { inquiries: 3, visits: 2 },
      quarter: { inquiries: 8, visits: 6 },
      year: { inquiries: 16, visits: 13 },
    },
  },
  {
    id: "prp-203",
    title: "Tipe Naraya (Signature Villa)",
    unit: "Kavling A-01",
    area: "LB 220 m² / LT 300 m²",
    cluster: "Sang Dipa",
    location: "Candisari",
    statusLabel: "Tersedia",
    statusTone: "success",
    counts: {
      month: { inquiries: 2, visits: 2 },
      quarter: { inquiries: 5, visits: 4 },
      year: { inquiries: 8, visits: 7 },
    },
  },
  {
    id: "prp-204",
    title: "Tipe Saura Hook",
    unit: "Kavling A-14",
    area: "LB 155 m² / LT 225 m²",
    cluster: "Sang Dipa",
    location: "Candisari",
    statusLabel: "Tersedia",
    statusTone: "success",
    counts: {
      month: { inquiries: 1, visits: 1 },
      quarter: { inquiries: 1, visits: 2 },
      year: { inquiries: 4, visits: 4 },
    },
  },
  {
    id: "prp-205",
    title: "Tipe Kalandra Hook",
    unit: "Kavling C-12",
    area: "LB 115 m² / LT 150 m²",
    cluster: "Sang Wira",
    location: "Tembalang",
    statusLabel: "Tersedia",
    statusTone: "success",
    counts: {
      month: { inquiries: 1, visits: 1 },
      quarter: { inquiries: 2, visits: 1 },
      year: { inquiries: 4, visits: 3 },
    },
  },
  {
    id: "prp-206",
    title: "Tipe Grand Candisari",
    unit: "Kavling B-02",
    area: "LB 165 m² / LT 210 m²",
    cluster: "Sang Naya",
    location: "Sambiroto",
    statusLabel: "Negosiasi",
    statusTone: "warning",
    counts: {
      month: { inquiries: 1, visits: 1 },
      quarter: { inquiries: 4, visits: 2 },
      year: { inquiries: 9, visits: 5 },
    },
  },
  {
    id: "prp-207",
    title: "Tipe Grand Sambiroto",
    unit: "Kavling D-03",
    area: "LB 150 m² / LT 200 m²",
    cluster: "Sang Naya",
    location: "Sambiroto",
    statusLabel: "Tersedia",
    statusTone: "success",
    counts: {
      month: { inquiries: 1, visits: 0 },
      quarter: { inquiries: 2, visits: 1 },
      year: { inquiries: 4, visits: 2 },
    },
  },
];

const PERFORMANCE_TARGETS = {
  month: {
    label: "Target Q4 — Bulan Oktober",
    quarterLabel: "Kuartal Berjalan",
    daysLeft: "Sisa 3 Hari Lagi",
    targetDeals: 3,
    achievedDeals: 2,
    targetValue: 1_500_000_000,
    achievedValue: 1_035_000_000,
    commission: 31_050_000,
    note: "Tinggal 1 deal lagi untuk mencapai insentif bonus tier Platinum bulan ini.",
  },
  quarter: {
    label: "Target Q4 — Kuartal IV",
    quarterLabel: "Kuartal Berjalan",
    daysLeft: "Sisa 57 Hari Lagi",
    targetDeals: 8,
    achievedDeals: 5,
    targetValue: 4_500_000_000,
    achievedValue: 2_580_000_000,
    commission: 77_400_000,
    note: "Tinggal 3 deal lagi untuk mencapai target kuartal.",
  },
  year: {
    label: "Target Tahunan 2026",
    quarterLabel: "Tahun Berjalan",
    daysLeft: "Sisa 57 Hari Lagi",
    targetDeals: 24,
    achievedDeals: 11,
    targetValue: 12_000_000_000,
    achievedValue: 5_940_000_000,
    commission: 178_200_000,
    note: "Tinggal 13 deal lagi untuk mencapai target tahunan.",
  },
};

const PERFORMANCE_KPIS = {
  month: [
    {
      key: "response",
      label: "Waktu Respon Rata-rata",
      value: "2,4 jam",
      note: "45 menit lebih cepat dari rata-rata agen",
      noteTone: "positive",
      noteIcon: "trendDown",
      icon: "clock",
    },
    {
      key: "conversion",
      label: "Tingkat Konversi",
      value: "14%",
      note: "2,5% vs target performa kuartal",
      noteTone: "positive",
      noteIcon: "trendUp",
      icon: "chart",
    },
    {
      key: "visits",
      label: "Kunjungan Terlaksana",
      value: "6",
      note: "Kunjungan lapangan selesai dari 7 terjadwal",
      noteTone: "neutral",
      icon: "pin",
    },
    {
      key: "responseRate",
      label: "Pengajuan Ditanggapi",
      value: "92%",
      note: "12 dari 13 pengajuan ditindaklanjuti < 4 jam",
      noteTone: "neutral",
      icon: "checkCircle",
    },
  ],
  quarter: [
    {
      key: "response",
      label: "Waktu Respon Rata-rata",
      value: "2,7 jam",
      note: "30 menit lebih cepat dari rata-rata agen",
      noteTone: "positive",
      noteIcon: "trendDown",
      icon: "clock",
    },
    {
      key: "conversion",
      label: "Tingkat Konversi",
      value: "15%",
      note: "3,1% vs target performa kuartal",
      noteTone: "positive",
      noteIcon: "trendUp",
      icon: "chart",
    },
    {
      key: "visits",
      label: "Kunjungan Terlaksana",
      value: "18",
      note: "Kunjungan lapangan selesai dari 22 terjadwal",
      noteTone: "neutral",
      icon: "pin",
    },
    {
      key: "responseRate",
      label: "Pengajuan Ditanggapi",
      value: "90%",
      note: "31 dari 34 pengajuan ditindaklanjuti < 4 jam",
      noteTone: "neutral",
      icon: "checkCircle",
    },
  ],
  year: [
    {
      key: "response",
      label: "Waktu Respon Rata-rata",
      value: "3,1 jam",
      note: "10 menit lebih cepat dari rata-rata agen",
      noteTone: "positive",
      noteIcon: "trendDown",
      icon: "clock",
    },
    {
      key: "conversion",
      label: "Tingkat Konversi",
      value: "13%",
      note: "1,2% vs target performa kuartal",
      noteTone: "positive",
      noteIcon: "trendUp",
      icon: "chart",
    },
    {
      key: "visits",
      label: "Kunjungan Terlaksana",
      value: "52",
      note: "Kunjungan lapangan selesai dari 61 terjadwal",
      noteTone: "neutral",
      icon: "pin",
    },
    {
      key: "responseRate",
      label: "Pengajuan Ditanggapi",
      value: "88%",
      note: "63 dari 72 pengajuan ditindaklanjuti < 4 jam",
      noteTone: "neutral",
      icon: "checkCircle",
    },
  ],
};

const PERFORMANCE_TRENDS = {
  month: {
    labels: ["Mei", "Jun", "Jul", "Agu", "Sep", "Okt"],
    inquiries: [6, 8, 7, 10, 11, 14],
    deals: [1, 1, 2, 1, 2, 2],
    insight:
      "Rasio konversi pengajuan menjadi closing menunjukkan peningkatan stabil dalam 3 bulan terakhir.",
  },
  quarter: {
    labels: ["Agu", "Sep", "Okt"],
    inquiries: [10, 11, 14],
    deals: [1, 2, 2],
    insight:
      "Konversi kuartal ini naik dari 10% ke 14% seiring bertambahnya kunjungan lapangan.",
  },
  year: {
    labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt"],
    inquiries: [3, 4, 5, 4, 6, 8, 7, 10, 11, 14],
    deals: [0, 0, 1, 1, 1, 1, 1, 2, 2, 2],
    insight:
      "Tren pengajuan dan closing tumbuh stabil sepanjang tahun, dengan akselerasi pada kuartal IV.",
  },
};

const ACTIVITIES = [
  {
    id: "act-01",
    date: "28 Okt 2026, 14:00 WIB",
    title: "Survei lapangan terlaksana bersama Rani Hartono",
    location: "Candisari Heights (Unit A-04)",
    statusLabel: "Selesai",
    statusTone: "success",
    dotTone: "emerald",
  },
  {
    id: "act-02",
    date: "27 Okt 2026, 11:30 WIB",
    title: "Kirim surat penawaran & simulasi KPR BTN",
    location: "Tembalang Hillcrest (Unit B-07)",
    statusLabel: "Terkirim",
    statusTone: "neutral",
    dotTone: "slate",
  },
  {
    id: "act-03",
    date: "26 Okt 2026, 16:15 WIB",
    title: "Penandatanganan PPJB & booking fee diterima",
    location: "Candisari Heights (Unit A-04)",
    statusLabel: "Deal",
    statusTone: "gold",
    dotTone: "gold",
  },
  {
    id: "act-04",
    date: "25 Okt 2026, 10:00 WIB",
    title: "Konsultasi virtual 360 & review denah",
    location: "Sambiroto Verde (Unit C-02)",
    statusLabel: "Follow-up",
    statusTone: "warning",
    dotTone: "amber",
  },
  {
    id: "act-05",
    date: "24 Okt 2026, 15:45 WIB",
    title: "Survei lapangan klaster & clubhouse",
    location: "Tembalang Hillcrest (Unit B-12)",
    statusLabel: "Selesai",
    statusTone: "success",
    dotTone: "emerald",
  },
  {
    id: "act-06",
    date: "23 Okt 2026, 09:10 WIB",
    title: "Verifikasi berkas kelayakan finansial KPR",
    location: "Sambiroto Verde (Unit D-09)",
    statusLabel: "Validasi",
    statusTone: "neutral",
    dotTone: "slate",
  },
];

/** Data satu periode untuk halaman Analitik Penjualan. */
function buildSalesDataset(period) {
  const meta = PERIOD_META[period];
  const monthly = SALES_MONTHLY[period];
  const cluster = SALES_CLUSTERS[period];

  const properties = TOP_PROPERTIES.map((property) => {
    const counts = property.counts[period];
    return {
      id: property.id,
      title: property.title,
      unit: property.unit,
      area: property.area,
      cluster: property.cluster,
      location: property.location,
      statusLabel: property.statusLabel,
      statusTone: property.statusTone,
      inquiries: counts.inquiries,
      visits: counts.visits,
      conversion:
        counts.inquiries > 0 ? Math.round((counts.visits / counts.inquiries) * 100) : 0,
    };
  });

  return {
    key: period,
    label: ANALYTICS_PERIODS.find((option) => option.value === period)?.label ?? period,
    quarterLabel: meta.quarterLabel,
    kpis: SALES_KPIS[period],
    monthly: {
      ...monthly,
      caption: meta.chartCaption,
    },
    clusters: cluster.items,
    clusterTotal: cluster.total,
    consolidationNote: cluster.note,
    properties,
    propertiesTotal: properties.length,
    updatedLabel: "15 menit lalu",
  };
}

/** Data satu periode untuk halaman Kinerja Agen. */
function buildPerformanceDataset(period) {
  const meta = PERIOD_META[period];
  const target = PERFORMANCE_TARGETS[period];
  const trend = PERFORMANCE_TRENDS[period];

  return {
    key: period,
    label: ANALYTICS_PERIODS.find((option) => option.value === period)?.label ?? period,
    quarterLabel: meta.quarterLabel,
    target: {
      ...target,
      progress:
        target.targetDeals > 0
          ? Math.round((target.achievedDeals / target.targetDeals) * 100)
          : 0,
      valueProgress:
        target.targetValue > 0
          ? Math.round((target.achievedValue / target.targetValue) * 100)
          : 0,
      remainingDeals: Math.max(target.targetDeals - target.achievedDeals, 0),
    },
    kpis: PERFORMANCE_KPIS[period],
    trend: {
      ...trend,
      caption: meta.trendCaption,
    },
    activities: ACTIVITIES,
    activityWindowLabel: "7 Hari Terakhir",
  };
}

/** @returns {Record<string, ReturnType<typeof buildSalesDataset>>} */
export function getSalesAnalyticsDatasets() {
  return Object.fromEntries(
    ANALYTICS_PERIODS.map(({ value }) => [value, buildSalesDataset(value)]),
  );
}

/** @returns {Record<string, ReturnType<typeof buildPerformanceDataset>>} */
export function getAgentPerformanceDatasets() {
  return Object.fromEntries(
    ANALYTICS_PERIODS.map(({ value }) => [value, buildPerformanceDataset(value)]),
  );
}
