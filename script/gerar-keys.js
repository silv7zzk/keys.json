'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');

const tipo = process.env.TIPO;
const quantidade = Math.max(
  1,
  Math.min(100, Number(process.env.QUANTIDADE || 1))
);

const duracoes = {
  diaria: 1,
  semanal: 7,
  mensal: 30,
  permanente: null
};

if (!Object.prototype.hasOwnProperty.call(duracoes, tipo)) {
  throw new Error('Tipo inválido.');
}

const arquivo = JSON.parse(fs.readFileSync('keys.json', 'utf8'));
arquivo.keys = Array.isArray(arquivo.keys) ? arquivo.keys : [];

for (let i = 0; i < quantidade; i++) {
  const key = 'SCAN-' + crypto
    .randomBytes(24)
    .toString('base64url')
    .toUpperCase();

  const criadaEm = new Date();
  const dias = duracoes[tipo];
  const expiraEm = dias === null
    ? null
    : new Date(criadaEm.getTime() + dias * 86400000).toISOString();

  const hash = crypto
    .createHash('sha256')
    .update(key)
    .digest('hex');

  arquivo.keys.push({
    hash,
    tipo,
    criada_em: criadaEm.toISOString(),
    expira_em: expiraEm,
    ativa: true
  });

  // A key verdadeira aparece no resultado do GitHub Actions.
  console.log('KEY GERADA:', key);
  console.log('TIPO:', tipo);
  console.log('EXPIRA EM:', expiraEm || 'NUNCA');
}

fs.writeFileSync(
  'keys.json',
  JSON.stringify(arquivo, null, 2) + '\n'
);
