<script>
	import { Toaster, toast } from 'svelte-sonner';
	import '@/app.pcss';
	export let data;
	console.log(data.user);
</script>

<Toaster />
<slot />
