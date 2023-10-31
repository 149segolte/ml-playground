<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { goto } from '$app/navigation';

	import { db } from '$lib/db';

	let url = 'https://apis.149segolte.dev/minor';
	let dispatch = createEventDispatcher();
	let id = $page.url.pathname.split('/')[1];
	var hash;
	let requestData = {
		name: '',
		model_type: '',
		train_size: 0,
		test_size: 0,
		validation_size: 0,
		l2_regularization: 0,
		learning_rate: 0,
		max_epochs: 0,
		batch_size: 0
	};

	function handleInputChange(event) {
		const { name, value } = event.target;
		requestData = { ...requestData, [name]: value };
	}

	async function submitData() {
		// get data table from dexie as string
		const data = await db.data.get(1);
		if (data) {
			const name = data.name;
			const csvData = data.csvData;
			// convert csvData to Blob
			var blob = new Blob([csvData], { type: 'text/plain' });
			var file = new File([blob], name, { type: 'text/plain' });

			let formData = new FormData();
			formData.append('data', file, name);
			formData.append('target', 'Species');

			const res = await fetch(`${url}/project/${id}/upload`, {
				method: 'POST',
				body: formData,
				headers: {
					'Content-Type': 'multipart/form-data'
				},
				redirect: 'follow'
			});

			const resdata = await res.json();

			hash = resdata.hash;

			const response = await fetch(`${url}/project/${id}/data/${hash}/add`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(requestData)
			});

			const responseData = await response.json();
		}
	}
</script>

<div class="bg-gray-200">
	<div class="container min-h-screen relative">
		<div class="flex justify-between bg-gray-300 p-4 mb-4">
			<span class="text-2xl font-semibold text-gray-700 px-8">File's Name (Size)</span>
			<div class="button-group">
				<button class="bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-gray-800">Add</button>
				<button
					class="bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-gray-800"
					on:click={submitData}>Done</button
				>
				<button class="bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-gray-800"
					>Cancel</button
				>
			</div>
		</div>

		<div class="mt-10 font-semibold">
			<div
				class="bg-white p-4 ml-8 shadow float-left"
				style="width: 45%; max-height: 30rem; overflow-y: auto;"
			>
				<div>
					<label for="name">Name:</label>
					<input
						type="text"
						id="name"
						name="name"
						bind:value={requestData.name}
						on:input={handleInputChange}
					/>
				</div>
				<div>
					<label for="model_type">Model Type:</label>
					<input
						type="text"
						id="model_type"
						name="model_type"
						bind:value={requestData.model_type}
						on:input={handleInputChange}
					/>
				</div>
				<div>
					<label for="train_size">Train Size:</label>
					<input
						type="number"
						id="train_size"
						name="train_size"
						bind:value={requestData.train_size}
						on:input={handleInputChange}
					/>
				</div>

				<div>
					<label for="test_size">Test Size:</label>
					<input
						type="number"
						id="test_size"
						name="test_size"
						bind:value={requestData.test_size}
						on:input={handleInputChange}
					/>
				</div>
				<div>
					<label for="validation_size">Validation Size:</label>
					<input
						type="number"
						id="validation_size"
						name="validation_size"
						bind:value={requestData.validation_size}
						on:input={handleInputChange}
					/>
				</div>
				<div>
					<label for="l2_regularization">L2 Regularization:</label>
					<input
						type="number"
						step="0.01"
						id="l2_regularization"
						name="l2_regularization"
						bind:value={requestData.l2_regularization}
						on:input={handleInputChange}
					/>
				</div>
				<div>
					<label for="learning_rate">Learning Rate:</label>
					<input
						type="number"
						step="0.01"
						id="learning_rate"
						name="learning_rate"
						bind:value={requestData.learning_rate}
						on:input={handleInputChange}
					/>
				</div>
				<div>
					<label for="max_epochs">Max Epochs:</label>
					<input
						type="number"
						id="max_epochs"
						name="max_epochs"
						bind:value={requestData.max_epochs}
						on:input={handleInputChange}
					/>
				</div>
				<div>
					<label for="batch_size">Batch Size:</label>
					<input
						type="number"
						id="batch_size"
						name="batch_size"
						bind:value={requestData.batch_size}
						on:input={handleInputChange}
					/>
				</div>
			</div>
		</div>
	</div>
</div>
