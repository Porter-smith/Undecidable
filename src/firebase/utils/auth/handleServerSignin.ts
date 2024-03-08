import { toast } from 'svelte-sonner';
import { DEFAULT_URL } from '@/constants';
import fetchServerSignIn from '@/services/api/auth/fetchServerSignIn';

async function handleServerSignin(idToken: string) {
	const { status, message } = await fetchServerSignIn(idToken);
	if (status === 'success') {
		// Use window.location.href for a full server refresh
		window.location.href = DEFAULT_URL;
	} else {
		toast.error(message);
	}
}
export default handleServerSignin;
