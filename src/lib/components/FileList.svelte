<script lang="ts">
	export let files = [];
	let url = 'https://apis.149segolte.dev/minor';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	let id = $page.url.pathname.split('/')[1];

	function calculateHoursLeft(expires: any) {
		const currentTimestamp = Math.ceil(Date.now() / 1000);
		const hoursLeft = Math.ceil((expires - currentTimestamp) / 3600);
		return hoursLeft;
	}

	async function deleteFile(id: string, hash: string) {
		let res = await fetch(`${url}/project/${id}/data/${hash}`, {
			method: 'DELETE',
			headers: {
				'content-type': 'application/json'
			}
		});
		files = files.filter((file) => file.hash !== hash);
		goto(`/${id}`);
	}
</script>

<div>
	{#if files.length === 0}
		<div class="flex items-center justify-between bg-gray-300 p-4 mb-4">
			<span class="text-2xl font-semibold text-gray-700 px-8"
				>Indeed, there is nothing to see here!
			</span>
		</div>
	{:else}
		{#each files as file}
			<div class="mx-8">
				<div class="flex items-center justify-between w-full px-12 bg-gray-300 p-4 mt-10 mb-4">
					<a href={`/${id}/${file.hash}`}>
						<span class="text-blue-500">{file.name} {file.size}</span>
					</a>
					<div>
						<span class="text-blue-800 mr-10">{file.shape[0]} rows, {file.shape[1]} columns</span>
						<button
							on:click={() => deleteFile(id, file.hash)}
							class="text-red-500 ml-8 hover:text-red-700">delete</button
						>
					</div>
				</div>
			</div>
		{/each}
	{/if}
</div>
