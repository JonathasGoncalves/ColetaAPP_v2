
const INITIAL_STATE = {
  veiculo: {},
  identificado: false, //marca se a placa já foi inserida
  password: '',        //senha do password
  username: '',        //user do password
  passport: true       //marca se o client passport esta válido (true ou false)
}


export default function Identificacao(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SAVE_VEICULO':
      return {
        ...state,
        veiculo: action.veiculo,
        identificado: action.identificado
      }
    case 'REMOVER_ID':
      return {
        ...state,
        identificado: action.identificado
      }
    case 'SAVE_CRED':
      return {
        ...state,
        password: action.password,
        username: action.username
      }
    case 'SAVE_PASSPORT':
      return {
        ...state,
        passport: action.passport
      }
    default:
      return state;
  }
}

