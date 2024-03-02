import { goto } from '$app/navigation';
import { toast } from 'svelte-sonner';
import { DEFAULT_URL } from '@/constants';
import fetchServerSignIn from '@/services/api/auth/fetchServerSignIn';

async function handleServerSignin(idToken: string) {
	const { status, message } = await fetchServerSignIn(idToken);
	if (status === 'success') {
		goto(DEFAULT_URL);
	} else {
		toast.error(message);
	}
}
export default handleServerSignin;
