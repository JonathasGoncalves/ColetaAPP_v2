import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, Alert } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionsColeta from '../../store/actions/coletaActions';
import styles from './styles';
import { Button } from 'native-base';
import { CommonActions } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { ListItem, Radio, Right, Left, Container } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { date, time } from '../../functions/tempo';
import Geolocation from '@react-native-community/geolocation';
import { calcularTotalColetado } from '../../functions/totalColeta';

const TanqueColeta = ({ salvar_total_coletado, salvar_total_coletadoOff, id_linha, coleta, tanqueAtual, navigation, save_coleta, save_tanque }) => {

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [coletando, setColetando] = useState(false);
  const [odometro, setOdometro] = useState('');
  const [volume, setVolume] = useState('');
  const [temperatura, setTemperatura] = useState('');
  const [loading, setLoading] = useState(false);
  const [obs, setObs] = useState('');
  const [obsType, setObsType] = useState('');
  const [tempInvalida, setTemInvalida] = useState(false);

  useEffect(() => {
    function setLocalizacao(geolocation) {
      setLatitude(String(geolocation.coords.latitude));
      setLongitude(String(geolocation.coords.longitude));
    }

    try {
      if (tanqueAtual.ATUALIZAR_COORDENADA == 1) {
        Geolocation.getCurrentPosition(info => setLocalizacao(info));
      } else {
        setLatitude('00000000000');
        setLongitude('00000000000');
      }
    } catch (error) {
      Alert.alert(
        'Atenção!',
        'Não foi possivel capturar a localização!',
        [
          { text: 'ok' },
        ]
      );
    }
    setObs(tanqueAtual.observacao);
    setTemperatura(String(tanqueAtual.temperatura));
    setOdometro(tanqueAtual.odometro);

    if (tanqueAtual.cod_ocorrencia != '') {
      setObsType(tanqueAtual.cod_ocorrencia);
    }

    navigation.setOptions({
      headerRight: () => (
        <View></View>
      ),
    });

    navigation.setOptions({
      headerLeft: () => (
        <Button
          transparent
          onPress={() => handleBackButtonClick()}>
          <FontAwesomeIcon icon="arrow-left" color="white" size={25} style={{ marginLeft: 10 }} />
        </Button>
      ),
    });
  }, [])

  function setTemperaturaAction(text) {
    const newText = text.replace(/[^0-9.]/g, '');

    if (parseFloat(newText) > 30.0) {
      setTemInvalida(true);
    } else {
      setTemInvalida(false);
    }
    setTemperatura(newText);
  }

  function setOdometroAction(text) {
    const newText = text.replace(/[^0-9]/g, '');
    setOdometro(newText);
  }

  function setVolumeAction(text) {
    setObs('');
    const newText = text.replace(/[^0-9]/g, '');
    setVolume(newText);
  }


  function handleBackButtonClick() {
    if (coletando) {
      setColetando(!coletando);
      return true;
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: 'Coleta' },
          ],
        })
      );
      return true;
    }
  }

  async function onPressInfo() {
    setLoading(true);

    const dataFormat = date();
    const timeFormat = time();

    var copyColeta = coleta;
    var tanqueTemp = {};
    copyColeta[id_linha].coleta.map((tanqueMap) => {
      if (tanqueMap.tanque == tanqueAtual.tanque) {
        if (obsType == '003') {
          tanqueMap.volume = parseInt(volume);
          tanqueMap.lataoList.map((listLatao) => {
            listLatao.volume = 0;
          })
        }
        tanqueMap.lataoList.map((listLatao) => {
          listLatao.hora = timeFormat;
          listLatao.data = dataFormat;
        })
        tanqueMap.cod_ocorrencia = obsType;
        tanqueMap.observacao = obs;
        tanqueMap.odometro = odometro;
        tanqueMap.latitude = latitude;
        tanqueMap.longitude = longitude;
        if (temperatura != '') {
          tanqueMap.temperatura = parseFloat(temperatura);
        } else {
          tanqueMap.temperatura = 0;
        }
        tanqueTemp = tanqueMap;
      }
    })

    const total = calcularTotalColetado(copyColeta);
    salvar_total_coletado(total.total);
    salvar_total_coletadoOff(total.totalOff);

    save_tanque(tanqueTemp);
    await AsyncStorage.setItem('@tanqueAtual', JSON.stringify(tanqueTemp));
    await AsyncStorage.setItem('@coleta', JSON.stringify(copyColeta));
    save_coleta(copyColeta);
    if (obsType != '') {
      navigation.dispatch(state => {
        // Remove the home route from the stack
        const routes = state.routes.filter(r => r.name !== 'Home');
        return CommonActions.reset({
          index: 0,
          routes
        });
      });
      setLoading(false);
      navigation.goBack();
    } else {
      setLoading(false);
      navigation.navigate('LataoList');

    }
  }

  function setObsTypeFunction(type) {
    if (type == '004') {
      setVolume('');
    }
    if (type == obsType) {
      setObsType('');
    } else {
      setObsType(type);
    }
  }

  return (
    <Container >
      <View style={{
        marginBottom: 24,
        marginTop: 24,
        flex: 1,
        justifyContent: "space-around"
      }}>
        <View>
          <ScrollView>
            <Text allowFontScaling={false} style={styles.textTituloLinha}>Odômetro</Text>
            <TextInput
              maxLength={9}
              keyboardType='numeric'
              style={styles.inputPlaca}
              value={odometro}
              onChangeText={text => setOdometroAction(text)}
            />
            <Text allowFontScaling={false} style={styles.textTituloLinha}>Temperatura</Text>
            <TextInput
              maxLength={4}
              keyboardType='numeric'
              style={styles.inputPlaca}
              value={temperatura}
              onChangeText={text => setTemperaturaAction(text)}
            />
            {tempInvalida && <Text allowFontScaling={false} style={{ alignSelf: 'center', color: 'red' }}>Temperatura precisa ser menor que 30.0</Text>}
            <View style={styles.ViewRadioSelect}>
              <ListItem style={{ borderColor: 'white' }}>
                <Left>
                  <Text
                    allowFontScaling={false}
                    style={styles.textCod}
                    onPress={() => setObsTypeFunction('001')}
                  >
                    IMP. DE ACESSO AO TANQUE</Text>
                </Left>
                <Right>
                  <Radio
                    style={{ width: 25 }}
                    selectedColor={"#F9690E"}
                    selected={obsType == '001'}
                    onPress={() => setObsTypeFunction('001')}
                  />
                </Right>
              </ListItem>
              <ListItem style={{ borderColor: 'white' }}>
                <Left>
                  <Text
                    allowFontScaling={false}
                    style={styles.textCod}
                    onPress={() => setObsTypeFunction('002')}
                  >
                    VOLUME INSUFICIENTE</Text>
                </Left>
                <Right>
                  <Radio
                    style={{ width: 25 }}
                    selectedColor={"#F9690E"}
                    selected={obsType == '002'}
                    onPress={() => setObsTypeFunction('002')}
                  />
                </Right>
              </ListItem>
              <ListItem style={{ borderColor: 'white' }}>
                <Left>
                  <Text
                    allowFontScaling={false}
                    style={styles.textCod}
                    onPress={() => setObsTypeFunction('003')}
                  >
                    LEITE FORA DO PADRAO</Text>
                </Left>
                <Right>
                  <Radio
                    style={{ width: 25 }}
                    selectedColor={"#F9690E"}
                    selected={obsType == '003'}
                    onPress={() => setObsTypeFunction('003')}
                  />
                </Right>
              </ListItem>
              <ListItem style={{ borderColor: 'white' }}>
                <Left>
                  <Text
                    allowFontScaling={false}
                    style={styles.textCod}
                    onPress={() => setObsTypeFunction('004')}
                  >
                    OUTROS</Text>
                </Left>
                <Right>
                  <Radio
                    style={{ width: 25 }}
                    selectedColor={"#F9690E"}
                    selected={obsType == '004'}
                    onPress={() => setObsTypeFunction('004')}
                  />
                </Right>
              </ListItem>
              {obsType == '004' &&
                <>
                  <Text allowFontScaling={false} style={styles.textTitulo}>Observações</Text>
                  <View>
                    <TextInput
                      returnKeyType='done'
                      returnKeyLabel="OK"
                      blurOnSubmit={true}
                      multiline={true}
                      style={styles.inputPlaca}
                      value={obs}
                      onChangeText={text => setObs(text)}
                    >
                    </TextInput>
                  </View>
                </>
              }
              {obsType == '003' &&
                <>
                  <Text allowFontScaling={false} style={styles.textTitulo}>Volume Fora Do Padrão</Text>
                  <TextInput
                    maxLength={6}
                    keyboardType='numeric'
                    multiline={true}
                    style={styles.inputPlaca}
                    value={volume}
                    onChangeText={text => setVolumeAction(text)}
                  />
                </>
              }
            </View>
            <Button
              block
              style={(obsType == '' && (odometro.length <= 0 || temperatura.length <= 0) || (obsType != '' && (odometro.length <= 0)) || (obsType == '003' && (volume.length <= 0)) ||
                (obsType == '004' && (obs.length <= 0)) ||
                loading || tempInvalida) ? styles.buttonContinuarPress : styles.buttonContinuar}
              rounded={true}
              onPress={onPressInfo}
              disabled={
                (
                  odometro.length <= 0 ||
                  (obsType == '' && (odometro.length <= 0 || temperatura.length <= 0)) ||
                  (obsType == '003' && (volume.length <= 0))) ||
                (obsType == '004' && (obs.length <= 0) ||
                  loading || tempInvalida
                )
              }
            >
              <Text allowFontScaling={false} style={styles.textButtonContinuar}>Continuar</Text>
            </Button>
          </ScrollView>
        </View>
      </View>
    </Container >
  );
}

const mapStateToProps = state => ({
  tanqueAtual: state.Coleta.tanqueAtual,
  coleta: state.Coleta.coleta,
  cod_linha: state.Coleta.cod_linha,
  id_linha: state.Coleta.id_linha
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(actionsColeta, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TanqueColeta);