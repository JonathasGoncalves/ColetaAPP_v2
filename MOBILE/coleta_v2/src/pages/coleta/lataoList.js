import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionsColeta from '../../store/actions/coletaActions';
import styles from './styles';
import { Button } from 'native-base';
import { CommonActions } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calcularTotalColetadoPorTanque, calcularTotalColetado } from '../../functions/totalColeta';


const LataoList = ({
  totalColetadoOffTanque,
  totalColetadoTanque,
  salvar_total_coletadoOff_tanque,
  salvar_total_coletado_tanque,
  salvar_total_coletadoOff,
  salvar_total_coletado,
  save_latao, id_linha,
  coleta,
  tanqueAtual,
  navigation,
  save_coleta
}) => {

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    navigation.setOptions({
      headerRight: () => (
        <View></View>
      ),
    });

    navigation.setOptions({
      headerLeft: () => (
        <Button
          transparent
          onPress={() => onBackPress()}>
          <FontAwesomeIcon icon="arrow-left" color="white" size={25} style={{ marginLeft: 10 }} />
        </Button>
      ),
    });

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, [])


  function onBackPress() {
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



  function coletarLatao(latao) {
    save_latao(latao);
    navigation.navigate('Latao');
  }

  function confirmarExclusao(latao) {
    const indexTanque = coleta[id_linha].coleta.indexOf(tanqueAtual);
    const index = coleta[id_linha].coleta[indexTanque].lataoList.indexOf(latao);

    Alert.alert(
      'Atenção',
      'Deseja excuir a coleta desse tanque?',
      [
        { text: 'Sim', onPress: () => limparColeta(indexTanque, index) },
        { text: 'Não' },
      ]
    );
  }

  async function limparColeta(indexTanque, index) {

    var copyColeta = coleta;
    copyColeta[id_linha].coleta[indexTanque].volume = parseInt(copyColeta[id_linha].coleta[indexTanque].volume) - parseInt(copyColeta[id_linha].coleta[indexTanque].lataoList[index].volume);
    copyColeta[id_linha].coleta[indexTanque].lataoList[index].hora = '';
    copyColeta[id_linha].coleta[indexTanque].lataoList[index].data = '';
    copyColeta[id_linha].coleta[indexTanque].lataoList[index].volume = 0;
    if (copyColeta[id_linha].coleta[indexTanque].volume == 0) {
      copyColeta[id_linha].coleta[indexTanque].cod_ocorrencia = '';
      copyColeta[id_linha].coleta[indexTanque].observacao = '';
    }
    save_coleta(copyColeta);
    //atualizando quantidade coletada total
    const total = calcularTotalColetado(copyColeta);
    salvar_total_coletado(total.total);
    salvar_total_coletadoOff(total.totalOff);
    //atualizando a quantidade coletada do tanque 
    const totalTanque = calcularTotalColetadoPorTanque(copyColeta, tanqueAtual.tanque);
    salvar_total_coletado_tanque(totalTanque.total);
    salvar_total_coletadoOff_tanque(totalTanque.totalOff);
    AsyncStorage.setItem('@coleta', JSON.stringify(copyColeta));
  }

  function renderLataoList(latao) {
    return (
      <View style={{ flexDirection: 'row', borderBottomWidth: 1 }}>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => coletarLatao(latao)}>
          <View style={styles.viewItemLinhaFlex}>
            <View style={styles.viewItemLatao}>
              <Text allowFontScaling={false} style={styles.textTitulo}>
                Latão
              </Text>
              <Text allowFontScaling={false} style={styles.textCod}>
                {latao.latao}
              </Text>
            </View>
            <View style={styles.viewItemLatao}>
              <Text allowFontScaling={false} style={styles.textTitulo}>
                Volume
              </Text>
              <Text allowFontScaling={false} style={styles.textCod}>
                {latao.volume}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        {latao.volume > 0 &&
          <Button
            style={{ flex: 1, alignSelf: 'center', height: 30, position: 'absolute', right: 2, width: 50 }}
            transparent
            onPress={() => confirmarExclusao(latao)}>
            <FontAwesomeIcon icon="trash" color="black" size={25} style={{ marginLeft: 20 }} />
          </Button>
        }
      </View>
    )
  }
  return (
    <View style={{ flex: 1, justifyContent: 'flex-start' }}>
      <Text maxFontSizeMultiplier={1} style={styles.textTituloLinha}>{`Tanque ${tanqueAtual.tanque}`}</Text>
      <View style={styles.viewMainFlatList}>
        <FlatList
          data={tanqueAtual.lataoList}
          keyExtractor={item => item.latao}
          renderItem={({ item }) => renderLataoList(item)}
        />
      </View>
      <View style={styles.ViewTotal}>
        <View style={styles.viewTotalColetado}>
          <Text allowFontScaling={false} style={styles.textTotalColetado}>Coletado</Text>
          <Text allowFontScaling={false} style={styles.ValueTotalColetado}>{totalColetadoTanque}</Text>
        </View>
        <View style={styles.viewTotalColetado}>
          <Text allowFontScaling={false} style={styles.textTotalColetado}>Fora do Padrão</Text>
          <Text allowFontScaling={false} style={styles.ValueTotalColetado}>{totalColetadoOffTanque}</Text>
        </View>
      </View>
    </View>
  );
}

const mapStateToProps = state => ({
  tanqueAtual: state.Coleta.tanqueAtual,
  coleta: state.Coleta.coleta,
  cod_linha: state.Coleta.cod_linha,
  id_linha: state.Coleta.id_linha,
  totalColetado: state.Coleta.totalColetado,
  totalColetadoOff: state.Coleta.totalColetadoOff,
  totalColetadoOffTanque: state.Coleta.totalColetadoOffTanque,
  totalColetadoTanque: state.Coleta.totalColetadoTanque,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(actionsColeta, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LataoList);