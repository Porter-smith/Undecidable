<script lang="ts">
	import { signInWithEmailAndPassword } from 'firebase/auth';
	import getFriendlyErrorMessage from '@/firebase/utils/auth/getFriendlyErrorMessage';
	import { auth } from '@/firebase/client';
	import { FirebaseError } from 'firebase/app';
	import handleServerSignin from '@/firebase/utils/auth/handleServerSignin';
	import UndecidableLogo from '@/lib/assets/logo.png';
	let email: string = '',
		password: string,
		errorMessage: string,
		loading: boolean;

	async function handleLogin() {
		loading = true;
		try {
			const actionCodeSettings = {
				// URL you want to redirect back to. The domain (www.example.com) for this
				// URL must be in the authorized domains list in the Firebase Console.
				url: 'https://www.yourapp.com/finishSignIn', // Adjust this URL to your application's URL.
				handleCodeInApp: true
			};

			await sendSignInLinkToEmail(auth, email, actionCodeSettings);
			window.localStorage.setItem('emailForSignIn', email); // Save the email in local storage to use it later.
			// Inform the user to check their email for the sign-in link.
		} catch (error) {
			if (error instanceof FirebaseError) {
				errorMessage = getFriendlyErrorMessage(error);
			} else {
				errorMessage = 'An unexpected error occurred';
			}
		}
		loading = false;
	}
	import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';

	$: buttonClass = email.trim() ? 'bg-primary' : 'bg-neutral-400';
</script>

<div
	class="text-text-color flex w-full items-center justify-center bg-neutral-900 px-16 py-20 text-center text-base max-md:px-5"
>
	<div class="mt-24 flex w-[337px] max-w-full flex-col items-center max-md:mt-10">
		<img src={UndecidableLogo} alt="Undecidable Logo" class="aspect-square w-[135px] max-w-full" />
		<h2 class="mt-2 text-2xl font-semibold leading-5">Log in or sign up</h2>
		<form
			class="mt-4 flex flex-col items-center self-stretch"
			on:submit|preventDefault={handleLogin}
		>
			<input
				bind:value={email}
				id="emailInput"
				type="email"
				autocomplete="on"
				placeholder="Email"
				aria-label="Email"
				class="mt-4 w-full max-w-full items-start justify-center self-stretch whitespace-nowrap rounded-lg bg-neutral-700 py-4 pl-5 pr-16 text-white placeholder:text-neutral-400 max-md:px-5"
			/>
			<button
				type="submit"
				class={`mt-4 w-full max-w-full items-center justify-center self-stretch whitespace-nowrap rounded-lg px-16 py-4 font-bold text-neutral-900 max-md:px-5 ${buttonClass} transition-colors duration-300`}
				disabled={!email.trim()}>Continue</button
			>
		</form>
		<div class="mt-5 text-neutral-400">or</div>
		<button class="mt-7 flex items-center gap-2.5 font-bold tracking-tight" tabindex="0">
			<img
				loading="lazy"
				src="https://cdn.builder.io/api/v1/image/assets/TEMP/4876e1a6b7bf9533361b271969588acad512d0c89e5745fdcb0efa65ae114130?apiKey=30258c61c24f4b5c92ef3c24374b1fdd&"
				alt="Continue with Google"
				class="aspect-square w-5 shrink-0"
			/>
			<span>Continue with Google</span>
		</button>
		<a
			href="#"
			class="mt-10 whitespace-nowrap font-bold tracking-tight text-blue-500 max-md:mt-10"
			tabindex="0">Need help signing in?</a
		>
		<p class="mt-9 text-sm leading-5 tracking-tight">
			By signing up, you are creating a Undecidable account and agree to Undeciable’s
			<a href="#" class="text-white" tabindex="0">Terms</a> and
			<a href="#" class="text-white" tabindex="0">Privacy Policy</a>.
		</p>
	</div>
</div>

<style>
	input:focus {
		outline: none; /* Removes the default outline */
		box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5); /* Optional: Adds a custom focus indicator */
	}

	/* Tailwind CSS is applied through class names, so no custom CSS here */
</style>
