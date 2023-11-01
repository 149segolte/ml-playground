<script lang="ts">
	import { db } from '$lib/db';
	import type { Data } from '$lib/db';

	let selectedFile: File | undefined;
	let url = 'https://apis.149segolte.dev/minor';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	let id = $page.url.pathname.split('/')[1];
	console.log($page.url.pathname);

	function handleFileUpload(event: Event) {
		if (event.target?.files) {
			selectedFile = event.target?.files[0];
		}
	}

	async function addFile() {
		if (selectedFile) {
			const name = selectedFile.name;
			const reader = new FileReader();
			reader.onload = async (event) => {
				const csvData = event.target?.result;

				// Store the CSV data in the Dexie database
				await db.data.add({ name, csvData } as Data);

				// goto model page
				goto(`/${id}/model`);
			};

			reader.readAsText(selectedFile);
		} else {
			alert('Please select a CSV file.');
		}
	}
</script>

<div class="flex justify-center items-center mt-20">
	<div class="max-w-md bg-gray-400 p-6 rounded-md shadow-md">
		<h2 class="text-2xl font-bold mb-4 text-center">Upload CSV File</h2>

		<label class="block text-gray-700 font-bold mb-2">
			<input
				type="file"
				accept=".csv"
				class="mt-2 p-2 border rounded w-full focus:outline-none"
				on:change={handleFileUpload}
			/>
		</label>

		<button
			class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
			on:click={addFile}
		>
			Submit
		</button>

		<p class="text-sm text-black mt-2">Upload your CSV file here.</p>
		<p class="text-sm text-black">Supported formats: .csv</p>
	</div>
</div>
