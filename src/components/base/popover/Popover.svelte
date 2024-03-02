<script lang="ts">
	import { focusTrap } from '@/lib/actions/FocusTrap/focusTrap.js';
	import { clickOutside } from '@/lib/actions/HandleClickOutside/clickOutside.js';
	import { keyDown } from '@/lib/actions/HandleKeyPress/keyDown.js';

	let open = false;
	let isAnimatingClose = false;
	let popoverTrigger: HTMLElement;

	function closePopover() {
		isAnimatingClose = true;
		setTimeout(() => {
			open = false;
			isAnimatingClose = false;
			if (popoverTrigger) {
				popoverTrigger.setAttribute('aria-expanded', 'false');
			}
		}, 100); // Adjust the duration to match your close animation duration
	}

	function togglePopover() {
		if (open && !isAnimatingClose) {
			closePopover();
		} else {
			open = !open;
		}
		updateAria();
	}

	function updateAria() {
		if (popoverTrigger) {
			popoverTrigger.setAttribute('aria-expanded', open ? 'true' : 'false');
		}
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

	$: dataState = !isAnimatingClose && open ? 'open' : 'closed';
</script>

<div class="relative">
	<!-- Slot for the trigger -->
	<slot name="trigger" {bindTrigger} {open} />

	{#if open || isAnimatingClose}
		<div
			use:focusTrap
			use:clickOutside={[closePopover, popoverTrigger]}
			use:keyDown={[open, closePopover, ['Escape']]}
			tabindex="-1"
			role="dialog"
			aria-labelledby="popoverTitle"
			aria-modal="true"
			data-state={dataState}
			class="absolute z-50 mt-2 min-w-[16rem] rounded-xl border border-gray-200 shadow-lg p-2 bg-white dark:bg-black dark:border-stone-700 will-change-transform
		data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
		>
			<!-- Slot for the Popover Content -->
			<slot name="content" {closePopover} />
		</div>
	{/if}
</div>
