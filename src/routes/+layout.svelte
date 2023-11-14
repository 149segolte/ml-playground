<script lang="ts">
	import { goto } from '$app/navigation';
	import '../app.postcss';
	import { Github } from 'lucide-svelte';
	import { ModeWatcher } from 'mode-watcher';

	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Sun, Moon } from 'lucide-svelte';
	import { setMode, resetMode } from 'mode-watcher';
</script>

<ModeWatcher />
<div class="bg-neutral-50 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
	<div class="min-w-screen min-h-screen m-0 p-0 flex flex-col">
		<nav
			class="p-4 font-sans container mx-auto flex flex-col md:flex-row font-bold items-center justify-between"
		>
			<Button variant="link" class="!no-underline" on:click={() => goto('/')}>
				<span class="text-2xl md:text-3xl">Machine Learning Playground</span>
			</Button>
			<div class="md:ml-auto p-2 flex flex-row gap-1 items-center">
				<Button variant="ghost" size="icon" href="https://github.com/149segolte/ml-playground">
					<Github size="26" />
				</Button>
				<DropdownMenu.Root positioning={{ placement: 'bottom-end' }}>
					<DropdownMenu.Trigger asChild let:builder>
						<Button builders={[builder]} variant="ghost" size="icon">
							<Sun
								size="26"
								class="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
							/>
							<Moon
								size="26"
								class="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
							/>
							<span class="sr-only">Toggle theme</span>
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Item on:click={() => setMode('light')}>Light</DropdownMenu.Item>
						<DropdownMenu.Item on:click={() => setMode('dark')}>Dark</DropdownMenu.Item>
						<DropdownMenu.Item on:click={() => resetMode()}>System</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</nav>
		<div class="container mx-auto">
			<slot />
		</div>
		<div
			class="container mx-auto mt-auto w-full p-4 flex flex-col md:flex-row items-center text-md md:text-lg font-mono"
		>
			<span class="opacity-0">
				Copyright &copy; 2023,
				<Button variant="link" class="p-0 text-md md:text-lg" href="https://149segolte.dev">149segolte</Button>
			</span>
			<span class="mx-auto">
				Made with
				<Button variant="link" class="p-0 text-md md:text-lg" href="https://kit.svelte.dev">SvelteKit</Button>
				and
				<Button variant="link" class="p-0 text-md md:text-lg" href="https://rust-lang.org">Rust</Button>
			</span>
			<span class="hidden md:block opacity-0">&copy; Copyright 2023, 149segolte</span>
		</div>
	</div>
</div>
