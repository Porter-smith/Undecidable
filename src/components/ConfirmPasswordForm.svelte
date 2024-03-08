<script>
	import { getAuth, confirmPasswordReset } from 'firebase/auth';
	import { Button } from '@/components/base/button';
	import { Input } from '@/components/base/input';
	import getFriendlyErrorMessage from '@/firebase/utils/auth/getFriendlyErrorMessage';
	import { app } from '@/firebase/client';
	import UndecidableLogo from '@/lib/assets/logo.png';

	export let oobCode;
	let newPassword = '';
	let confirmPassword = '';
	let errorMessage = '';
	let successMessage = '';
	const auth = getAuth(app);

	async function handlePasswordChange() {
		if (newPassword !== confirmPassword) {
			errorMessage = 'Passwords do not match.';
			return;
		}

		try {
			await confirmPasswordReset(auth, oobCode, newPassword);
			successMessage = 'Your password has been reset successfully.';
		} catch (error) {
			console.error('Error during password reset:', error);
			errorMessage = getFriendlyErrorMessage(error);
		}
	}
</script>

<div
	class="text-text-color flex h-screen w-full items-center justify-center bg-background text-center text-base"
>
	<div class="flex w-[337px] max-w-full flex-col items-center">
		<img src={UndecidableLogo} alt="Logo" class="aspect-square w-[135px] max-w-full" />
		<h1 class="text-2xl font-semibold">Reset Your Password</h1>
		<form
			class="mt-4 flex flex-col items-center self-stretch"
			on:submit|preventDefault={handlePasswordChange}
		>
			<Input
				bind:value={newPassword}
				class="input-style"
				type="password"
				placeholder="New Password"
				required
			/>
			<Input
				bind:value={confirmPassword}
				class="input-style"
				type="password"
				placeholder="Confirm Password"
				required
			/>

			{#if successMessage}
				<div class="text-sm text-green-500">{successMessage}</div>
			{/if}
			{#if errorMessage}
				<div class="text-sm text-red-500">{errorMessage}</div>
			{/if}

			<Button type="submit" class="w-full" variant="grey">Change Password</Button>
		</form>
	</div>
</div>
