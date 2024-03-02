<script lang="ts">
	import type { Action } from 'svelte/action';

	// Define a type for the variant keys
	type ButtonVariant = keyof typeof buttonVariants;
	let className: string | undefined | null = undefined;
	let href: string | undefined = undefined;
	export { className as class, href };
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let action: Action | undefined = undefined;
	// Ensure that variant is of type ButtonVariant
	export let variant: ButtonVariant = 'default';

	const buttonVariants = {
		google:
			'disabled:opacity-50 disabled:pointer-events-none group relative w-full flex justify-center items-center py-2 px-4 border border-gray-300 dark:border-transparent text-sm font-medium rounded-md bg-white dark:bg-[#131314] dark:text-[#e3e3e3] hover:bg-gray-50 dark:hover:bg-white/8 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
		outlined:
			'py-2 px-4 rounded-md border border-gray-300 text-black bg-white hover:bg-gray-50 transition duration-200 ease-in-out',
		ghost:
			'flex items-center space-x-3 rounded-lg  transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-accent dark:active:bg-accent/60',
		rounded: 'px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors rounded-full',
		roundedOutlined:
			'px-4 py-2 border border-black text-black hover:bg-gray-200 transition-colors rounded-full',
		default:
			'flex justify-center items-center disabled:opacity-30 disabled:pointer-events-none py-2 px-4 rounded-md text-white bg-black hover:bg-black/80 focus:outline-none focus:ring-2 transition duration-200 ease-in-out dark:bg-white dark:text-black'
	};

	// This function returns true if 'href' is a non-empty string
	const isLink = (): boolean => typeof href === 'string' && href.length > 0;
	function safeAction(node: HTMLElement) {
		if (action) {
			return action(node);
		}
		// If no action is provided, return an empty object with optional destroy and update
		return { update: () => {}, destroy: () => {} };
	}
</script>

<!--
  * When 'href' is defined, we render an <a> element instead of a <button>.
  This is important for accessibility because screen readers and other
  assistive technologies use the semantic information of HTML elements
  to convey their function to users. An <a> element signifies a hyperlink
  that navigates the user to a new page or resource, while a <button>
  indicates an action or command that the user can perform on the current page.
-->
{#if isLink()}
	<a
		use:safeAction
		{...$$restProps}
		{href}
		class="text-center {buttonVariants[variant]} {className}"
		on:click
		{type}
		role="button"
		tabindex="0"
	>
		<slot />
	</a>
{:else}
	<button
		on:click
		{...$$restProps}
		use:safeAction
		{type}
		class="{buttonVariants[variant]} {className}"
	>
		<slot />
	</button>
{/if}
