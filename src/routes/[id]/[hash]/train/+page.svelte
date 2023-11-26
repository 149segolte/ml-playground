<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import type { PageServerData } from './$types';
	import { ArrowLeft, Plus } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table';
	import { page } from '$app/stores';
	import * as Form from '$lib/components/ui/form';
	import { modelSchema, type ModelSchema } from './schema';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { FormOptions } from 'formsnap';
	import { superForm } from 'sveltekit-superforms/client';

	let { id, hash } = $page.params;
	export let data: PageServerData;

	const form = superForm(data.form, {
		validators: modelSchema,
		onResult: (ev) => {
			if (ev.result.type === 'success') {
				invalidateAll();
			} else {
				console.error('Form validation failed', ev.result);
				alert(`Form validation failed: ${ev.result}`);
			}
		}
	});
	let val_store = form.form;

	$: console.log($val_store);

	let choices = {
		'Ordinary Least Squares': [''],
		'Elastic Net': ['alpha', 'l1_ratio', 'max_iter', 'tol'],
		'Logistic Regression': ['C', 'max_iter', 'tol'],
		'Gradient Descent': [
			'loss',
			'alpha',
			'max_iter',
			'tol',
			'shuffle',
			'learning_rate',
			'early_stopping',
			'validation_fraction'
		],
		'Decision Tree': [
			'criterion',
			'max_depth',
			'min_samples_split',
			'min_samples_leaf',
			'max_features',
			'max_leaf_nodes'
		],
		'Support Vector Machine': ['C', 'kernel', 'degree', 'gamma', 'tol', 'max_iter']
	};
</script>

<Form.Root controlled {form} schema={modelSchema} let:config>
	<Card.Root>
		<Card.Header>
			<div class="flex flex-row items-center">
				<Button size="icon" variant="ghost" on:click={() => goto(`/${id}`)}>
					<ArrowLeft />
				</Button>
				<div class="ml-4 flex items-baseline">
					<Card.Title class="text-2xl font-semibold capitalize">Model Configuration</Card.Title>
				</div>
				<Form.Button id="add" class="ml-auto rounded-full">
					<Plus class="mr-2 h-4 w-4" />
					Add to queue
				</Form.Button>
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
				<div class="ml-2 mt-4 flex flex-row gap-4">
					<Form.Field {config} name="name">
						<Form.Item>
							<Form.Label>Name</Form.Label>
							<Form.Input id="name" type="text" />
						</Form.Item>
					</Form.Field>
					<Form.Field {config} name="model">
						<Form.Item>
							<Form.Label>Model</Form.Label>
							<Form.Select preventScroll={false}>
								<Form.SelectTrigger placeholder="Choose the model type" class="min-w-[192px]" />
								<Form.SelectContent>
									{#each ['Ordinary Least Squares', 'Elastic Net', 'Logistic Regression', 'Gradient Descent', 'Decision Tree', 'Support Vector Machine'] as type}
										<Form.SelectItem value={type}>
											{type}
										</Form.SelectItem>
									{/each}
								</Form.SelectContent>
							</Form.Select>
							<Form.Validation />
						</Form.Item>
					</Form.Field>
					<Form.Field {config} name="test_size">
						<Form.Item>
							<Form.Label>Test Size</Form.Label>
							<Form.Input id="test_size" step="0.01" type="number" />
						</Form.Item>
					</Form.Field>
				</div>

				{#if $val_store.model && $val_store.model !== 'Ordinary Least Squares'}
					<span class="text-xl font-semibold mt-4">Hyperparameters</span>
					<div class="ml-2 mt-4 flex flex-row gap-4 flex-wrap">
						{#each choices[$val_store.model] as choice}
							{#if choice === 'alpha'}
								<Form.Field {config} name="alpha">
									<Form.Item>
										<Form.Label>Alpha</Form.Label>
										<Form.Input id="alpha" step="0.01" type="number" />
										<Form.Validation />
									</Form.Item>
								</Form.Field>
							{:else if choice === 'l1_ratio'}
								<Form.Field {config} name="l1_ratio">
									<Form.Item>
										<Form.Label>L1 Ratio</Form.Label>
										<Form.Input id="l1_ratio" step="0.001" type="number" />
									</Form.Item>
								</Form.Field>
							{:else if choice === 'max_iter'}
								<Form.Field {config} name="max_iter">
									<Form.Item>
										<Form.Label>Max Iterations</Form.Label>
										<Form.Input id="max_iter" type="number" />
									</Form.Item>
								</Form.Field>
							{:else if choice === 'tol'}
								<Form.Field {config} name="tol">
									<Form.Item>
										<Form.Label>Tolerance</Form.Label>
										<Form.Input id="tol" step="0.0001" type="number" />
									</Form.Item>
								</Form.Field>
							{:else if choice === 'C'}
								<Form.Field {config} name="C">
									<Form.Item>
										<Form.Label>C</Form.Label>
										<Form.Input id="C" step="0.01" type="number" />
									</Form.Item>
								</Form.Field>
							{:else if choice === 'loss'}
								<Form.Field {config} name="loss">
									<Form.Item>
										<Form.Label>Loss</Form.Label>
										<Form.Select preventScroll={false}>
											<Form.SelectTrigger placeholder="Choose the loss function" />
											<Form.SelectContent>
												{#each ['hinge', 'huber', 'log_loss', 'squared_hinge', 'perceptron', 'epsilon_insensitive', 'squared_epsilon_insensitive'] as type}
													<Form.SelectItem value={type}>
														{type}
													</Form.SelectItem>
												{/each}
											</Form.SelectContent>
										</Form.Select>
										<Form.Validation />
									</Form.Item>
								</Form.Field>
							{:else if choice === 'shuffle'}
								<Form.Field {config} name="shuffle">
									<Form.Item>
										<div class="flex flex-col space-y-2">
											<Form.Label class="my-2">Shuffle</Form.Label>
											<Form.Switch class="mt-4" />
										</div>
									</Form.Item>
								</Form.Field>
							{:else if choice === 'learning_rate'}
								<Form.Field {config} name="learning_rate">
									<Form.Item>
										<Form.Label>Learning Rate</Form.Label>
										<Form.Select preventScroll={false}>
											<Form.SelectTrigger placeholder="Choose the learning rate" />
											<Form.SelectContent>
												{#each ['constant', 'optimal', 'invscaling', 'adaptive'] as type}
													<Form.SelectItem value={type}>
														{type}
													</Form.SelectItem>
												{/each}
											</Form.SelectContent>
										</Form.Select>
										<Form.Validation />
									</Form.Item>
								</Form.Field>
							{:else if choice === 'early_stopping'}
								<Form.Field {config} name="early_stopping">
									<Form.Item>
										<div class="flex flex-col space-y-2">
											<Form.Label class="my-2">Early Stopping</Form.Label>
											<Form.Switch class="mt-4" />
										</div>
									</Form.Item>
								</Form.Field>
							{:else if choice === 'validation_fraction'}
								<Form.Field {config} name="validation_fraction">
									<Form.Item>
										<Form.Label>Validation Fraction</Form.Label>
										<Form.Input id="validation_fraction" step="0.01" type="number" />
									</Form.Item>
								</Form.Field>
							{:else if choice === 'criterion'}
								<Form.Field {config} name="criterion">
									<Form.Item>
										<Form.Label>Criterion</Form.Label>
										<Form.Select preventScroll={false}>
											<Form.SelectTrigger placeholder="Choose the criterion" />
											<Form.SelectContent>
												{#each ['gini', 'entropy', 'log_loss'] as type}
													<Form.SelectItem value={type}>
														{type}
													</Form.SelectItem>
												{/each}
											</Form.SelectContent>
										</Form.Select>
										<Form.Validation />
									</Form.Item>
								</Form.Field>
							{:else if choice === 'max_depth'}
								<Form.Field {config} name="max_depth">
									<Form.Item>
										<Form.Label>Max Depth</Form.Label>
										<Form.Input id="max_depth" type="number" />
									</Form.Item>
								</Form.Field>
							{:else if choice === 'min_samples_split'}
								<Form.Field {config} name="min_samples_split">
									<Form.Item>
										<Form.Label>Min Samples Split</Form.Label>
										<Form.Input id="min_samples_split" type="number" />
									</Form.Item>
								</Form.Field>
							{:else if choice === 'min_samples_leaf'}
								<Form.Field {config} name="min_samples_leaf">
									<Form.Item>
										<Form.Label>Min Samples Leaf</Form.Label>
										<Form.Input id="min_samples_leaf" type="number" />
									</Form.Item>
								</Form.Field>
							{:else if choice === 'max_features'}
								<Form.Field {config} name="max_features">
									<Form.Item>
										<Form.Label>Max Features</Form.Label>
										<Form.Select preventScroll={false}>
											<Form.SelectTrigger placeholder="Choose the max features" />
											<Form.SelectContent>
												{#each ['auto', 'sqrt', 'log2'] as type}
													<Form.SelectItem value={type}>
														{type}
													</Form.SelectItem>
												{/each}
											</Form.SelectContent>
										</Form.Select>
										<Form.Validation />
									</Form.Item>
								</Form.Field>
							{:else if choice === 'max_leaf_nodes'}
								<Form.Field {config} name="max_leaf_nodes">
									<Form.Item>
										<Form.Label>Max Leaf Nodes</Form.Label>
										<Form.Input id="max_leaf_nodes" type="number" />
									</Form.Item>
								</Form.Field>
							{:else if choice === 'kernel'}
								<Form.Field {config} name="kernel">
									<Form.Item>
										<Form.Label>Kernel</Form.Label>
										<Form.Select preventScroll={false}>
											<Form.SelectTrigger placeholder="Choose the kernel" />
											<Form.SelectContent>
												{#each ['linear', 'poly', 'rbf', 'sigmoid'] as type}
													<Form.SelectItem value={type}>
														{type}
													</Form.SelectItem>
												{/each}
											</Form.SelectContent>
										</Form.Select>
										<Form.Validation />
									</Form.Item>
								</Form.Field>
							{:else if choice === 'degree'}
								<Form.Field {config} name="degree">
									<Form.Item>
										<Form.Label>Degree</Form.Label>
										<Form.Input id="degree" type="number" />
									</Form.Item>
								</Form.Field>
							{:else if choice === 'gamma'}
								<Form.Field {config} name="gamma">
									<Form.Item>
										<Form.Label>Gamma</Form.Label>
										<Form.Input id="gamma" step="0.001" type="number" />
									</Form.Item>
								</Form.Field>
							{/if}
						{/each}
					</div>
				{/if}
			</div>
		</Card.Content>
	</Card.Root>
</Form.Root>
