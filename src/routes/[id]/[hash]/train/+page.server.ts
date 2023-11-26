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

		let res = await fetch(`${url}/project/${params.id}/file/${params.hash}/add`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(form.data),
			redirect: 'follow'
		});
		let data = await res.json();
		if (res.status !== 201) {
			return fail(res.status, {
				form
			});
		}
		console.log(data);

		return {
			form,
			data
		};
	}
};
