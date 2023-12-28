import type { Handle } from '@sveltejs/kit';
import { decodeToken } from '$lib/server/firebase';
import { SESSION_COOKIE_NAME } from '$lib/constants';

export const handle = (async ({ event, resolve }) => {
    const token = event.cookies.get(SESSION_COOKIE_NAME);
    if (token) {
        const user = await decodeToken(token);
        if (user) {
            event.locals.user = user.toJSON();
        }
    }
    return resolve(event);
}) satisfies Handle;
