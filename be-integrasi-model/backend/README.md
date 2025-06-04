# Backend API untuk Prediksi Stunting

Backend API menggunakan Hapi.js dan TensorFlow.js untuk prediksi stunting pada anak.

## 🚀 Instalasi dan Menjalankan

### Prasyarat
- Node.js >= 16.x
- NPM atau Yarn
- Model TensorFlow.js (sudah disediakan)

### Instalasi Dependencies
\`\`\`bash
npm install
\`\`\`

### Menjalankan Server
\`\`\`bash
# Development mode
npm run dev

# Production mode
npm start
\`\`\`

Server akan berjalan di `http://localhost:3001`

## 📋 API Endpoints

### 1. Health Check
\`\`\`
GET /health
\`\`\`

Response:
\`\`\`json
{
  "status": "OK",
  "timestamp": "2025-06-04T20:02:10.000Z",
  "service": "Stunting Prediction API"
}
\`\`\`

### 2. Prediksi Stunting
\`\`\`
POST /api/predict
\`\`\`

Request Body:
\`\`\`json
{
  "usia": 24,
  "jenisKelamin": "laki-laki",
  "beratBadan": 10.5,
  "tinggiBadan": 85.5
}
\`\`\`

Response:
\`\`\`json
{
  "status": "normal",
  "message": "Berdasarkan analisis machine learning...",
  "recommendations": ["...", "..."],
  "score": 15,
  "recommendedArticles": [...]
}
\`\`\`

### 3. Rekomendasi Artikel
\`\`\`
POST /api/recommend
\`\`\`

Request Body:
\`\`\`json
{
  "status": "normal",
  "usia": 24,
  "jenisKelamin": "laki-laki"
}
\`\`\`

## 🧠 Model Machine Learning

- **Framework**: TensorFlow.js Node
- **Input**: Usia (bulan), Jenis Kelamin, Berat Badan (kg), Tinggi Badan (cm)
- **Output**: 3 kelas (Normal, Stunted, Severely Stunted)
- **Normalisasi**: StandardScaler

## 🔧 Konfigurasi

### Environment Variables
\`\`\`bash
PORT=3001
NODE_ENV=development
\`\`\`

### CORS Configuration
- Origin: `http://localhost:3000`
- Methods: GET, POST
- Headers: Accept, Content-Type

## 📁 Struktur File

\`\`\`
backend/
├── server.js              # Main server file
├── services/
│   ├── ml-service.js       # Machine learning service
│   └── recommendation-service.js
├── validators/
│   └── prediction-validator.js
├── model-machine-learning/
│   ├── model.json
│   └── group1-shard1of1.bin
└── package.json
\`\`\`

## 🐛 Troubleshooting

### Model Loading Error
- Pastikan file model tersedia di `model-machine-learning/`
- Periksa path file di `ml-service.js`

### CORS Error
- Pastikan frontend berjalan di `http://localhost:3000`
- Periksa konfigurasi CORS di `server.js`

### Port Conflict
- Ubah port di `server.js` jika 3001 sudah digunakan
- Update `NEXT_PUBLIC_BACKEND_URL` di frontend
