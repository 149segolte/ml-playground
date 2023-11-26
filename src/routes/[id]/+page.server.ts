import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { url } from '$lib/api';
import { superValidate } from 'sveltekit-superforms/server';
import { formSchema } from './schema';

export const load: PageServerLoad = async ({ fetch, params }) => {
	let res = await fetch(`${url}/project/${params.id}`, {
		method: 'GET',
		headers: {
			'content-type': 'application/json'
		}
	});

	let data = await res.json();
	const form = await superValidate(formSchema);
	return { ...data, id: params.id, form };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const formData = await request.formData();
		let file = formData.get('file');
		const form = await superValidate(formData, formSchema);
		if (!form.valid || !(file instanceof File)) {
			console.log(file);
			return fail(400, {
				form
			});
		}
		let payload = {
			...form.data,
			file: {
				name: file.name,
				type: file.type,
				content: await file.text()
			}
		};
		let res = await fetch(`${url}/clean`, {
			method: 'PUT',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(payload)
		});
		let data = await res.json();
		if (res.status !== 200) {
			return fail(res.status, {
				form: {
					...form.data,
					errors: data.errors
				}
			});
		}

		data.content_type = data.type;
		delete data.type;
		let raw = JSON.stringify({
			...form.data,
			file: data
		});

		let res2 = await fetch(`${url}/project/${params.id}/add`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: raw,
			redirect: 'follow'
		});
		let data2 = await res2.json();
		if (res2.status !== 201) {
			return fail(res2.status, {
				form: {
					...form.data,
					errors: data2.errors
				}
			});
		}
		return {
			form
		};
	}
};
