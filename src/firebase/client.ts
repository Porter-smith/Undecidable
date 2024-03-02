import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
	apiKey: "AIzaSyDREnhYo-4VhJ0LwGVOPEM9Hrmv2D4v1R4",
	authDomain: "undecidable-e6585.firebaseapp.com",
	projectId: "undecidable-e6585",
	storageBucket: "undecidable-e6585.appspot.com",
	messagingSenderId: "416942136516",
	appId: "1:416942136516:web:a3b0723c057f4f51ea3d91",
	measurementId: "G-F0EWSSGJZS"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
