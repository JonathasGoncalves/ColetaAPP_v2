import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'https://apicoletaleite.selita.coop.br/',
  //baseURL: 'http://192.168.10.26:8000/',
  timeout: 10000,
  headers: {
    'accept': 'application/json',
    'Content-Type': 'application/json'
  },
});

api.interceptors.request.use(
  async function (config) {
    const access_token = await AsyncStorage.getItem('@access_token');
    if (access_token) config.headers.Authorization = `Bearer ${access_token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default api;

api.interceptors.response.use(async function (response) {

  //REFRESH DO TOKEN
  if (response.config.url != 'oauth/token') {

    const clientID = await AsyncStorage.getItem('@Client');
    const clientSecret = await AsyncStorage.getItem('@Secret');
    const grant_type = await AsyncStorage.getItem('@grant_type');
    const user_storage = await AsyncStorage.getItem('@username');
    const password_storage = await AsyncStorage.getItem('@password');

    const responseToken = await api.post('oauth/token', {
      grant_type: grant_type,
      client_id: clientID,
      client_secret: clientSecret,
      username: user_storage,
      password: password_storage
    })
    await AsyncStorage.setItem('@access_token', responseToken.data.access_token);
  }
  return response;
}, async function (error) {

  erroResponse = {};
  //modelo do objeto de erro
  /*
  {
   "errors":{
      "placa":[
         "A placa mtc não existe.",
         "The placa must be 10.",
         "The placa must be an integer."
      ],
      "input2":[
         "A placa mtc não existe.",
         "The placa must be 10.",
         "The placa must be an integer."
      ]
   },
   "message":"The given data was invalid."
  }*/

  errorJson = error.toJSON();
  if (errorJson.message == 'Request failed with status code 401' && errorJson.config.url != 'oauth/token') {
    const clientID = await AsyncStorage.getItem('@Client');
    const clientSecret = await AsyncStorage.getItem('@Secret');
    const grant_type = await AsyncStorage.getItem('@grant_type');
    const user_storage = await AsyncStorage.getItem('@username');
    const password_storage = await AsyncStorage.getItem('@password');

    const responseToken = await api.post('oauth/token', {
      grant_type: grant_type,
      client_id: clientID,
      client_secret: clientSecret,
      username: user_storage,
      password: password_storage
    })
    await AsyncStorage.setItem('@access_token', responseToken.data.access_token);
  } else if (errorJson.message == 'Request failed with status code 401') {
    erroResponse = {
      "errors": {
        "401": [
          "Requisição não autorizada. Tente novamente."
        ]
      },
      "message": "Não autorizado."
    };
  } else if (errorJson.message == 'Request failed with status code 404') {
    erroResponse = {
      "errors": {
        "404": [
          "O item requisitado não foi encontrado!"
        ]
      },
      "message": "Não encontrado."
    };
  } else if (errorJson.code == 'ECONNABORTED') {
    erroResponse = {
      "errors": {
        "Timeout": [
          "Não foi possivel estabelecer conexão com a API."
        ]
      },
      "message": "Timeout."
    };
  } else if (errorJson.message == 'Request failed with status code 500') {

    erroResponse = {
      "errors": {
        "500": [
          "Erro desconhecido na API. Por favor contatar a TI "
        ]
      },
      "message": "Erro API"
    };
  } else if (errorJson.message == 'Network Error') {
    erroResponse = {
      "errors": {
        "Timeout": [
          "Sem conexão com a internet!"
        ]
      },
      "message": "Erro API"
    };
  } else if (errorJson.message == 'Request failed with status code 400') {
    erroResponse = {
      "errors": {
        "Timeout": [
          "A requisição está incorreta!"
        ]
      },
      "message": "Erro Request"
    };
  } else {
    erroResponse = {
      "errors": {
        "Erro desconhecido": [
          JSON.stringify(errorJson)
        ]
      },
      "message": errorJson.message
    };
    return Promise.reject(erroResponse);
  }
  return Promise.reject(erroResponse);
});