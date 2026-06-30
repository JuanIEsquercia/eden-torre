import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (!pathname.startsWith('/admin')) {
        return NextResponse.next()
    }

    const authCookie = request.cookies.get('eden-auth')
    if (!authCookie?.value) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    const role = request.cookies.get('eden-role')?.value ?? 'user'

    // Usuarios regulares solo pueden acceder a /admin (dashboard) y /admin/sales
    const allowedForUser = pathname === '/admin' || pathname.startsWith('/admin/sales')
    if (role !== 'superadmin' && !allowedForUser) {
        return NextResponse.redirect(new URL('/admin', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}
