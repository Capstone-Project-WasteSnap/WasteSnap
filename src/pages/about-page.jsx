import React from "react";
import "../styles/about.css";
import image from "../assets/image/Hand-coding-amico.svg";
import imageDevelopt1 from "../assets/developt/diva.png";
import imageDevelopt2 from "../assets/developt/artur.png";
import imageDevelopt3 from "../assets/developt/sakifa.jpg";
import imageDevelopt4 from "../assets/developt/falen.png";
import imageDevelopt5 from "../assets/developt/wildan.jpg";
import imageDevelopt6 from "../assets/developt/yogi.jpg";
import imageKolaborasi from "../assets/kolaborasi/kolaborasi.png";

const AboutPage = () => {
  return (
    <section className="about-section">
      {/* Bagian 1: Tentang Kami */}
      <div className="about-wrapper container">
        <div className="about-text">
          <h1 className="about-title">Tentang Kami</h1>
          <p className="about-description">
            Kami hadir dengan solusi berbasis AI untuk mengatasi masalah sampah
            yang terus meningkat. Melalui teknologi machine learning, pengguna
            dapat mengenali jenis sampah hanya dengan memindai gambar. berguna.
          </p>
        </div>
        <div className="about-image">
          <img src={image} alt="Ilustrasi Tentang Kami" className="img-fluid" />
        </div>
      </div>

      {/* Bagian 2: Kolaborasi Bersama Komunitas */}
      <div className="collaboration-section container">
        <div className="collab-wrapper">
          {/* Kiri: Logo Komunitas */}

          <div className="logo-grid">
            <div className="collab-logo">
              <img src={imageKolaborasi} alt="Logo" />
            </div>
          </div>

          {/* Kanan: Teks */}
          <div className="collab-text">
            <h2 className="section-title">Kolaborasi Bersama Komunitas</h2>
            <p className="collab-description">
              WasteSnap bekerja sama dengan komunitas dan organisasi lingkungan
              seperti AZWI, Greenpeace, Zero Waste Indonesia, Pilah Sampah,
              Waste4Change, dan WWF untuk mendorong pengelolaan sampah yang
              berkelanjutan.
            </p>
          </div>
        </div>
      </div>

      {/* Bagian 3: Tim Kami */}
      <div className="team-section">
        <div className="container">
          <div className="content-wrapper">
            {/* Kiri: Judul dan Deskripsi */}
            <div className="team-text">
              <h2 className="section-title">Tim Pengembang</h2>
              <p className="team-description">
                Dalam pengembangan web ini kami terdiri dari 6 anggota developt,
                yaitu 3 <strong>frontend Backend (FEBE)</strong> dan 3{" "}
                <strong>Machine Learning (ML)</strong>
              </p>
            </div>

            {/* Kanan: Grid Gambar Anggota */}
            <div className="team-avatars">
              <img src={imageDevelopt1} alt="diva harahap" className="avatar" />
              <img src={imageDevelopt2} alt="Member 2" className="avatar" />
              <img src={imageDevelopt3} alt="Member 3" className="avatar" />
              <img src={imageDevelopt4} alt="Member 4" className="avatar" />
              <img src={imageDevelopt5} alt="Member 5" className="avatar" />
              <img src={imageDevelopt6} alt="Yogi" className="avatar" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
