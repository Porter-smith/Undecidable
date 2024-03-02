// TODO: Update this thing not sure if right types
export interface User {
	uid: string;
	email: string | null;
	emailVerified: boolean;
	displayName: string | null;
	photoURL: string | null;
	isAnonymous: boolean;
}
