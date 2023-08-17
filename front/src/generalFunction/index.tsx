
type method = 'GET' | 'POST' | 'PATCH' | 'DELETE';

const urlPath = import.meta.env.VITE_URL_PATH ;
console.log(urlPath)
function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
}

export async function generalRequest<T>(endpoint: string, body?:object, method: method = 'GET'){
    try {
        if (!urlPath) {
            throw new Error('URL_PATH is not defined');
        }

        const token = getCookie('session')

        if (!token) {
            throw new Error('Token is not defined');
        }
        const req = await fetch(`${urlPath}${endpoint}`, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
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