// const url = 'http://localhost:3000'
type method = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export async function generalRequest<T>(endpoint: string, body?:object, method: method = 'GET'){
    try {
        const req = await fetch(`http://localhost:3000${endpoint}`, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body),
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        const result = await req.json() as T;
        return result;
    } catch (error) {
        console.error("Error:", error)
    }
}