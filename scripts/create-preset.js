const https = require('https');

const cloudName = 'diktsavzd';
const apiKey = '872847933219545';
const apiSecret = 'bGvZ3KvQ8eEyanj2trav5bOWamI';

const data = JSON.stringify({
  name: 'eden_properties',
  unsigned: true,
  folder: 'properties'
});

const options = {
  hostname: 'api.cloudinary.com',
  path: `/v1_1/${cloudName}/upload_presets`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'Authorization': 'Basic ' + Buffer.from(apiKey + ':' + apiSecret).toString('base64')
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    const response = JSON.parse(body);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log('Success! Preset Name:', response.name);
    } else {
      console.error('Error:', response);
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e);
});

req.write(data);
req.end();
