import { getAdditionalUserInfo, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/firebase/client';
import fetchCreateUser from '@/services/api/auth/fetchCreateUser';
import handleSignin from './handleServerSignin';

function isRunningInFlutterWebView() {
  return window.isFlutterInAppWebView === true;
}

async function handleGoogleSignIn() {
  try {
    if (isRunningInFlutterWebView()) {
      // If the code is running in Flutter WebView, send a message to Flutter to handle.
      window.Flutter.postMessage('openExternalBrowser');
      return; // Stop execution in the WebView after sending the message
    }

    // Proceed with the normal sign-in process if not in a Flutter WebView
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
