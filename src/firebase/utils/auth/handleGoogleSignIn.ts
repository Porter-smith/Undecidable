import { getAdditionalUserInfo, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/firebase/client';
import fetchCreateUser from '@/services/api/auth/fetchCreateUser';
import handleSignin from './handleServerSignin';

function shouldPromptForExternalBrowser() {
  // Extend this function to detect other problematic user agents as needed.
  return window.navigator.userAgent.includes('Messenger');
}

async function handleGoogleSignIn() {
  try {
    if (shouldPromptForExternalBrowser()) {
      // Modify this to display a user-friendly message or UI element prompting to open in an external browser.
      alert('Please open this link in your browser to continue with sign-in.');
      return;
    }

    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    const idToken = await user.getIdToken();

    const additionalUserInfo = getAdditionalUserInfo(user);
    if (additionalUserInfo?.isNewUser) {
      await fetchCreateUser(idToken);
    }

    await handleSignin(idToken);
  } catch (error) {
    console.error('Error during Google Sign In or setting user role:', error);
  }
}

export default handleGoogleSignIn;
