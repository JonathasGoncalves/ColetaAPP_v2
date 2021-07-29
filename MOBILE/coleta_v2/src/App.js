import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Routes from '../src/routes/index';
import store from './store/store';
import { Provider } from 'react-redux';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faCheckSquare, faCoffee, faBars, faArrowLeft, faTrash } from '@fortawesome/free-solid-svg-icons';

/*
Conta de update:
Servicos.ti@selita.coop.br
*/
function App() {

  useEffect(() => {
    //adicionando icones globalmente
    try {
      library.add(fab, faCheckSquare, faCoffee, faBars, faArrowLeft, faTrash);
    } catch (error) {
      console.log(error);
    }

  }, [])

  const MyTheme = {
    colors: {
      primary: 'white',
      background: 'white'
    },
  };

  return (
    <Provider store={store}>
      <NavigationContainer theme={MyTheme}>
        <Routes />
        <StatusBar style="auto" />
      </NavigationContainer>
    </Provider>
  );
}

export default App;

