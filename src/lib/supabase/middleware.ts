import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Get user
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protected routes
    const clientProtectedPaths = ['/jobs', '/workers', '/analytics', '/settings']
    const workerProtectedPaths = ['/worker/dashboard', '/worker/jobs', '/worker/profile', '/worker/schedule', '/worker/settings']
    const isClientProtectedPath = clientProtectedPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
    )
    const isWorkerProtectedPath = workerProtectedPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
    )

    // Auth routes
    const authPaths = ['/login', '/register']
    const isAuthPath = authPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
    )

    // Redirect logic
    if (!user && (isClientProtectedPath || isWorkerProtectedPath)) {
        // Not logged in, trying to access protected route
        if (isWorkerProtectedPath) {
            return NextResponse.redirect(new URL('/worker/login', request.url))
        }
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (user && isAuthPath) {
        // Already logged in, trying to access auth pages - check if worker or client
        const { data: worker } = await supabase
            .from('workers')
            .select('id')
            .eq('user_id', user.id)
            .single()

        if (worker) {
            return NextResponse.redirect(new URL('/worker/dashboard', request.url))
        }
        return NextResponse.redirect(new URL('/jobs', request.url))
    }

    return supabaseResponse
}