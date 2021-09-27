import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Alert
} from 'react-native';
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
import Geolocation from 'react-native-geolocation-service';
import { calcularTotalColetado } from '../../functions/totalColeta';

const TanqueColeta = ({ salvar_total_coletado, salvar_total_coletadoOff, id_linha, coleta, tanqueAtual, navigation, save_coleta, save_tanque }) => {

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [coletando, setColetando] = useState(false);
  const [odometro, setOdometro] = useState('');
  const [temperatura, setTemperatura] = useState('');
  const [loading, setLoading] = useState(false);
  const [observacoes, setObservacoes] = useState([]);
  const [obsObj, setObsObj] = useState({ id: 0, descricao: '', resposta: '', tipo: '' });
  const [temObs, setTemObs] = useState(false);
  const [idObs, setIdObs] = useState('');
  const [respostaObs, setRespostaObs] = useState('');
  const [odometroInvalido, setOdometroInvalido] = useState(false);
  const [temperaturaInvalida, setTemperaturaInvalida] = useState(false)
  const [tempInvalida, setTemInvalida] = useState(false)

  useEffect(() => {

    async function recuperar_observacoes() {
      temp = JSON.parse(await AsyncStorage.getItem("@obs"));
      setObservacoes(temp);
    }

    function setLocalizacao(geolocation) {
      setLatitude(String(geolocation.coords.latitude));
      setLongitude(String(geolocation.coords.longitude));
    }

    try {
      if (tanqueAtual.ATUALIZAR_COORDENADA == 1) {
        Geolocation.getCurrentPosition(
          (position) => {
            setLocalizacao(position)
          },
          (error) => {
            Alert.alert(
              'Atenção! Erro ao acessar localização!',
              JSON.stringify(error),
              [
                { text: 'ok' },
              ]
            );
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } else {
        setLatitude('00000000000');
        setLongitude('00000000000');
      }
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Atenção!',
        'Não foi possivel capturar a localização!',
        [
          { text: 'ok' },
        ]
      );
    }

    recuperar_observacoes();
    setTemperatura(String(tanqueAtual.temperatura));
    setOdometro(tanqueAtual.odometro);
    /*if (tanqueAtual.complemento_obs) {
      setObsObj(tanqueAtual.complemento_obs);
      setTemObs(true);
    }*/

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

  function formatarTemperatura() {
    if (temperatura.length > 0 && !isNaN(parseFloat(temperatura)) && temperatura > 0) {
      setTemperatura(String(parseFloat(temperatura)));
      setTemperaturaInvalida(false);
    } else {
      setTemperaturaInvalida(true);
    }
  }

  function formatarOdometro() {
    if (odometro.length > 0 && !isNaN(parseFloat(odometro)) && odometro > 0) {
      setOdometro(String(parseFloat(odometro)));
      setOdometroInvalido(false);
    } else {
      setOdometroInvalido(true);
    }
  }

  function setRespostaAction(text, obs) {
    setRespostaObs(text);
    observacoes_temp = observacoes;
    observacoes_temp[observacoes.indexOf(obs)].resposta = text;
    setObservacoes(observacoes_temp);
    setTemObs(true);
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

    if ((!odometroInvalido && !temperaturaInvalida) || (idObs != '' && !odometroInvalido)) {
      setLoading(true);
      const dataFormat = date();
      const timeFormat = time();

      var copyColeta = coleta;
      var tanqueTemp = {};
      copyColeta[id_linha].coleta.map((tanqueMap) => {
        if (tanqueMap.tanque == tanqueAtual.tanque) {
          tanqueMap.lataoList.map((listLatao) => {
            listLatao.hora = timeFormat;
            listLatao.data = dataFormat;
          })
          tanqueMap.cod_ocorrencia = idObs;
          tanqueMap.complemento_obs = respostaObs;
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

      save_tanque(tanqueTemp);
      await AsyncStorage.setItem('@tanqueAtual', JSON.stringify(tanqueTemp));
      await AsyncStorage.setItem('@coleta', JSON.stringify(copyColeta));
      save_coleta(copyColeta);
      if (idObs != '') {
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
  }


  function verificarResposta(id_marcado) {
    return obsObj.id == id_marcado
  }

  function setObsTypeFunction(obs) {
    if (obs.id == obsObj.id) {
      setObsObj({ id: 0, descricao: '', resposta: '', tipo: '' });
      observacoes[observacoes.indexOf(obs)].resposta = '';
      setTemObs(false);
      setIdObs(0);
      setRespostaObs('');
    } else {
      temp = obsObj
      temp.id = obs.id
      setObsObj(temp);
      setIdObs(obs.id);
      if (obs.tipo == 'D') {
        setTemObs(true);
      }
      setRespostaObs('');
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
              onEndEditing={() => formatarOdometro()}
              keyboardType='numeric'
              style={styles.inputPlaca}
              value={odometro}
              onChangeText={text => setOdometroAction(text)}
            />
            <Text allowFontScaling={false} style={styles.textTituloLinha}>Temperatura</Text>
            <TextInput
              maxLength={4}
              onEndEditing={() => formatarTemperatura()}
              keyboardType='numeric'
              style={styles.inputPlaca}
              value={temperatura}
              onChangeText={text => setTemperaturaAction(text)}
            />
            {tempInvalida && <Text allowFontScaling={false} style={{ alignSelf: 'center', color: 'red' }}>Temperatura precisa ser menor que 30.0</Text>}
            <View style={styles.ViewRadioSelect}>
              {
                observacoes.map((obs) => {
                  return (
                    <View key={obs.id}>
                      <ListItem style={{ borderColor: 'white' }}>
                        <Left>
                          <Text
                            allowFontScaling={false}
                            style={styles.textCod}
                            onPress={() => setObsTypeFunction(obs)}
                          >
                            {obs.descricao}</Text>
                        </Left>
                        <Right>
                          <Radio
                            color={'gray'}
                            style={{ width: 25 }}
                            selectedColor={"#F9690E"}
                            selected={verificarResposta(obs.id)}
                            onPress={() => setObsTypeFunction(obs)}
                          />
                        </Right>
                      </ListItem>
                      {obs.tipo == 'D' && obsObj.id == obs.id &&
                        <>
                          <Text allowFontScaling={false} style={styles.textTitulo}>Complemento da observação</Text>
                          <TextInput
                            multiline={true}
                            style={styles.inputPlaca}
                            value={respostaObs}
                            onChangeText={text => setRespostaAction(text, obs)}
                          />
                        </>
                      }
                    </View>
                  )
                })
              }
            </View>
            {(odometroInvalido || temperaturaInvalida) && <Text allowFontScaling={false} style={{ alignSelf: 'center', color: 'red' }}>Temperatura e Odômetro precisam ser preenchidos e maiores que zero</Text>}
            <Button
              block
              style={(idObs == '' && (odometro.length <= 0 || temperatura.length <= 0) || (idObs != '' && (odometro.length <= 0)) || (temObs == true && (respostaObs.length <= 0)) ||
                loading || tempInvalida) ? styles.buttonContinuarPress : styles.buttonContinuar}
              rounded={true}
              onPress={onPressInfo}
              disabled={
                (
                  odometro.length <= 0 ||
                  (idObs == '' && (odometro.length <= 0 || temperatura.length <= 0)) ||
                  (temObs == true && (respostaObs.length <= 0)) ||
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