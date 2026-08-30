const API_URL = import.meta.env.VITE_API_URL ;


export async function downloadInfo(token: string, password?: string) {


    const response = await fetch(`${API_URL}/files/download/${token}`,
        {
        method: password ? "POST" : "GET",
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            password,
        }),
        },
    );

    const data = await response.json();

    if (!response.ok) {
        throw {
        status: response.status,
        message: data.message,
        };
    }

    console.log(data, response)
    return data ;

}