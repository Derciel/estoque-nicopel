// O seu código, mas agora neste caminho de ficheiro
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ redirect }) => {
  // A forma "Astro" de fazer o que você fez
  // É mais limpa e lida com os cabeçalhos por si.
  return redirect("/login", 302, [
    'Set-Cookie: sb-access-token=; Path=/; HttpOnly; Max-Age=0',
    'Set-Cookie: sb-refresh-token=; Path=/; HttpOnly; Max-Age=0'
  ]);
}

// Opcional: Se quiser uma mensagem de erro simpática
// para quem tentar aceder via GET
export const GET: APIRoute = () => {
  return new Response("Use o botão de 'Sair', não esta URL.", { status: 405 });
}