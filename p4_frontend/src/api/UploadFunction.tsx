const API_URL = import.meta.env.VITE_API_URL;

export async function uploadFile (
    file: File,
    expirationDays: string
) {
    const formData = new FormData();

  formData.append("file", file);
  formData.append("expirationDays", expirationDays);

  const response = await fetch(`${API_URL}/files/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data = await response.json();
  console.log(data);

  if (!response.ok) {
    throw {
      status: response.status,
      message: data.message,
    };
  }

  console.log(data, response)
  return response.status ;
};