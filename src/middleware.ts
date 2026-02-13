import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const adminPath = process.env.ADMIN_PATH || '/admin'

    // Only intercept requests to the admin path
    if (request.nextUrl.pathname.startsWith(adminPath)) {
        const authCookie = request.cookies.get('admin_session')

        // If no cookie, redirect to login
        if (!authCookie?.value) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'], // Note: We might need to adjust this if ADMIN_PATH is dynamic, but for now strict /admin is fine or we can match all and filter in function.
}
