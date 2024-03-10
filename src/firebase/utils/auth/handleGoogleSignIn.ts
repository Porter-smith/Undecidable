import { getAdditionalUserInfo, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/firebase/client';
import fetchCreateUser from '@/services/api/auth/fetchCreateUser';
import handleSignin from './handleServerSignin';

async function handleGoogleSignIn() {
    try {
        const provider = new GoogleAuthProvider();
        const { user } = await signInWithPopup(auth, provider);
        const idToken = await user.getIdToken();

        const isNewUser = getAdditionalUserInfo(user)?.isNewUser;
        if (isNewUser) {
            await fetchCreateUser(idToken);
        }

        await handleSignin(idToken);
    } catch (error) {
        console.error('Error during Google Sign In or setting user role:', error);
    }
}

export default handleGoogleSignIn;
