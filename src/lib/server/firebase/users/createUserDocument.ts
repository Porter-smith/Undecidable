import type { UserDocument } from '@/types/userDocument';
import { db } from '@/lib/server/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
async function createUserDocument(userId: string): Promise<UserDocument> {
	const userDocRef = db.collection('users').doc(userId);

	// Retrieve the document
	const doc = await userDocRef.get();

	if (!doc.exists) {
		const newUser = {
			userID: userId,
			organizations: [],
			timestamp: FieldValue.serverTimestamp()
		};
		await userDocRef.set(newUser);
		console.log('User created with ID: ', userDocRef.id);
		return newUser;
	} else {
		console.log('User document already exists with ID: ', userDocRef.id);
		// Return the existing user data
		return doc.data() as UserDocument;
	}
}

export default createUserDocument;
