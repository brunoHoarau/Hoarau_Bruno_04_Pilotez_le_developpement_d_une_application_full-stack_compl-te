const API_URL = import.meta.env.VITE_API_URL ;

export async function login(
  email: string,
  password: string,
) {
    console.log(import.meta.env);
  const response = await fetch( `${API_URL}/auth/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email,
        password,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
     console.log(data);
    throw new Error(
      data.message ?? 'Erreur de connexion',
    );
  }

  return data.status;
}