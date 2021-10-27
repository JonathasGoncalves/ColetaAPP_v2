import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, Alert } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionsColeta from '../../store/actions/coletaActions';
import styles from './styles';
import { Button } from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calcularTotalColetado, calcularTotalColetadoPorTanque } from '../../functions/totalColeta';
import { SearchBar } from 'react-native-elements';
import PlacaAberta from '../../functions/placaAberta';

const Coleta = ({
  coleta,
  salvar_total_coletado,
  salvar_total_coletado_tanque,
  totalColetado,
  id_linha,
  cod_linha,
  navigation,
  save_coleta,
  save_tanque,
  tanqueAtual,
  veiculo
}) => {

  const [tanqueInput, setTanqueInput] = useState('');
  const [tanquesFiltro, setTanquesFiltro] = useState([]);

  useEffect(() => {

    navigation.setOptions({
      headerRight: () => (
        <View>
        </View>
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

    //AQUI VAI SER ADICIONADO A QUANTIDADE DE DIAS DA ULTIMA COLETA
    var coletaCopy = coleta;
    async function buscarTanques() {
      //coleta iniciada
      await AsyncStorage.setItem('@emAberto', 'true');
      //iniciando redux de coleta
      //Recuperando tanques unicos
      const tanques_todos = JSON.parse(await AsyncStorage.getItem("@tanques"));
      const unicos = [];
      const map = new Map();
      for (const item of tanques_todos) {
        if (!map.has(item.tanque)) {
          map.set(item.tanque, true); // set any value to Map
          if (item.linha == cod_linha) {
            unicos.push({
              id: item.id,
              //codigo: item.codigo,
              //codigo_cacal: item.codigo_cacal,
              tanque: item.tanque,
              latao: item.latao,
              LINHA: item.linha,
              LINHA_DESC: item.descricao,
              descricao: item.descricao,
              lataoQuant: item.lataoQuant,
              ATUALIZAR_COORDENADA: item.ATUALIZAR_COORDENADA,
              tpfor: item.tpfor,
              lataoList: [],
              temperatura: '',
              odometro: '',
              volume: 0,
              complemento_obs: '',
              latitude: '',
              longitude: '',
              cod_ocorrencia: '',
              boca: 1
            });
          }
        }
      }

      //ordenando os tanques da linha
      unicos.sort(function (a, b) {
        if (a.tanque > b.tanque) {
          return 1;
        }
        if (a.tanque < b.tanque) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });

      unicos.map((tanqueUnico) => {
        let lataoArray = [];
        tanques_todos.map((tanqueList) => {

          if (tanqueList.tanque == tanqueUnico.tanque) {
            lataoObj = {
              latao: tanqueList.latao,
              volume: 0,
              data: '',
              hora: '',
              dias_diff: tanqueList.dias_diff,
              ultima_coleta: tanqueList.ultima_coleta || "",
              habilitado: tanqueList.habilitado,
              tpfor: tanqueList.tpfor,
              codigo: tanqueList.codigo,
              codigo_cacal: tanqueList.codigo_cacal
            }
            lataoArray.push(lataoObj)
          }
        })
        //ordenando os latões do tanque
        lataoArray.sort(function (a, b) {
          if (a.latao > b.latao) {
            return 1;
          }
          if (a.latao < b.latao) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
        unicos[unicos.indexOf(tanqueUnico)].lataoList = lataoArray;
      })
      coletaCopy.map((coletaItem) => {
        if (coletaItem.id == cod_linha) {
          coletaItem.coleta = unicos;
        }
      })
      save_coleta(coletaCopy);
      //iniciando array de tanques 
      setTanquesFiltro(coleta[id_linha].coleta);
    }

    coletaCopy.map((coletaItem) => {
      //COLETA ITEM É A COLTA DE UMA LINHA
      if (coletaItem.id == cod_linha) {
        if (coletaItem.coleta.length <= 0) {
          buscarTanques();
        } else {
          //Se já tem valores, adiciona os valores no state 
          setTanquesFiltro(coleta[id_linha].coleta);
        }
      }
    })

  }, [])

  //Validar valor de entrada para o tanque
  function setTanqueAction(text) {
    const newText = text.replace(/[^0-9]/g, '');
    setTanqueInput(newText);
    filtrarTanque(newText);
  }

  async function filtrarTanque(inputTanque) {
    if (tanqueInput.length <= inputTanque.length && tanquesFiltro) {
      var find = tanquesFiltro.filter(function (tanqueItem) {
        return tanqueItem.tanque.includes(inputTanque);
      });
    } else {
      var find = coleta[id_linha].coleta.filter(function (tanqueItem) {
        return tanqueItem.tanque.includes(inputTanque);
      });
    }
    setTanquesFiltro(find);
  }

  async function coletarTanque(coleta, tanque) {
    //atualizando a quantidade coletada do tanque
    const totalTanque = calcularTotalColetadoPorTanque(coleta, tanque.tanque);
    salvar_total_coletado_tanque(totalTanque.total);
    //alterar list para os latões
    save_tanque(tanque);
    AsyncStorage.setItem('@tanqueAtual', JSON.stringify(tanque));
    navigation.navigate('Tanque');
  }

  //renderiza item da lista
  function renderTanque(tanque) {

    let cont = 0;
    tanque.lataoList.map((latao) => {
      if (latao.volume > 0) {
        cont++;
      }
    })

    function confirmarExclusao(tanque) {
      const index = coleta[id_linha].coleta.indexOf(tanque)
      Alert.alert(
        'Atenção',
        'Deseja excuir a coleta desse tanque?',
        [
          { text: 'Sim', onPress: () => limparColeta(index) },
          { text: 'Não' },
        ]
      );

    }

    async function limparColeta(index) {

      var copyColeta = coleta;

      copyColeta[id_linha].coleta[index].cod_ocorrencia = '';
      copyColeta[id_linha].coleta[index].odometro = '';
      copyColeta[id_linha].coleta[index].volume = 0;
      copyColeta[id_linha].coleta[index].complemento_obs = '';
      copyColeta[id_linha].coleta[index].temperatura = '';
      copyColeta[id_linha].coleta[index].latitude = '';
      copyColeta[id_linha].coleta[index].longitude = '';
      copyColeta[id_linha].coleta[index].cod_ocorrencia = '';
      copyColeta[id_linha].coleta[index].lataoList.map((latao) => {
        latao.hora = '';
        latao.data = '';
        latao.volume = 0;
      })

      save_coleta(copyColeta);
      AsyncStorage.setItem('@coleta', JSON.stringify(copyColeta));
      const total = calcularTotalColetado(copyColeta);
      salvar_total_coletado(total.total);
      //atualizando a quantidade coletada do tanque
      totalTanque = calcularTotalColetadoPorTanque(copyColeta, tanqueAtual);
      salvar_total_coletado_tanque(total.total);
    }

    return (
      <View style={{ flexDirection: 'row', borderBottomWidth: 1 }}>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => coletarTanque(coleta, tanque)}>
          <View style={styles.viewItemLinhaFlex}>
            <Text allowFontScaling={false} style={styles.textCod}>
              {tanque.tanque}
            </Text>
            <Text allowFontScaling={false} style={styles.textNome}>
              {tanque.lataoList.length}/{cont}
            </Text>
            <Text allowFontScaling={false} style={tanque.cod_ocorrencia == '' ? styles.textNome : styles.textNomeVolumeFora}>
              {tanque.volume}
            </Text>
          </View>
        </TouchableOpacity>
        {(tanque.volume > 0 || tanque.cod_ocorrencia != '') &&
          <Button
            style={styles.buttonTresh}
            transparent
            onPress={() => confirmarExclusao(tanque)}>
            <FontAwesomeIcon icon="trash" color="black" size={25} style={{ marginLeft: 20 }} />
          </Button>
        }
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <PlacaAberta placa={veiculo.label} />
      {coleta.length > 0 && coleta[id_linha].coleta.length > 0 ?
        (
          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <Text maxFontSizeMultiplier={1} style={styles.textTituloLinha}>{coleta[id_linha].coleta[0].descricao}</Text>
            <SearchBar
              keyboardType='numeric'
              placeholder="Buscar Tanque"
              onChangeText={text => setTanqueAction(text)}
              value={tanqueInput}
              inputContainerStyle={styles.searchBarCont}
              inputStyle={{ backgroundColor: 'white', borderWidth: 0 }}
              containerStyle={styles.searchBar}
            />
            <View style={styles.viewMainFlatList}>
              <FlatList
                data={tanquesFiltro}
                keyExtractor={item => item.id}
                renderItem={({ item }) => renderTanque(item)}
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
          <View>
            <ActivityIndicator size="large" color="#F9690E" />
          </View>
        )
      }
    </View>
  );
}

const mapStateToProps = state => ({
  cod_linha: state.Coleta.cod_linha,
  coleta: state.Coleta.coleta,
  tanqueAtual: state.Coleta.tanqueAtual,
  data: state.Coleta.data,
  id_linha: state.Coleta.id_linha,
  totalColetado: state.Coleta.totalColetado,
  totalColetadoOff: state.Coleta.totalColetadoOff,
  veiculo: state.Identificacao.veiculo
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(actionsColeta, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Coleta);
