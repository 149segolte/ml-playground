<script lang="ts">
	import { goto } from '$app/navigation';
	import * as d3 from 'd3';
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { ArrowLeft, HelpCircle, Trash2 } from 'lucide-svelte';

	const { id, model } = $page.params;
	export let data: PageData;
	let project = data.project;
	let file = project.files.find((file) => file.hash === data.model.data_hash);
	let result: number | null = null;

	function predict() {
		let features: number[][] = [[]];
		for (let i = 0; i < file.features.length; i++) {
			let val = parseFloat((document.getElementById(file.features[i]) as HTMLInputElement).value);
			if (isNaN(val)) {
				alert('Please fill in all the features');
				(document.getElementById('predict') as HTMLButtonElement).disabled = false;
				return;
			}
			features[0].push(val);
		}

		if (features[0].length !== file.features.length) {
			alert('Please fill in all the features');
			(document.getElementById('predict') as HTMLButtonElement).disabled = false;
			return;
		}

		fetch(`https://apis.149segolte.dev/minor/project/${id}/model/${model}/predict`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ input: features })
		})
			.then((res) => res.json())
			.then((res) => {
				result = res.data[0];
				(document.getElementById('predict') as HTMLButtonElement).disabled = false;
			});
	}

	function deleteModel() {
		fetch(`https://apis.149segolte.dev/minor/project/${id}/model/${model}`, {
			method: 'DELETE'
		}).then((res) => {
			if (res.status === 200) {
				goto(`/${id}`);
			} else {
				alert('Something went wrong');
				(document.getElementById('delete') as HTMLButtonElement).disabled = false;
			}
		});
	}
</script>

<Card.Root>
	<Card.Header>
		<div class="flex flex-row items-center">
			<Button size="icon" variant="ghost" on:click={() => goto(`/${id}`)}>
				<ArrowLeft />
			</Button>
			<div class="ml-4 flex items-baseline">
				<Card.Title class="text-2xl font-semibold capitalize"
					>{file.name.split('.')[0]} / {data.model.name}</Card.Title
				>
			</div>
			<Dialog.Root>
				<Dialog.Trigger
					class={buttonVariants({ variant: 'outline' }) + ' !ml-auto hover:text-red-500'}
				>
					<Trash2 class="mr-2 h-4 w-4" />
					Delete
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Are you sure?</Dialog.Title>
						<Dialog.Description>
							This action is irreversible. Entire model will be deleted.
						</Dialog.Description>
					</Dialog.Header>
					<Dialog.Footer>
						<Button
							variant="destructive"
							id="delete"
							on:click={() => {
								document.getElementById('delete').disabled = true;
								deleteModel();
							}}
						>
							Delete
						</Button>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>
			<Dialog.Root>
				<Dialog.Trigger class={buttonVariants() + ' !ml-4'}>
					<HelpCircle class="mr-2 h-4 w-4" />
					Predict
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Predictions</Dialog.Title>
						<Dialog.Description>
							Enter the values for the features you want to predict
						</Dialog.Description>
					</Dialog.Header>
					<div class="grid grid-cols-2 gap-4">
						{#each file.features as feature}
							<div class="flex flex-col">
								<Label for={feature}>{feature}</Label>
								<Input class="mt-2" id={feature} type="number" />
							</div>
						{/each}
					</div>
					{#if result}
						<div class="mt-4">
							<Label for="result">Result</Label>
							<Input class="mt-2" id="result" type="number" value={result} readonly />
						</div>
					{/if}
					<Dialog.Footer>
						<Button
							id="predict"
							on:click={() => {
								document.getElementById('predict').disabled = true;
								predict();
							}}
						>
							Predict
						</Button>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>
		</div>
	</Card.Header>

	<Card.Content class="px-6 md:px-12">
		<div class="grid grid-cols-2 gap-4">
			<div>
				<span class="text-2xl font-semibold">Overview</span>
				<div class="mt-4 flex flex-col gap-4">
					<div class="border rounded-lg bg-card text-card-foreground shadow-sm h-min">
						<Table.Root>
							<Table.Body>
								<Table.Row>
									<Table.Head class="border-r">Dataset</Table.Head>
									<Table.Cell>{file.name.split('.')[0]}</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Head class="border-r">Shape</Table.Head>
									<Table.Cell>{file.shape.join(' x ')}</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Head class="border-r">Target</Table.Head>
									<Table.Cell>{file.target}</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Head class="border-r">Features</Table.Head>
									<Table.Cell>{file.features.join(', ')}</Table.Cell>
								</Table.Row>
							</Table.Body>
						</Table.Root>
					</div>

					<div class="border rounded-lg bg-card text-card-foreground shadow-sm h-min">
						<Table.Root>
							<Table.Body>
								<Table.Row>
									<Table.Head class="border-r">Model</Table.Head>
									<Table.Cell>{data.model.name}</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Head class="border-r">Type</Table.Head>
									<Table.Cell>{data.model.model_type}</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Head class="border-r">Split</Table.Head>
									<Table.Cell
										>Train: {data.model.config.train_size / 100} / Test: {data.model.config
											.test_size / 100}</Table.Cell
									>
								</Table.Row>
								<Table.Row>
									<Table.Head class="border-r">Learning Rate</Table.Head>
									<Table.Cell>{data.model.config.learning_rate.toFixed(2)}</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Head class="border-r">Epochs</Table.Head>
									<Table.Cell>{data.model.config.max_epochs}</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Head class="border-r">Batch Size</Table.Head>
									<Table.Cell>{data.model.config.batch_size}</Table.Cell>
								</Table.Row>
							</Table.Body>
						</Table.Root>
					</div>
				</div>
			</div>

			<div>
				<span class="text-2xl font-semibold mt-8">Metrics</span>
				<div class="mt-4 flex flex-col gap-4">
					{#each Object.keys(data.model.metrics) as metric}
						<div class="border rounded-lg bg-card text-card-foreground shadow-sm h-min">
							<Table.Root>
								<Table.Body>
									{#each Object.keys(data.model.metrics[metric]) as key}
										<Table.Row>
											<Table.Head class="border-r">{key}</Table.Head>
											<Table.Cell>{data.model.metrics[metric][key]}</Table.Cell>
										</Table.Row>
									{/each}
								</Table.Body>
							</Table.Root>
						</div>
					{/each}
				</div>
			</div>
		</div></Card.Content
	>
</Card.Root>
