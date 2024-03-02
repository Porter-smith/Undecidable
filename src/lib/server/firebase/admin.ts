import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';
import {
	FIREBASE_PROJECT_ID,
	FIREBASE_PRIVATE_KEY_ID,
	FIREBASE_PRIVATE_KEY,
	FIREBASE_CLIENT_EMAIL,
	FIREBASE_CLIENT_ID,
	FIREBASE_AUTH_URI,
	FIREBASE_TOKEN_URI,
	FIREBASE_AUTH_PROVIDER_CERT_URL,
	FIREBASE_CLIENT_CERT_URL
} from '$env/static/private';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Your service account details
const serviceAccount = {
	type: 'service_account',
	project_id: FIREBASE_PROJECT_ID,
	private_key_id: FIREBASE_PRIVATE_KEY_ID,
	private_key: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Handle newlines in private key
	client_email: FIREBASE_CLIENT_EMAIL,
	client_id: FIREBASE_CLIENT_ID,
	auth_uri: FIREBASE_AUTH_URI,
	token_uri: FIREBASE_TOKEN_URI,
	auth_provider_x509_cert_url: FIREBASE_AUTH_PROVIDER_CERT_URL,
	client_x509_cert_url: FIREBASE_CLIENT_CERT_URL
};

// Check if any apps have been initialized. If not, initialize a new app
export const app = admin.apps.length
	? admin.app() // Use the existing app instance
	: admin.initializeApp({
			credential: admin.credential.cert(serviceAccount as ServiceAccount)
		});
export const auth = getAuth(app);
export const db = getFirestore(app);
