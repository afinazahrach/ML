const { Firestore } = require('@google-cloud/firestore');

// Inisialisasi Firestore
const firestore = new Firestore();

// Koleksi di Firestore
const COLLECTION_NAME = 'predictions';

// Simpan hasil prediksi ke Firestore
async function savePrediction(prediction) {
    const docRef = firestore.collection(COLLECTION_NAME).doc();
    const predictionData = {
        id: docRef.id,
        cancer: prediction.cancer,
        nonCancer: prediction.nonCancer,
        timestamp: new Date(),
    };
    await docRef.set(predictionData);
    return predictionData;
}

// Ambil riwayat prediksi dari Firestore
async function getPredictions() {
    const snapshot = await firestore.collection(COLLECTION_NAME).orderBy('timestamp', 'desc').get();
    return snapshot.docs.map(doc => doc.data());
}

module.exports = { savePrediction, getPredictions };
