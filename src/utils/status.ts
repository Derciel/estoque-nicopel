// src/utils/status.ts

/** 
 * Retorna texto e classes de estilo do status de estoque.
 * Pode ser usado em qualquer página Astro/React/Svelte dentro do projeto.
 */
export function getStockStatus(stock: number, minStock: number) {
  const baseClasses =
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border';

  if (stock === 0) {
    return {
      text: 'Sem Estoque',
      color: `${baseClasses} text-red-700 bg-red-50 border-red-200`,
    };
  }

  if (stock <= minStock) {
    return {
      text: 'Estoque Baixo',
      color: `${baseClasses} text-yellow-700 bg-yellow-50 border-yellow-200`,
    };
  }

  return {
    text: 'Em Estoque',
    color: `${baseClasses} text-green-700 bg-green-50 border-green-200`,
  };
}

/**
 * Retorna texto e cor do tipo de movimentação (entrada/saída).
 */
export function getMovementStatus(tipo: string) {
  const baseClasses =
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border';

  if (tipo === 'entrada') {
    return {
      text: 'Entrada',
      color: `${baseClasses} text-green-700 bg-green-50 border-green-200`,
    };
  }

  if (tipo === 'saida') {
    return {
      text: 'Saída',
      color: `${baseClasses} text-red-700 bg-red-50 border-red-200`,
    };
  }

  return {
    text: 'Desconhecido',
    color: `${baseClasses} text-gray-700 bg-gray-50 border-gray-200`,
  };
}
