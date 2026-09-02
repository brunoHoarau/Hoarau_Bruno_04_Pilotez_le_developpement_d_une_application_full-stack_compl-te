const API_URL = import.meta.env.VITE_API_URL ;


export async function OneFile(token: string | undefined) {


    const response = await fetch(`${API_URL}/files/download/${token}`,
        {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
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