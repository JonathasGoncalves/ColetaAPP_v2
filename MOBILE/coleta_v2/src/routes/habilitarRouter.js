import React from 'react';
import Habilitar from '../pages/habilitar/index';
import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();

function Solicitar() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Solicitar"
        component={Habilitar}
        options={{
          title: 'Solicitar Acesso',
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

export default Solicitar;