import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionsColeta from '../../store/actions/coletaActions';
import styles from './styles';
import { Button, Container } from 'native-base';
import { CommonActions } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { date, time } from '../../functions/tempo';
import { calcularTotalColetado, calcularTotalColetadoPorTanque } from '../../functions/totalColeta';


const LataoColeta = ({ salvar_total_coletadoOff, salvar_total_coletado_tanque, salvar_total_coletadoOff_tanque, salvar_total_coletado, save_latao, lataoAtual, id_linha, coleta, tanqueAtual, navigation, save_coleta, save_tanque }) => {

  const [volume, setVolume] = useState('');
  const [loading, setLoading] = useState(false);
  const [dateSave, setDate] = useState('');
  const [litros, setLitros] = useState(0);
  const [msgErro, setmsgErro] = useState({});

  function setVolumeAction(text) {
    newText = text.replace(/[^0-9]/g, '');
    setVolume(newText);
    temp = {
      erro: 'Média diária insuficiente!',
      media_atual: (Number(newText) / lataoAtual.dias_diff).toFixed(2),
      ultima_coleta: lataoAtual.ultima_coleta || "Sem Coleta",
      dias_sem_coleta: lataoAtual.dias_diff,
      valor_minimo: lataoAtual.dias_diff * litros
    }
    setmsgErro(temp);
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View></View>
      ),
    });

    navigation.setOptions({
      headerLeft: () => (
        <Button
          transparent
          onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon="arrow-left" color="white" size={25} style={{ marginLeft: 10 }} />
        </Button>
      ),
    });

    //buscando parametro de quantidade de leite
    async function parametro_litros() {
      const parametro_litros = await AsyncStorage.getItem('@parametro_litros');
      setLitros(parametro_litros);
    }
    dataFormat = date();
    setDate(dataFormat);
    if (lataoAtual.volume > 0) {
      setVolume(String(lataoAtual.volume));
    }
    parametro_litros();
  }, [])



  async function onPressColetar() {
    setLoading(true);
    //dataFormat = date();
    timeFormat = time();
    var copyColeta = coleta;
    var indexTanque = 0;
    var lataoTemp = {};
    copyColeta[id_linha].coleta.map((tanqueMap) => {
      if (tanqueMap.tanque == tanqueAtual.tanque) {
        indexTanque = copyColeta[id_linha].coleta.indexOf(tanqueMap);
        tanqueMap.lataoList.map((listLatao) => {
          if (lataoAtual.latao == listLatao.latao) {
            listLatao.hora = timeFormat;
            listLatao.data = dateSave;
            if (tanqueMap.volume > 0) {
              tanqueMap.volume = parseInt(tanqueMap.volume) - parseInt(listLatao.volume) + parseInt(volume);
            } else {
              tanqueMap.volume = parseInt(volume);
            }
            listLatao.volume = parseInt(volume);
            lataoTemp = listLatao;
          }
        })
      }
    })

    //setTotalColetado(total.total);
    //setTotalColetadoOffState(total.totalOff);
    await AsyncStorage.setItem('@tanqueAtual', JSON.stringify(copyColeta[id_linha].coleta[indexTanque]));
    await AsyncStorage.setItem('@coleta', JSON.stringify(copyColeta));
    save_tanque(copyColeta[id_linha].coleta[indexTanque]);
    save_coleta(copyColeta);
    save_latao(lataoTemp);
    //atualizando a quantidade coletda total
    total = calcularTotalColetado(coleta);
    salvar_total_coletado(total.total);
    salvar_total_coletadoOff(total.totalOff);
    //atualizando a quantidade coletada do tanque 
    totalTanque = calcularTotalColetadoPorTanque(copyColeta, tanqueAtual.tanque);
    salvar_total_coletado_tanque(totalTanque.total);
    salvar_total_coletadoOff_tanque(totalTanque.totalOff);


    navigation.dispatch(state => {
      const routes = state.routes.filter(r => r.name !== 'Home');
      return CommonActions.reset({
        index: 0,
        routes
      });
    });
    navigation.goBack();
    setLoading(false);
  }

  return (
    <Container >

      <View style={{
        marginBottom: 24,
        marginTop: 24,
        flex: 1,
        justifyContent: "flex-start"
      }}>
        <View>
          <ScrollView>
            <View style={{ flexDirection: 'column' }}>
              <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                <View style={{ flexDirection: 'column', flex: 1 }}>
                  <Text style={styles.textInfoColeta}>Tanque</Text>
                  <Text style={styles.ValueInfoColeta}>{tanqueAtual.tanque}</Text>
                </View>
                <View style={{ flexDirection: 'column', flex: 1 }}>
                  <Text style={styles.textInfoColeta}>Latão</Text>
                  <Text style={styles.ValueInfoColeta}>{lataoAtual.latao}</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                <View style={{ flexDirection: 'column', flex: 1 }}>
                  <Text style={styles.textInfoColeta}>Odometro</Text>
                  <Text style={styles.ValueInfoColeta}>{tanqueAtual.odometro}</Text>
                </View>
                <View style={{ flexDirection: 'column', flex: 1 }}>
                  <Text style={styles.textInfoColeta}>Temperatura</Text>
                  <Text style={styles.ValueInfoColeta}>{tanqueAtual.temperatura}</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                <View style={{ flexDirection: 'column', flex: 1 }}>
                  <Text style={styles.textInfoColeta}>Data</Text>
                  <Text style={styles.ValueInfoColeta}>{dateSave}</Text>
                </View>
                <View style={{ flexDirection: 'column', flex: 1 }}>
                  <Text style={lataoAtual.dias_diff > 2 ? styles.textInfoColetaErro : styles.textInfoColeta}>Dias Sem Coleta</Text>
                  <Text style={lataoAtual.dias_diff > 2 ? styles.ValueInfoColetaErro : styles.ValueInfoColeta}>{lataoAtual.dias_diff}</Text>
                </View>
              </View>
            </View>

            <View style={{ padding: 10 }}>
              <Text allowFontScaling={false} style={styles.textTitulo}>Volume</Text>
              <TextInput
                keyboardType='numeric'
                maxLength={6}
                style={styles.inputVolume}
                value={volume}
                onChangeText={text => setVolumeAction(text)}
              />
              {(volume != '' && volume < (litros * lataoAtual.dias_diff)) &&
                <View style={{ alignItems: 'flex-start', marginLeft: 10 }}>

                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.ValueInfoColetaErro}>{msgErro.erro}</Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.ValueInfoColetaErro}>Média diária atual: </Text>
                    <Text style={styles.ValueInfoColetaErro}>{`${msgErro.media_atual} litros`}</Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.ValueInfoColetaErro}>Última coleta: </Text>
                    <Text style={styles.ValueInfoColetaErro}>{msgErro.ultima_coleta}</Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.ValueInfoColetaErro}>Dias Sem coleta: </Text>
                    <Text style={styles.ValueInfoColetaErro}>{msgErro.dias_sem_coleta}</Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.ValueInfoColetaErro}>Volume mínimo para hoje: </Text>
                    <Text style={styles.ValueInfoColetaErro}>{msgErro.valor_minimo}</Text>
                  </View>

                </View>
              }

              <Button
                block
                style={loading || volume.length <= 0 || (volume != '' && volume < (litros * lataoAtual.dias_diff)) ? styles.buttonContinuarPress : styles.buttonContinuar}
                rounded={true}
                onPress={onPressColetar}
                disabled={loading || volume.length <= 0 || (volume != '' && volume < (litros * lataoAtual.dias_diff))}
              >
                <Text allowFontScaling={false} style={styles.textButtonContinuar}>Coletar</Text>
              </Button>
            </View>
          </ScrollView>
        </View>
      </View>
    </Container>
  );
}

const mapStateToProps = state => ({
  tanqueAtual: state.Coleta.tanqueAtual,
  coleta: state.Coleta.coleta,
  cod_linha: state.Coleta.cod_linha,
  id_linha: state.Coleta.id_linha,
  lataoAtual: state.Coleta.lataoAtual
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(actionsColeta, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LataoColeta);







