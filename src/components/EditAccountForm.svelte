<script lang="ts">
	import { Button } from '@/components/base/button';
	import { Input } from '@/components/base/input';
	import getFriendlyErrorMessage from '@/firebase/utils/auth/getFriendlyErrorMessage';
	import fetchUpdateUser from '@/services/api/auth/fetchUpdateUser';
	import LoadingButton from '@/components/LoadingButton.svelte';
	import type { User } from '@/types/user';

	export let user: User;
	let loading = false;
	let name = user?.displayName || '';
	let email = user?.email || '';
	let errorMessage = '';
	let successMessage = '';
	$: hasChanged = name !== user?.displayName || email !== user?.email;

	// Function to construct an object with the new account details
	function getAccountUpdates() {
		let updates = {};
		if (name !== user?.displayName) {
			updates.displayName = name;
		}
		if (email !== user?.email) {
			updates.email = email;
		}
		return updates;
	}

	async function updateAccountDetails(event) {
		event.preventDefault();
		loading = true;
		successMessage = '';
		errorMessage = '';
		const updates = getAccountUpdates();

		try {
			const updatedUser = await fetchUpdateUser(updates);
			successMessage = 'Successfully updated..';
			user = { ...user, ...updatedUser };
		} catch (error) {
			console.error('Error updating account:', error);
			errorMessage = getFriendlyErrorMessage(error);
		}
		loading = false;
	}
</script>

<div class="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
	<div class="w-full max-w-md space-y-8 rounded-xl bg-white p-6 shadow-lg">
		<div>
			<h1 class="mt-6 text-center text-3xl font-extrabold text-black">Edit Account</h1>
		</div>
		<form class="mt-8 space-y-6" on:submit|preventDefault={updateAccountDetails}>
			<div class="space-y-4 rounded-md shadow-sm">
				<div>
					<label for="name" class="sr-only">Name</label>
					<Input bind:value={name} type="text" id="name" placeholder="Name" required />
				</div>
				<div>
					<label for="email" class="sr-only">Email</label>
					<Input bind:value={email} type="email" id="email" placeholder="Email Address" required />
				</div>
			</div>
			{#if successMessage}
				<div class="mb-3 mt-4 text-center">
					<p class="text-sm text-green-500">{successMessage}</p>
				</div>
			{/if}
			{#if errorMessage}
				<div class="mb-3 mt-4 text-center">
					<p class="text-sm text-red-500">{errorMessage}</p>
				</div>
			{/if}
			<div>
				{#if loading}
					<LoadingButton class="w-full" type="submit" />
				{:else}
					<Button disabled={!hasChanged} class="w-full" type="submit">Save Changes</Button>
				{/if}
			</div>
		</form>
	</div>
</div>
