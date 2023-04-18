import * as dfd from 'danfojs';

export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const file = form.get('input');
		const data = await dfd.read_csv(file);

		console.log(data[0]);
	}
};
