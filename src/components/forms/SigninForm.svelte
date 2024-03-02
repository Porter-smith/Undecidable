<script lang="ts">
	import { signInWithEmailAndPassword } from 'firebase/auth';
	import getFriendlyErrorMessage from '@/firebase/utils/auth/getFriendlyErrorMessage';
	import { Button } from '@/components/base/button';
	import GoogleSignInButton from '@/components/AuthProvider/GoogleSignInButton.svelte';
	import { Input } from '@/components/base/input';
	import { auth } from '@/firebase/client';
	import Spinner from '@/icons/spinner.svg?component';
	import { FirebaseError } from 'firebase/app';
	import handleServerSignin from '@/firebase/utils/auth/handleServerSignin';
	let email: string, password: string, errorMessage: string, loading: boolean;

	async function handleLogin() {
		loading = true;
		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			const idToken = await userCredential.user.getIdToken();
			await handleServerSignin(idToken);
		} catch (error) {
			if (error instanceof FirebaseError) {
				errorMessage = getFriendlyErrorMessage(error);
			} else {
				errorMessage = 'An unexpected error occurred';
			}
		}
		loading = false;
	}
</script>

<div class="flex w-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
	<div
		class="w-full max-w-md space-y-8 rounded-xl bg-white p-6 shadow-lg dark:border dark:border-gray-700 dark:bg-black/60"
	>
		<div>
			<h1 class="mt-6 text-center text-3xl font-extrabold text-black dark:text-white">Sign in</h1>
			<p class="mt-2 text-center text-sm text-black/80 dark:text-white/80">
				New?
				<a href="/signup" class="font-medium text-black hover:text-black/70 dark:text-white">
					Create an account
				</a>
			</p>
		</div>
		<form class="mt-8 space-y-6" on:submit|preventDefault={handleLogin}>
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
				<div>
					<label for="password" class="sr-only">Password</label>
					<Input
						bind:value={password}
						type="password"
						id="password"
						placeholder="Password"
						autocomplete="current-password"
					/>
					<div class="mt-2 text-right">
						<a
							href="/forgot-password"
							class="text-sm font-medium text-black hover:text-black/70 dark:text-white dark:hover:text-white/70"
						>
							Forgot your password?
						</a>
					</div>
				</div>
			</div>
			{#if errorMessage}
				<!-- Container for error message with margin for spacing -->
				<div class="mb-3 mt-4 text-center">
					<p class="text-sm text-red-500">{errorMessage}</p>
				</div>
			{/if}

			<div>
				<Button disabled={loading} class="w-full" type="submit"
					>{#if loading}
						<Spinner class="mr-2 h-4 w-4" />
						Please wait
					{:else}
						Sign in
					{/if}</Button
				>
			</div>
		</form>

		<div class="relative">
			<div class="absolute inset-0 flex items-center">
				<span class="w-full border-t dark:border-stone-700" />
			</div>
			<div class="relative flex justify-center text-xs uppercase">
				<span class="bg-white px-2 text-[#71717a] dark:bg-black dark:text-white"
					>Or continue with</span
				>
			</div>
		</div>

		<div>
			<GoogleSignInButton />
		</div>
	</div>
</div>
