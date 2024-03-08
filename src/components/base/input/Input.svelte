<script lang="ts">
	export let type: 'email' | 'text' | 'password' | 'number' = 'text';
	export let placeholder = '';
	export let id = '';
	export let value = '';
</script>

<!-- * Using {...{ type }} to handle dynamic types in Svelte - see: https://stackoverflow.com/questions/57392773/error-type-attribute-cannot-be-dynamic-if-input-uses-two-way-binding -->
<input
	bind:value
	{...{ type }}
	{...$$restProps}
	{placeholder}
	{id}
	required
	class="mt-4 w-full max-w-full items-start justify-center self-stretch whitespace-nowrap rounded-lg bg-neutral-700 py-4 pl-5 pr-16 text-white placeholder:text-neutral-400 max-md:px-5"
/>
