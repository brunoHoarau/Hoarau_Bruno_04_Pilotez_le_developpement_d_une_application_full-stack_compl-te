const API_URL = import.meta.env.VITE_API_URL ;

export async function logout() {
    console.log(import.meta.env);
  const response = await fetch( `${API_URL}/auth/logout`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    },
  );

  const data = await response.json();

  if (!response.ok) {
     console.log(data);
    throw new Error(
      data.message ?? 'Erreur de connexion',
    );
  }

  console.log(data)
  return data;
}