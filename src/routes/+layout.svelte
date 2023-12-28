<script lang="ts">
	import '../app.pcss';
	import { onMount } from 'svelte';
	import { initializeFirebase } from '$lib/client/firebase';
	import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
	import { applyAction, deserialize } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	onMount(() => {
		const { auth } = initializeFirebase();

		window.handle_login = (res: any) => {
			// Build Firebase credential with the Google ID token.
			const idToken = res.credential;
			const credential = GoogleAuthProvider.credential(idToken);

			// Sign in with credential from the Google user.
			let login = signInWithCredential(auth, credential).catch((error) => {
				// Handle Errors here.
				const errorCode = error.code;
				const errorMessage = error.message;
				// The email of the user's account used.
				const email = error.email;
				// The credential that was used.
				const credential = GoogleAuthProvider.credentialFromError(error);
				console.log(errorCode, errorMessage, email, credential);
			});

			login.then(async (res) => {
				if (!res) return;
				const token = await res.user.getIdToken();
				const data = new FormData();
				data.append('token', token);

				const response = await fetch('/login', {
					method: 'POST',
					body: data
				});

				const result = deserialize(await response.text());
				if (result.type === 'success') {
					// rerun all `load` functions, following the successful update
					await invalidateAll();
				}
				applyAction(result);
			});
		};
	});
</script>

<slot />
