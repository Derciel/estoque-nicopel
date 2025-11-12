// src/pages/api/clientes.js
import { supabase } from '$lib/supabase';

export async function GET() {
  try {
    const { data: clientes, error } = await supabase
      .from('clientes')
      .select('id, nome, cnpj')
      .order('nome');

    if (error) throw error;

    return new Response(JSON.stringify(clientes), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}