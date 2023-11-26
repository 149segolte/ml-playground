let url = 'https://apis.149segolte.dev/minor';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, params }) => {
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
	delete model_data['config']['id'];
	delete model_data['config']['project'];
	delete model_data['config']['file'];
	let project_data = await project.json();
	return {
		project: project_data,
		model: model_data
	};
};
