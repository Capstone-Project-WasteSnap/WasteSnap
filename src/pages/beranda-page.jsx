import {
  FaRecycle,
  FaMapMarkerAlt,
  FaNewspaper,
  FaArrowRight,
  FaThList,
} from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import Papa from "papaparse";
import "../styles/beranda.css";
import image from "../assets/image/daur-ulang.png";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Daftar lengkap provinsi untuk dropdown
const daftarProvinsi = [
  "Aceh", "Bali", "Banten", "Bengkulu", "DKI Jakarta",
  "Daerah Istimewa Yogyakarta", "Gorontalo", "Jambi", "Jawa Barat",
  "Jawa Tengah", "Jawa Timur", "Kalimantan Barat", "Kalimantan Selatan",
  "Kalimantan Tengah", "Kalimantan Timur", "Kalimantan Utara",
  "Kepulauan Bangka Belitung", "Kepulauan Riau", "Lampung", "Maluku",
  "Maluku Utara", "Nusa Tenggara Barat", "Nusa Tenggara Timur", "Papua",
  "Papua Barat", "Riau", "Sulawesi Barat", "Sulawesi Selatan",
  "Sulawesi Tengah", "Sulawesi Tenggara", "Sulawesi Utara",
  "Sumatera Barat", "Sumatera Selatan", "Sumatera Utara",
];


const BerandaPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // State untuk pilihan provinsi
  const [provinsi, setProvinsi] = useState("Aceh");

  // State untuk data chart
  const [allChartData, setAllChartData] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [isChartLoading, setIsChartLoading] = useState(true);

  // Mengambil data dari CSV saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchData = async () => {
      setIsChartLoading(true);
      try {
        const response = await fetch("/data_provinsi.csv");
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder("utf-8");
        const csv = decoder.decode(result.value);

        Papa.parse(csv, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            setAllChartData(results.data);
            setIsChartLoading(false);
          },
        });
      } catch (error) {
        console.error("Gagal mengambil atau mengurai data CSV:", error);
        setIsChartLoading(false);
      }
    };
    fetchData();
  }, []);

  // PERBAIKAN UTAMA: Logika untuk membuat 3 garis grafik
  useEffect(() => {
    if (allChartData.length === 0) return;

    // 1. Definisikan tahun yang ingin kita bandingkan
    const relevantYears = [2022, 2023, 2024];
    
    // 2. Filter semua data yang relevan (hanya provinsi terpilih & dari tahun-tahun di atas)
    const provinceData = allChartData.filter(
      (row) => row.nama_provinsi === provinsi && relevantYears.includes(row.tahun)
    );

    // 3. Buat daftar unik semua 'jenis_sampah' sebagai label sumbu X.
    // Ini memastikan semua jenis sampah dari 3 tahun ditampilkan di sumbu X.
    const labels = [...new Set(provinceData.map(d => d.jenis_sampah))].sort();

    // 4. Siapkan warna berbeda untuk setiap tahun
    const lineColors = {
      2022: 'rgba(255, 99, 132, 1)',  // Merah
      2023: 'rgba(54, 162, 235, 1)',  // Biru
      2024: 'rgba(75, 192, 192, 1)',  // Hijau/Teal
    };

    // 5. Buat dataset terpisah untuk setiap tahun
    const datasets = relevantYears.map(year => {
      // Untuk setiap label sumbu X, cari data persentasenya di tahun ini
      const dataForYear = labels.map(label => {
        const dataPoint = provinceData.find(
          d => d.tahun === year && d.jenis_sampah === label
        );
        // Jika data untuk jenis sampah ini tidak ada di tahun ini, kembalikan null
        // Chart.js akan membuat garis terputus untuk data null.
        return dataPoint ? dataPoint.persentase : null;
      });

      return {
        label: `Tahun ${year}`,
        data: dataForYear,
        borderColor: lineColors[year],
        backgroundColor: lineColors[year].replace('1)', '0.2)'), // Warna transparan untuk tooltip/area
        fill: false, // Set 'false' agar garis tidak saling menutupi
        tension: 0.1,
      };
    });
    
    // 6. Update state chart dengan format multi-garis yang baru
    setChartData({ labels, datasets });

  }, [provinsi, allChartData]); // Jalankan ulang saat provinsi atau data utama berubah

  // Handler untuk mengubah state provinsi
  const handleProvinsiChange = (event) => {
    setProvinsi(event.target.value);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Memeriksa status login...</p>
      </div>
    );
  }

  // Opsi konfigurasi chart
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        // Judul diubah agar lebih deskriptif
        text: `Komposisi Sampah di ${provinsi} tahun 2022-2024`,
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Persentase (%)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Jenis Sampah",
        },
      },
    },
  };
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Memeriksa status login...</p>
      </div>
    );
  }

  return (
    <div className="beranda-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>
            Kelola Sampah dengan <span>WasteSnap</span>
          </h1>
          <p>
            Solusi pintar untuk pemilahan sampah dan menemukan Tempat Pengolahan Sampah Reduce, Reuse, Recyle (TPS3R) terdekat
          </p>
          <div className="hero-buttons">
            {isAuthenticated ? (
              <Link to="/pindai" className="primary-button">
                Mulai Memindai <FaArrowRight />
              </Link>
            ) : (
              <Link to="/register" className="primary-button">
                Daftar Sekarang
              </Link>
            )}
          </div>
        </div>
        <div className="hero-image">
          <img src={image} alt="WasteSnap" />
        </div>
      </section>

      {/* Layout Section for Chart and Form */}
      <section className="chart-and-form-section">
        <div className="chart-container">
          <h2>Grafik Komposisi Sampah</h2>
          {isChartLoading ? (
            <p>Memuat data chart...</p>
          ) : // Pengecekan yang lebih baik untuk data multi-garis
            chartData.datasets.length > 0 && chartData.datasets.some(ds => ds.data.some(d => d !== null)) ? (
            <div style={{ position: "relative", height: "300px" }}>
              <Line data={chartData} options={options} />
            </div>
          ) : (
            <p>Data untuk {provinsi} pada tahun 2022-2024 tidak ditemukan.</p>
          )}
        </div>

        <div className="form-container">
          <h2>Pilih Lokasi</h2>
          <div className="form-group">
            <label htmlFor="provinsi">Provinsi</label>
            <div className="select-wrapper">
              <select id="provinsi" value={provinsi} onChange={handleProvinsiChange}>
                {daftarProvinsi.map((namaProv) => (
                  <option key={namaProv} value={namaProv}>
                    {namaProv}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Fitur Section */}
      <section className="features-section">
        <h2 className="judul">Fitur Unggulan</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FaRecycle />
            </div>
            <h3>Pemilahan Sampah</h3>
            <p>Ketahui jenis sampah Anda melalui pemindaian cerdas</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaMapMarkerAlt />
            </div>
            <h3>Lokasi TPS3R</h3>
            <p>Temukan tempat pembuangan sampah terdekat di sekitar Anda</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaNewspaper />
            </div>
            <h3>Informasi Terkini</h3>
            <p>Update terbaru seputar pengelolaan sampah</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>Cara Kerja WasteSnap</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Pindai Sampah</h3>
              <p>Gunakan kamera untuk memindai jenis sampah Anda</p>
              {isAuthenticated && (
                <Link to="/pindai" className="step-button">
                  Coba Sekarang
                </Link>
              )}
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Dapatkan Informasi</h3>
              <p>Sistem akan mengenali jenis sampah dan cara pembuangannya</p>
              {isAuthenticated && (
                <Link to="/informasi" className="step-button">
                  Coba Sekarang
                </Link>
              )}
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Temukan TPS3R</h3>
              <p>Lihat lokasi pembuangan terdekat berdasarkan jenis sampah</p>
              {isAuthenticated && (
                <Link to="/temukan-tps3r" className="step-button">
                  Coba Sekarang
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {isAuthenticated ? (
        <section className="cta-section">
          <div className="cta-content">
            <h2>Temukan Lebih Banyak Fitur</h2>
            <p>
              Temukan beragam fitur unggulan WasteSnap untuk pengelolaan sampah
              yang lebih cerdas, cepat, dan berkelanjutan. Dengan mengelola
              limbah secara efisien
            </p>
          </div>
        </section>
      ) : (
        <section className="cta-section">
          <div className="cta-content">
            <h2>Siap Mengelola Sampah dengan Lebih Baik?</h2>
            <p>
              Bergabunglah dengan WasteSnap sekarang dan mulai berkontribusi
              untuk lingkungan yang lebih bersih
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="secondary-button">
                Daftar Sekarang
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BerandaPage;