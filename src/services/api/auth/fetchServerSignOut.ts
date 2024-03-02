async function fetchServerSignOut() {
	const response = await fetch('/api/signin', {
		method: 'DELETE'
	});

	if (!response.ok) {
		throw new Error(`Failed to sign in. Server responded with status: ${response.status}`);
	}

	return response.redirected ? response.url : null; // Include URL if redirected
}

export default fetchServerSignOut;
