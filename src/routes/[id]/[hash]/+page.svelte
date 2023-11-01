<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	export let data: PageData;

	onMount(() => {
		if (data.hash) {
			goto(`/${data.project}/${data.hash}/${data.model}`);
		} else {
			goto(`/${data.project}`);
		}
	});
</script>

<div />
