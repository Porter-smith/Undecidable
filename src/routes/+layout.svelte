<script>
	import { Toaster } from 'svelte-sonner';
	import '@/app.pcss';
	import Navbar from '../components/Navbar.svelte';
	export let data;
	let user = data.user;
	const currentYear = new Date().getFullYear(); // Dynamically sets the current year
</script>

<Toaster />
<Navbar {user} />
<slot />

<footer class="w-full bg-neutral-900 py-4 text-center text-sm text-neutral-400">
	<p>&copy; {currentYear} MyUndecidable. All rights reserved.</p>
</footer>
