import { useState, useRef, useEffect, useCallback } from 'react';
import { FaCamera, FaTrash, FaSearch, FaPowerOff, FaPlay } from 'react-icons/fa';
import api from '../../service/api';
import '../../styles/pindai.css';

const videoLinks = {
  Organik: [
    'https://www.youtube.com/embed/PkYgN3xfJ2I?si=__dA4WeqeBP-38wJ',
    'https://www.youtube.com/embed/3NdAGDtrrjc?si=udmMZjtmKNk6YoWw',
    'https://www.youtube.com/embed/DZj4OlW_ogk?si=fUlsjI5LJR2iLUIW',
    'https://www.youtube.com/embed/8q08XUa3P_Q?si=I0nv4WY76El8XaLu',
    'https://www.youtube.com/embed/1raJ4IGmwxc?si=e7k_mCD34QaKoL8l',
    'https://www.youtube.com/embed/RFD3yarpgHA?si=f7RzMrcPxPvtchYZ',
    'https://www.youtube.com/embed/I13_hwqm2Zo?si=wBgMpmd4F4vsqNp4'
  ],
  Anorganik: [
    'https://www.youtube.com/embed/MJd3bo_XRaU?si=D0yBZVveUbBn-tCH',
    'https://www.youtube.com/embed/VYzDrFSYQ-g?si=tY8fH8evpLVEWtWD',
    'https://www.youtube.com/embed/Bgi6UJAQ1UY?si=K84ZVyhMEO69lSHq',
    'https://www.youtube.com/embed/kNflGgtJyLA?si=FZYimWmkrYRJJ1z2',
    'https://www.youtube.com/embed/ycya1NvbBns?si=ZeFXEEvndjQSsG3M',
    'https://www.youtube.com/embed/a3yjtSHNnpo?si=wOaGzZJNjbd6UpKl',
    'https://www.youtube.com/embed/18x-npX3yxA?si=vVSMnJF0eWrdt7xW',
    'https://www.youtube.com/embed/fgkMBz6WvZs?si=O0nNm5g73jeUoJ5A',
    'https://www.youtube.com/embed/q-_sT1AdzPQ?si=kIR8dev_451N2Njg',
    'https://www.youtube.com/embed/ar5RYAAt62k?si=b36LnR8DsqU-Dnje'
  ],
};

const recommendationContainerStyle = {
  backgroundColor: '#f0f8ff',
  border: '1px solid #add8e6',
  padding: '20px',
  borderRadius: '12px',
  marginBottom: '30px',
  color: '#333',
  lineHeight: '1.8',
  fontFamily: 'Arial, sans-serif',
  textAlign: 'left',
};

const Recommendation = ({ type }) => {
  if (type === 'Organik') {
    return (
      <div style={recommendationContainerStyle}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>♻️ Sampah Organik: Jangan Dibuang, Bisa Jadi Emas!</h3>
        <p>
          Sampah organik berasal dari bahan alami seperti sisa makanan, sayur dan buah busuk, kulit telur, daun kering, dan rumput. Sampah ini mudah membusuk dan terurai oleh mikroorganisme dalam waktu singkat.
        </p>
        <p style={{ fontWeight: 'bold', marginTop: '16px' }}>Ciri-ciri sampah organik:</p>
        <ul style={{ paddingLeft: '20px', listStyleType: "'• '", margin: 0 }}>
          <li>Terbuat dari bahan alami</li>
          <li>Mudah membusuk dan berbau jika tidak segera diolah</li>
          <li>Bisa terurai secara alami dalam tanah</li>
        </ul>

        <p style={{ fontWeight: 'bold', marginTop: '16px' }}>Manfaat pengolahan sampah organik:</p>
        <ul style={{ paddingLeft: '20px', listStyleType: 'none', margin: 0 }}>
          <li>🌱 Kompos untuk menyuburkan tanaman</li>
          <li>💧 Pupuk cair untuk pertanian</li>
          <li>🔥 Biogas sebagai sumber energi pengganti gas elpiji</li>
          <li>🐛 Pakan maggot untuk ikan dan unggas</li>
          <li>🔋 Pelet biomassa untuk energi ramah lingkungan</li>
        </ul>

        <p style={{ marginTop: '16px' }}>
          Dengan memilah dan mengolah sampah organik, kita membantu menjaga lingkungan dan membuka peluang ekonomi hijau. Yuk, mulai dari rumah agar sampah organik jadi "emas hijau" yang bernilai!
        </p>
      </div>
    );
  } else if (type === 'Anorganik') {
    return (
      <div style={recommendationContainerStyle}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>🧴 Sampah Anorganik: Jangan Dibuang, Bisa Disulap!</h3>
        <p>
          Sampah anorganik berasal dari bahan yang sulit terurai seperti plastik, logam, kaca, karet, dan kain sintetis. Karena susah membusuk, sampah ini harus kita kelola dengan bijak.
        </p>
        <p style={{ fontWeight: 'bold', marginTop: '16px' }}>Ciri-ciri sampah anorganik:</p>
        <ul style={{ paddingLeft: '20px', listStyleType: "'• '", margin: 0 }}>
          <li>Terbuat dari bahan non-alami</li>
          <li>Tidak mudah terurai di tanah</li>
          <li>Bisa bertahan puluhan bahkan ratusan tahun</li>
        </ul>

        <p style={{ fontWeight: 'bold', marginTop: '16px' }}>Contoh pemanfaatan ulang sampah anorganik:</p>
        <ul style={{ paddingLeft: '20px', listStyleType: 'none', margin: 0 }}>
          <li>♻️ Botol plastik jadi tas daur ulang, pot tanaman, atau bahan bangunan</li>
          <li>🛠️ Kaleng bekas jadi kerajinan tangan dan dekorasi rumah</li>
          <li>🎨 Kaca pecah bisa dilebur jadi botol baru atau mozaik seni</li>
          <li>👜 Limbah tekstil dijadikan bantal, tas belanja, atau benang rajut</li>
        </ul>

        <p style={{ marginTop: '16px' }}>
          Dengan memilah dan memanfaatkan ulang sampah anorganik, kita mengurangi tumpukan sampah sekaligus mendukung ekonomi kreatif dan menjaga bumi tetap lestari. Yuk, mulai sekarang lebih bijak dalam mengelola sampah anorganik!
        </p>
      </div>
    );
  }
  return null;
};

const VideoCarousel = ({ type }) => {
  const containerRef = useRef(null);
  if (!type || !videoLinks[type]) return null;
  const scroll = (offset) => containerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  return (
    <div style={{ position: 'relative', marginBottom: '30px' }}>
      <button onClick={() => scroll(-320)} style={{ position: 'absolute', left: '5px', top: '50%', transform: 'translateY(-50%)', zIndex: 2, cursor: 'pointer', padding: '10px', borderRadius: '50%', border: '1px solid #ccc' }}>◀</button>
      <div ref={containerRef} style={{ display: 'flex', overflowX: 'auto', scrollBehavior: 'smooth', gap: '10px', padding: '10px 40px' }}>
        {videoLinks[type].map((url, i) => (
          <iframe key={i} width="300" height="170" src={url} title={`Video ${type} ${i + 1}`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ borderRadius: '8px', flex: '0 0 auto' }} />
        ))}
      </div>
      <button onClick={() => scroll(320)} style={{ position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', zIndex: 2, cursor: 'pointer', padding: '10px', borderRadius: '50%', border: '1px solid #ccc' }}>▶</button>
    </div>
  );
};

const PindaiPage = () => {
  const [activeTab, setActiveTab] = useState('camera');
  const [capturedImage, setCapturedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [cameraActive, setCameraActive] = useState(true);
  const [confidence, setConfidence] = useState(0);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError("Tidak dapat mengakses kamera. Pastikan izin telah diberikan.");
      stopCamera();
    }
  }, [stopCamera]);

  useEffect(() => {
    if (activeTab === 'camera') startCamera();
    else stopCamera();
    return () => stopCamera();
  }, [activeTab, startCamera, stopCamera]);

  const captureAndAnalyze = async () => {
    if (!videoRef.current?.srcObject || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    
    setIsAnalyzing(true);
    setActiveTab('analysis');
    
    try {
      canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append('image', blob, 'scan.jpg');
        
        const response = await api.post('/scans/analyze', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        setAnalysisResult(response.data.result);
        setConfidence(response.data.confidence);
        setCapturedImage(canvas.toDataURL('image/jpeg'));
        setIsAnalyzing(false);
      }, 'image/jpeg', 0.9);
    } catch (error) {
      console.error('Analysis error:', error);
      setIsAnalyzing(false);
      setAnalysisResult('Error');
    }
  };

  const resetScan = () => {
    setCapturedImage(null);
    setAnalysisResult('');
    setConfidence(0);
    setIsAnalyzing(false);
    setActiveTab('camera');
  };

  return (
    <div className="pindai-container" style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Pindai Sampah</h1>

      <div className="tab-navigation" style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        <button className={`tab-btn ${activeTab === 'camera' ? 'active' : ''}`} disabled>1. Kamera</button>
        <button className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`} disabled>2. Analisis</button>
      </div>

      <div className="tab-content">
        {activeTab === 'camera' && (
          <div className="camera-tab" style={{ textAlign: 'center' }}>
            <div className="video-container" style={{ position: 'relative', backgroundColor: '#000', borderRadius: '8px' }}>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                style={{ 
                  width: '100%', 
                  borderRadius: '8px', 
                  maxHeight: '400px', 
                  objectFit: 'cover' 
                }} 
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              {cameraError && (
                <p style={{ color: 'red', padding: '10px' }}>{cameraError}</p>
              )}
            </div>
            <div className="camera-controls" style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button 
                onClick={captureAndAnalyze} 
                className="btn btn-capture" 
                disabled={!!cameraError || !cameraActive} 
                style={{ padding: '12px 20px', cursor: 'pointer', fontSize: '16px' }}
              >
                <FaSearch /> Pindai & Analisis Sampah
              </button>
              <button 
                onClick={startCamera} 
                disabled={cameraActive} 
                style={{ padding: '12px 20px', fontSize: '16px', cursor: cameraActive ? 'not-allowed' : 'pointer' }}
              >
                <FaPlay /> Hidupkan Kamera
              </button>
              <button 
                onClick={stopCamera} 
                disabled={!cameraActive} 
                style={{ padding: '12px 20px', fontSize: '16px', cursor: !cameraActive ? 'not-allowed' : 'pointer' }}
              >
                <FaPowerOff /> Matikan Kamera
              </button>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="analysis-tab" style={{ textAlign: 'center' }}>
            {capturedImage && (
              <img 
                src={capturedImage} 
                alt="Analysed" 
                style={{ 
                  maxWidth: '100%', 
                  borderRadius: '8px', 
                  marginBottom: '15px' 
                }} 
              />
            )}
            {isAnalyzing ? (
              <div style={{ padding: '20px' }}>
                <h3>Menganalisa...</h3>
                <p>Sistem sedang mengidentifikasi jenis sampah Anda.</p>
              </div>
            ) : (
              <>
                <div style={{ 
                  marginBottom: '20px', 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  color: '#2e7d32' 
                }}>
                  Hasil Deteksi: Sampah <span style={{ 
                    textTransform: 'uppercase',
                    color: analysisResult === 'Organik' ? '#388e3c' : '#d32f2f'
                  }}>
                    {analysisResult}
                  </span>
                  {confidence > 0 && (
                    <div style={{
                      fontSize: '14px',
                      color: '#666',
                      marginTop: '5px'
                    }}>
                      Tingkat Akurasi: {confidence}%
                    </div>
                  )}
                </div>
                {analysisResult && (
                  <>
                    <Recommendation type={analysisResult} />
                    <VideoCarousel type={analysisResult} />
                  </>
                )}
              </>
            )}
            <button 
              onClick={resetScan} 
              disabled={isAnalyzing} 
              className="btn btn-reset" 
              style={{ 
                padding: '12px 20px', 
                cursor: isAnalyzing ? 'not-allowed' : 'pointer', 
                fontSize: '16px',
                marginTop: '20px'
              }}
            >
              <FaTrash /> Scan Baru
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PindaiPage;