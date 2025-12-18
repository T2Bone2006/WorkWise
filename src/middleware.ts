import { type NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Default page
    const defaultPage = '/workwise/workers';

    // Allowed routes
    const allowedRoutes = [
        '/workwise/workers',
        '/workwise/terms',
        '/workwise/privacy',
    ];

    // Redirect root / to default page
    if (pathname === '/') {
        return NextResponse.redirect(new URL(defaultPage, request.url));
    }

    // If the route is allowed, continue
    if (allowedRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Redirect all other routes to default page
    return NextResponse.redirect(new URL(defaultPage, request.url));
}

export const config = {
    matcher: [
        // Match all routes except Next.js internals and static files
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
