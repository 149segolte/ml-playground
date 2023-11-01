<script lang="ts">
	export let projects;
	let url = 'https://apis.149segolte.dev/minor';

	function calculateHoursLeft(expires: any) {
		const currentTimestamp = Math.ceil(Date.now() / 1000);
		const hoursLeft = Math.ceil((expires - currentTimestamp) / 3600);
		return hoursLeft;
	}

	async function deleteProject(id: string) {
		let res = await fetch(`${url}/project/${id}`, {
			method: 'DELETE',
			headers: {
				'content-type': 'application/json'
			}
		});

		if (res.ok) {
			projects = projects.filter((proj) => proj.id !== id);
		} else {
			console.error(`Error deleting project. Status: ${res.status}`);
			alert(`Error deleting project. Status: ${res.status}`);
		}
	}
</script>

<div>
	{#if projects.length === 0}
		<div class="flex items-center justify-between bg-gray-300 p-4 mb-4">
			<span class="text-2xl font-semibold text-gray-700 px-8"
				>Indeed, there is nothing to see here!
			</span>
		</div>
	{:else}
		{#each projects as proj}
			<div class="mx-12">
				<div class="flex items-center justify-between w-full px-12 bg-gray-300 p-4 mt-6 mb-4">
					<div class="text-blue-800">
						<a href={`/${proj.id}`}>
							<span class="text-blue-500 underline">{proj.name}</span>
						</a>
					</div>
					<div class="flex items-center">
						<!-- Container div for the last two spans -->
						<span class="text-blue-800 left-auto"
							>Expires in {calculateHoursLeft(proj.expires)}hrs
						</span>
						<span class="ml-8">
							<button
								on:click={() => deleteProject(proj.id)}
								class="text-red-500 hover:text-red-700">delete</button
							>
						</span>
					</div>
				</div>
			</div>
		{/each}
	{/if}
</div>
