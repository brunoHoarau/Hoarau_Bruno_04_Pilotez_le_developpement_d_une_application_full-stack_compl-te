const API_URL = import.meta.env.VITE_API_URL ;


export async function downloadFile(token: string, password?: string) {


    const response = await fetch(`${API_URL}/files/download/${token}`,
        {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            password,
        }),
        },
    );

    if (!response.ok) {
         const data = await response.json();

         throw {
            status: response.status,
            message: data.message,
        };
    }

    const blob = await response.blob();

    return blob ;

}