const cloudName = 'diktsavzd';
const apiKey = '872847933219545';
const apiSecret = 'bGvZ3KvQ8eEyanj2trav5bOWamI';

const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload_presets`;
const auth = Buffer.from(apiKey + ':' + apiSecret).toString('base64');

async function createPreset() {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'eden_properties',
        unsigned: true,
        folder: 'properties'
      })
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

createPreset();
