<script>
	import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
	import { app } from '@/firebase/client';
	import { Button } from '@/components/base/button';
	import { Input } from '@/components/base/input';
	import getFriendlyErrorMessage from '@/firebase/utils/auth/getFriendlyErrorMessage';
	import Mail from '@/icons/mail.svg?component';
	import LoadingButton from '@/components/LoadingButton.svelte';
	let email, errorMessage, loading, successMessage;
	const auth = getAuth(app);

	async function handlePasswordReset() {
		loading = true;
		try {
			await sendPasswordResetEmail(auth, email);
			successMessage = 'Please check your email to reset your password.';
		} catch (error) {
			console.error('Error during password reset:', error);
			errorMessage = getFriendlyErrorMessage(error);
		}
		loading = false;
	}
</script>

<div class="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
	<div class="w-full max-w-md space-y-8 rounded-xl bg-white p-6 shadow-lg">
		<div>
			<h1 class="mt-6 text-center text-3xl font-extrabold text-black">Reset Password</h1>
			<p class="mt-2 text-center text-sm text-black/80">
				Enter the email associated with your account.
			</p>
		</div>
		<form class="mt-8 space-y-6" on:submit|preventDefault={handlePasswordReset}>
			<div class="space-y-4 rounded-md">
				<div>
					<label for="email" class="sr-only">Email</label>
					<Input
						bind:value={email}
						type="email"
						id="email"
						placeholder="Email"
						autocomplete="email"
					/>
				</div>
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
			<div>
				{#if loading}
					<LoadingButton class="w-full" />
				{:else}
					<Button class="w-full" type="submit">
						<Mail />
						Send Reset Email</Button
					>
				{/if}
			</div>
		</form>
	</div>
</div>
