function updateMovieData(chunk) {
	// Assume the chunk is movie data
	const index = recommendations.findIndex(
		(movie) => movie.title === chunk.title && movie.year === chunk.year
	);

	if (index >= 0) {
		// Update existing movie data
		recommendations = [
			...recommendations.slice(0, index),
			{ ...recommendations[index], ...chunk },
			...recommendations.slice(index + 1)
		];
	} else {
		// Add new movie data
		recommendations = [...recommendations, chunk];
	}
}
async function handleStreamedResponse({ stream }: { stream: ReadableStream<Uint8Array> }) {
	const reader = stream.getReader();
	const decoder = new TextDecoder('utf-8');

	let readResult;
	while (!(readResult = await reader.read()).done) {
		const chunk = decoder.decode(readResult.value);
		await processChunk(chunk);
	}
}

async function processChunk(chunk: string) {
	console.log('chunk', chunk);
	try {
		const data = JSON.parse(chunk);
		updateMovieData(data);
	} catch (error) {
		console.log('not a json', chunk);
	}
}
