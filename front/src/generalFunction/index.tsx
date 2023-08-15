// const url = 'https://localhost:443'
type method = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export async function generalRequest<T>(endpoint: string, body?:object, method: method = 'GET'){
    try {
        const req = await fetch(`https://localhost:443${endpoint}`, {
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