import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

// Load .env.local manually (dotenv not installed)
function loadEnv(filePath) {
  const content = readFileSync(filePath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

loadEnv(resolve(projectRoot, '.env.local'));

// Convert Firestore Timestamps and nested objects to JSON-safe values
function serialize(obj) {
  if (obj === null || obj === undefined) return obj;
  if (obj instanceof Timestamp) return obj.toDate().toISOString();
  if (Array.isArray(obj)) return obj.map(serialize);
  if (typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, serialize(v)])
    );
  }
  return obj;
}

// Init Firebase Admin
const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '')
  .replace(/^"|"$/g, '')
  .replace(/\\n/g, '\n');

const app = initializeApp({
  credential: cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey,
  }),
});

const db = getFirestore(app);

const OUTPUT_DIR = resolve(projectRoot, 'migration', 'export');
mkdirSync(OUTPUT_DIR, { recursive: true });

const COLLECTIONS = [
  'typologies',
  'properties',
  'ventas',
  'users',
  'brands',
  'agencies',
  'files',
  'project_settings',
  'project_updates',
];

async function exportCollection(name) {
  const snapshot = await db.collection(name).get();
  const docs = snapshot.docs.map(doc => serialize({ id: doc.id, ...doc.data() }));
  return docs;
}

async function main() {
  console.log('Exportando Firestore → JSON\n');
  console.log(`Proyecto: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`);
  console.log(`Destino:  migration/export/\n`);

  const summary = {};

  // Export main collections
  for (const name of COLLECTIONS) {
    process.stdout.write(`  ${name}...`);
    const docs = await exportCollection(name);
    writeFileSync(
      resolve(OUTPUT_DIR, `${name}.json`),
      JSON.stringify(docs, null, 2),
      'utf8'
    );
    summary[name] = docs.length;
    console.log(` ${docs.length} registros`);
  }

  // Export cuotas sub-collection (flattened with ventaId)
  process.stdout.write('  cuotas (sub-coleccion)...');
  const ventas = JSON.parse(readFileSync(resolve(OUTPUT_DIR, 'ventas.json'), 'utf8'));
  const allCuotas = [];
  for (const venta of ventas) {
    const snap = await db.collection('ventas').doc(venta.id).collection('cuotas').get();
    const cuotas = snap.docs.map(doc => serialize({ id: doc.id, ventaId: venta.id, ...doc.data() }));
    allCuotas.push(...cuotas);
  }
  writeFileSync(
    resolve(OUTPUT_DIR, 'cuotas.json'),
    JSON.stringify(allCuotas, null, 2),
    'utf8'
  );
  summary['cuotas'] = allCuotas.length;
  console.log(` ${allCuotas.length} registros`);

  // Summary
  console.log('\n--- RESUMEN ---');
  let total = 0;
  for (const [name, count] of Object.entries(summary)) {
    console.log(`  ${name.padEnd(20)} ${count} registros`);
    total += count;
  }
  console.log(`  ${'TOTAL'.padEnd(20)} ${total} registros`);
  console.log('\nExport completo. Archivos en: web/migration/export/');
}

main().catch(err => {
  console.error('\nError durante el export:', err.message);
  process.exit(1);
});
