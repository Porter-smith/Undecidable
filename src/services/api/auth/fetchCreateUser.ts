async function fetchCreateUser(idToken: string) {
	const response = await fetch('/api/user', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${idToken}`
		}
	});

	if (!response.ok) {
		throw new Error(`Failed to sign in. Server responded with status: ${response.status}`);
	}
}

export default fetchCreateUser;
