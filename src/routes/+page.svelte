<script lang="ts">
    let step = 0;
</script>

<style>
:global(body) {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    background-color: #2e2e2e;
    color: #eee;
}
</style>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
{#if step === 0}
    <form method="POST" enctype="multipart/form-data">
        <input type="file" accept="text/csv" id="input" name="input" required/>
        <input type="submit" value="Submit"/>
    </form>
{/if}
