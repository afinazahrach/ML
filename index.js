const express = require('express');
const multer = require('multer');
const { predictImage } = require('./model');
const { savePrediction, getPredictions } = require('./firestore');
const path = require('path');

require('dotenv').config();

// Inisialisasi aplikasi Express
const app = express();
const PORT = 3000;

// Konfigurasi Multer untuk upload file
const upload = multer({
    dest: path.join(__dirname, 'uploads'),
    limits: { fileSize: 1 * 1024 * 1024 }, // Maksimal 1MB
});

// Menambahkan route untuk root URL
app.get('/', (req, res) => {
    res.send('Server berjalan dengan baik, silakan gunakan endpoint yang ada.');
  });  

// Endpoint POST /predict
app.post('/predict', upload.single('image'), async (req, res) => {
    try {
        const { file } = req;
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Prediksi gambar
        const prediction = await predictImage(file.path);

        // Simpan hasil prediksi ke Firestore
        const savedPrediction = await savePrediction(prediction);

        res.json({ prediction: savedPrediction });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint GET /predict/histories
app.get('/predict/histories', async (req, res) => {
    try {
        const predictions = await getPredictions();
        res.json({ histories: predictions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
