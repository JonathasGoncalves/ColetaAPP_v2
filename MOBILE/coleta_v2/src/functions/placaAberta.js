import React from 'react';
import { Text } from 'react-native';
export default function PlacaAberta(props) {
  return (
    <Text allowFontScaling={false} style={{ fontSize: 25, padding: 5, textAlign: 'center', color: 'black', fontWeight: 'bold', borderBottomWidth: 1, marginBottom: 10 }}>Você está coletando com a placa {props.placa}</Text>
  )
}