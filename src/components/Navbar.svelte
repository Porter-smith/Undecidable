<script lang="ts">
	import { onMount } from 'svelte';
	import UserDropdown from '@/components/UserDropdown.svelte';
	import { Button } from '@/components/base/button';
	// import ShoppingBasket from '@/icons/ShoppingBasket.svelte';
	import HamburgerIcon from '@/icons/hamburger-menu.svg?component'; // Make sure you have a HamburgerIcon component
	import type { User } from 'firebase/auth';
	// import FrogOrKnotText from '@/icons/FrogOrKnotText.svelte';
	import MobileUserDropdown from '@/components/MobileUserDropdown.svelte';
	import LoginIcon from '@/icons/login-icon.svg?component';
	import UndecidableLogo from '@/lib/assets/logo.png';
	import ContactIcon from '@/icons/contact.svg?component';
	import HomeIcon from '@/icons/home.svg?component';
	import AboutIcon from '@/icons/about.svg?component';
	import type { UserRecord } from 'firebase-admin/auth';
	export let user: UserRecord | null;

	let scrolled = false;
	let menuOpen = false; // State for the mobile navigation menu

	onMount(() => {
		const handleScroll = () => {
			scrolled = window.pageYOffset > 0;
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	function toggleMenu() {
		menuOpen = !menuOpen;
	}
</script>

<div
	class={`fixed top-0 z-50 h-16 w-full transition-all ${
		scrolled ? 'border-b border-gray-900 bg-background/50 backdrop-blur-xl' : 'bg-transparent'
	}`}
>
	<div class="mx-auto flex h-full max-w-screen-xl items-center justify-between px-5">
		<!-- Hamburger Icon -->
		<button class="m-1 mt-[50px] p-2 md:hidden" on:click={toggleMenu}>
			<HamburgerIcon />
		</button>

		<!-- Left Section: Logo -->
		<div class="flex items-center gap-8">
			<a href="/" class="font-display flex items-center text-2xl">
				<!-- <img
					src="/frogorknot-logo.svg"
					alt="Frog Or Knot logo"
					width="30"
					height="30"
					class="hidden rounded-sm md:flex"
				/> -->
			</a>
			<nav class="hidden items-center gap-5 md:flex">
				<a
					href="/"
					class="text-sm text-primary transition duration-150 ease-in-out hover:text-gray-400"
				>
					Home
				</a>
				<!-- <a
					href="/about"
					class="text-sm text-primary transition duration-150 ease-in-out hover:text-gray-400"
				>
					About
				</a>
				<a
					href="/contact"
					class="text-sm text-primary transition duration-150 ease-in-out hover:text-gray-400"
				>
					Contact
				</a> -->
			</nav>
		</div>

		<!-- Center Text -->
		<div class="pointer-events-none absolute inset-0 flex w-full items-center justify-center">
			<div class="pointer-events-auto">
				<a href="/">
					<!-- <img
						src={UndecidableLogo}
						alt="Undecidable Logo"
						class="aspect-square w-[135px] max-w-full"
					/> -->
					<!-- <FrogOrKnotText /> -->
				</a>
			</div>
		</div>

		<!-- Right Section: UserDropdown and ShoppingBasket -->
		<div class="flex items-center gap-5">
			{#if user}
				<div class="hidden md:block">
					<UserDropdown {user} />
				</div>
			{:else}
				<div class="hidden md:block">
					<Button href="/login" variant="rounded">Login</Button>
				</div>
			{/if}
		</div>
	</div>

	<!-- Mobile Navigation Links -->
	{#if menuOpen}
		<nav
			class="absolute left-0 top-full z-40 flex w-full flex-col items-center bg-background shadow-md md:hidden"
		>
			<!-- ... mobile navigation links ... -->
			<div
				class="animate-slide-up-fade absolute right-0 z-50 w-full rounded-md border border-gray-600 bg-background p-2 shadow-lg will-change-transform"
			>
				<Button href="/" class="w-full" type="submit" variant="ghost">
					<HomeIcon />
					<p class="text-sm">Home</p>
				</Button>
				<!-- <Button href="/about" class="w-full" type="submit" variant="ghost">
					<AboutIcon />
					<p class="text-sm">About</p>
				</Button>
				<Button href="/contact" class="w-full" type="submit" variant="ghost">
					<ContactIcon />
					<p class="text-sm">Contact</p>
				</Button> -->
				{#if user}
					<!-- User Profile and Sign Out options for mobile menu -->
					<div class="w-full text-center">
						<MobileUserDropdown {user} />
					</div>
				{:else}
					<Button href="/login" class="w-full" type="submit" variant="ghost">
						<LoginIcon />
						<p class="text-sm">Sign In / Sign Up</p>
					</Button>
				{/if}
			</div>
		</nav>
	{/if}
</div>
