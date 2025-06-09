import React, { useState, useEffect, useCallback } from "react";
import api from "../../service/api";
import "../../styles/informasi.css";

const InformasiPage = () => {
  // State untuk data
  const [informasiList, setInformasiList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // State untuk search dan filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // State untuk modal detail
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // State untuk form tambah informasi
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    judul: "",
    isi: "",
    kategori: "",
    nama_pengirim: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // Fetch data dari API
  const fetchInformasi = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        ...(selectedCategory && { kategori: selectedCategory }),
        ...(sortBy && { sort: sortBy }),
        ...(searchTerm && { search: searchTerm }),
      };

      // Panggil API dengan method yang benar
      const response = await api.getInformasi(params);

      // Pastikan response sesuai struktur API Anda
      setInformasiList(response.data || response);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Gagal memuat informasi. Silakan coba lagi."
      );
      console.error("Error fetching informasi:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, sortBy, searchTerm]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.getKategori();
      setCategories(response.data || response);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Gagal memuat kategori");
    }
  }, []);

  // Load data saat komponen mount atau filter berubah
  useEffect(() => {
    fetchInformasi();
    fetchCategories();
  }, [fetchInformasi, fetchCategories]);

  // Filter dan sort informasi
  const filteredAndSortedInformasi = React.useMemo(() => {
    let filtered = [...informasiList];

    // Filter berdasarkan search term jika ada
    if (searchTerm) {
      filtered = filtered.filter(
        (info) =>
          info.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
          info.isi.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort berdasarkan pilihan
    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) => new Date(b.tanggal_dibuat) - new Date(a.tanggal_dibuat)
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) => new Date(a.tanggal_dibuat) - new Date(b.tanggal_dibuat)
        );
        break;
      case "title":
        filtered.sort((a, b) => a.judul.localeCompare(b.judul));
        break;
      default:
        break;
    }

    return filtered;
  }, [informasiList, searchTerm, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(
    filteredAndSortedInformasi.length / itemsPerPage
  );
  const currentItems = filteredAndSortedInformasi.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Helper functions
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return "";
    return text.length <= maxLength
      ? text
      : `${text.substring(0, maxLength)}...`;
  };

  // Modal handlers
  const openModal = (info) => {
    setSelectedInfo(info);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedInfo(null);
    setShowModal(false);
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error saat user mulai mengetik
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const { judul, isi, kategori, nama_pengirim } = formData;

    if (!judul.trim()) errors.judul = "Judul harus diisi";
    else if (judul.length < 5) errors.judul = "Judul minimal 5 karakter";

    if (!isi.trim()) errors.isi = "Isi informasi harus diisi";
    else if (isi.length < 20) errors.isi = "Isi informasi minimal 20 karakter";

    if (!kategori) errors.kategori = "Kategori harus dipilih";
    if (!nama_pengirim.trim())
      errors.nama_pengirim = "Nama pengirim harus diisi";

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setFormLoading(true);
      setFormErrors({});

      const dataToSubmit = {
        ...formData,
        tanggal_dibuat: new Date().toISOString(),
      };

      await api.createInformasi(dataToSubmit);

      setSuccess("Informasi berhasil ditambahkan!");
      setShowAddForm(false);
      setFormData({
        judul: "",
        isi: "",
        kategori: "",
        nama_pengirim: "",
      });

      // Refresh data
      await fetchInformasi();

      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      console.error("Error creating informasi:", err);
      setError(err.response?.data?.message || "Gagal menambahkan informasi");
      if (err.response?.data?.errors) {
        setFormErrors(err.response.data.errors);
      }
    } finally {
      setFormLoading(false);
    }
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  // Search with debounce
  const handleSearch = useCallback((value) => {
    const timer = setTimeout(() => {
      setSearchTerm(value);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  // Loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Memuat informasi...</p>
      </div>
    );
  }

  return (
    <div className="informasi-page">
      {/* Header */}
      <div className="page-header">
        <h1>Informasi & Tips</h1>
        <p>Berbagi informasi, tips, dan kegiatan seputar pengelolaan sampah</p>
        <button className="btn-add" onClick={() => setShowAddForm(true)}>
          + Tambah Informasi
        </button>
      </div>

      {/* Messages */}
      {(error || success) && (
        <div className={`message ${error ? "error" : "success"}`}>
          <p>{error || success}</p>
          <button className="message-close" onClick={clearMessages}>
            ×
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="filters-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Cari informasi berdasarkan judul atau isi..."
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">Semua Kategori</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
            <option value="title">Judul A-Z</option>
          </select>
        </div>
      </div>

      {/* Results Info */}
      {searchTerm && (
        <div className="results-info">
          <p>
            Menampilkan {filteredAndSortedInformasi.length} hasil untuk "
            {searchTerm}"
          </p>
        </div>
      )}

      {/* Informasi Cards */}
      <div className="informasi-grid">
        {currentItems.length === 0 ? (
          <div className="no-data">
            <p>
              {searchTerm
                ? `Tidak ada informasi yang cocok dengan "${searchTerm}"`
                : "Belum ada informasi tersedia"}
            </p>
          </div>
        ) : (
          currentItems.map((info) => (
            <div key={info.id} className="info-card">
              <div className="card-header">
                <h3 className="card-title">{info.judul}</h3>
                <div className="card-meta">
                  <span className="card-date">
                    {formatDate(info.tanggal_dibuat)}
                  </span>
                  {info.kategori && (
                    <span className="card-category">{info.kategori}</span>
                  )}
                </div>
              </div>

              <div className="card-content">
                <p className="card-preview">{truncateText(info.isi)}</p>
              </div>

              <div className="card-footer">
                <div className="card-author">
                  {info.nama_pengirim && (
                    <span>Oleh: {info.nama_pengirim}</span>
                  )}
                </div>
                <button className="btn-detail" onClick={() => openModal(info)}>
                  Lihat Selengkapnya
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            ‹ Sebelumnya
          </button>

          <div className="pagination-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination-number ${
                  currentPage === page ? "active" : ""
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Selanjutnya ›
          </button>
        </div>
      )}

      {/* Modal Add Form */}
      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div
            className="modal-content add-form-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Tambah Informasi Baru</h2>
              <button
                className="modal-close"
                onClick={() => setShowAddForm(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="add-form">
              <div className="form-group">
                <label htmlFor="judul">Judul *</label>
                <input
                  type="text"
                  id="judul"
                  name="judul"
                  value={formData.judul}
                  onChange={handleInputChange}
                  className={formErrors.judul ? "error" : ""}
                  placeholder="Masukkan judul informasi"
                />
                {formErrors.judul && (
                  <span className="error-text">{formErrors.judul}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="kategori">Kategori *</label>
                <select
                  id="kategori"
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleInputChange}
                  className={formErrors.kategori ? "error" : ""}
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {formErrors.kategori && (
                  <span className="error-text">{formErrors.kategori}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="nama_pengirim">Nama Pengirim *</label>
                <input
                  type="text"
                  id="nama_pengirim"
                  name="nama_pengirim"
                  value={formData.nama_pengirim}
                  onChange={handleInputChange}
                  className={formErrors.nama_pengirim ? "error" : ""}
                  placeholder="Masukkan nama Anda"
                />
                {formErrors.nama_pengirim && (
                  <span className="error-text">{formErrors.nama_pengirim}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="isi">Isi Informasi *</label>
                <textarea
                  id="isi"
                  name="isi"
                  value={formData.isi}
                  onChange={handleInputChange}
                  className={formErrors.isi ? "error" : ""}
                  placeholder="Tulis informasi lengkap di sini..."
                  rows="8"
                />
                <div className="char-count">
                  {formData.isi.length} karakter (minimal 20)
                </div>
                {formErrors.isi && (
                  <span className="error-text">{formErrors.isi}</span>
                )}
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowAddForm(false)}
                  disabled={formLoading}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={formLoading}
                >
                  {formLoading ? "Menyimpan..." : "Simpan Informasi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail */}
      {showModal && selectedInfo && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>{selectedInfo.judul}</h2>
              <button className="modal-close" onClick={closeModal}>
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-meta">
                <span className="modal-date">
                  {formatDate(selectedInfo.tanggal_dibuat)}
                </span>
                {selectedInfo.kategori && (
                  <span className="modal-category">
                    {selectedInfo.kategori}
                  </span>
                )}
                {selectedInfo.nama_pengirim && (
                  <span className="modal-author">
                    Oleh: {selectedInfo.nama_pengirim}
                  </span>
                )}
              </div>

              <div className="modal-text">
                <p>{selectedInfo.isi}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InformasiPage;
