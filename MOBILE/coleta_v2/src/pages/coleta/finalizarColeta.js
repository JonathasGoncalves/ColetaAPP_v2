import React, { useEffect, useState } from 'react';
import {
  View, Text, ActivityIndicator, Alert, TextInput,
  KeyboardAvoidingView,
  FlatList
}
  from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionsColeta from '../../store/actions/coletaActions';
import styles from './styles';
import { Button, Container } from 'native-base';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { time } from '../../functions/tempo';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import * as actionsIMEI from '../../store/actions/imeiActions';
import { ScrollView } from 'react-native-gesture-handler';
import NetInfo from "@react-native-community/netinfo";
import erroMessage from '../../functions/erroMessage';
import { NativeModules } from 'react-native';
import { Header } from '@react-navigation/stack';

const Finalizar = ({
  removerID,
  coleta,
  data,
  horaI,
  navigation,
  save_coleta,
  adicionar_horaF }) => {

  const [loading, setLoading] = useState(false);
  const [odometro, setOdometro] = useState('');
  const [transmitindo, setTransmitindo] = useState(false);
  const [grid, setGrid] = useState([]);
  const [isConnected, setIsConnected] = useState(true);

  //@finalizado 1 coleta; 2 falta finalizar; 3 falta transmitir
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button
          transparent
          onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon="arrow-left" color="white" size={25} style={{ marginLeft: 10 }} />
        </Button>
      ),
    });
    navigation.setOptions({
      headerRight: () => (
        <View>
        </View>
      ),
    });

    NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
    });

    async function verificarSubmisao() {
      const hora = time();
      adicionar_horaF(hora);
      await AsyncStorage.setItem('@horaF', hora);
      await finalizarColeta();
    }
    verificarSubmisao();
  }, [])

  function setOdometroAction(text) {
    newText = text.replace(/[^0-9]/g, '');
    setOdometro(newText);
  }

  async function finalizarColeta() {
    setLoading(true);
    tanquesCount = 0;
    volumeSum = 0;
    tanquesCountOc = 0;
    volumeSumOc = 0;
    coleta.map((coletaLinha) => {
      coletaLinha.coleta.map((coletaItem) => {
        if (coletaItem.cod_ocorrencia != '') {
          volumeSumOc += coletaItem.volume;
          tanquesCountOc++;
        }
        if (coletaItem.volume > 0 && coletaItem.cod_ocorrencia == '') {
          tanquesCount++;
          volumeSum += coletaItem.volume;
        }
      })
    })

    const horafAdd = await AsyncStorage.getItem('@horaF');
    labels = ['Data', 'Nº Tanques', 'Volume', 'Tanq. Ocorrências', 'Vol. Fora Padrão', 'Hora Ínicio', 'Hora Fim'];
    values = [data, tanquesCount, volumeSum, tanquesCountOc, volumeSumOc, horaI, horafAdd]
    obj = {
      label: '',
      valor: '',
      id: '0'
    }
    listGrid = [];
    for (i = 0; i < 7; i++) {
      obj.label = labels[i];
      obj.valor = values[i];
      obj.id = String(i);
      listGrid.push(obj);
      obj = {
        label: '',
        valor: '',
        id: '0'
      }
    }
    setGrid(listGrid);
    setLoading(false);
  }

  function renderTotal(total) {
    return (
      <View style={total.id == '0' ? styles.ViewItemList1 : styles.ViewItemList}>
        <View style={styles.viewItemLinhaFinalizar}>
          <View style={styles.viewItemLatao}>
            <Text allowFontScaling={false} style={styles.textTituloFinalizar}>
              {total.label}
            </Text>
            <Text allowFontScaling={false} style={styles.textvalorFinal}>
              {total.valor}
            </Text>
          </View>
        </View>
      </View>
    )
  }

  async function submeterColeta() {

    if (isConnected) {

      //criar array no formato que a api recebe
      setTransmitindo(true);
      setLoading(true);

      await AsyncStorage.setItem('@OdometroF', odometro);

      try {

        const veiculoTemp = await AsyncStorage.getItem('@veiculo');
        const veiculo = JSON.parse(veiculoTemp);

        const data = await AsyncStorage.getItem('@data');
        const odometroI = await AsyncStorage.getItem('@OdometroI');
        const odometroF = await AsyncStorage.getItem('@OdometroF');

        novaColeta = {};

        //CRIA COLETA NORMALMENTE
        const responseColeta = await api.post('api/coleta/NovaColeta', {
          data: data,
          chave_motorista: veiculo.CHAVE,
          odometroI: odometroI,
          odometroF: odometroF
        })


        //precisa das tabelas novas
        novaColeta = responseColeta.data;
        var coletaRequest = [];
        coleta.map((coleta) => { //cada coleta representa uma linha
          coleta.coleta.map((coletaItem) => { //cada coletaOtem representa um tanque
            coletaItem.lataoList.map((latao) => { //lista de latão do tanque
              //cada latão : {"data": "", "hora": "", "latao": "003222", "volume": 0}
              if (latao.volume > 0 && coletaItem.cod_ocorrencia == '') {
                temp = 0;
                if (coletaItem.temperatura >= 0) {
                  temp = parseFloat(coletaItem.temperatura)
                }
                coletaUnidade = {
                  id_coleta: novaColeta.id,
                  id: coletaItem.id,
                  codigo: coletaItem.codigo,
                  codigo_cacal: coletaItem.codigo_cacal,
                  tanque: coletaItem.tanque,
                  latao: latao.latao,
                  LINHA: coletaItem.LINHA,
                  lataoQuant: parseInt(coletaItem.lataoQuant),
                  ATUALIZAR_COORDENADA: coletaItem.ATUALIZAR_COORDENADA,
                  tpfor: coletaItem.tpfor,
                  temperatura: temp,
                  odometro: coletaItem.odometro,
                  volume: latao.volume,
                  latitude: coletaItem.latitude,
                  longitude: coletaItem.longitude,
                  cod_ocorrencia: coletaItem.cod_ocorrencia,
                  observacao: coletaItem.observacao,
                  data: latao.data,
                  hora: latao.hora,
                  boca: 1,
                  volume_fora_padrao: 0
                };
                coletaRequest.push(coletaUnidade);
              }
            })
            if (coletaItem.cod_ocorrencia != '') {
              volumeOC = 0;
              volumeOC = coletaItem.volume;
              temp = 0;
              if (coletaItem.temperatura >= 0) {
                temp = parseFloat(coletaItem.temperatura)
              }
              coletaUnidade = {
                id_coleta: novaColeta.id,
                id: coletaItem.id,
                codigo: coletaItem.codigo,
                codigo_cacal: coletaItem.codigo_cacal,
                tanque: coletaItem.tanque,
                latao: coletaItem.latao,
                LINHA: coletaItem.LINHA,
                lataoQuant: parseInt(coletaItem.lataoQuant),
                ATUALIZAR_COORDENADA: coletaItem.ATUALIZAR_COORDENADA,
                tpfor: coletaItem.tpfor,
                temperatura: temp,
                odometro: coletaItem.odometro,
                volume: 0,
                latitude: coletaItem.latitude,
                longitude: coletaItem.longitude,
                cod_ocorrencia: coletaItem.cod_ocorrencia,
                observacao: coletaItem.observacao,
                data: coletaItem.lataoList[0].data,
                hora: coletaItem.lataoList[0].hora,
                boca: 1,
                volume_fora_padrao: volumeOC
              };
              coletaRequest.push(coletaUnidade);
            }
          })
        })

        //Criando objetos para salvar no arquivo de texto local
        nova_coleta_obj = {
          data: data,
          chave_motorista: veiculo.CHAVE,
          odometroI: odometroI,
          odometroF: odometroF
        }
        nova_coleta_string = JSON.stringify(nova_coleta_obj);
        string_request_comp = {
          coletas: coletaRequest
        }
        coletas_json = JSON.stringify(string_request_comp);
        coletas_json_completo = nova_coleta_string + "\n" + coletas_json;
        //Gerando e salvando o arquivo de texto na pasta "Coleta BKP"
        const hora_atual = time();
        let file_name = `coleta_${data}_${hora_atual}.txt`;
        try {
          const { AcessoLocal } = NativeModules;
          //SALVANDO ARQUIVO DE BKP
          resp_save = await AcessoLocal.save_file_bkp(coletas_json_completo, file_name);
          if (resp_save != "1") {
            const AsyncAlert = async () => new Promise((resolve) => {
              Alert.alert(
                'Atenção!',
                'Arquivo de backup não gerado! Por favor entrar em contato com a TI!',
                [
                  {
                    text: 'ok',
                    onPress: () => {
                      resolve('YES');
                    },
                  },
                ],
                { cancelable: false },
              );
            });
            await AsyncAlert();
          }

          //EXCLUINDO ARQUIVOS LOCAIS COM MAIS DE 7 DIAS
          resp_excluir = await AcessoLocal.ExcluirArquivos();
          if (resp_excluir != "1") {
            const AsyncAlert = async () => new Promise((resolve) => {
              Alert.alert(
                'Atenção!',
                'Arquivo de backup não excluido! Por favor entrar em contato com a TI!',
                [
                  {
                    text: 'ok',
                    onPress: () => {
                      resolve('YES');
                    },
                  },
                ],
                { cancelable: false },
              );
            });
            await AsyncAlert();
          }

        } catch (error) {
          temp = JSON.stringify(error);
          const AsyncAlert = async () => new Promise((resolve) => {
            Alert.alert(
              'Erro no tratamento de arquivos locais!',
              temp,
              [
                {
                  text: 'ok',
                  onPress: () => {
                    resolve('YES');
                  },
                },
              ],
              { cancelable: false },
            );
          });
          await AsyncAlert();
        }

        TEMP_REQUEST = await api.post('api/coleta/NovaColetaItem', {
          coletas: coletaRequest
        })

        await AsyncStorage.multiRemove(['@emAberto', '@coleta', '@linha', '@finalizado', '@veiculo']);
        await AsyncStorage.setItem('@transmitir', 'false');

        Alert.alert(
          'Sucesso!',
          'Coleta transmitida!',
          [
            { text: 'ok', onPress: () => sair() },
          ]
        );
      } catch (error) {
        if (novaColeta.id) {
          await api.post('api/coleta/RemoverColeta', {
            id_coleta: novaColeta.id
          })
        }
        Alert.alert(
          'Erro',
          erroMessage(error),
          [
            { text: 'ok', onPress: () => sairErro() },
          ]
        );
      }
    } else {
      Alert.alert(
        'Erro!',
        'Sem conexão com a internet',
        [
          { text: 'ok', onPress: () => sairErro() },
        ]
      );
    }
  }

  function sair() {
    save_coleta([]);
    setTransmitindo(false);
    setLoading(false);
    removerID();
  }

  function sairErro() {
    setTransmitindo(false);
    setLoading(false);
  }

  return (
    <Container>

      <KeyboardAvoidingView
        keyboardVerticalOffset={Header.HEIGHT + 20}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView>
          <View style={{
            marginBottom: 24,
            marginTop: 24,
            flex: 1,
            justifyContent: "space-around"
          }}>

            {loading || transmitindo ? (
              <ActivityIndicator size="large" color="#F9690E" />
            ) : (

              <View style={styles.ViewTotalFinalizar}>
                <View style={styles.ViewFlatList}>
                  <Text allowFontScaling={false} style={styles.textTituloGeralFinalizar}>Informações Gerais</Text>
                  <FlatList
                    data={grid}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => renderTotal(item)}
                  />
                </View>

                <View style={{ marginTop: 20 }}>
                  <Text allowFontScaling={false} style={styles.textDescOdometro}>
                    Odômetro Final
                    </Text>
                  <TextInput
                    maxLength={9}
                    keyboardType='numeric'
                    editable={!loading}
                    style={styles.inputPlaca}
                    value={odometro}
                    onChangeText={text => setOdometroAction(text)}
                  />
                </View>

                <Button
                  block
                  style={loading || transmitindo || odometro.length <= 0 ? styles.buttonContinuarPress : styles.buttonContinuar}
                  disabled={loading || odometro.length <= 0 || transmitindo}
                  rounded={true}
                  onPress={submeterColeta}
                >
                  <Text allowFontScaling={false} style={styles.textButtonContinuar}>Transmitir Coleta</Text>
                </Button>
              </View>
            )
            }
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

    </Container>
  )
}

const mapStateToProps = state => ({
  tanqueAtual: state.Coleta.tanqueAtual,
  coleta: state.Coleta.coleta,
  cod_linha: state.Coleta.cod_linha,
  veiculo: state.Identificacao.veiculo,
  transmitir: state.Coleta.transmitir,
  horaI: state.Coleta.horaI,
  horaF: state.Coleta.horaF,
  imei: state.Identificacao.imei,
  data: state.Coleta.data,
  linhas: state.Coleta.linhas,
  id_coleta: state.Coleta.id_coleta
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...actionsIMEI, ...actionsColeta }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Finalizar);