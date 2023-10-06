<script lang="ts">
	import { goto } from '$app/navigation';
	let url = 'https://apis.149segolte.dev/minor';
	let projectName: HTMLInputElement;
	let description: HTMLTextAreaElement;

	async function submitProject() {
		var data = {
			name: projectName.value,
			description: description.value
		};

		let res = await fetch(`${url}/project`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		const dataa = await res.json();
		goto('/');
	}
</script>

<div>
	<div class="max-w-md mx-auto p-6 rounded-md mt-20">
		<div class="max-w-md bg-gray-400 p-6 rounded-md shadow-md">
			<h2 class="text-3xl title-font font-medium mb-4">Project Information</h2>

			<div class="mb-4">
				<label for="projectName" class="block text-black font-bold mb-2">Project Name:</label>
				<input
					bind:this={projectName}
					type="text"
					id="projectName"
					placeholder="Project's Name"
					name="projectName"
					class="border rounded w-full py-2 px-3"
				/>
			</div>

			<div class="mb-4">
				<label for="description" class="block text-black font-bold mb-2">Description:</label>
				<textarea
					bind:this={description}
					placeholder="Description"
					id="description"
					name="description"
					class="border rounded w-full py-2 px-3"
				/>
			</div>

			<button
				on:click={submitProject}
				class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
				>Submit</button
			>
		</div>
	</div>
</div>
