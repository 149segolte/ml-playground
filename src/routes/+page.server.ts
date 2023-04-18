import * as d3 from 'd3';

function parse(str : string): string | number {
	if (Number(str) && !isNaN(parseFloat(str)))
		return +str;
	else
		return str;
}

export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const file = form.get('input');
		const csv = await file.text();
		let data = d3.csvParse(csv);
		const keys = Object.keys(data[0]);
		let types = keys.map(() => 'number');

		for (let i = 0; i < Math.ceil(data.length / 1000); i++) {
			const rand_index = Math.floor(Math.random() * data.length);
			const rand_data = data[rand_index];
			types = keys.map((key, index) => {
				if (typeof parse(rand_data[key] || '') === 'string')
					return 'string';
				else
					if (types[index] === 'string')
						return 'string';
					else
						return typeof parse(rand_data[key] || '');
			});
		}

		data = data.map(d => {
			return Object.fromEntries(keys.map((key) => [key, parse(d[key] || '')]));
		});

		console.log(data[0]);
	}
};
