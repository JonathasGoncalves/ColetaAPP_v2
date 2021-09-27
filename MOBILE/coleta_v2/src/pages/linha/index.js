import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionsColeta from '../../store/actions/coletaActions';
import styles from './styles';
import { Button } from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calcularTotalColetado } from '../../functions/totalColeta';

const Linha = ({
  salvar_total_coletado,
  salvar_total_coletadoOff,
  totalColetado,
  totalColetadoOff,
  save_linhaID,
  coleta,
  linhas,
  navigation,
  save_linha,
  save_coleta
}) => {
  const [linhasRender, setLinhas] = useState([]);
  const [loading, setLoading] = useState(true);

  /*
  formato do objeto com todas as coletas. 
  Coleta guarda o array de tanque e valores coletados e id é o numero da linha
    [
      {
        "coleta": [
  
        ],
        "id": "000001"
      },
      {
        "coleta": [
  
        ],
        "id": "000006"
      }
    ]
  */
  useEffect(() => {
    //buscar linhas da base local
    async function pupularColeta() {
      let coletaTemp = [];
      linhas.map((linha) => {
        coletaTemp.push({
          id: linha,
          coleta: []
        });
      })
      save_coleta(coletaTemp);
      await AsyncStorage.setItem('@coleta', JSON.stringify(coletaTemp));
    }

    async function buscarLinhas() {
      const linhas_temp = await AsyncStorage.getItem("@linhasObj");
      setLinhas(JSON.parse(linhas_temp));
      setLoading(false);
    }

    buscarLinhas();
    //executa somente uma vez

    if (coleta.length == 0) {
      pupularColeta();
    }

    //adiconando configurações do header
    navigation.setOptions({ title: 'Realizar Coleta' });
    navigation.setOptions({
      headerLeft: () => (
        <Button
          transparent
          onPress={() => navigation.toggleDrawer()}>
          <FontAwesomeIcon icon="bars" color="white" size={25} style={{ marginLeft: 10 }} />
        </Button>
      ),
    });

    navigation.setOptions({
      headerRight: () => (
        <View></View>
      ),
    });

    //atualizando valor total da coleta
    const total = calcularTotalColetado(coleta);
    salvar_total_coletado(total.total);
    salvar_total_coletadoOff(total.totalOff);

  }, [loading])

  //salva no storage a linha selecionada
  async function selecionarLinha(cod_linha) {
    coleta.map((coletaItem) => {
      if (coletaItem.id == cod_linha) {
        const id = coleta.indexOf(coletaItem);
        save_linhaID(id);
        AsyncStorage.setItem('@idlinha', JSON.stringify(id));
      }
    })
    await AsyncStorage.setItem('@linha', cod_linha);
    save_linha(cod_linha);
    navigation.navigate('Coleta');
  }

  //renderiza item da lista
  function renderLinha(linha) {
    return (
      <TouchableOpacity onPress={() => selecionarLinha(linha.linha)}>
        <View style={styles.viewItemLinha}>
          <Text allowFontScaling={false} style={styles.textCod}>
            {linha.linha}
          </Text>
          <Text allowFontScaling={false} style={styles.textNome}>
            {linha.descricao}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.viewMain}>

      {linhasRender.length > 0 ? (
        <View style={{ flex: 1, justifyContent: 'flex-start' }}>
          <View style={styles.viewMainFlatList}>
            <Text allowFontScaling={false} style={styles.textTitulo}>Selecione a linha</Text>
            <FlatList
              data={linhasRender}
              keyExtractor={item => item.linha}
              renderItem={({ item }) => renderLinha(item)}
            />
          </View>

          <View style={styles.ViewTotal}>
            <View style={styles.viewTotalColetado}>
              <Text allowFontScaling={false} style={styles.textTotalColetado}>Coletado</Text>
              <Text allowFontScaling={false} style={styles.ValueTotalColetado}>{totalColetado}</Text>
            </View>
          </View>

        </View>
      ) : (
        <ActivityIndicator size="large" color='#F9690E' />
      )
      }
    </View >
  );
}

const mapStateToProps = state => ({
  cod_linha: state.Coleta.cod_linha,
  coleta: state.Coleta.coleta,
  linhas: state.Coleta.linhas,
  totalColetado: state.Coleta.totalColetado,
  totalColetadoOff: state.Coleta.totalColetadoOff
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(actionsColeta, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Linha);


