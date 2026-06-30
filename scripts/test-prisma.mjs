import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'

const lines = readFileSync('.env.local', 'utf8').split('\n')
for (const line of lines) {
  const m = line.match(/^([^#=\s]+)\s*=\s*(.*)$/)
  if (m) process.env[m[1]] = m[2].replace(/^"(.*)"$/, '$1')
}

console.log('DATABASE_URL host:', process.env.DATABASE_URL?.split('@')[1]?.split('?')[0])

const p = new PrismaClient({ log: ['warn', 'error'] })
try {
  const r = await p.$queryRawUnsafe('SELECT 1 AS ok')
  console.log('✓ Conexión OK:', r)
} catch(e) {
  console.error('✗ Error:', e.message.split('\n').slice(0,3).join(' | '))
} finally {
  await p.$disconnect().catch(() => {})
}
