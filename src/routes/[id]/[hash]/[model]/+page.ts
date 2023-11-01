let url = 'https://apis.149segolte.dev/minor';
import type { PageLoad } from './$types';
import { goto } from '$app/navigation';

export const load: PageLoad = async ({ params }) => {
	let model = await fetch(`${url}/project/${params.id}/model/${params.model}`, {
		method: 'GET',
		headers: {
			'content-type': 'application/json'
		}
	});

	let project = await fetch(`${url}/project/${params.id}`, {
		method: 'GET',
		headers: {
			'content-type': 'application/json'
		}
	});

	let model_data = await model.json();
	model_data.id = params.model;
	let project_data = await project.json();
	return {
		project: project_data,
		model: model_data
	};
};
