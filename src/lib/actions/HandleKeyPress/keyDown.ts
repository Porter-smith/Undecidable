import type { ActionReturn } from 'svelte/action';
// https://github.com/WailAbou/shadcn-svelte-nodep/blob/72b96d937afd3b79ae04f883e71e6b42daddb5d7/src/lib/helpers/actions.ts#L26
// Popover
/**
 * `keyDown` action enhances keyboard navigation within popovers/modals by listening for specific key events, such as pressing the 'ESC' key.
 * When activated, it invokes a callback, often used to close the popover, ensuring a keyboard-friendly interface, per WCAG 2.1 accessibility standards.
 * Arguments:
 * - `condition`: Boolean to enable or disable the keydown listener.
 * - `callback`: Function to execute when the specified keys are pressed.
 * - `codes`: Array of key codes to listen for, e.g., ['Escape'] for the 'ESC' key.
 * - `shiftKey`: KeyCombination to consider the state of the 'Shift' key, with possible values 'ignore', 'always', 'never'.
 */
type KeyCombination = 'always' | 'never' | 'ignore';
export function keyDown(
	node: Node,
	[condition, callback, codes, shiftKey = 'ignore']: [
		boolean,
		VoidFunction,
		string[],
		KeyCombination?
	]
): ActionReturn {
	const onKeyDown: EventListener = (event: Event) => {
		const e = event as KeyboardEvent;
		const shiftCondition =
			shiftKey === 'ignore' ||
			(shiftKey === 'never' && !e.shiftKey) ||
			(shiftKey === 'always' && e.shiftKey);

		if (condition && codes.includes(e.code) && shiftCondition) {
			e.preventDefault();
			callback();
		}
	};

	node.addEventListener('keydown', onKeyDown);

	return {
		destroy() {
			node.removeEventListener('keydown', onKeyDown);
		}
	};
}
