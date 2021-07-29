import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionsIMEI from '../../store/actions/imeiActions';
import { View, Text, ScrollView, TextInput, ActivityIndicator, Alert, NativeModules } from 'react-native';
import { Button } from 'native-base';
import styles from './style';
import api from '../../services/api';
import { BarCodeScanner } from 'expo-barcode-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestMultiple, PERMISSIONS } from 'react-native-permissions';
import erroMessage from '../../functions/erroMessage';
import { date, time } from '../../functions/tempo';

const Habilitar = ({ save_user }) => {

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [acesso, setAcesso] = useState(false);
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState('');
  const [password, setPassword] = useState('');
  const [UUID, setUUID] = useState('');

  useEffect(() => {
    setLoading(true);
    async function verificar_permissoes() {
      try {
        requestMultiple([PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]).then((statuses) => {
          setHasPermission(statuses[PERMISSIONS.ANDROID.CAMERA] && statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] && statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] === 'granted');
        });
      } catch (error) {
        Alert.alert(
          'Erro ao verificar permissões!',
          erroMessage(error),
          [
            { text: 'ok' },
          ]
        );
      }
    }

    //VERIFICA O STATUS DA APLICAÇÃO (LENDO QR OU ESPERANDO SOLICITAÇÃO)
    async function habilitar_status() {
      const id_solicitacao = await AsyncStorage.getItem('@solicitado');
      if (id_solicitacao) {
        setLoading(false);
        setAcesso(true);
      } else {
        setLoading(false);
      }
    }
    verificar_permissoes();
    habilitar_status();
  }, []);

  //O data será retornado pelo Qrcode entregue pela aplicação web
  //Mando o UUID da solicitação que foi aprovada, o app verifica, se o UUID for o
  //mesmo do aparelho, faz uma requisição passando o mac e recuperando a senha do usuário
  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    //mac_cap = JSON.parse(await AsyncStorage.getItem('@mac'));
    if (data == UUID) {
      //faz requisição
      //gerando senha do usuário
      const password_const = await generatePassword();
      setPassword(password_const);
      try {
        const aparelho_habilitado = await api.post('api/habilitar/habilitar_aparelho', {
          uuid: UUID,
          password: password_const
        });
        await AsyncStorage.setItem('@username', UUID);
        await AsyncStorage.setItem('@password', password_const);
        await AsyncStorage.removeItem('@solicitado'); //vai pedir para solicitar autorizacao novamente
        //ATUALIZA PARA O CLIENT COM USUARIO E SENHA
        await AsyncStorage.setItem('@Client', '7');
        await AsyncStorage.setItem('@Secret', 'ZIJYH4zMvr14sNUCqC5gfJc6PARgvJoD3irHjYY2');
        await AsyncStorage.setItem('@grant_type', 'password');

        //ATUALIZANDO O TOKEN PARA O USER HABILITADO
        const responseToken = await api.post('oauth/token', {
          grant_type: 'password',
          client_id: 7,
          client_secret: 'ZIJYH4zMvr14sNUCqC5gfJc6PARgvJoD3irHjYY2',
          username: UUID,
          password: password_const
        })
        await AsyncStorage.setItem('@access_token', responseToken.data.access_token);

        //ADICIONANDO OS cod_motorista NO AsyncStorage
        await AsyncStorage.setItem('@cod_motorista', aparelho_habilitado.data.cod_motorista);

        Alert.alert(
          'Sucesso!',
          'Acesso liberado!',
          [
            { text: 'ok', onPress: () => save_user(UUID, password) },
          ]
        );
      } catch (error) {
        setScanned(false);
        alert('Não Habilitado!');
      }
    } else {
      setScanned(false);
      alert('Não autorizado!');
    }
  };

  async function generatePassword() {
    const { AcessoLocal } = NativeModules;
    const UUID_new = await AcessoLocal.gerarID();
    return UUID_new;
  }

  async function solicitarAcesso() {
    setLoading(true);
    try {
      const { AcessoLocal } = NativeModules;
      const UUID_new = await AcessoLocal.gerarID();
      const dateTime = date() + "-" + time();
      teste = await api.post('api/habilitar/solicitar_acesso', {
        uuid: UUID_new,
        nome_digitado: nome,
        data: dateTime
      });
      await AsyncStorage.setItem('@solicitado', 'true');
      await AsyncStorage.setItem('@UUID', UUID_new);
      setUUID(UUID_new);
      setAcesso(true);
    } catch (error) {
      Alert.alert(
        'Erro ao Solicitar Acesso!',
        erroMessage(error),
        [
          { text: 'ok' },
        ]
      );
    }

    setLoading(false);
  }
  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator size="large" color='#F9690E' />
      ) : hasPermission === false ? (
        <Text allowFontScaling={false} style={styles.textDescPlaca}>As permissões são necessárias para o uso do aplicativo. Por favor reinicie o aplicativo e habilite as permissões!</Text>
      ) : !acesso ? (
        <View>
          <ScrollView>
            <View>
              <Text allowFontScaling={false} style={styles.textDescPlaca}>
                Nome do Motorista
              </Text>
              <TextInput
                editable={!loading}
                style={styles.inputPlaca}
                value={nome}
                onChangeText={text => setNome(text)}
              />
              <Button
                block
                style={loading || nome.length <= 0 ? styles.buttonContinuarPress : styles.buttonContinuar}
                rounded={true}
                onPress={solicitarAcesso}
                disabled={loading || nome.length <= 0}
              >
                <Text allowFontScaling={false} style={styles.textButtonContinuar}>Solicitar Acesso</Text>
              </Button>
            </View>
          </ScrollView>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <Text allowFontScaling={false} style={styles.textQR}>Leia o QR Code Exibido na tela, para acessar o aplicativo</Text>
          <View style={{ flex: 1, padding: 40 }}>
            <BarCodeScanner
              barCodeTypes={['qr']}
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={{ flex: 1 }}
            />
          </View>

          <Button
            block
            style={styles.buttonSolicitar}
            rounded={true}
            onPress={solicitarAcesso}
            disabled={loading}
          >
            <Text allowFontScaling={false} style={styles.textButtonContinuar}>Solicitar Novamente</Text>
          </Button>

        </View>
      )
      }
    </View>
  );
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(actionsIMEI, dispatch);

export default connect(null, mapDispatchToProps)(Habilitar);


