<script lang="ts">
	import { Popover } from '@/components/base/popover';
	import LogoutIcon from '@/icons/log-out.svg?component';
	import { Button } from '@/components/base/button';
	import type { User } from 'firebase/auth';
	import AdminIcon from '@/icons/admin.svg?component';
	import MoviesIcon from '@/icons/movies.svg?component';
	import AccountIcon from '@/icons/account.svg?component';
	import { handleSignOut } from '../firebase/utils/auth/handleServerSignOut';
	export let user: User;
</script>

{#if user?.email}
	<Button href="/orders" variant="ghost">
		<!-- <OrdersIcon /> -->
		<MoviesIcon class="h-4 w-4" />
		<p class="text-sm">Recommendations</p>
	</Button>
	{#if user?.customClaims?.role === 'admin'}
		<Button href="/admin" variant="ghost">
			<AdminIcon />
			<p class="text-sm">Admin</p>
		</Button>
	{/if}
	<Button href="/account" variant="ghost">
		<AccountIcon />
		<p class="text-sm">Account</p>
	</Button>
	<Button on:click={handleSignOut} class="w-full" variant="ghost">
		<LogoutIcon />
		<p class="text-sm">Sign out</p>
	</Button>
	<div class="text-sm">Logged in as</div>
	<div class="p-2">
		{#if user?.displayName}
			<p class="truncate text-sm font-medium text-primary">
				{user?.displayName}
			</p>
		{/if}
		<p class="text- truncate text-sm text-neutral-400">
			{user?.email}
		</p>
	</div>
{/if}
