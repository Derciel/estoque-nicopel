import type { APIRoute } from 'astro';
import { supabase } from '$lib/supabase';

export const POST: APIRoute = async ({ request, locals }) => {
  // Verifica autenticação
  const user = locals.user;
  if (!user) {
    return new Response(JSON.stringify({ error: 'Não autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Verifica permissões (opcional, mas recomendado - usando a mesma lógica do front)
  const userRole = user.profile?.role ?? 'Visitante';
  const canEdit = ['Administrador', 'Estoquista_Entrada', 'Estoquista_Saida'].includes(userRole);

  if (!canEdit) {
    return new Response(JSON.stringify({ error: 'Permissão insuficiente' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json();
    const { id, field, value } = body;

    if (!id || !field || value === undefined) {
      return new Response(JSON.stringify({ error: 'Dados inválidos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Campos permitidos para edição
    const allowedFields = ['estoque_atual', 'estoque_minimo'];
    if (!allowedFields.includes(field)) {
      return new Response(JSON.stringify({ error: 'Campo não permitido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Atualiza no Supabase
    const { data, error } = await supabase
      .from('produtos')
      .update({ [field]: value })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Erro ao atualizar produto:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (e) {
    console.error('Erro interno:', e);
    return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
