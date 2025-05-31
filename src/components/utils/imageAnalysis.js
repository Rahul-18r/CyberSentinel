import * as tf from '@tensorflow/tfjs';
import * as faceapi from '@vladmandic/face-api';
import { FaceDetectionService } from '../../services/faceDetection';

const MODEL_URL = '/models/face-api';
let isModelLoaded = false;

// Add helper functions at the top
const updateProgress = async (setStage, setProgress, stage, progress) => {
  setStage(stage);
  setProgress(progress);
  // Add small delay to allow UI updates
  await new Promise(resolve => setTimeout(resolve, 100));
};

const preprocessImage = async (imageElement) => {
  return tf.tidy(() => {
    const tensor = tf.browser.fromPixels(imageElement);
    const resized = tf.image.resizeBilinear(tensor, [128, 128]);
    return tf.cast(resized, 'float32').div(255.0);
  });
};

const performELA = async (tensor) => {
  return tf.tidy(() => {
    try {
      const compressed = tf.avgPool(
        tensor.expandDims(),
        [2, 2],
        [1, 1],
        'same'
      ).squeeze();
      
      const difference = tensor.sub(compressed).abs();
      const score = difference.mean().dataSync()[0];
      return Math.min(Math.max(score * 5, 0), 1);
    } catch (err) {
      console.error('ELA Analysis error:', err);
      return 0.5;
    }
  });
};

const analyzeNoisePattern = async (tensor) => {
  return tf.tidy(() => {
    try {
      const blurred = tf.avgPool(
        tensor.expandDims(),
        [3, 3],
        [1, 1],
        'same'
      ).squeeze();
      
      const noise = tensor.sub(blurred);
      return Math.min(noise.abs().mean().dataSync()[0] * 10, 1);
    } catch (err) {
      console.error('Noise Analysis error:', err);
      return 0.5;
    }
  });
};

const calculateFinalScore = (scores) => {
  const weights = {
    ela: 0.4,
    noise: 0.3,
    face: 0.3
  };
  
  return Object.entries(scores).reduce((total, [key, value]) => {
    return total + (value * weights[key]);
  }, 0);
};

const getAnalysisReason = (score) => {
  if (score < 0.3) {
    return 'High confidence this is a real image (very low manipulation markers)';
  } else if (score < 0.45) {
    return 'Moderate confidence this is a real image';
  } else if (score < 0.55) {
    return 'Analysis is inconclusive - borderline case';
  } else if (score < 0.7) {
    return 'Moderate confidence this is a deepfake image';
  } else {
    return 'High confidence this is a deepfake image (strong manipulation markers)';
  }
};

// Update the analyzeFacialFeatures function
const analyzeFacialFeatures = async (imageElement) => {
  try {
    const modelsLoaded = await loadFaceApiModels();
    if (!modelsLoaded) {
      console.warn('Face detection models not available');
      return await simplifiedFacialAnalysis(imageElement);
    }

    // Create temporary canvas for face detection
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions to match image
    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;

    // Draw image onto canvas
    ctx.drawImage(imageElement, 0, 0);

    // Configure face detection options
    const options = new faceapi.TinyFaceDetectorOptions({
      inputSize: 512,
      scoreThreshold: 0.3
    });

    console.log('Starting face detection...');
    
    // Run detection with debug logging
    const detection = await faceapi
      .detectSingleFace(canvas, options)
      .withFaceLandmarks();

    console.log('Detection result:', detection);

    if (!detection) {
      console.warn('No face detected in image');
      return await simplifiedFacialAnalysis(imageElement);
    }

    // Calculate scores
    const landmarks = detection.landmarks;
    const symmetryScore = analyzeFacialSymmetry(landmarks);
    const consistencyScore = analyzeFacialConsistency(landmarks);

    console.log('Analysis scores:', { symmetryScore, consistencyScore });

    return (symmetryScore * 0.4 + consistencyScore * 0.6);
  } catch (err) {
    console.error('Facial analysis error:', err);
    return await simplifiedFacialAnalysis(imageElement);
  }
};

// Update the model path and loading logic
const loadFaceApiModels = async () => {
  if (isModelLoaded) {
    console.log('Models already loaded');
    return true;
  }

  try {
    console.log('Loading models from:', MODEL_URL);
    
    await Promise.all([
      faceapi.nets.tinyFaceDetector.load(MODEL_URL),
      faceapi.nets.faceLandmark68Net.load(MODEL_URL)
    ]);

    console.log('Face-api models loaded successfully');
    isModelLoaded = true;
    
    // Verify models are loaded
    const modelStatus = {
      tinyFaceDetector: faceapi.nets.tinyFaceDetector.isLoaded,
      faceLandmark68Net: faceapi.nets.faceLandmark68Net.isLoaded
    };
    
    console.log('Model status:', modelStatus);
    return true;
  } catch (err) {
    console.error('Failed to load face-api models:', err);
    return false;
  }
};

// Verify if the models are accessible and not corrupted
const verifyModels = async (modelPath) => {
  try {
    const response = await fetch(`${modelPath}/tiny_face_detector_model-weights_manifest.json`);
    if (!response.ok) {
      throw new Error(`Failed to load model manifest: ${response.statusText}`);
    }
    return true;
  } catch (err) {
    console.error('Model verification failed:', err);
    return false;
  }
};

const verifyModelFiles = async () => {
  const modelPath = '/models/face-api';
  const requiredFiles = [
    'tiny_face_detector_model-weights_manifest.json',
    'tiny_face_detector_model-shard1',
    'face_landmark_68_model-weights_manifest.json',
    'face_landmark_68_model-shard1'
  ];

  try {
    for (const file of requiredFiles) {
      const response = await fetch(`${modelPath}/${file}`);
      if (!response.ok) {
        console.error(`Missing model file: ${file}`);
        return false;
      }
    }
    return true;
  } catch (err) {
    console.error('Model verification failed:', err);
    return false;
  }
};

// Update simplifiedFacialAnalysis with better memory management
const simplifiedFacialAnalysis = async (imageElement) => {
  return tf.tidy(() => {
    try {
      const tensor = tf.browser.fromPixels(imageElement);
      // Resize image to reduce memory usage
      const resized = tf.image.resizeBilinear(tensor, [224, 224]);
      const normalized = tf.cast(resized, 'float32').div(255);
      
      const blurred = tf.avgPool(normalized, 2, 2, 'valid');
      const upscaled = tf.image.resizeBilinear(blurred, [normalized.shape[0], normalized.shape[1]]);
      const diff = normalized.sub(upscaled).abs();
      
      return Math.min(Math.max(diff.mean().dataSync()[0] * 3, 0), 1);
    } catch (err) {
      console.error('Simplified analysis error:', err);
      return 0.5;
    }
  });
};

// Helper functions for facial analysis
const analyzeFacialSymmetry = (landmarks) => {
  try {
    const points = landmarks.positions;
    let symmetryScore = 0;
    const centerX = points[27].x; // Nose bridge point
    
    // Compare left and right side points
    const pairs = [
      [0, 16],  // Jaw points
      [1, 15],
      [2, 14],
      [3, 13],
      [4, 12],
      [5, 11],
      [6, 10],
      [7, 9]
    ];

    pairs.forEach(([left, right]) => {
      const leftPoint = points[left];
      const rightPoint = points[right];
      const leftDist = Math.abs(centerX - leftPoint.x);
      const rightDist = Math.abs(centerX - rightPoint.x);
      const diff = Math.abs(leftDist - rightDist);
      symmetryScore += 1 - (diff / leftDist); // Normalize difference
    });

    return symmetryScore / pairs.length;
  } catch (err) {
    console.error('Symmetry analysis error:', err);
    return 0.5;
  }
};

const analyzeFacialConsistency = (landmarks) => {
  try {
    const points = landmarks.positions;
    // Check consistency of facial features
    const eyeDistance = getDistance(points[36], points[45]); // Distance between eyes
    const noseLength = getDistance(points[27], points[33]); // Nose length
    const mouthWidth = getDistance(points[48], points[54]); // Mouth width
    
    // Check if proportions are within normal ranges
    const consistencyScores = [
      checkProportion(eyeDistance, noseLength, 1.5, 2.5),
      checkProportion(mouthWidth, eyeDistance, 0.8, 1.2),
      checkProportion(noseLength, mouthWidth, 0.5, 0.9)
    ];
    
    return consistencyScores.reduce((a, b) => a + b) / consistencyScores.length;
  } catch (err) {
    console.error('Consistency analysis error:', err);
    return 0.5;
  }
};

// Utility functions
const getDistance = (p1, p2) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

const checkProportion = (a, b, minRatio, maxRatio) => {
  const ratio = a / b;
  if (ratio >= minRatio && ratio <= maxRatio) return 1;
  const deviation = Math.min(Math.abs(ratio - minRatio), Math.abs(ratio - maxRatio));
  return Math.max(0, 1 - deviation);
};

// Add the missing performAnalysis function
const performAnalysis = async (imageElement, model, setStage, setProgress) => {
  try {
    // Preprocess image
    await updateProgress(setStage, setProgress, 'Preprocessing image...', 10);
    const preprocessed = await preprocessImage(imageElement);

    // Perform ELA analysis
    await updateProgress(setStage, setProgress, 'Analyzing error levels...', 30);
    const elaScore = await performELA(preprocessed);

    // Analyze noise patterns
    await updateProgress(setStage, setProgress, 'Analyzing noise patterns...', 50);
    const noiseScore = await analyzeNoisePattern(preprocessed);

    // Analyze facial features
    await updateProgress(setStage, setProgress, 'Analyzing facial features...', 70);
    const faceScore = await analyzeFacialFeatures(imageElement);

    // Calculate final scores
    await updateProgress(setStage, setProgress, 'Calculating final results...', 90);
    
    const scores = {
      ela: elaScore,
      noise: noiseScore,
      face: faceScore
    };

    const finalScore = calculateFinalScore(scores);
    
    // Clean up tensors
    tf.dispose(preprocessed);
    
    await updateProgress(setStage, setProgress, 'Analysis complete', 100);

    // Return more detailed results
    return {
      scores: {
        errorLevel: {
          value: elaScore,
          label: 'Error Level Analysis',
          description: 'Analyzes image compression artifacts'
        },
        noisePattern: {
          value: noiseScore,
          label: 'Noise Pattern',
          description: 'Examines image noise consistency'
        },
        facial: {
          value: faceScore,
          label: 'Facial Analysis',
          description: 'Analyzes facial feature consistency'
        }
      },
      finalScore,
      prediction: finalScore > 0.5 ? "Deepfake" : "Real",
      confidence: Math.round(Math.abs(finalScore - 0.5) * 200), // Convert to percentage
      reason: getAnalysisReason(finalScore),
      detailedAnalysis: true
    };

  } catch (err) {
    console.error('Analysis error:', err);
    throw new Error('Failed to complete image analysis');
  }
};

// Single export statement at the bottom of the file
export {
  performELA,
  analyzeNoisePattern,
  analyzeFacialFeatures,
  performAnalysis,
  calculateFinalScore,
  getAnalysisReason,
  updateProgress,
  preprocessImage
};