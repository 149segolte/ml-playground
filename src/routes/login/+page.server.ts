import { SESSION_COOKIE_NAME } from '$lib/constants';
import { redirect, fail } from '@sveltejs/kit'
import type { Actions } from './$types';

export const load = async ({ locals }) => {
	// redirect user if already logged in
	if (locals.user) {
		throw redirect(302, '/')
	}
}

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const formData = await request.formData();
        const token = formData.get('token')?.valueOf();
        if (!token || typeof token !== 'string') {
            return fail(400, { message: 'Token is a required field and must be a string' });
        }
        cookies.set(SESSION_COOKIE_NAME, token, {
            httpOnly: true,
            path: '/',
            secure: true
        });
        return { success: true };
    }
};
