# 🔧 Setup Instructions - Windows Fix

## ❌ Masalah yang Diperbaiki

Masalah sebelumnya:
- `@tensorflow/tfjs-node` memerlukan Visual Studio Build Tools
- Node.js v22 tidak kompatibel dengan beberapa dependencies
- Proses kompilasi native modules gagal di Windows

## ✅ Solusi yang Diterapkan

1. **Mengganti `@tensorflow/tfjs-node` dengan `@tensorflow/tfjs` + `@tensorflow/tfjs-backend-cpu`**
   - Tidak memerlukan kompilasi native
   - Kompatibel dengan semua versi Node.js
   - Tidak memerlukan Visual Studio Build Tools

2. **Fallback System yang Robust**
   - Jika model asli gagal dimuat, gunakan model fallback
   - Jika backend tidak tersedia, gunakan prediksi frontend
   - Aplikasi tetap berfungsi dalam segala kondisi

## 🚀 Langkah Setup Baru

### 1. Persiapan Model
\`\`\`bash
# Copy model ke backend
mkdir backend\\model-machine-learning
copy model-machine-learning\\* backend\\model-machine-learning\\
\`\`\`

### 2. Install Dependencies
\`\`\`bash
# Install frontend dependencies (termasuk axios)
npm install

# Install backend dependencies (sudah diperbaiki)
cd backend
npm install
cd ..
\`\`\`

### 3. Jalankan Aplikasi
\`\`\`bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
npm run dev
\`\`\`

## ✅ Verifikasi

### 1. Test Backend
\`\`\`bash
curl https://be-byestunting-production.up.railway.app/health
\`\`\`

Response:
\`\`\`json
{"status":"OK","timestamp":"...","service":"Stunting Prediction API"}
\`\`\`

### 2. Test Frontend
- Buka: http://localhost:3000
- Isi form prediksi stunting
- Submit dan lihat hasil

### 3. Test Fallback
- Matikan backend (Ctrl+C)
- Coba prediksi lagi di frontend
- Harus tetap berfungsi dengan mode fallback

## 🔍 Log yang Diharapkan

### Backend Log:
\`\`\`
🚀 Server running on https://be-byestunting-production.up.railway.app
📊 ML Prediction API ready
🔗 CORS enabled for: http://localhost:3000
🔄 Memuat model TensorFlow.js dari file yang disediakan...
✅ TensorFlow.js backend CPU siap
✅ Model berhasil dimuat dari file asli!
\`\`\`

### Frontend Log (Browser Console):
\`\`\`
🔄 Memulai prediksi stunting via backend API...
📤 Data yang dikirim ke backend: {usia: 24, jenisKelamin: "laki-laki", ...}
✅ Prediksi berhasil dari backend
\`\`\`

## 🎯 Fitur yang Berfungsi

- ✅ **Model Loading**: Menggunakan model asli tanpa kompilasi
- ✅ **Backend API**: Hapi.js dengan TensorFlow.js CPU backend
- ✅ **Frontend Integration**: Axios untuk komunikasi
- ✅ **Fallback System**: 3 level fallback untuk reliability
- ✅ **Cross-Platform**: Berfungsi di Windows, Mac, Linux
- ✅ **No Build Tools**: Tidak perlu Visual Studio atau Python

## 🔧 Troubleshooting

### Jika masih ada error npm install:
\`\`\`bash
# Clear cache
npm cache clean --force

# Delete node_modules dan install ulang
rmdir /s backend\\node_modules
cd backend
npm install
\`\`\`

### Jika model tidak dimuat:
- Pastikan file `model.json` dan `group1-shard1of1.bin` ada
- Cek path di console log
- Model fallback akan otomatis digunakan jika gagal

### Jika backend tidak bisa diakses:
- Cek port 3001 tidak digunakan aplikasi lain
- Restart backend
- Frontend akan otomatis menggunakan fallback prediction

Sekarang aplikasi sudah siap dijalankan tanpa masalah kompilasi!
