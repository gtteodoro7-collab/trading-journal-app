import { supabase } from '../src/api/supabaseClient.js';

try {
  console.log('Verificando tabela trades...');
  const { data, error } = await supabase.from('trades').select('id, created_at').limit(1);
  if (error) {
    console.error('Erro ao consultar tabela trades:', error.message || error);
    process.exit(1);
  }
  console.log('Consulta realizada com sucesso. Exemplo de linha:', data?.[0] || 'nenhuma linha');

  const { count, error: countError } = await supabase.from('trades').select('*', { count: 'exact', head: true });
  if (countError) {
    console.error('Erro ao contar trades:', countError.message || countError);
  } else {
    console.log('Total de trades na tabela:', count);
  }

  console.log('Se a consulta retornou sem erro, o campo `created_at` existe (ou foi retornado null).');
} catch (err) {
  console.error('Erro inesperado:', err.message || err);
  process.exit(1);
}
