import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Endpoint llamado por un cron externo cada 5-6 días para evitar el auto-pause
// de Supabase free tier (pausa tras 7 días sin actividad)
// Configurar en https://cron-job.org o similar, URL: /api/keepalive
// Con el header Authorization: Bearer <CRON_SECRET>
export async function GET(request: Request) {
    const secret = process.env.CRON_SECRET
    if (secret) {
        const auth = request.headers.get('authorization')
        if (auth !== `Bearer ${secret}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
    }

    try {
        const result = await prisma.$queryRaw<[{ one: number }]>`SELECT 1 AS one`
        return NextResponse.json({ ok: true, db: result[0].one === 1, ts: new Date().toISOString() })
    } catch (err) {
        console.error('[keepalive] DB error:', err)
        return NextResponse.json({ ok: false, error: 'DB unreachable' }, { status: 503 })
    }
}
