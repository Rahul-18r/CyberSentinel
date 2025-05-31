import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const modelsDir = path.join(projectRoot, 'public', 'models', 'face-api');

console.log('Project root:', projectRoot);
console.log('Models directory:', modelsDir);

if (!fs.existsSync(modelsDir)) {
  console.log('Creating models directory...');
  fs.mkdirSync(modelsDir, { recursive: true });
}

// Updated model definitions with correct URLs and file sizes
const models = [
  {
    name: 'tiny_face_detector_model-weights_manifest.json',
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json'
  },
  {
    name: 'tiny_face_detector_model-shard1',
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1'
  },
  {
    name: 'face_landmark_68_model-weights_manifest.json',
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-weights_manifest.json'
  },
  {
    name: 'face_landmark_68_model-shard1',
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-shard1'
  },
  {
    name: 'face_recognition_model-weights_manifest.json',
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-weights_manifest.json'
  },
  {
    name: 'face_recognition_model-shard1',
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard1'
  }
];

async function downloadModel({ name, url }) {
  return new Promise((resolve, reject) => {
    const file = path.join(modelsDir, name);
    const fileStream = fs.createWriteStream(file);
    
    console.log(`Downloading ${name}...`);
    console.log(`URL: ${url}`);
    
    const request = https.get(url, response => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirects
        console.log(`Following redirect for ${name}...`);
        downloadModel({ name, url: response.headers.location }).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${name}: ${response.statusCode}`));
        return;
      }

      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Successfully downloaded: ${name}`);
        resolve();
      });
    });
    
    request.on('error', err => {
      fs.unlink(file, () => {});
      console.error(`Error downloading ${name}:`, err.message);
      reject(err);
    });
    
    // Add timeout
    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error(`Timeout downloading ${name}`));
    });
  });
}

async function downloadAll() {
  try {
    for (const model of models) {
      try {
        await downloadModel(model);
        // Add small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        console.error(`Failed to download ${model.name}:`, err.message);
        console.log('Continuing with next model...');
      }
    }
    console.log('Download process completed!');
  } catch (err) {
    console.error('Fatal error downloading models:', err.message);
    process.exit(1);
  }
}

downloadAll();