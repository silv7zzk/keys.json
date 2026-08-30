'use strict';

const fs = require('node:fs');

const arquivo = JSON.parse(fs.readFileSync('keys.json', 'utf8'));
const agora = Date.now();
let alterou = false;

for (const registro of arquivo.keys || []) {
  if (
    registro.ativa === true &&
    registro.expira_em !== null &&
    registro.expira_em &&
    Date.parse(registro.expira_em) <= agora
  ) {
    registro.ativa = false;
    registro.expirada_em = new Date().toISOString();
    alterou = true;
  }
}

if (alterou) {
  fs.writeFileSync(
    'keys.json',
    JSON.stringify(arquivo, null, 2) + '\n'
  );
  console.log('Keys expiradas foram desativadas.');
} else {
  console.log('Nenhuma key expirou.');
}
