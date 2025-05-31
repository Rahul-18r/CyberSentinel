router.post('/scan-url', async (req, res) => {
  try {
    const { url } = req.body;
    
    // Check if URL is valid
    if (!isValidUrl(url)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid URL format'
      });
    }

    // Perform security checks
    const securityCheck = await performSecurityCheck(url);
    
    res.json({
      success: true,
      ...securityCheck
    });
  } catch (error) {
    console.error('URL scan error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to scan URL'
    });
  }
});

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

const performSecurityCheck = async (url) => {
  // Here you would integrate with actual security APIs
  // For demo, using simple checks
  const response = await fetch(url, { mode: 'no-cors' });
  
  // Example security check logic
  const suspicious = url.includes('suspicious') || url.includes('warez');
  const malware = url.includes('malware') || url.includes('virus');
  const phishing = url.includes('login') && url.includes('verify');
  
  const score = suspicious ? 40 : malware ? 10 : phishing ? 20 : 90;
  
  return {
    status: malware || phishing ? 'dangerous' : suspicious ? 'suspicious' : 'safe',
    malware,
    phishing,
    suspicious,
    score,
    details: [
      malware && 'Potential malware detected',
      phishing && 'Possible phishing attempt',
      suspicious && 'Suspicious content detected',
    ].filter(Boolean)
  };
};