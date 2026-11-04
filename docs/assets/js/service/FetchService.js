export default class FetchService {
    async performPostHttpRequest(fetchLink, headers, body) {
        if (!fetchLink || !headers || !body) {
            throw new Error('One or more POST request parameters was not passed.');
        }
        const rawResponse = await fetch(fetchLink, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        });
        if (!rawResponse.ok) {
            throw new Error(`Request failed with status ${rawResponse.status}`);
        }
        return rawResponse.json();
    }
}
