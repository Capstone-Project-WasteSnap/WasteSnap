import { useState, useRef, useEffect } from 'react';
import { FaCamera, FaTrash, FaSearch, FaPowerOff, FaPlay, FaSpinner } from 'react-icons/fa';
import * as tf from '@tensorflow/tfjs';
import api from '../../service/api';
import '../../styles/pindai.css';

const VideoCarousel = ({ type }) => {
  const videoLinks = {
    Organik: [
      'https://www.youtube.com/embed/PkYgN3xfJ2I',
      'https://www.youtube.com/embed/3NdAGDtrrjc',
      'https://www.youtube.com/embed/DZj4OlW_ogk'
    ],
    Anorganik: [
      'https://www.youtube.com/embed/MJd3bo_XRaU',
      'https://www.youtube.com/embed/VYzDrFSYQ-g',
      'https://www.youtube.com/embed/Bgi6UJAQ1UY'
    ]
  };

  const containerRef = useRef(null);

  if (!type || !videoLinks[type]) return null;

  const scroll = (offset) => {
    containerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <div className="video-carousel">
      <button onClick={() => scroll(-300)} className="carousel-button left">
        ◀
      </button>
      <div ref={containerRef} className="video-list">
        {videoLinks[type].map((url, index) => (
          <iframe
            key={index}
            src={url}
            title={`Video ${type} ${index + 1}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ))}
      </div>
      <button onClick={() => scroll(300)} className="carousel-button right">
        ▶
      </button>
    </div>
  );
};

const PindaiPage = () => {
  const [activeTab, setActiveTab] = useState('camera');
  const [capturedImage, setCapturedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [models, setModels] = useState({
    trashDetection: null,
    trashClassification: null,
    isLoaded: false,
    loadingError: null
  });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const loadModels = async () => {
      try {
        await tf.ready();
        const [detectionModel, classificationModel] = await Promise.all([
          tf.loadGraphModel('/tfjs_model/model-adasampah-gakadasampah/model.json'),
          tf.loadGraphModel('/tfjs_model/model-organik-anorganik/model.json')
        ]);

        if (isMounted) {
          setModels({
            trashDetection: detectionModel,
            trashClassification: classificationModel,
            isLoaded: true,
            loadingError: null
          });
        }
      } catch (error) {
        if (isMounted) {
          setModels(prev => ({
            ...prev,
            isLoaded: false,
            loadingError: 'Gagal memuat model AI'
          }));
          setCameraError('Model tidak dapat dimuat');
        }
      }
    };

    loadModels();

    return () => {
      isMounted = false;
      if (models.trashDetection) models.trashDetection.dispose();
      if (models.trashClassification) models.trashClassification.dispose();
    };
  }, []);

  // Camera control
  const startCamera = async () => {
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
      setCameraError('Izin kamera ditolak atau perangkat tidak tersedia');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  const classifyImage = async (imageElement) => {
    try {
      const tensor = tf.browser.fromPixels(imageElement)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .div(tf.scalar(255.0))
        .expandDims();

      const trashPred = await models.trashDetection.predict(tensor).data();
      if (trashPred[1] < 0.5) {
        tensor.dispose();
        return { type: 'Bukan Sampah', confidence: 0 };
      }

      const typePred = await models.trashClassification.predict(tensor).data();
      tensor.dispose();

      const resultType = typePred[0] > typePred[1] ? 'Organik' : 'Anorganik';
      const confidence = Math.max(...typePred) * 100;
      
      return { type: resultType, confidence: confidence.toFixed(2) };
    } catch (error) {
      console.error('Error klasifikasi gambar:', error);
      throw error;
    }
  };

  const captureAndAnalyze = async () => {
    if (!models.isLoaded || !videoRef.current || !canvasRef.current) return;

    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      setCapturedImage(canvas.toDataURL('image/jpeg'));
      setIsAnalyzing(true);
      setActiveTab('analysis');

      const { type, confidence } = await classifyImage(canvas);
      setAnalysisResult(type);

      await api.post('/scans', {
        imageUrl: canvas.toDataURL('image/jpeg'),
        result: type
      });

    } catch (error) {
      console.error('Error analisis:', error);
      setAnalysisResult('Error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetScan = () => {
    setCapturedImage(null);
    setAnalysisResult('');
    setIsAnalyzing(false);
    setActiveTab('camera');
    startCamera();
  };

  useEffect(() => {
    if (activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [activeTab]);

  return (
    <div className="pindai-container">
      <h1>Pindai Sampah</h1>

      <div className="tab-navigation">
        <button className={`tab-btn ${activeTab === 'camera' ? 'active' : ''}`} disabled>
          1. Kamera
        </button>
        <button className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`} disabled>
          2. Analisis
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'camera' && (
          <div className="camera-tab">
            {models.loadingError ? (
              <div className="error-message">
                <p>{models.loadingError}</p>
                <button onClick={() => window.location.reload()}>Coba Lagi</button>
              </div>
            ) : (
              <>
                <div className="video-container">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    style={{ display: cameraActive ? 'block' : 'none' }}
                  />
                  {!cameraActive && (
                    <div className="camera-placeholder">
                      <p>Kamera tidak aktif</p>
                    </div>
                  )}
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                  {cameraError && <p className="error-text">{cameraError}</p>}
                </div>

                <div className="camera-controls">
                  <button 
                    onClick={captureAndAnalyze} 
                    disabled={!cameraActive || !models.isLoaded}
                    className="btn btn-capture"
                  >
                    {models.isLoaded ? (
                      <>
                        <FaSearch /> Pindai & Analisis Sampah
                      </>
                    ) : (
                      <>
                        <FaSpinner className="spin" /> Memuat Model...
                      </>
                    )}
                  </button>
                  
                  {cameraActive ? (
                    <button onClick={stopCamera} className="btn btn-secondary">
                      <FaPowerOff /> Matikan Kamera
                    </button>
                  ) : (
                    <button onClick={startCamera} className="btn btn-secondary">
                      <FaPlay /> Hidupkan Kamera
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="analysis-tab">
            {capturedImage && (
              <img 
                src={capturedImage} 
                alt="Captured" 
                className="captured-image"
              />
            )}

            {isAnalyzing ? (
              <div className="analyzing-state">
                <FaSpinner className="spin" />
                <h3>Menganalisis...</h3>
                <p>Sedang memproses gambar sampah Anda</p>
              </div>
            ) : (
              <>
                <div className="result-display">
                  <h2>Hasil Deteksi:</h2>
                  <p className={`result-type ${analysisResult.toLowerCase().replace(' ', '-')}`}>
                    {analysisResult}
                  </p>
                </div>

                {analysisResult && analysisResult !== 'Bukan Sampah' && (
                  <VideoCarousel type={analysisResult} />
                )}
              </>
            )}

            <button 
              onClick={resetScan} 
              disabled={isAnalyzing}
              className="btn btn-reset"
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