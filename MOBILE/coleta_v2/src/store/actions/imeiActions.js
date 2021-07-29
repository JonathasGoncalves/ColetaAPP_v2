export function saveVeiculo(veiculo) {
  return {
    type: 'SAVE_VEICULO',
    veiculo,
    identificado: true
  };
}


export function removerID() {
  return {
    type: 'REMOVER_ID',
    identificado: false
  };
}

export function save_user(username, password) {
  return {
    type: 'SAVE_CRED',
    username,
    password
  };
}

export function save_passport(passport) {
  return {
    type: 'SAVE_PASSPORT',
    passport
  };
}