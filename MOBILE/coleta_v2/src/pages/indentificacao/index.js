import React from 'react';
import { View, Text } from 'react-native';

const Bloqueado = ({ }) => {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, color: 'black', alignSelf: 'center', fontWeight: "bold", marginTop: '40%' }}>
        Este aparelho não está autorizado! Contate a TI!
      </Text>
    </View>
  );
}
export default Bloqueado;


