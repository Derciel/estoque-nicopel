export async function POST() {
  const headers = new Headers();
  headers.append('Set-Cookie', 'sb-access-token=; Path=/; HttpOnly; Max-Age=0');
  headers.append('Set-Cookie', 'sb-refresh-token=; Path=/; HttpOnly; Max-Age=0');
  headers.append('Location', '/login');

  return new Response(null, {
    status: 302,
    headers
  });
}