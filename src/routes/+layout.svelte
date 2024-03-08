<script>
	import { Toaster } from 'svelte-sonner';
	import '@/app.pcss';
	import Navbar from '../components/Navbar.svelte';
	export let data;
	let user = data.user;
</script>

<Toaster />
<Navbar {user} />
<slot />
