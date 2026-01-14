export const fetchJson = async <T>(
	url: string,
	options: RequestInit = {},
	timeout = 1000,
): Promise<T | undefined> => {
	const controller = new AbortController() // Create an AbortController instance
	const id = setTimeout(() => controller.abort(), timeout) // Set the timeout to abort the request
	options.signal = controller.signal // Attach the signal to the request options

	try {
		const response = await fetch(url, options) // Send the fetch request
		if (!response.ok) {
			console.warn(
				`HTTP error! Status: ${response.status} on url: ${url}`,
			)
			return undefined
		}
		return await response.json() // Parse and return JSON response
	} catch (error) {
		if ((error as Error).name === 'AbortError') {
			console.error(`Request to ${url}: has timed out [${timeout}]`)
			throw new Error('Request timed out')
		}
		throw error
	} finally {
		clearTimeout(id) // Clear the timeout when the request completes or fails
	}
}
