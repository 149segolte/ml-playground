<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	let url = $page.url.pathname;
	export let data: PageData;
	let model_data = data.model;
	let project = data.project;
</script>

<div>
	<div>
		<div class="flex items-center justify-between bg-gray-300 p-4 mb-4">
			<span class="text-2xl font-semibold text-gray-700 px-8">{project.name}</span>
			<div class=" flex justify-end">
				<button
					class="bg-gray-700 text-white px-4 py-2 rounded-full mr-10 hover:bg-gray-800"
					on:click={() => {
						goto(`${url}/predict`);
					}}>Perdict</button
				>
				<button class="bg-gray-700 text-white px-4 py-2 rounded-full mr-10 hover:bg-gray-800"
					>Edit Project</button
				>
				<button class="bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-gray-800"
					>Add Project</button
				>
			</div>
		</div>
	</div>
	<div class="mx-20 mt-10">
		<div>
			<h1 class="text-black font-sans text-3xl leading-normal">Training Summary</h1>
			<p class="mt-4 font-sans text-lg text-gray-700">
				Your dataset had {model_data.config.shape[0]} rows and {model_data.config.shape[1]} columns,
				{model_data.config.shape[0]} rows were used in training, {model_data.config.test_size} rows were
				used in testing, and {model_data.config.shape[1]} columns, {model_data.config.shape[0]} rows
				were used in training, {model_data.config.train_size} rows were used in model comparison. The
				model is a {model_data.config.shape[1]} columns, {model_data.config.shape[0]} rows were used
				in training, {model_data.config.betch_size}rows were used in model comparison
			</p>
		</div>
		<div class="mt-4 font-sans text-lg">
			<h1 class="text-black font-sans text-3xl leading-normal">Metrics</h1>
			<p class="mt-4 text-gray-700">
				Your model was evaluated on the test dataset and accurately classified 100% of the examples.
				This is compared with the baseline accuracy of 23.33%, which is what the model would get if
				it always predicted the majority class.
			</p>
		</div>
	</div>
	<div class="mt-10 mx-20 border h-36 border-gray-300 bg-gray-100 rounded-sm">
		<div class="text-center">
			<p class="text-xl mt-3">Accuracy</p>
			<p class="text-lg text-green-500">76.67%</p>
		</div>
		<div class="flex justify-center">
			<div class="text-center mr-4">
				<p class="text-3xl">23.33%</p>
				<span class=" bg-gray-400 text-lg rounded-lg px-2">Baseline</span>
			</div>
			<div class="text-center">
				<p class="text-3xl">100%</p>
				<span class="text-lg bg-blue-400 rounded-lg px-2">Training</span>
			</div>
		</div>
	</div>
	<div class="mx-20 border border-gray-300 bg-gray-100 rounded-sm mt-10 h-96">
		<div>
			<p class="text-lg text-center font-sans">Training Loss By Round or Epoch</p>
			<div class="flex items-center justify-center">
				<div class="w-4 h-4 bg-blue-500 rounded-sm mr-2" />
				<span class="text-lg">Loss</span>
			</div>
		</div>
	</div>
	<div class="text-center mt-4">
		<p class="font-semibold text-xl">Feature Importances</p>
		<p class="text-xl">
			The chart and table below show which features were most important to the model.
		</p>
	</div>
	<div class="mx-20 border border-gray-300 bg-gray-100 rounded-sm mt-10 h-96">
		<div>
			<p class="text-lg text-center font-sans">Training Loss By Round or Epoch</p>
			<div class="flex items-center justify-center">
				<div class="w-4 h-4 bg-blue-700 rounded-sm mr-2" />
				<span class="text-lg">Feature Importance</span>
			</div>
		</div>
	</div>

	<div class="mx-20 border-black mt-10">
		<table class="min-w-full bg-white border border-gray-300">
			<thead>
				<tr>
					<th class="py-2 px-4 text-left border-b border-gray-300 bg-gray-100">Feature Name</th>
					<th class="py-2 px-4 text-left border-b border-gray-300 bg-gray-100"
						>Feature Importance Value</th
					>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="py-2 px-4 border-b">PetalWidthCm</td>
					<td class="py-2 px-4 border-b">0.33470824</td>
				</tr>
				<tr>
					<td class="py-2 px-4 border-b">PetalLengthCm</td>
					<td class="py-2 px-4 border-b">0.2863413</td>
				</tr>
				<tr>
					<td class="py-2 px-4 border-b">SepalWidthCm</td>
					<td class="py-2 px-4 border-b">0.20674689</td>
				</tr>
				<tr>
					<td class="py-2 px-4 border-b">SepalLengthCm</td>
					<td class="py-2 px-4 border-b">0.17220357</td>
				</tr>
			</tbody>
		</table>
	</div>
	<div class="h-20" />
</div>
