import { defineMiddleware } from "astro:middleware";
import { getUserSession } from "./lib/auth";

export const onRequest = defineMiddleware(async ({ request, url, locals }, next) => {
  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/login', '/api/auth/login', '/api/auth/logout'];
  const isPublic = publicRoutes.some(route => url.pathname.startsWith(route));
  
  console.log('🔍 Middleware:', url.pathname, 'Público?', isPublic);
  
  if (isPublic) {
    return next();
  }

  // Verifica sessão
  const session = await getUserSession(request);
  console.log('👤 Sessão encontrada:', !!session);
  
  if (!session) {
    console.log('❌ Redirecionando para login');
    return new Response(null, {
      status: 302,
      headers: { 'Location': '/login' }
    });
  }

  // ✅ CORREÇÃO: Usar locals diretamente
  locals.user = session;

  return next();
});