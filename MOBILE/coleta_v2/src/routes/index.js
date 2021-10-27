import React, { useEffect, useState } from 'react';
import IDAPP from './identificarRoutes';
import ColetaStack from './coletaRouter';
import Habilitar from './habilitarRouter';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as actionsIMEI from '../store/actions/imeiActions';
import * as actionsColeta from '../store/actions/coletaActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import api from '../services/api';
import { calcularTotalColetado, calcularTotalColetadoPorTanque } from '../functions/totalColeta';
import { date } from './../functions/tempo';

function Routes({
  salvar_total_coletado,
  salvar_total_coletadoOff,
  save_linhaID,
  save_linhas,
  identificado,
  saveVeiculo,
  save_linha,
  save_coleta,
  adicionar_horaF,
  adicionar_horaI,
  save_tanque,
  adicionar_data,
  salvar_total_coletado_tanque,
  salvar_total_coletadoOff_tanque,
  save_user,
  username,
  save_passport
}) {
  const [verificar, setVerificar] = useState(true);

  useEffect(() => {
    async function verificar_dados() {
      /* armazerar credenciais do client laravel 
      ClientProtheus
      Client ID: 1
      Client secret: daKpV4Lpgmp0DBozqsQMr81FbTTBOztVoaD9Dxyl
      */

      /* client local
        (--valida aparelhos)
        Client ID: 6
        Client secret: glQNqYpv0vmFKG31KCSqMWB82MwsGIk7y4asnn1B

        (--somente secret)
        Client ID: 7
        Client secret: ua0JaY1j3Q8xYCjaPCwKMhAnzs6x3n2gkYyZWo7y

        (Aparelhos cpanel)
        Client ID: 7
        Client secret: ZIJYH4zMvr14sNUCqC5gfJc6PARgvJoD3irHjYY2
      */

      //RECUPERA O CLIENT DE AUTENTICAÇÃO
      const clientIDVerificar = await AsyncStorage.getItem('@Client');
      //SE ESTIVER VAZIO (PRIMEIRO ACESSO, SETA OS VALORES)
      if (!clientIDVerificar) {
        //ADICONA O CLIENT Q VAI SER USADO. ATÉ A HABILITAÇÃO SER CONCLUIDA USA O 7
        //DEPOIS USA O 6(COM USUÁRIO E SENHA)
        await AsyncStorage.setItem('@Client', '1');
        await AsyncStorage.setItem('@Secret', 'daKpV4Lpgmp0DBozqsQMr81FbTTBOztVoaD9Dxyl');
        await AsyncStorage.setItem('@grant_type', 'client_credentials');
        const clientID = await AsyncStorage.getItem('@Client');
        save_passport(true);
      }
      //RECUPERANDO INFORMAÇÕES DE AUTENTICAÇÃO
      const clientID = await AsyncStorage.getItem('@Client');
      const clientSecret = await AsyncStorage.getItem('@Secret');
      const access_token = await AsyncStorage.getItem('@access_token');
      const grant_type = await AsyncStorage.getItem('@grant_type');
      const user_storage = await AsyncStorage.getItem('@username');
      const password_storage = await AsyncStorage.getItem('@password');
      //SE NÃO TIVER UM TOKEN SALVO, SOLICITA NOVO TOKEN
      //ESSE TOKEN É PARA A REUISIÇÃO DAS ROTAS Q NÃO PRECISAM DE USUÁRIO, "ROTAS ABERTAS"
      //(/solicitar_acesso', /aprovar_solicitacao, /habilitar_aparelho),
      if (!access_token) {
        try {
          let obj = {
            grant_type: grant_type,
            client_id: clientID,
            client_secret: clientSecret,
            username: user_storage,
            password: password_storage
          };
          const responseToken = await api.post('oauth/token', obj)
          await AsyncStorage.setItem('@access_token', responseToken.data.access_token);
        } catch (error) {
          //SÓ VAI CAIR AQUI SE USER DO PASSWORD FOR DELETADO DO BANCO
          //await AsyncStorage.removeItem('@Client');
          save_passport(false);
        }
      }

      //SE TIVER USUARIO SALVA, SENÃO, VAI CAIR NA TELA DE SOLICITAR ACESSO
      if (user_storage) {
        save_user(user_storage, password_storage);
      }
      //SE NÃO TIVER VEICULO, NÃO EXISTEM INFORMAÇÕES DE COLETA PARA RECUPERAR
      //FINALIZA A VALIDADAÇÃO
      const veiculo = await AsyncStorage.getItem('@veiculo');
      if (veiculo) {
        const emAbertoStorage = await AsyncStorage.getItem('@emAberto');
        if (emAbertoStorage == 'true') {
          const coletaStoragetemp = await AsyncStorage.getItem('@coleta');
          const coletaStorage = JSON.parse(coletaStoragetemp);
          const tanqueAtualS = await AsyncStorage.getItem('@tanqueAtual');
          const tanqueAtualStorage = JSON.parse(tanqueAtualS);
          const linha = await AsyncStorage.getItem('@linha');
          const idlinhaTemp = await AsyncStorage.getItem('@idlinha');
          const idlinha = JSON.parse(idlinhaTemp);
          const data = date();
          await AsyncStorage.setItem('@data', data);
          const horaI = await AsyncStorage.getItem('@horaI');
          const horaF = await AsyncStorage.getItem('@horaF');
          const linhasTemp = await AsyncStorage.getItem('@linhas');
          const linhas = JSON.parse(linhasTemp);
          save_tanque(tanqueAtualStorage);
          adicionar_horaI(horaI);
          adicionar_horaF(horaF);
          adicionar_data(data);
          save_linha(linha);
          save_linhas(linhas);
          save_linhaID(idlinha);
          if (coletaStorage != null) {
            save_coleta(coletaStorage);
            const total = calcularTotalColetado(coletaStorage);
            salvar_total_coletado(total.total);
            salvar_total_coletadoOff(total.totalOff);
            const totalTanque = calcularTotalColetadoPorTanque(coletaStorage, tanqueAtualStorage);
            salvar_total_coletado_tanque(totalTanque.total);
            salvar_total_coletadoOff_tanque(totalTanque.totalOff);
          } else {
            save_coleta([]);
          }
        }
        const veiculoTemp = JSON.parse(veiculo);
        await saveVeiculo(veiculoTemp);
      }
      setVerificar(false);
    }
    verificar_dados();
  }, [])

  //OU STACK DE AUTENTICAÇÃO (AGUARNDANDO SOLICITAÇÃO, AGUARDANDO LEITURA DO QRCODE)
  if (verificar) {
    return <ActivityIndicator />
  } else if (!username) {  //NÃO HABILITOU
    return <Habilitar />
  } else if (identificado) {
    return <ColetaStack />
  } else {
    return <IDAPP />;
  }
};

const mapStateToProps = state => ({
  identificado: state.Identificacao.identificado,
  username: state.Identificacao.username,
  passport: state.Identificacao.passport
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...actionsIMEI, ...actionsColeta }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Routes);


