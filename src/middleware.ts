import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Default page
    const defaultPage = '/workwise/workers';

    // Public routes (no auth required)
    const publicRoutes = [
        '/workwise/workers',
        '/workwise/terms',
        '/workwise/privacy',
        '/api/worker-waitlist',
        '/login',
        '/register',
        '/admin/login',
        '/sitemap.xml',
        '/robots.txt',
    ];

    // Redirect root / to default page
    if (pathname === '/') {
        return NextResponse.redirect(new URL(defaultPage, request.url));
    }

    // If the route is public, continue
    if (publicRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Check if this is an admin route (but not the login page)
    const isAdminRoute = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');

    if (isAdminRoute) {
        // Create Supabase client for session check
        let response = NextResponse.next({ request });

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value }) =>
                            request.cookies.set(name, value)
                        );
                        response = NextResponse.next({ request });
                        cookiesToSet.forEach(({ name, value, options }) =>
                            response.cookies.set(name, value, options)
                        );
                    },
                },
            }
        );

        // Check for valid session
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            // No session, redirect to admin login
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        // Check if user is an admin
        const { data: adminData } = await supabase
            .from('admins')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (!adminData) {
            // Not an admin, sign them out and redirect to admin login
            // We can't sign out in middleware, so just redirect with an error param
            return NextResponse.redirect(new URL('/admin/login?error=unauthorized', request.url));
        }

        // User is authenticated admin, allow access
        return response;
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
