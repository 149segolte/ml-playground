<script>
	import '../app.postcss';
</script>


<div class="bg-gray-200">
	<div class="container min-h-screen relative">
		<nav class="text-black bg-gray-400 body-font">
			<div
				class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
			>
				<span class="ml-3 text-3xl">Machine Learning Playground</span>
			</div>
		</nav>
		<slot />
	</div>
</div>
