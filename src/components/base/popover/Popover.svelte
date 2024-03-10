<script lang="ts">
	import { page } from '$app/stores'; // Importing the page store from SvelteKit
	import { focusTrap } from '../../../lib/actions/FocusTrap/focusTrap';
	import { clickOutside } from '../../../lib/actions/HandleClickOutside/clickOutside';
	import { keyDown } from '../../../lib/actions/HandleKeyPress/keyDown';

	let open = false;
	let popoverTrigger: HTMLElement;

	// Automatically close the popover when the route changes
	$: {
		if ($page.url.pathname) {
			closePopover();
		}
	}

	async function closePopover() {
		if (open) {
			open = false;
			updateAria();
		}
	}
	function updateAria() {
		if (popoverTrigger) {
			popoverTrigger.setAttribute('aria-expanded', open ? 'true' : 'false');
		}
	}
	function togglePopover() {
		open = !open;
		updateAria();
	}
	export function bindTrigger(node: HTMLElement) {
		popoverTrigger = node;
		node.addEventListener('click', togglePopover);
		return {
			destroy() {
				node.removeEventListener('click', togglePopover);
			}
		};
	}
</script>

<div class="relative">
	<slot name="trigger" {bindTrigger} />
	{#if open}
		<div
			use:focusTrap
			use:clickOutside={[closePopover, popoverTrigger]}
			use:keyDown={[open, closePopover, ['Escape']]}
			tabindex="-1"
			class="animate-slide-up-fade absolute right-0 z-50 mt-2 w-56 rounded-md border border-gray-700 bg-background p-2 shadow-lg will-change-transform"
			role="dialog"
			aria-labelledby="popoverTitle"
			aria-modal="true"
		>
			<slot name="content" />
		</div>
	{/if}
</div>
