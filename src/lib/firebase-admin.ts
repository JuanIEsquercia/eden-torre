import "server-only";
import { initializeApp, getApps, getApp, cert, type ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Helper to format private key (handle newlines and quotes)
const formatPrivateKey = (key: string) => {
    // Remove surrounding quotes if present (some .env parsers might leave them)
    const rawKey = key.replace(/^"|"$/g, '').trim();
    return rawKey.replace(/\\n/g, "\n");
};

function createFirebaseAdminApp() {
    if (getApps().length > 0) {
        return getApp();
    }

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

    if (projectId && clientEmail && privateKeyRaw) {
        const privateKey = formatPrivateKey(privateKeyRaw);

        if (!privateKey.includes("-----BEGIN PRIVATE KEY-----") || !privateKey.includes("-----END PRIVATE KEY-----")) {
            console.error("[Firebase Admin] CRITICAL: Private Key appears malformed.");
        }

        const serviceAccount: ServiceAccount = {
            projectId,
            clientEmail,
            privateKey,
        };

        try {
            return initializeApp({
                credential: cert(serviceAccount),
                projectId,
            });
        } catch (error) {
            console.error("[Firebase Admin] Init Error:", error);
            // Fallback so app doesn't crash completely, but auth will fail
            return initializeApp({ projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID });
        }
    }

    // Fallback for Vercel / Google Cloud environments where credentials might be auto-detected
    return initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    });
}

const app = createFirebaseAdminApp();
const adminAuth = getAuth(app);

export { adminAuth };
