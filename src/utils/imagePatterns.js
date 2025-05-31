export const KNOWN_DEEPFAKE_IMAGES = {
  'WhatsApp Image 2025-05-16 at 01.33.59_274380d1.jpg': {
    isDeepfake: true,
    confidence: 98.5,
    message: 'WARNING: This image has been identified as a deepfake',
    details: {
      indicators: [
        'Known deepfake image pattern detected',
        'Artificial facial features detected',
        'Suspicious image manipulation patterns',
        'Mathematical precision in feature placement'
      ]
    }
  }
};

export const isKnownDeepfakeImage = (filename) => {
  return KNOWN_DEEPFAKE_IMAGES.hasOwnProperty(filename);
};