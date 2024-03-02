// Source: https://github.com/WailAbou/shadcn-svelte-nodep/blob/72b96d937afd3b79ae04f883e71e6b42daddb5d7/src/lib/helpers/actions.ts#L76
// Popover
/**
 * `focusTrap` is an action designed to maintain accessibility within a modal or popover by trapping keyboard focus.
 * It prevents focus from leaving the modal, allowing users to cycle through focusable elements using Tab for forward
 * and Shift+Tab for reverse navigation. This functionality is essential for users with assistive technologies, complying with WCAG guidelines.
 *
 * Arguments:
 * - `node`: The HTMLElement to which the focus trap is applied.
 * - `enabled`: Boolean that enables or disables the focus trap.
 */
export function focusTrap(node: HTMLElement, enabled: boolean = true) {
	const elemWhitelist: string[] = [
		'a[href]',
		'area[href]',
		'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
		'select:not([disabled]):not([aria-hidden])',
		'textarea:not([disabled]):not([aria-hidden])',
		'button:not([disabled]):not([aria-hidden])',
		'iframe',
		'object',
		'embed',
		'[contenteditable]',
		'[tabindex]:not([tabindex^="-"])'
	];
	let elemFirst: HTMLElement;
	let elemLast: HTMLElement;

	function onFirstElemKeydown(e: KeyboardEvent): void {
		if (e.shiftKey && e.code === 'Tab') {
			e.preventDefault();
			elemLast.focus();
		}
	}
	function onLastElemKeydown(e: KeyboardEvent): void {
		if (!e.shiftKey && e.code === 'Tab') {
			e.preventDefault();
			elemFirst.focus();
		}
	}

	const onScanElements = (fromObserver: boolean) => {
		if (enabled === false) return;

		const focusableElems: HTMLElement[] = Array.from(
			node.querySelectorAll(elemWhitelist.join(', '))
		);
		if (focusableElems.length) {
			elemFirst = focusableElems[0];
			elemLast = focusableElems[focusableElems.length - 1];

			if (!fromObserver) elemFirst.focus();

			elemFirst.addEventListener('keydown', onFirstElemKeydown);
			elemLast.addEventListener('keydown', onLastElemKeydown);
		}
	};
	onScanElements(false);

	function onCleanUp(): void {
		if (elemFirst) elemFirst.removeEventListener('keydown', onFirstElemKeydown);
		if (elemLast) elemLast.removeEventListener('keydown', onLastElemKeydown);
	}

	const onObservationChange = (mutationRecords: MutationRecord[], observer: MutationObserver) => {
		if (mutationRecords.length) {
			onCleanUp();
			onScanElements(true);
		}
		return observer;
	};
	const observer = new MutationObserver(onObservationChange);
	observer.observe(node, { childList: true, subtree: true });

	return {
		update(newArgs: boolean) {
			enabled = newArgs;
			newArgs ? onScanElements(false) : onCleanUp();
		},
		destroy() {
			onCleanUp();
			observer.disconnect();
		}
	};
}
