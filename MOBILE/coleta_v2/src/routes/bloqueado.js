import React from 'react';
import Bloqueado from '../pages/indentificacao/index';
import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();

function BloqueadoScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Bloqueado"
        component={Bloqueado}
        options={{
          title: 'Acesso negado',
          headerStyle: {
            backgroundColor: '#F9690E',
          },
          headerTitleAlign: "center",
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
}

export default BloqueadoScreen;