const API_URL = import.meta.env.VITE_API_URL ;


export async function deleteFile(token: string) {
  const response = await fetch(`${API_URL}/files/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      token,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      status: response.status,
      message: data.message,
    };
  }

  return data;
}