import type { PageServerLoad } from './$types';
import { url } from '$lib/api';

export const load: PageServerLoad = async ({ fetch, params }) => {
	let res = await fetch(`${url}/project`, {
		method: 'GET',
		headers: {
			'content-type': 'application/json'
		}
	});

	let data = await res.json();
	return data;
};
