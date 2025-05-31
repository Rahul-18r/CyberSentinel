import axios from 'axios';

const SAFE_BROWSING_API_KEY = 'AIzaSyCWOiI4ZU6Ggj40bQw_HR9ZmEVBQLsB2Ug';
const SAFE_BROWSING_ENDPOINT = 'https://safebrowsing.googleapis.com/v4/threatMatches:find';

export const analyzeThreatMatches = async (url) => {
  try {
    const response = await axios.post(
      `${SAFE_BROWSING_ENDPOINT}?key=${SAFE_BROWSING_API_KEY}`,
      {
        client: {
          clientId: 'cyberspy-app',
          clientVersion: '1.0.0'
        },
        threatInfo: {
          threatTypes: [
            'MALWARE',
            'SOCIAL_ENGINEERING',
            'UNWANTED_SOFTWARE',
            'POTENTIALLY_HARMFUL_APPLICATION'
          ],
          platformTypes: ['ANY_PLATFORM'],
          threatEntryTypes: ['URL'],
          threatEntries: [{ url }]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Safe Browsing API error:', error);
    throw error;
  }
};