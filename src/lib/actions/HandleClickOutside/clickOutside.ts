import type { ActionReturn } from 'svelte/action';
// https://github.com/WailAbou/shadcn-svelte-nodep/blob/72b96d937afd3b79ae04f883e71e6b42daddb5d7/src/lib/helpers/actions.ts#L5
// Popover
/**
 * `clickOutside` is an action that enhances UI interaction for popovers and modals. It monitors for clicks outside of the
 * target element and then executes a callback, typically used to close the UI element.
 * Arguments:
 * - `node`: The HTMLElement to which clickOutside is applied.
 * - `callback`: The function to call when a click outside is detected.
 * - `except`: An optional HTMLElement to ignore in the outside click detection, useful for elements like popover triggers.
 */

export function clickOutside(
	node: Node,
	[callback, except]: [VoidFunction, HTMLElement?]
): ActionReturn<[VoidFunction, HTMLElement?]> {
	const onClick = (event: MouseEvent) => {
		const target = event.target as Node;
		if (!node.contains(target) && (!except || !except.contains(target))) {
			callback();
		}
	};

	document.body.addEventListener('click', onClick);

	return {
		update([newCallback, newExcept]: [VoidFunction, HTMLElement?]) {
			callback = newCallback;
			except = newExcept;
		},
		destroy() {
			document.body.removeEventListener('click', onClick);
		}
	};
}
