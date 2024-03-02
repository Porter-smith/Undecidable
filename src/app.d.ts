// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import '@poppanator/sveltekit-svg/dist/svg';
import type { DecodedIdToken } from 'firebase-admin/auth';
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: DecodedIdToken | null
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
