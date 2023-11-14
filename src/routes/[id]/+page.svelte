<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';
	import { ArrowLeft, Pencil, Trash2, Loader2, Upload, X } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Sheet from '$lib/components/ui/sheet';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import * as Table from '$lib/components/ui/table';
	import { Toggle } from '$lib/components/ui/toggle';
	import { z } from 'zod';
	import Papa from 'papaparse';
	import { page } from '$app/stores';

	let id = $page.params.id;
	export let data: PageData;
	let csv: {
		name: string;
		content_type: string;
		size: number;
		shape: [number, number];
		columns: string[];
		data: any[];
	} | null = null;
	let valid_types = z.enum([
		'text/csv',
		'text/tab-separated-values',
		'application/json',
		'application/xml'
	]);
	let sheet_open = false;

	function fileHandler(ev) {
		if (ev.target === null) return;
		if (ev.target.files && ev.target.files.length > 0) {
			if (valid_types.safeParse(ev.target.files[0].type).success) {
				Papa.parse(ev.target.files[0], {
					header: true,
					skipEmptyLines: true,
					dynamicTyping: true,
					complete: (results) => {
						csv = {
							name: ev.target.files[0].name,
							content_type: ev.target.files[0].type,
							size: ev.target.files[0].size,
							shape: [results.data.length, results.meta.fields.length],
							columns: results.meta.fields,
							data: results.data
						};
					}
				});
			} else {
				alert('Invalid file type');
			}
		}
	}

	function getIcon(contentType: string) {
		// TODO: Add more icons
		contentType = 'file';
		if (valid_types.safeParse(contentType).success) {
			return `/icons/${contentType.split('/')[1]}.svg`;
		} else {
			return '/icons/file.svg';
		}
	}

	function bytesToSize(bytes: number) {
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		if (bytes === 0) return '0 Byte';
		const i = Math.floor(Math.log(bytes) / Math.log(1024));
		return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
	}

	function deleteFile(hash: string) {
		fetch(`https://apis.149segolte.dev/minor/project/${id}/file/${hash}`, {
			method: 'DELETE'
		}).then((res) => {
			if (res.ok) {
				invalidateAll();
			} else {
				console.error(`Error deleting file. Status: ${res.status}`);
				alert(`Error deleting file. Status: ${res.status}`);
			}
		});
	}

	let debug = false;
	function addFile() {
		if (debug) {
			console.log(csv);
			return;
		} else {
		let target = (document.getElementById('target') as HTMLInputElement).value;
		if (target === '') {
			alert('Please select a target column');
			return;
		}

		if (csv) {
			var formdata = new FormData();
			let csv_str = Papa.unparse(csv.data, { header: true, columns: csv.columns });
			let blob = new Blob([csv_str], { type: csv.content_type });
			formdata.append('data', blob, csv.name);
			formdata.append('target', target);

			fetch(`https://apis.149segolte.dev/minor/project/${id}/add`, {
				method: 'POST',
				body: formdata,
				redirect: 'follow'
			}).then((res) => {
				if (res.ok) {
					invalidateAll();
					csv = null;
					sheet_open = false;
				} else {
					console.error(`Error adding file. Status: ${res.status}`);
					alert(`Error adding file. Status: ${res.status}`);
				}
			});
		}
		}
	}

	function visualize() {
		let model = (document.getElementById('model') as HTMLInputElement).value;
		if (model === '') {
			alert('Please select a model');
			return;
		}
		goto(`/${id}/model/${model}`);
	}
</script>

<Card.Root>
	<Card.Header>
		<div class="flex flex-row items-center">
			<Button size="icon" variant="ghost" on:click={() => goto('/')}>
				<ArrowLeft />
			</Button>
			<div class="ml-4 flex items-baseline">
				<Card.Title class="text-2xl font-semibold capitalize">{data.name}</Card.Title>
				<Card.Description class="ml-4 text-md text-gray-500">{data.description}</Card.Description>
			</div>
			<Button class="ml-auto">
				<Pencil class="mr-2 h-4 w-4" />
				Edit
			</Button>
		</div>
	</Card.Header>

	<Card.Content class="px-6 md:px-12">
		<span class="text-2xl font-semibold">Files</span>
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2 mt-4">
			{#each data.files as file}
				<Card.Root>
					<Card.Header class="p-4">
						<img
							src={getIcon(file.content_type)}
							alt="file icon"
							class="mx-auto w-20 aspect-square dark:invert"
						/>
					</Card.Header>
					<Card.Content class="px-4 pb-4 pt-0">
						<div class="flex flex-row items-center">
							<Dialog.Root>
								<Dialog.Trigger class={buttonVariants({ variant: 'link' }) + ' !p-0'}>
									<Card.Title class="text-xl">{file.name}</Card.Title>
								</Dialog.Trigger>
								<Dialog.Content class="max-w-3xl">
									<Dialog.Header>
										<Dialog.Title class="text-xl">{file.name}</Dialog.Title>
									</Dialog.Header>
									<div class="flex flex-col">
										<div class="mt-1 flex flex-row flex-wrap gap-2">
											<Badge class="whitespace-nowrap">
												Shape: {file.shape[0]} x {file.shape[1]}
											</Badge>
											<Badge class="whitespace-nowrap">
												Size: {bytesToSize(file.size)}
											</Badge>
											<Badge class="whitespace-nowrap">
												Target: {file.target}
											</Badge>
											<Badge class="whitespace-nowrap">
												Empty: {file.empty || 'Drop'}
											</Badge>
											<Badge class="whitespace-nowrap">
												Categorical: {file.categorical || 'Ordinal'}
											</Badge>
											<Badge class="whitespace-nowrap">
												Bucket: {file.bucket || 'None'}
											</Badge>
											<Badge class="whitespace-nowrap">
												Scale: {file.scale || 'None'}
											</Badge>
											<Badge class="whitespace-nowrap">
												Trained: {file.models.length}
											</Badge>
											{#if file.training}
												<Loader2 class="animate-spin" />
												Training...
											{/if}
										</div>
										<div class="mt-4 text-md font-semibold">Top 5 rows</div>
										<Table.Root>
											<Table.Header>
												<Table.Row>
													{#each file.features as col}
														<Table.Head class="font-medium">{col}</Table.Head>
													{/each}
													<Table.Head class="font-medium">{file.target}</Table.Head>
												</Table.Row>
											</Table.Header>
											<Table.Body>
												{#each file.head as row}
													<Table.Row>
														{#each row as val}
															<Table.Cell>{val}</Table.Cell>
														{/each}
													</Table.Row>
												{/each}
											</Table.Body>
										</Table.Root>
									</div>
									<Dialog.Footer class="flex sm:items-center">
										{#if file.models.length > 0}
											<Select.Root>
												<Select.Trigger class="max-w-[10rem] mr-2">
													<Select.Value placeholder="Select a model" />
												</Select.Trigger>
												<Select.Content>
													<Select.Group>
														{#each file.models as model}
															<Select.Item value={model[0]} label={model[1]}>{model[1]}</Select.Item
															>
														{/each}
													</Select.Group>
												</Select.Content>
												<Select.Input name="model" id="model" />
											</Select.Root>
											<Button class="ml-2" on:click={visualize}>Visualize</Button>
										{/if}
										<Button on:click={() => goto(`/${id}/${file.hash}/train`)}>
											Train a Model
										</Button>
									</Dialog.Footer>
								</Dialog.Content>
							</Dialog.Root>
							<Dialog.Root>
								<Dialog.Trigger
									class={buttonVariants({ variant: 'ghost', size: 'icon' }) +
										' !ml-auto hover:text-red-500'}
								>
									<Trash2 size="18" />
								</Dialog.Trigger>
								<Dialog.Content>
									<Dialog.Header>
										<Dialog.Title>Are you sure?</Dialog.Title>
										<Dialog.Description>
											This action cannot be undone. This file will be permanently deleted.
										</Dialog.Description>
									</Dialog.Header>
									<Dialog.Footer>
										<Button
											id="del"
											variant="destructive"
											on:click={() => {
												document.getElementById('del').disabled = true;
												deleteFile(file.hash);
											}}
										>
											Delete
										</Button>
									</Dialog.Footer>
								</Dialog.Content>
							</Dialog.Root>
						</div>
						<div class="flex flex-col items-center w-full">
							<span class="text-gray-500 text-sm">
								It contains {file.shape[0]} rows x {file.shape[1]} columns with a size of {bytesToSize(
									file.size
								)}
							</span>
							<div class="mt-1 flex flex-row w-full">
								<Badge class="mr-2">
									Trained: {file.models.length}
								</Badge>
								{#if file.training}
									<Loader2 class="animate-spin" />
								{/if}
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			{/each}
			<div class="rounded-lg border border-dashed bg-card text-card-foreground shadow-sm">
				<Sheet.Root bind:open={sheet_open}>
					<Sheet.Trigger class="w-full h-full min-h-[15.875rem]">
						<div class="w-full aspect-square flex flex-col items-center justify-center">
							<span class="text-4xl">+</span>
							<span class="text-xl">Add File</span>
						</div>
					</Sheet.Trigger>
					<Sheet.Content side="right">
						<Sheet.Header>
							<Sheet.Title>Add File</Sheet.Title>
							<Sheet.Description>Upload a file to your project</Sheet.Description>
						</Sheet.Header>
						<div class="mt-4 flex flex-col justify-center">
							{#if !csv}
								<div
									class="p-4 rounded-lg border border-dashed bg-card text-card-foreground shadow-sm flex flex-col items-center justify-center relative"
								>
									<Input
										type="file"
										accept=".csv,.tsv,.json,.xml"
										multiple={false}
										class="opacity-0 absolute left-0 top-0 w-full h-full cursor-pointer"
										on:change={fileHandler}
									/>
									<Upload class="w-20 h-20" />
									<span class="text-lg mt-4">Drag and drop your file here</span>
								</div>
							{:else}
								<div class="flex flex-row items-center justify-between">
									<div class="flex flex-col">
										<Label for="name" class="text-md mb-1">Name</Label>
										<Input type="text" id="name" value={csv.name.split('.')[0]} />
									</div>
									<div class="flex flex-col">
										<Label for="type" class="text-md mb-1">Debug</Label>
										<Toggle pressed={debug}>D</Toggle>
									</div>
								</div>
								<div class="flex flex-row items-center mt-4">
									<div class="w-2/3">
										<Label class="text-md">Shape</Label>
										<div class="mt-1 flex flex-row items-center">
											<Input type="number" class="w-2/5 mr-2" value={csv.shape[0]} readonly />
											<X size={20} />
											<Input type="number" class="w-2/5 ml-2" value={csv.shape[1]} readonly />
										</div>
									</div>
									<div class="w-1/3">
										<Label class="text-md">Size</Label>
										<Input type="text" class="mt-1" value={bytesToSize(csv.size)} readonly />
									</div>
								</div>
								<Label for="target" class="text-md mt-4">Target</Label>
								<Select.Root>
									<Select.Trigger class="mt-1">
										<Select.Value placeholder="Select a column" />
									</Select.Trigger>
									<Select.Content>
										<Select.Group>
											{#each csv.columns as col}
												<Select.Item value={col} label={col}>{col}</Select.Item>
											{/each}
										</Select.Group>
									</Select.Content>
									<Select.Input name="target" id="target" />
								</Select.Root>
								<Label for="emptys" class="text-md mt-4">Empty Values</Label>
								<Select.Root>
									<Select.Trigger class="mt-1">
										<Select.Value placeholder="Choose a method to handle empty values" />
									</Select.Trigger>
									<Select.Content>
										<Select.Group>
											<Select.Item value="drop" label="Drop">Drop</Select.Item>
											<Select.Item value="mean" label="Mean">Mean</Select.Item>
											<Select.Item value="median" label="Median">Median</Select.Item>
											<Select.Item value="mode" label="Mode">Mode</Select.Item>
										</Select.Group>
									</Select.Content>
									<Select.Input name="emptys" id="emptys" />
								</Select.Root>
								<Label for="categories" class="text-md mt-4">Categorical Encoding</Label>
								<Select.Root>
									<Select.Trigger class="mt-1">
										<Select.Value placeholder="Choose a method to encode categorical values" />
									</Select.Trigger>
									<Select.Content>
										<Select.Group>
											<Select.Item value="onehot" label="One Hot">One Hot</Select.Item>
											<Select.Item value="label" label="Label">Label</Select.Item>
											<Select.Item value="ordinal" label="Ordinal">Ordinal</Select.Item>
											<Select.Item value="binary" label="Binary">Binary</Select.Item>
										</Select.Group>
									</Select.Content>
									<Select.Input name="categories" id="categories" />
								</Select.Root>
								<div class="grid grid-cols-2 gap-2 mt-4">
									<div>
										<Label for="bucket" class="text-md">Bucketing</Label>
										<Select.Root multiple>
											<Select.Trigger class="mt-1">
												<Select.Value placeholder="Select columns to bucket" />
											</Select.Trigger>
											<Select.Content>
												<Select.Group>
													{#each csv.columns as col}
														<Select.Item value={col} label={col}>{col}</Select.Item>
													{/each}
												</Select.Group>
											</Select.Content>
											<Select.Input name="bucket" id="bucket" />
										</Select.Root>
									</div>
									<div>
										<Label for="bucket_type" class="text-md">Bucketing type</Label>
										<Select.Root>
											<Select.Trigger class="mt-1">
												<Select.Value placeholder="Choose a method to bucket values" />
											</Select.Trigger>
											<Select.Content>
												<Select.Group>
													<Select.Item value="equal" label="Equal">Equal</Select.Item>
													<Select.Item value="kmeans" label="K-Means">K-Means</Select.Item>
													<Select.Item value="quantile" label="Quantile">Quantile</Select.Item>
												</Select.Group>
											</Select.Content>
											<Select.Input name="bucket_type" id="bucket_type" />
										</Select.Root>
									</div>
								</div>
								<Label for="scale" class="text-md mt-4">Scaling</Label>
								<Select.Root>
									<Select.Trigger class="mt-1">
										<Select.Value placeholder="Choose a method to scale values" />
									</Select.Trigger>
									<Select.Content>
										<Select.Group>
											<Select.Item value="minmax" label="Min-Max">Min-Max</Select.Item>
											<Select.Item value="standard" label="Standard">Standard</Select.Item>
											<Select.Item value="robust" label="Robust">Robust</Select.Item>
											<Select.Item value="maxabs" label="Max-Abs">Max-Abs</Select.Item>
											<Select.Item value="quantile" label="Quantile">Quantile</Select.Item>
										</Select.Group>
									</Select.Content>
									<Select.Input name="scale" id="scale" />
								</Select.Root>
							{/if}
						</div>
						<Sheet.Footer class="mt-4">
							{#if csv}
								<Sheet.Close
									id="cancel"
									class={buttonVariants({ variant: 'outline' }) + ' '}
									on:click={() => (csv = null)}
								>
									Cancel
								</Sheet.Close>
								<Button
									id="upload"
									on:click={() => {
										document.getElementById('upload').disabled = true;
										document.getElementById('cancel').disabled = true;
										addFile();
									}}
								>
									Upload
								</Button>
							{:else}
								<Button disabled>Upload</Button>
							{/if}
						</Sheet.Footer>
					</Sheet.Content>
				</Sheet.Root>
			</div>
		</div>
	</Card.Content>
</Card.Root>
