<script lang="ts">
	import { Button } from '@/components/base/button';
	import type { User } from 'firebase/auth';
	// import EditAccountForm from '@/components/EditAccountForm.svelte';
	export let user: User;
</script>

<div class="flex flex-col items-center justify-center px-4 pt-20 sm:px-6 lg:px-8">
	<div class="mt-16 w-full max-w-md rounded-xl bg-white p-5 shadow-lg">
		<div class="flex flex-col items-center justify-center">
			<h1 class="mb-4 text-3xl font-bold">Dashboard</h1>
			<p class="mb-4 text-xl">Welcome, {user.displayName}!</p>
			<p>We are happy to see you here. Ready to dive in?</p>
			<div class="mt-6">
				<Button href="/account">Edit Your Account</Button>
			</div>
		</div>
	</div>
</div>

<style>
	/* Just in case you want to add some extra styles */
</style>
