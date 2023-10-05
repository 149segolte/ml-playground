<script lang="ts">
	import type { PageData } from './$types';
	
	export let data: PageData;

</script>
<div>
		<div class="flex items-center justify-between bg-gray-300 p-4 mb-4">
			<span class="text-2xl font-semibold text-gray-700 px-8">Your Projects</span>
			<button
				on:click={() => goto('/add_file')}
				class="bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-gray-800">Add Project</button
			>
		</div>

		<FilesList files={data.data}/>
</div>