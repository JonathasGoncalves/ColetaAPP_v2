import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, Image, Alert,
  ActivityIndicator, TouchableWithoutFeedback, Keyboard, ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styles from './style';
import { Button, Container } from 'native-base';
import api from '../../../services/api';
import * as actionsIMEI from '../../../store/actions/imeiActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as actionsColeta from '../../../store/actions/coletaActions';
import { time, date } from '../../../functions/tempo';
import NetInfo from "@react-native-community/netinfo";
import ModalSelector from 'react-native-modal-selector';
import * as Updates from 'expo-updates';
import erroMessage from './../../../functions/erroMessage';

const Cadastro = ({
  save_coleta,
  adicionar_horaI,
  adicionar_data,
  saveVeiculo,
  save_linhas
}) => {
  const [placa, setPlaca] = useState('');
  const [placas, setPlacas] = useState([]);
  const [odometro, setOdometro] = useState('');
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [motorista, setMotorista] = useState({});
  const [updateController, setUpdateController] = useState(true);

  const isMountedRef = useRef(null);

  useEffect(() => {

    isMountedRef.current = true;

    NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
    });

    async function updateAPP() {
      //await AsyncStorage.setItem('@access_token', 'dfsdfsfdsfsdfsdfsdfdcscxcxcvxcvxc');
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          setUpdateController(false);
          await Updates.reloadAsync();
        } else {
          setUpdateController(false);
        }
      } catch (e) {

        if (!isConnected) {
          Alert.alert(
            'Sem internet!',
            'Não é possivel verificar atualizações sem internet. Conecte-se e reinicie o APP!',
            [
              { text: 'OK' },
            ]
          );
        } else {
          Alert.alert(
            'Erro ao atualizar o APP!',
            `Erro ${e}`,
            [
              { text: 'OK' },
            ]
          );
        }
        setUpdateController(false);
      }
    }

    //ATUALIZAR MOTORISTA ITENS
    async function atualizar_motorista() {

      const cod_motorista = await AsyncStorage.getItem('@cod_motorista');

      try {
        //RECUPERAR TRANSPORTADORA
        const transportadora = await api.post('api/transportadora/transportadora_motorista', {
          cod_motorista: cod_motorista
        });

        //RECUPERANDO AS PLACAS Q ESSE APARELHO PODE UTILIZAR
        const motoristas = await api.post('api/transportadora/atualizar_motorista', {
          cod_transportadora: transportadora.data.COD_TRANSPORTADORA
        });
        //SET NO ASYNC
        //ADICIONANDO OS MOTORISTAS NO
        await AsyncStorage.setItem('@motoristas', JSON.stringify(motoristas.data));
        //criando array de placas para p picker de placas
        let placas_temp = [], i = 0;
        for (motorista_item of motoristas.data) {
          placas_temp.push({ key: i, label: motorista_item.placa, COD_TRANSPORTADORA: motorista_item.COD_TRANSPORTADORA });
          i++;
        }
        setPlacas(placas_temp);
      } catch (error) {
        Alert.alert(
          error.errors.codigo[0],
          error.message,
          [
            { text: 'ok', onPress: () => sairErro() },
          ]
        );
      }

    }
    updateAPP();
    atualizar_motorista();

    return () => isMountedRef.current = false;
  }, [])

  async function salvarPlaca() {
    if (!isConnected) {
      Alert.alert(
        'Sem conexão com a internet!',
        'É necessário se conectar para iniciar a coleta!',
        [
          { text: 'OK' },
        ]
      );
    } else {
      setLoading(true);
      try {
        //Retorna a quantidade de litros q cada coleta deve ter
        const responseLitros = await api.get('api/coleta/parametro_litros');
        await AsyncStorage.setItem('@parametro_litros', JSON.stringify(responseLitros.data));

        //retorna as linhas q essa transportadora atende. Se o item enviado tiver linha == null
        //retorna todas as linhas (Caso dos "socorros" da selita)
        const responseLinhas = await api.post('api/linha/linhasPorVeiculo', {
          cod_transportadora: motorista.COD_TRANSPORTADORA
        })

        //retorna as observações do tanque
        const responseObs = await api.get('api/coleta/RetornaObservacoes');


        let linhas = [];
        for (linhaItem of responseLinhas.data.linhas) {
          linhas.push(linhaItem.linha);
        }

        //retorna todos os tanques, das linhas encontradas, agrupados por linha
        const responseTanques = await api.post('api/tanque/TanquesInLinhas', {
          linhas: linhas
        });

        if (linhas.length > 0 && responseTanques.data.tanques.length > 0) {
          await AsyncStorage.setItem("@tanques", JSON.stringify(responseTanques.data.tanques))
          await AsyncStorage.setItem('@OdometroI', odometro);
          await AsyncStorage.setItem('@linhas', JSON.stringify(linhas));
          await AsyncStorage.setItem('@linhasObj', JSON.stringify(responseLinhas.data.linhas));
          await AsyncStorage.setItem('@veiculo', JSON.stringify(motorista));
          await AsyncStorage.setItem('@obs', JSON.stringify(responseObs.data.observacoes));

          //const hora = time();
          //const data = date();

          save_linhas(linhas);
          adicionar_horaI(time());
          adicionar_data(date());
          await AsyncStorage.setItem('@horaI', date());
          await AsyncStorage.setItem('@data', date());
          await AsyncStorage.setItem('@emAberto', 'true');
          save_coleta([]);
          setLoading(false);
          saveVeiculo(motorista);

        } else {
          throw ('Não foi possivel recuperar as linhas, tente novamente!')
        }
      } catch (error) {
        await AsyncStorage.multiRemove(['@emAberto', '@coleta', '@linha', '@finalizado', '@veiculo']);
        Alert.alert(
          error.errors.codigo[0],
          error.message,
          [
            { text: 'ok', onPress: () => sairErro() },
          ]
        );
      }
    }
  }

  function setOdometroAction(text) {
    const newText = text.replace(/[^0-9]/g, '');
    setOdometro(newText);
  }

  async function modal_select(option) {
    setPlaca(option.label);
    if (isMountedRef.current) {
      setMotorista(option);
    }
  }

  return (
    <Container style={{ backgroundColor: 'white', flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{
          padding: 24,
          flex: 1,
          justifyContent: "space-around"
        }}>
          {updateController ? (
            <View style={styles.container}>
              <ActivityIndicator size='large' color='#F9690E' />
              <Text allowFontScaling={false} allowFontScaling={false} >Atualizando versão do APP...</Text>
            </View>
          ) : (
            <View >
              <ScrollView>
                <View>
                  <Image style={{ alignSelf: 'center' }} source={require('../../coleta/imagens/iconeCaminhao.jpg')} />
                  <Text allowFontScaling={false} style={styles.textDescPlaca}>
                    Selecione a placa do veiculo
                  </Text>
                </View>
                <ModalSelector
                  allowFontScaling={false}
                  style={styles.centeredView}
                  childrenContainerStyle={styles.childrenContainerStyle}
                  touchableStyle={styles.touchableStyle}
                  selectStyle={styles.selectStyle}
                  selectTextStyle={{ color: 'black' }}
                  selectedItemTextStyle={{ color: 'black' }}
                  optionTextStyle={{ color: 'black' }}
                  optionContainerStyle={{ backgroundColor: '#e6e6e6' }}
                  cancelStyle={{ backgroundColor: '#e6e6e6' }}
                  initValueTextStyle={styles.initValueTextStyle}
                  cancelText='Cancelar'
                  data={placas}
                  initValue="Clique para selecionar a placa"
                  onChange={(option) => { modal_select(option) }} />
                <View>
                  <Text allowFontScaling={false} style={styles.textDescPlaca}>
                    Odômetro Inicial
                  </Text>
                  <TextInput
                    keyboardType='numeric'
                    editable={!loading}
                    style={styles.inputPlaca}
                    value={odometro}
                    onChangeText={text => setOdometroAction(text)}
                  />
                  <Button
                    block
                    style={loading || placa.length <= 0 || odometro.length <= 0 ? styles.buttonContinuarPress : styles.buttonContinuar}
                    rounded={true}
                    onPress={salvarPlaca}
                    disabled={loading || placa.length <= 0 || odometro.length <= 0}
                  >
                    <Text allowFontScaling={false} style={styles.textButtonContinuar}>Continuar</Text>
                  </Button>
                </View>
              </ScrollView>
            </View>
          )
          }
          {loading && <ActivityIndicator size='large' color='#F9690E' style={{ marginTop: 20 }} />}
        </View>
      </TouchableWithoutFeedback>
    </Container>
  );
}

const mapStateToProps = state => ({
  imei: state.Identificacao.imei
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...actionsIMEI, ...actionsColeta }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Cadastro);
