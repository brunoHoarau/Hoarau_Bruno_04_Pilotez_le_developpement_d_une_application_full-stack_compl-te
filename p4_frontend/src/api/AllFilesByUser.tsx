const API_URL = import.meta.env.VITE_API_URL ;


export async function AllFilesByUSer() {


    const response = await fetch(`${API_URL}/files/my-files`,
        {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        },
    );

    const data = await response.json();
    console.log(data);
    if (!response.ok) {
        throw {
        status: response.status,
        message: data.message,
        };
    }


    return data ;

}