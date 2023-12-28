<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { auth as authStore } from '$lib/stores/user';

	function load_login() {
		if (browser) {
			const login = document.getElementById('login');
			let html = `
		<div
			id="g_id_onload"
			data-client_id="546572143993-1pilbml7rr0a1qrmeh3m7vkrki5ohmde.apps.googleusercontent.com"
			data-context="use"
			data-ux_mode="popup"
			data-callback="handle_login"
			data-nonce=""
			data-auto_prompt="false"
		></div>

		<div
			class="g_id_signin"
			data-type="standard"
			data-shape="rectangular"
			data-theme="outline"
			data-text="signin_with"
			data-size="large"
			data-logo_alignment="left"
		></div>
			`;
			if (login) {
				login.innerHTML = html;
			}
		}
	}

	onMount(() => {
		authStore.subscribe((user) => {
			if (user) {
				goto('/');
			}
		});

		let script = document.createElement('script');
		script.src = 'https://accounts.google.com/gsi/client';
		script.async = true;
		script.defer = true;
		load_login();
		document.head.appendChild(script);
	});
</script>

<div class="container mx-auto mt-8">
	<div id="login" class="mx-auto w-1/3"></div>
</div>
