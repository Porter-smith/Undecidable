<!-- Modal.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { keyDown } from '@/lib/actions/HandleKeyPress/keyDown';
	import { clickOutside } from '@/lib/actions/HandleClickOutside/clickOutside';
	import { focusTrap } from '@/lib/actions/FocusTrap/focusTrap';

	export let isOpen = false;

	// Stores references to the trigger and the modal elements
	let modalTrigger: HTMLElement;
	let modalRef: HTMLElement;
	let isAnimatingClose = false;

	function closeModal() {
		// Start the closing animation
		isAnimatingClose = true;

		// Use a timeout to delay setting isOpen to false
		setTimeout(() => {
			isOpen = false;
			isAnimatingClose = false; // End the closing animation
			if (modalTrigger) {
				modalTrigger.setAttribute('aria-expanded', 'false');
				modalTrigger.focus(); // Accessibility: Return focus to the trigger when the modal closes
			}
		}, 100); // Duration of the close animation
	}

	// Function to be called by the modal trigger
	export function bindTrigger(node: HTMLElement) {
		modalTrigger = node;
		node.setAttribute('aria-haspopup', 'dialog');
		node.setAttribute('aria-expanded', isOpen.toString());
		node.addEventListener('click', () => {
			isOpen = !isOpen;
			node.setAttribute('aria-expanded', isOpen.toString());
		});
		return {
			destroy() {
				node.removeEventListener('click', () => {
					isOpen = !isOpen;
				});
			}
		};
	}
	$: dataState = !isAnimatingClose && isOpen ? 'open' : 'closed';

	function closeTrigger() {
		closeModal(); // Call the existing closeModal function
	}
</script>

<div class="relative">
	<!-- Slot for the trigger -->
	<slot name="trigger" {bindTrigger} />

	{#if isOpen}
		<div
			use:focusTrap
			use:keyDown={[isOpen, closeModal, ['Escape']]}
			class="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
			aria-labelledby="modalTitle"
			aria-modal="true"
			role="dialog"
			tabindex="-1"
			bind:this={modalRef}
			data-state={dataState}
		>
			<div
				use:clickOutside={[closeModal, modalTrigger]}
				data-state={dataState}
				class="pointer-events-auto fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full"
			>
				<!-- Slot for the modal content -->
				<slot name="content" {closeTrigger} />
			</div>
		</div>
	{/if}
</div>

<!-- Useage:


<Modal>
  <div slot="trigger" let:bindTrigger>
    <Button action={bindTrigger}>Open Modal</Button>
  </div>
  <div slot="content" let:closeTrigger>
    <h2 id="modalTitle">Modal Title</h2>
    <p>Modal content goes here...</p>
    <Button aria-label="close" on:click={closeTrigger}>Close Modal</Button>
  </div>
</Modal>

-->
