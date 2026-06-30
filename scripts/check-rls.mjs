import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ log: ['error'] });

const rows = await prisma.$queryRaw`
  SELECT tablename, rowsecurity as rls_enabled
  FROM pg_tables
  WHERE schemaname = 'public'
  ORDER BY tablename;
`;

console.log('\nEstado de RLS por tabla:\n');
for (const row of rows) {
  const status = row.rls_enabled ? '✓ ACTIVO' : '✗ DESACTIVADO';
  console.log(`  ${row.tablename.padEnd(25)} ${status}`);
}
console.log('');

await prisma.$disconnect();
