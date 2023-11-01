<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	let url = 'https://apis.149segolte.dev/minor';
	let id = $page.url.pathname.split('/')[1];
	let resultValue;

	export let data: PageData;

	let sepalLength;
	let sepalWidth;
	let petalLength;
	let petalWidth;
	let name = ['Iris-setosa', 'Iris-versicolor', 'Iris-virginica'];

	async function predict() {
		let raw = JSON.stringify({
			input: [[sepalLength, sepalWidth, petalLength, petalWidth]]
		});

		const response = await fetch(`${url}/project/${id}/model/${data.model_id}/predict`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: raw,
			redirect: 'follow'
		});
		const result = await response.json();
		resultValue = name[Math.round(result.result.data[0]) % 3];
	}
</script>

<div class="mt-20 ml-10 flex justify-between">
	<div class="w-1/2">
		<div>
			<div class="w-32 h-8 bg-gray-500 rounded-2xl flex items-center justify-center">
				<p class="w-full h-full px-3 py-1 text-left text-white">Number</p>
			</div>
			<p class="px-2">SepalLengthCm</p>
			<input
				type="number"
				bind:value={sepalLength}
				class="w-3/5 h-full px-2 py-3 bg-transparent text-white border border-slate-600 focus:outline-none hover:border-black"
				placeholder="5.854074001312256"
			/>
		</div>
		<div class="py-7">
			<div class="w-32 h-8 bg-gray-500 rounded-2xl flex items-center justify-center">
				<p class="w-full h-full px-3 py-1 text-left text-white">Number</p>
			</div>
			<p class="px-2">SepalWidthCm</p>
			<input
				type="number"
				bind:value={sepalWidth}
				class="w-3/5 h-full px-2 py-3 bg-transparent text-white border border-slate-600 focus:outline-none hover:border-black"
				placeholder="5.854074001312256"
			/>
		</div>
		<div>
			<div class="w-32 h-8 bg-gray-500 rounded-2xl flex items-center justify-center">
				<p class="w-full h-full px-3 py-1 text-left text-white">Number</p>
			</div>
			<p class="px-2">PetalLengthCm</p>
			<input
				type="number"
				bind:value={petalLength}
				class="w-3/5 h-full px-2 py-3 bg-transparent text-white border border-slate-600 focus:outline-none hover:border-black"
				placeholder="5.854074001312256"
			/>
		</div>
		<div class="py-7">
			<div class="w-32 h-8 bg-blue-500 rounded-2xl flex items-center justify-center">
				<p class="w-full h-full px-3 py-1 text-left text-white">Number</p>
			</div>
			<p class="px-2">PetalWidthCm</p>
			<input
				type="number"
				bind:value={petalWidth}
				class="w-3/5 h-full px-2 py-3 bg-transparent text-white border border-slate-600 focus:outline-none hover:border-black"
				placeholder="5.854074001312256"
			/>
		</div>
		<button
			class="text-center border border-blue-500 bg-blue-500 w-1/2 rounded-md py-3"
			on:click={predict}>Predict</button
		>
	</div>
	{#if resultValue}
		<div class="w-1/2 mr-60 mb-80 rounded border-4 border-blue-500">
			<div class="bg-gray-200 p-8 rounded">
				<h2 class="text-4xl font-bold mb-4 text-center">Result</h2>
				<div class="flex justify-center py-10">
					<p class="mb-2 text-2xl">{resultValue}<span id="resultValue" /></p>
				</div>
			</div>
		</div>
	{/if}
</div>
