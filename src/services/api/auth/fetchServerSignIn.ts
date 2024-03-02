async function fetchServerSignIn(idToken: string) {
	const response = await fetch('/api/signin', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${idToken}`
		}
	});

	if (!response.ok) {
		throw new Error(`Failed to sign in. Server responded with status: ${response.status}`);
	}
	const data = await response.json();
	return data;
}

export default fetchServerSignIn;
