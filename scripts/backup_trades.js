import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabase } from '../src/api/supabaseClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  console.log('Buscando todos os trades do usuário (tabela `trades`)...');
  const { data, error } = await supabase.from('trades').select('*');
  if (error) throw error;

  if (!data || data.length === 0) {
    console.log('Nenhum trade encontrado. Nada para exportar.');
    process.exit(0);
  }

  const keys = Object.keys(data[0]);
  const csv = [keys.join(',')]
    .concat(
      data.map(row => keys.map(k => {
        const v = row[k] === null || row[k] === undefined ? '' : String(row[k]).replace(/"/g, '""');
        return `"${v}"`;
      }).join(','))
    ).join('\n');

  const backupsDir = path.join(__dirname, '..', 'backups');
  if (!fs.existsSync(backupsDir)) fs.mkdirSync(backupsDir);
  const filename = `trades-backup-${new Date().toISOString().replace(/[:.]/g,'-')}.csv`;
  const filepath = path.join(backupsDir, filename);
  fs.writeFileSync(filepath, csv);
  console.log('Backup salvo em:', filepath);
} catch (err) {
  console.error('Erro no backup:', err.message || err);
  process.exit(1);
}
