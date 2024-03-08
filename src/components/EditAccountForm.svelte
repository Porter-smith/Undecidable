<script lang="ts">
	import { Button } from '@/components/base/button';
	import { Input } from '@/components/base/input';
	import getFriendlyErrorMessage from '@/firebase/utils/auth/getFriendlyErrorMessage';
	import fetchUpdateUser from '@/services/api/auth/fetchUpdateUser';
	import LoadingButton from '@/components/LoadingButton.svelte';
	import type { User } from '@/types/user';
	import UndecidableLogo from '@/lib/assets/logo.png';

	export let user: User;
	let loading = false;
	let name = user?.displayName || '';
	let email = user?.email || '';
	let errorMessage = '';
	let successMessage = '';
	$: hasChanged = name !== user?.displayName || email !== user?.email;

	async function updateAccountDetails(event) {
		event.preventDefault();
		loading = true;
		successMessage = '';
		errorMessage = '';
		const updates = { displayName: name, email: email };

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

<div
	class="text-text-color flex h-screen w-full items-center justify-center bg-background text-center text-base"
>
	<div class="flex w-[337px] max-w-full flex-col items-center">
		<img src={UndecidableLogo} alt="Logo" class="aspect-square w-[135px] max-w-full" />
		<h1 class="text-2xl font-semibold">Edit Account</h1>
		<form
			class="mt-4 flex flex-col items-center self-stretch"
			on:submit|preventDefault={updateAccountDetails}
		>
			<Input bind:value={name} class="input-style" placeholder="Name" required />
			<Input
				bind:value={email}
				class="input-style"
				type="email"
				placeholder="Email Address"
				required
			/>

			{#if successMessage}
				<div class="text-sm text-green-500">{successMessage}</div>
			{/if}
			{#if errorMessage}
				<div class="text-sm text-red-500">{errorMessage}</div>
			{/if}

			{#if loading}
				<LoadingButton type="submit" variant="grey" disabled={!hasChanged} />
			{:else}
				<Button type="submit" variant="grey" disabled={!hasChanged}>Save Changes</Button>
			{/if}
		</form>
	</div>
</div>
