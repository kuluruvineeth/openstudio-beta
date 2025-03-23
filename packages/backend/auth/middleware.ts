import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import { keys } from '../keys';

const env = keys();

export async function updateSession(request: NextRequest) {
  const url = request.nextUrl;
  const path = url.pathname;
  const hostname = request.headers.get('host')!;
  const searchParams = `?${url.searchParams.toString()}`;
  //TODO: Later move to env variable
  // const userDomain = process.env.NEXT_PUBLIC_USER_DOMAIN as string;
  const userDomain = 'openstudio.co.in';
  const appDomain = 'app.openstudio.tech';
  const vercelDomain = '.vercel.app';

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          supabaseResponse = NextResponse.next({
            request,
          });
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  if (
    hostname.endsWith(`.${userDomain}`) ||
    url.pathname.includes(`localhost:3000/user/kuluruvineeth`)
  ) {
    return NextResponse.rewrite(
      new URL(
        `/user/${hostname.split('.')[0]}${path === '/' ? '' : path}${
          url.searchParams ? searchParams : ''
        }`,
        request.url
      )
    );
  }

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const publicDomains = [
    'localhost:3001',
    'openstudio.tech',
    'www.openstudio.tech',
  ];

  if (publicDomains.includes(hostname)) {
    return supabaseResponse;
  }

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/sign-in') &&
    !request.nextUrl.pathname.startsWith('/sign-up') &&
    !request.nextUrl.pathname.startsWith('/auth') &&
    !request.nextUrl.pathname.startsWith('/api/auth/callback')
  ) {
    // no user, potentially respond by redirecting the user to the sign-in page
    const url = request.nextUrl.clone();
    url.pathname = '/sign-in';
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
