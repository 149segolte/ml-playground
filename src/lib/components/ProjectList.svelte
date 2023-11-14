<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Table from '$lib/components/ui/table';
	import { Pencil, X } from 'lucide-svelte';
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
		<div class="">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head class="w-[240px]">Name</Table.Head>
						<Table.Head>Description</Table.Head>
						<Table.Head class="w-[100px]">Validity</Table.Head>
						<Table.Head class="w-[100px] text-right">Actions</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each projects as proj}
						<Table.Row>
							<Table.Cell class="font-medium">
								<span class="cursor-pointer hover:underline" on:click={() => goto(`/${proj.id}`)}>
									{proj.name}
								</span>
							</Table.Cell>
							<Table.Cell>{proj.description}</Table.Cell>
							<Table.Cell>{calculateHoursLeft(proj.expires)} hrs</Table.Cell>
							<Table.Cell class="flex flex-row gap-2 items-center justify-end">
								<span class="hover:text-blue-500 cursor-pointer">
									<Pencil size="20" />
								</span>
								<span class="hover:text-red-500 cursor-pointer" on:click={() => deleteProject(proj.id)}>
									<X />
								</span>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	{/if}
</div>
