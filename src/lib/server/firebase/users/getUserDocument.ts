import { db } from '@/lib/server/firebase/admin';

async function getUserDocument(userID: string): Promise<any> {
	const userDocRef = db.collection('users').doc(userID);

	const doc = await userDocRef.get();

	if (doc.exists) {
		return doc.data();
	} else {
		return null;
	}
}
export default getUserDocument;
