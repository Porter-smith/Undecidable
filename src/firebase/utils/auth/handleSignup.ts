import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import fetchCreateUser from '@/services/api/auth/fetchCreateUser';
import { auth } from '@/firebase/client';
import handleServerSignin from './handleServerSignin';

async function handleSignup(name: string, email: string, password: string) {
	// Register the user using Firebase's client SDK
	const userCredential = await createUserWithEmailAndPassword(auth, email, password);
	// Generate a default profile picture URL
	const defaultProfilePicUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;
	// Update the user's profile with the provided name
	await updateProfile(userCredential.user, {
		photoURL: defaultProfilePicUrl,
		displayName: name
	});

	// Get the ID token of the newly registered user
	const idToken = await userCredential.user.getIdToken(true);

	// Create a user document on firebase
	await fetchCreateUser(idToken);

	// Sign in
	await handleServerSignin(idToken);
}

export default handleSignup;
