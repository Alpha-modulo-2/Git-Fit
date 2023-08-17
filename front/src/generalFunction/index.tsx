
type method = 'GET' | 'POST' | 'PATCH' | 'DELETE';

const urlPath = import.meta.env.VITE_URL_PATH ;

export async function generalRequest<T>(endpoint: string, body?:object, method: method = 'GET'){
    try {
        if (!urlPath) {
            throw new Error('URL_PATH is not defined');
        }

        const req = await fetch(`${urlPath}${endpoint}`, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body),
            credentials: 'include'
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        const result = await req.json() as T;
        return result;
    } catch (error) {
        console.error("Error:", error)
    }
}