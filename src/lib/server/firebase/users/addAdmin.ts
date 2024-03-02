import { auth } from '@/lib/server/firebase/admin';

async function addAdmin(userUID: string): Promise<boolean> {
	try {
		await auth.setCustomUserClaims(userUID, { role: 'admin' });
		return true; // Successfully added role: admin claim
	} catch (e) {
		console.error('Error adding admin role claim:', e);
		return false;
	}
}

export default addAdmin;

// Useage

// import addAdmin from "@/firebase/utils/addAdmin";
// if (user) {
//   const result = await addAdmin(user.uid);
//   if (result) {
//     console.log("Successfully set user as admin");
//   } else {
//     console.log("Failed to set user as admin");
//   }
// }
