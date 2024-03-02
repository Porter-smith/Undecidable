<script>
	import { getAuth, confirmPasswordReset } from 'firebase/auth';
	import { Button } from '@/components/base/button';
	import { Input } from '@/components/base/input';
	import getFriendlyErrorMessage from '@/firebase/utils/auth/getFriendlyErrorMessage';
	import { app } from '@/firebase/client';

	export let oobCode; // This will hold the oobCode from the URL.
	let newPassword = '';
	let confirmPassword = '';
	let errorMessage;
	let successMessage;
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

<div class="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
	<div class="w-full max-w-md space-y-8 rounded-xl bg-white p-6 shadow-lg">
		<div>
			<h1 class="mt-6 text-center text-3xl font-extrabold text-black">Reset Your Password</h1>
			<p class="mt-2 text-center text-sm text-black/80">
				Enter and confirm your new password below.
			</p>
		</div>
		{#if errorMessage}
			<div class="mb-3 mt-4 text-center">
				<p class="text-sm text-red-500">{errorMessage}</p>
			</div>
		{/if}
		{#if successMessage}
			<div class="mb-3 mt-4 text-center">
				<p class="text-sm text-green-500">{successMessage}</p>
			</div>
		{/if}
		<form class="mt-8 space-y-6" on:submit|preventDefault={handlePasswordChange}>
			<div class="space-y-4 rounded-md">
				<div>
					<label for="new-password" class="sr-only">New Password</label>
					<Input
						bind:value={newPassword}
						type="password"
						id="new-password"
						placeholder="New Password"
						autocomplete="new-password"
					/>
				</div>
				<div>
					<label for="confirm-password" class="sr-only">Confirm Password</label>
					<Input
						bind:value={confirmPassword}
						type="password"
						id="confirm-password"
						placeholder="Confirm Password"
						autocomplete="new-password"
					/>
				</div>
			</div>
			<div>
				<Button class="w-full" type="submit">Change Password</Button>
			</div>
		</form>
	</div>
</div>
