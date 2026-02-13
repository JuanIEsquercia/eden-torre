const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local to avoid dependency on dotenv or Next.js
function loadEnv() {
    try {
        console.log("Current Working Directory:", process.cwd());
        const envPath = path.join(process.cwd(), '.env.local');
        console.log("Looking for .env.local at:", envPath);
        
        if (!fs.existsSync(envPath)) {
            console.error("CRITICAL: .env.local file NOT found at expected path!");
            return {};
        }

        const envContent = fs.readFileSync(envPath, 'utf8');
        console.log("File read successfully. Length:", envContent.length);
        console.log("First 100 chars:", envContent.substring(0, 100).replace(/\n/g, '\\n'));

        const envVars = {};
        envContent.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                let value = match[2].trim();
                // Remove surrounding quotes
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                envVars[key] = value;
            }
        });
        
        console.log("Parsed Keys:", Object.keys(envVars));
        return envVars;
    } catch (e) {
        console.error("Could not read .env.local:", e.message);
        return {};
    }
}

const env = loadEnv();

const projectId = env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = env.FIREBASE_CLIENT_EMAIL;
const privateKeyRaw = env.FIREBASE_PRIVATE_KEY;

console.log("--- Firebase Admin Verification Script ---");
console.log(`Project ID: ${projectId}`);
console.log(`Client Email: ${clientEmail ? 'Found' : 'Missing'}`);

if (!privateKeyRaw) {
    console.error("ERROR: Private Key is missing in .env.local");
    process.exit(1);
}

// Format Key
const privateKey = privateKeyRaw.replace(/\\n/g, '\n');

console.log(`Private Key Length (Raw): ${privateKeyRaw.length}`);
console.log(`Private Key Length (Formatted): ${privateKey.length}`);
console.log(`Private Key Header Check: ${privateKey.includes('-----BEGIN PRIVATE KEY-----') ? 'PASS' : 'FAIL'}`);

if (!projectId || !clientEmail || !privateKey) {
    console.error("Missing credentials. Aborting.");
    process.exit(1);
}

// Initialize
try {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey
        }),
        projectId
    });
    console.log("Firebase Admin Initialized successfully.");
} catch (e) {
    console.error("Initialization Failed:", e.message);
    process.exit(1);
}

// Test Connection
const db = admin.firestore();
console.log("Attempting to connect to Firestore...");

db.collection('agencies').get()
    .then(snapshot => {
        console.log(`SUCCESS! Connected to Firestore.`);
        console.log(`Found ${snapshot.size} agencies.`);
        process.exit(0);
    })
    .catch(error => {
        console.error("Firestore Connection Failed:");
        console.error(error);
        process.exit(1);
    });
