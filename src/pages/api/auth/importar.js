// src/pages/api/importar.js
import { supabase } from '$lib/supabase';
import * as XLSX from 'xlsx';

export async function post({ request }) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const tipo = formData.get('tipo');

    if (!file || !tipo) {
      return new Response(JSON.stringify({ error: 'Arquivo e tipo são obrigatórios' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Ler o arquivo Excel
    const buffer = await file.arrayBuffer();
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    if (tipo === 'clientes') {
      // Inserir clientes
      for (const row of data) {
        const { nome, cnpj } = row;
        await supabase.from('clientes').insert([{ nome, cnpj }]);
      }
    } else if (tipo === 'produtos') {
      // Inserir produtos
      for (const row of data) {
        const { nome, descricao, categoria, estoque_atual, estoque_minimo, preco, cliente_id } = row;
        await supabase.from('produtos').insert([{
          nome,
          descricao,
          categoria,
          estoque_atual,
          estoque_minimo,
          preco,
          cliente_id
        }]);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
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