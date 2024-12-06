const tf = require('@tensorflow/tfjs');
const fs = require('fs');

// Path ke model TensorFlow.js di Cloud Storage
const MODEL_URL = 'https://storage.googleapis.com/ml-model-afina/model.json';

let model;

// Load model TensorFlow.js
async function loadModel() {
    if (!model) {
        console.log('Loading model...');
        model = await tf.loadGraphModel(MODEL_URL);
    }
    return model;
}

// Prediksi gambar
async function predictImage(imagePath) {
    const imageBuffer = fs.readFileSync(imagePath);
    const decodedImage = tf.node.decodeImage(imageBuffer, 3);
    const resizedImage = tf.image.resizeBilinear(decodedImage, [224, 224]).div(255.0).expandDims();
    const loadedModel = await loadModel();
    const prediction = loadedModel.predict(resizedImage).dataSync();
    
    // Hasil prediksi
    return {
        cancer: prediction[0],
        nonCancer: prediction[1],
    };
}

module.exports = { predictImage };
