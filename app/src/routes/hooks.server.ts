import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
    const ua = event.request.headers.get('user-agent') || ''
    const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(ua)

    if (isMobile && event.url.pathname !== '/') return Response.redirect(new URL('/', event.url).toString(), 302)

    console.log(isMobile, ua)

    return resolve(event)
}
