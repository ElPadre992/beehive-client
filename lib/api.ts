export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`http://localhost:3001/${url}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options?.headers ?? {}),
        },
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(`API error: ${error}`);
    }

    return res.json() as Promise<T>;
}