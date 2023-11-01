let url = 'https://apis.149segolte.dev/minor';
import type { PageLoad } from './$types';
import { goto } from '$app/navigation';

export const load: PageLoad = async ({ params }) => {
	return {
		project_id: params.id,
		model_id: params.model
	};
};
