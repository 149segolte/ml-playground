<script lang="ts">
	import type { PageData } from './$types';
    import { goto } from '$app/navigation';
    import FileList from '$lib/components/FileList.svelte';
	export let data: PageData;

</script>
<div>
		<div class="flex items-center justify-between bg-gray-300 p-4 mb-4">
			<span class="text-2xl font-semibold text-gray-700 px-8">Your Files</span>
			<button
				on:click={() => goto(`/${data.id}/add_file`)}
				class="bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-gray-800">Add File</button
			>
        </div>

		<FileList files={data.data}/>
</div>
