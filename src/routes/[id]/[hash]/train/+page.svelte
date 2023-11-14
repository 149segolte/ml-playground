<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import { Switch } from '$lib/components/ui/switch';
	import { ArrowLeft, Plus } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { z } from 'zod';

	export let data: PageData;
	let { id, hash } = $page.params;
	let modelSchema = z.object({
		name: z.string(),
		model: z.discriminatedUnion('type', [
			z.object({
				task: z.enum(['Regression']),
				type: z.enum([
					'Ordinary Least Squares',
					'Isotonic Regression',
					'GLM',
					'Elastic Net',
					'Binomial Logistic Regression',
					'Multinomial Logistic Regression'
				])
			}),
			z.object({
				task: z.enum(['Classification']),
				type: z.enum([
					'Decision Tree',
					'Support Vector Machine',
					'Gaussian Naive Bayes',
					'Multinomial Naive Bayes'
				])
			}),
			z.object({
				task: z.enum(['Clustering']),
				type: z.enum(['KMeans', 'DBSCAN'])
			})
		]),
		split: z.object({
			test_size: z.number().min(0).max(1),
			shuffle: z.boolean()
		}),
		hyperparameters: z.object({
			learning_rate: z.number().min(0.0001).max(1),
			epochs: z.number().min(1),
			batch_size: z.number().min(1),
			optimizer: z.enum(['Adam', 'Adagrad', 'Adamax', 'Ftrl']),
			loss: z.enum([
				'RSME',
				'MSE',
				'MAE',
				'MSLE',
				'MAPE',
				'Hinge',
				'Log Cosh',
				'Binary Crossentropy',
				'Poisson',
				'Cosine Similarity',
				'Huber'
			])
		})
	});

	let model = {
		name: 'Model 1',
		model: {
			task: '',
			type: ''
		},
		split: {
			test_size: 0.2,
			shuffle: true
		},
		hyperparameters: {
			learning_rate: 0.01,
			epochs: 100,
			batch_size: 32,
			optimizer: 'Adam',
			loss: 'MSE',
			metrics: 'MAE'
		}
	};
	const inner1 = model.model;
	const inner2 = model.split;
	const inner3 = model.hyperparameters;
	$: inner1, (model = model);
	$: inner2, (model = model);
	$: inner3, (model = model);

	function addModel() {
		let valid = modelSchema.safeParse(model);
		if (!valid.success) {
			console.log(valid.error);
			(document.getElementById('add') as HTMLButtonElement).disabled = false;
			alert(`Invalid model configuration: ${valid.error}`);
			return;
		}

		let payload = {
			name: valid.data.name,
			model_type: 'Linear Regression',
			train_size: Math.round((1 - valid.data.split.test_size) * 100),
			test_size: Math.round(valid.data.split.test_size * 100),
			validation_size: 0,
			l2_regularization: 0.05,
			learning_rate: valid.data.hyperparameters.learning_rate,
			max_epochs: valid.data.hyperparameters.epochs,
			batch_size: valid.data.hyperparameters.batch_size
		};
		fetch(`https://apis.149segolte.dev/minor/project/${id}/file/${hash}/add`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		})
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					(document.getElementById('add') as HTMLButtonElement).disabled = false;
					console.error(`Error adding model. Status: ${res.status}`);
					alert(`Error adding model. Status: ${res.status}`);
				}
			})
			.then((data) => {
				goto(`/${id}`);
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
				<Card.Title class="text-2xl font-semibold capitalize">Model Configuration</Card.Title>
			</div>
			<Button
				id="add"
				class="ml-auto rounded-full"
				on:click={() => {
					document.getElementById('add').disabled = true;
					addModel();
				}}
			>
				<Plus class="mr-2 h-4 w-4" />
				Add to queue
			</Button>
		</div>
	</Card.Header>

	<Card.Content class="px-6 md:px-12">
		<div class="grid grid-cols-2 gap-4">
			<div class="border rounded-lg bg-card text-card-foreground shadow-sm h-min">
				<Table.Root>
					<Table.Body>
						<Table.Row>
							<Table.Head class="border-r">Dataset</Table.Head>
							<Table.Cell>{data.name.split('.')[0]}</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Head class="border-r">Shape</Table.Head>
							<Table.Cell>{data.shape.join(' x ')}</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Head class="border-r">Target</Table.Head>
							<Table.Cell>{data.target}</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Head class="border-r">Features</Table.Head>
							<Table.Cell>{data.features.join(', ')}</Table.Cell>
						</Table.Row>
					</Table.Body>
				</Table.Root>
			</div>

			<div class="border rounded-lg bg-card text-card-foreground shadow-sm">
				<Table.Root>
					<Table.Header>
						<Table.Row>
							{#each data.features as col}
								<Table.Head class="font-medium">{col}</Table.Head>
							{/each}
							<Table.Head class="font-medium">{data.target}</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each data.head as row}
							<Table.Row>
								{#each row as val}
									<Table.Cell>{val}</Table.Cell>
								{/each}
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</div>
		</div>
		<div class="flex flex-col">
			<span class="text-xl font-semibold">Model</span>
			<div class="ml-2 mt-4 flex flex-row items-center">
				<div class="mr-4 flex flex-row items-center max-w-sm">
					<Label for="name" class="text-md mr-4">Name</Label>
					<Input id="name" type="text" bind:value={model.name} />
				</div>
				<div class="mr-4 flex flex-row items-center max-w-sm">
					<Label for="task" class="text-md mr-4">Task</Label>
					<Select.Root>
						<Select.Trigger>
							<Select.Value class="min-w-[12rem]" placeholder="Select the task" />
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								{#each ['Regression', 'Classification', 'Clustering'] as task}
									<Select.Item value={task} on:click={() => (model.model.task = task)}>
										{task}
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</div>
				{#if model.model.task === 'Regression'}
					<div class="flex flex-row items-center max-w-sm">
						<Label for="type" class="text-md mr-4">Type</Label>
						<Select.Root preventScroll={false}>
							<Select.Trigger>
								<Select.Value class="min-w-[12rem]" placeholder="Select the type" />
							</Select.Trigger>
							<Select.Content>
								<Select.Group>
									{#each ['Ordinary Least Squares', 'Isotonic Regression', 'GLM', 'Elastic Net', 'Binomial Logistic Regression', 'Multinomial Logistic Regression'] as type}
										<Select.Item value={type} on:click={() => (model.model.type = type)}>
											{type}
										</Select.Item>
									{/each}
								</Select.Group>
							</Select.Content>
						</Select.Root>
					</div>
				{:else if model.model.task === 'Classification'}
					<div class="flex flex-row items-center max-w-sm">
						<Label for="type" class="text-md mr-4">Type</Label>
						<Select.Root preventScroll={false}>
							<Select.Trigger>
								<Select.Value class="min-w-[12rem]" placeholder="Select the type" />
							</Select.Trigger>
							<Select.Content>
								<Select.Group>
									{#each ['Decision Tree', 'Support Vector Machine', 'Gaussian Naive Bayes', 'Multinomial Naive Bayes'] as type}
										<Select.Item value={type} on:click={() => (model.model.type = type)}>
											{type}
										</Select.Item>
									{/each}
								</Select.Group>
							</Select.Content>
						</Select.Root>
					</div>
				{:else if model.model.task === 'Clustering'}
					<div class="flex flex-row items-center max-w-sm">
						<Label for="type" class="text-md mr-4">Type</Label>
						<Select.Root preventScroll={false}>
							<Select.Trigger>
								<Select.Value class="min-w-[12rem]" placeholder="Select the type" />
							</Select.Trigger>
							<Select.Content>
								<Select.Group>
									{#each ['KMeans', 'DBSCAN'] as type}
										<Select.Item value={type} on:click={() => (model.model.type = type)}>
											{type}
										</Select.Item>
									{/each}
								</Select.Group>
							</Select.Content>
						</Select.Root>
					</div>
				{/if}
			</div>
			{#if model.model.type}
				<div class="ml-2 mt-4 flex flex-row items-center">
					<div class="mr-4 flex flex-row items-center max-w-sm">
						<Label for="test_size" class="whitespace-nowrap text-md mr-4">Test Size</Label>
						<Input id="test_size" type="number" bind:value={model.split.test_size} />
					</div>
					<div class="mr-4 flex flex-row items-center max-w-sm">
						<div class="flex items-center space-x-2">
							<Switch id="shuffle" bind:checked={model.split.shuffle} />
							<Label for="shuffle" class="text-md">Shuffle</Label>
						</div>
					</div>
				</div>
				<div class="ml-2 mt-4 flex flex-row items-center">
					<div class="mr-4 flex flex-row items-center max-w-md">
						<Label for="learning_rate" class="whitespace-nowrap text-md mr-4">Learning Rate</Label>
						<Input
							id="learning_rate"
							type="number"
							bind:value={model.hyperparameters.learning_rate}
						/>
					</div>
					<div class="mr-4 flex flex-row items-center max-w-sm">
						<Label for="epochs" class="text-md mr-4">Epochs</Label>
						<Input id="epochs" type="number" bind:value={model.hyperparameters.epochs} />
					</div>
					<div class="mr-4 flex flex-row items-center max-w-sm">
						<Label for="batch_size" class="whitespace-nowrap text-md mr-4">Batch Size</Label>
						<Input id="batch_size" type="number" bind:value={model.hyperparameters.batch_size} />
					</div>
				</div>
				<div class="ml-2 mt-4 flex flex-row items-center">
					<div class="mr-4 flex flex-row items-center max-w-sm">
						<Label for="optimizer" class="text-md mr-4">Optimizer</Label>
						<Select.Root preventScroll={false}>
							<Select.Trigger>
								<Select.Value class="min-w-[12rem]" placeholder="Select the optimizer" />
							</Select.Trigger>
							<Select.Content>
								<Select.Group>
									{#each ['Adam', 'Adagrad', 'Adamax', 'Ftrl'] as optimizer}
										<Select.Item
											value={optimizer}
											on:click={() => (model.hyperparameters.optimizer = optimizer)}
										>
											{optimizer}
										</Select.Item>
									{/each}
								</Select.Group>
							</Select.Content>
						</Select.Root>
					</div>
					<div class="mr-4 flex flex-row items-center max-w-sm">
						<Label for="loss" class="text-md mr-4">Loss</Label>
						<Select.Root preventScroll={false}>
							<Select.Trigger>
								<Select.Value class="min-w-[12rem]" placeholder="Select the loss" />
							</Select.Trigger>
							<Select.Content>
								<Select.Group>
									{#each ['RSME', 'MSE', 'MAE', 'MSLE', 'MAPE', 'Hinge', 'Log Cosh', 'Binary Crossentropy', 'Poisson', 'Cosine Similarity', 'Huber'] as loss}
										<Select.Item value={loss} on:click={() => (model.hyperparameters.loss = loss)}>
											{loss}
										</Select.Item>
									{/each}
								</Select.Group>
							</Select.Content>
						</Select.Root>
					</div>
				</div>
			{/if}
		</div>
	</Card.Content>
</Card.Root>
