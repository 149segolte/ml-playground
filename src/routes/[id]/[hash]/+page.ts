let url = 'https://apis.149segolte.dev/minor';
import type { PageLoad } from './$types';
import { goto } from '$app/navigation';

export const load: PageLoad = async ({params}) => {
	let res = await fetch(`${url}/project/${params.id}/data/${params.hash}/models`, {
		method: "GET",
		headers: {
		"content-type": "application/json"
	}});

	let response = await res.json()

 	if (response.models.length === 0) {
        	goto('/');
		return {};
	} else {
		let model = await fetch(`${url}/project/${params.id}/model/${response.models[0].id}`, {
			method: "GET",
			headers: {
			"content-type": "application/json"
		}});

        	let model_data = await model.json();
			model_data.project_id = params.id;
        	return model_data;
	}
} 
    











