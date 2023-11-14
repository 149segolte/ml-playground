<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';
	import { Plus, Pencil, X } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Table from '$lib/components/ui/table';
	import { z } from 'zod';

	export let data: PageData;
	const schema = z.object({
		name: z.string().min(4),
		description: z.string().min(1)
	});

	function calcHours(timestamp: number) {
		const now = Date.now();
		const diff = timestamp * 1000 - now;
		return Math.floor(diff / 1000 / 60 / 60);
	}

	function createProject() {
		const name = (document.getElementById('name') as HTMLInputElement).value;
		const desc = (document.getElementById('desc') as HTMLInputElement).value;

		const result = schema.safeParse({ name, description: desc });
		if (!result.success) {
			console.error(result.error);
			alert(`Error creating project. ${result.error}`);
			return;
		}

		fetch('https://apis.149segolte.dev/minor/project', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(result.data)
		})
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					console.error(`Error creating project. Status: ${res.status}`);
					alert(`Error creating project. Status: ${res.status}`);
				}
			})
			.then((data) => {
				goto(`/${data.id}`);
			});
	}

	function deleteProject(id: string) {
		fetch(`https://apis.149segolte.dev/minor/project/${id}`, {
			method: 'DELETE'
		}).then((res) => {
			if (res.ok) {
				invalidateAll();
			} else {
				console.error(`Error deleting project. Status: ${res.status}`);
				alert(`Error deleting project. Status: ${res.status}`);
			}
		});
	}
</script>

<Card.Root>
	<Card.Header>
		<div class="flex flex-row">
			<Card.Title class="text-2xl">Your Projects</Card.Title>
			<Dialog.Root>
				<Dialog.Trigger class={buttonVariants() + ' !ml-auto'}>
					<Plus class="mr-2 h-4 w-4" />
					New
				</Dialog.Trigger>
				<Dialog.Content class="sm:max-w-[425px]">
					<Dialog.Header>
						<Dialog.Title>New Project</Dialog.Title>
						<Dialog.Description>Give your project a name and a description.</Dialog.Description>
					</Dialog.Header>
					<div class="grid gap-4 py-4">
						<div class="grid grid-cols-4 items-center gap-4">
							<Label class="text-right">Name</Label>
							<Input id="name" placeholder="ML Project" class="col-span-3" required />
						</div>
						<div class="grid grid-cols-4 items-center gap-4">
							<Label class="text-right">Description</Label>
							<Input
								id="desc"
								value="Tinkering with another side quest."
								class="col-span-3"
								required
							/>
						</div>
					</div>
					<Dialog.Footer>
						<Button
							id="create"
							on:click={() => {
								document.getElementById('create').disabled = true;
								createProject();
							}}
						>
							Create
						</Button>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>
		</div>
	</Card.Header>

	<Card.Content>
		{#if data.projects.length === 0}
			<div class="px-8 py-4 text-xl font-semibold">Start by adding your first project here!</div>
		{:else}
			<Table.Root class="text-md">
				<Table.Header>
					<Table.Row>
						<Table.Head class="w-[240px]">Name</Table.Head>
						<Table.Head>Description</Table.Head>
						<Table.Head class="w-[100px]">Validity</Table.Head>
						<Table.Head class="w-[100px] text-right">Actions</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.projects as proj}
						<Table.Row>
							<Table.Cell>
								<Button variant="link" class="text-md capitalize pl-0 h-6" href={`/${proj.id}`}>
									{proj.name}
								</Button>
							</Table.Cell>
							<Table.Cell>{proj.description}</Table.Cell>
							<Table.Cell>{calcHours(proj.expires)} hrs</Table.Cell>
							<Table.Cell class="p-3 flex flex-row gap-2 items-center justify-end">
								<Button variant="ghost" size="icon" class="w-8 h-8 hover:text-blue-500">
									<Pencil size="20" />
								</Button>
								<Dialog.Root>
									<Dialog.Trigger
										class={buttonVariants({ variant: 'ghost', size: 'icon' }) +
											' w-8 h-8 hover:text-red-500'}
									>
										<X />
									</Dialog.Trigger>
									<Dialog.Content>
										<Dialog.Header>
											<Dialog.Title>Are you sure?</Dialog.Title>
											<Dialog.Description>
												This action cannot be undone. This will permanently delete this project.
											</Dialog.Description>
										</Dialog.Header>
										<Dialog.Footer>
											<Button
												id="del"
												variant="destructive"
												on:click={() => {
													document.getElementById('del').disabled = true;
													deleteProject(proj.id);
												}}
											>
												Delete
											</Button>
										</Dialog.Footer>
									</Dialog.Content>
								</Dialog.Root>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		{/if}
	</Card.Content>
</Card.Root>
