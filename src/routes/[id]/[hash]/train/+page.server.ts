import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { url } from '$lib/api';
import { superValidate } from 'sveltekit-superforms/server';
import { modelSchema } from './schema';

export const load: PageServerLoad = async ({ fetch, params }) => {
	let res = await fetch(`${url}/project/${params.id}/file/${params.hash}`, {
		method: 'GET',
		headers: {
			'content-type': 'application/json'
		}
	});

	let data = await res.json();
	const form = await superValidate(modelSchema);
	return { ...data, form };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, modelSchema);
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		console.log(form);
		return {
			form
		};
	}
};
