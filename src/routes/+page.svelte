<script lang="ts">
	import { auth } from '$lib/stores/user';
	import { goto, invalidateAll } from '$app/navigation';
	import { getAuth, signOut } from 'firebase/auth';

	const logout = async () => {
		const firebaseAuth = getAuth();
		await signOut(firebaseAuth);
		await fetch('/logout', { method: 'POST', body: new FormData() });
		await invalidateAll();
	};
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
{#if $auth}
	<p>Logged in as {$auth.email}</p>
	<button on:click={logout}>Logout</button>
{:else}
	<p>Not logged in</p>
	<button on:click={() => goto('/login')}>Login</button>
{/if}
