const API_URL = import.meta.env.VITE_API_URL;

export const createUser = async (
  email: string,
  password: string
) => {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
  const data = await response.json();
  console.log(data);

  if (!response.ok) {
    throw {
      status: response.status,
      message: data.message,
    };
  }

  return data;
};