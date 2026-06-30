/**
 * Importa los datos exportados de Firestore (migration/export/*.json)
 * hacia PostgreSQL (Supabase) via Prisma.
 *
 * Optimizado para reducir round trips: carga lookups en memoria
 * y usa createMany para bulk inserts.
 */

import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const EXPORT_DIR = resolve(projectRoot, 'migration', 'export');

const prisma = new PrismaClient({ log: ['error'] });

function readJson(name) {
  return JSON.parse(readFileSync(resolve(EXPORT_DIR, `${name}.json`), 'utf8'));
}

function toDate(value) {
  if (!value) return null;
  return new Date(value);
}

// ─── Importers ───────────────────────────────────────────────────────────────

async function importTypologies(data) {
  await prisma.typology.createMany({
    data: data.map(d => ({
      firestoreId: d.id,
      name: d.name,
      description: d.description ?? null,
      createdAt: toDate(d.createdAt) ?? new Date(),
    })),
    skipDuplicates: true,
  });
  return data.length;
}

async function importAgencies(data) {
  await prisma.agency.createMany({
    data: data.map(d => ({
      firestoreId: d.id,
      name: d.name,
      logoUrl: d.logoUrl ?? null,
      logoPublicId: d.logoPublicId ?? null,
      phone: d.phone ?? null,
      createdAt: toDate(d.createdAt) ?? new Date(),
    })),
    skipDuplicates: true,
  });
  return data.length;
}

async function importBrands(data) {
  await prisma.brand.createMany({
    data: data.map(d => ({
      firestoreId: d.id,
      name: d.name,
      logoUrl: d.logoUrl ?? null,
      logoPublicId: d.logoPublicId ?? null,
      website: d.website ?? null,
      createdAt: toDate(d.createdAt) ?? new Date(),
    })),
    skipDuplicates: true,
  });
  return data.length;
}

async function importUsers(data) {
  await prisma.user.createMany({
    data: data.map(d => ({
      firestoreId: d.uid ?? d.id,
      firebaseUid: d.uid ?? null,
      name: d.name,
      email: d.email,
      role: d.role === 'superadmin' ? 'superadmin' : 'user',
      createdAt: toDate(d.createdAt) ?? new Date(),
    })),
    skipDuplicates: true,
  });
  return data.length;
}

async function importProperties(data) {
  // Carga todas las typologies en memoria (1 sola query)
  const typologies = await prisma.typology.findMany({ select: { id: true, firestoreId: true } });
  const typologyMap = new Map(typologies.map(t => [t.firestoreId, t.id]));

  // Bulk insert properties
  await prisma.property.createMany({
    data: data.map(d => ({
      firestoreId: d.id,
      unitNumber: d.unitNumber,
      typologyId: d.typologyId ? (typologyMap.get(d.typologyId) ?? null) : null,
      floor: d.floor,
      status: d.status ?? 'available',
      price: d.price ?? null,
      area: d.area ?? null,
      disposition: d.disposition ?? null,
      createdAt: toDate(d.createdAt) ?? new Date(),
      updatedAt: toDate(d.updatedAt) ?? null,
    })),
    skipDuplicates: true,
  });

  // Carga todas las properties en memoria (1 sola query) para las imágenes
  const properties = await prisma.property.findMany({ select: { id: true, firestoreId: true } });
  const propertyMap = new Map(properties.map(p => [p.firestoreId, p.id]));

  // Bulk insert imágenes
  const allImages = [];
  for (const d of data) {
    if (!d.images?.length) continue;
    const propertyId = propertyMap.get(d.id);
    if (!propertyId) continue;
    d.images.forEach((img, i) => {
      allImages.push({
        propertyId,
        url: img.url,
        publicId: img.publicId ?? null,
        position: i,
      });
    });
  }

  await prisma.propertyImage.createMany({
    data: allImages,
    skipDuplicates: true,
  });

  return { propCount: data.length, imgCount: allImages.length };
}

async function importSales(data) {
  if (!data.length) return 0;
  const properties = await prisma.property.findMany({ select: { id: true, firestoreId: true } });
  const propertyMap = new Map(properties.map(p => [p.firestoreId, p.id]));

  const rows = [];
  const skipped = [];
  for (const d of data) {
    const propertyId = propertyMap.get(d.unitId);
    if (!propertyId) { skipped.push(d.id); continue; }
    rows.push({
      firestoreId: d.id,
      propertyId,
      buyerName: d.buyerName,
      buyerLastName: d.buyerLastName,
      buyerDni: d.buyerDni,
      buyerPhone: d.buyerPhone ?? null,
      buyerEmail: d.buyerEmail ?? null,
      closingValue: d.closingValue,
      currency: d.currency ?? 'USD',
      deliveryPercentage: d.deliveryPercentage ?? null,
      deliveryAmount: d.deliveryAmount ?? null,
      installmentCount: d.installmentCount ?? null,
      installmentsBalance: d.installmentsBalance ?? null,
      installmentBaseAmount: d.installmentBaseAmount ?? null,
      updatableIndex: d.updatableIndex ?? false,
      indexType: d.indexType ?? null,
      boletoDate: toDate(d.boletoDate),
      createdAt: toDate(d.createdAt) ?? new Date(),
    });
  }

  if (skipped.length) console.log(`  [WARN] ${skipped.length} ventas sin property válida, omitidas`);
  if (!rows.length) return 0;

  await prisma.sale.createMany({ data: rows, skipDuplicates: true });
  return rows.length;
}

async function importInstallments(data) {
  if (!data.length) return 0;
  const sales = await prisma.sale.findMany({ select: { id: true, firestoreId: true } });
  const saleMap = new Map(sales.map(s => [s.firestoreId, s.id]));

  const rows = [];
  for (const d of data) {
    const saleId = saleMap.get(d.ventaId);
    if (!saleId) continue;
    rows.push({
      firestoreId: d.id,
      saleId,
      number: d.number,
      dueDate: new Date(d.dueDate),
      amount: d.amount,
      status: d.status ?? 'pendiente',
      paymentDate: toDate(d.paymentDate),
      appliedPercentage: d.appliedPercentage ?? null,
    });
  }

  if (!rows.length) return 0;
  await prisma.installment.createMany({ data: rows, skipDuplicates: true });
  return rows.length;
}

async function importFiles(data) {
  if (!data.length) return 0;
  await prisma.file.createMany({
    data: data.map(d => ({
      firestoreId: d.id,
      name: d.name,
      url: d.url,
      type: d.type ?? null,
      uploadedAt: toDate(d.uploadedAt) ?? new Date(),
    })),
    skipDuplicates: true,
  });
  return data.length;
}

async function importProjectUpdates(data) {
  if (!data.length) return 0;
  await prisma.projectUpdate.createMany({
    data: data.map(d => ({
      firestoreId: d.id,
      date: new Date(d.date),
      title: d.title,
      description: d.description ?? null,
      videoUrl: d.videoUrl ?? null,
      youtubeId: d.youtubeId ?? null,
      createdAt: toDate(d.createdAt) ?? new Date(),
    })),
    skipDuplicates: true,
  });
  return data.length;
}

async function importGallery(data) {
  const galleryDoc = data.find(d => d.id === 'gallery');
  if (!galleryDoc?.images?.length) return 0;

  await prisma.galleryImage.createMany({
    data: galleryDoc.images.map((img, i) => ({
      url: img.url,
      caption: img.caption ?? null,
      position: i,
      updatedAt: toDate(galleryDoc.updatedAt) ?? new Date(),
    })),
    skipDuplicates: true,
  });
  return galleryDoc.images.length;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Importando datos JSON → PostgreSQL (Supabase)\n');

  const steps = [
    { name: 'typologies',      fn: () => importTypologies(readJson('typologies')) },
    { name: 'agencies',        fn: () => importAgencies(readJson('agencies')) },
    { name: 'brands',          fn: () => importBrands(readJson('brands')) },
    { name: 'users',           fn: () => importUsers(readJson('users')) },
    { name: 'properties',      fn: () => importProperties(readJson('properties')) },
    { name: 'sales',           fn: () => importSales(readJson('ventas')) },
    { name: 'installments',    fn: () => importInstallments(readJson('cuotas')) },
    { name: 'files',           fn: () => importFiles(readJson('files')) },
    { name: 'project_updates', fn: () => importProjectUpdates(readJson('project_updates')) },
    { name: 'gallery_images',  fn: () => importGallery(readJson('project_settings')) },
  ];

  const summary = {};
  for (const step of steps) {
    process.stdout.write(`  ${step.name}...`);
    const result = await step.fn();
    const count = typeof result === 'object' ? result.propCount : result;
    const extra = typeof result === 'object' ? ` (+ ${result.imgCount} imágenes)` : '';
    console.log(` ${count}${extra}`);
    summary[step.name] = count;
  }

  console.log('\n--- RESUMEN ---');
  let total = 0;
  for (const [name, count] of Object.entries(summary)) {
    console.log(`  ${name.padEnd(20)} ${count}`);
    total += count;
  }
  console.log(`  ${'TOTAL'.padEnd(20)} ${total}`);
  console.log('\nImport completo.');
}

main()
  .catch(err => {
    console.error('\nError:', err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
