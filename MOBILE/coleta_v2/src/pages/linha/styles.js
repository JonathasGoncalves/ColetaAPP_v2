import { Dimensions, StyleSheet, PixelRatio } from 'react-native';

let { height, width } = Dimensions.get('window');
var FONT_SIZE_TITULOS = 20;
var FONT_SIZE_TITULOS_GRANDE = 25;
var FONT_SIZE_TEXT = 18;
var FONT_SIZE_LIST = 18;
var MARGIN_PADRAO_LATERAL = 10;
var MARGIN_PADRAO_VERTICAL_TITULOS = 30;
var INPUT_HEIGHT = 70;
var BUTTON_WIDTH = 200;
var TOTAL_COLETADO_HEIGHT = 80;


if (PixelRatio.get() <= 2 && width < 600) {
  FONT_SIZE_TEXT = 16;
  FONT_SIZE_TITULOS = 18;
  FONT_SIZE_LIST = 14;
  MARGIN_PADRAO_LATERAL = 5;
  INPUT_HEIGHT = 50;
  BUTTON_WIDTH = 170;
  TOTAL_COLETADO_HEIGHT = 60;
  FONT_SIZE_TITULOS_GRANDE = 20;
  MARGIN_PADRAO_VERTICAL_TITULOS = 15;
}
const styles = StyleSheet.create({

  textTitulo: {
    fontSize: FONT_SIZE_TITULOS,
    color: 'black',
    alignSelf: 'center',
    fontWeight: "bold",
    //marginRight: 10,
    // marginLeft: 10,
    //marginBottom: 10,
    padding: 10,
    textAlign: "center"
  },
  viewMainFlatList: {
    flex: 1,
    //marginRight: 10,
    marginLeft: 10,
    marginTop: 2,
    backgroundColor: 'white',
    //height: (Dimensions.get("window").height) * 0.8,
  },
  textButtonContinuar: {
    fontSize: FONT_SIZE_TITULOS,
    color: 'white',
    fontWeight: "bold",
  },
  textCod: {
    //flex: 1,
    fontSize: FONT_SIZE_TEXT,
    color: 'black',
    marginLeft: 10,
  },
  textNome: {
    flex: 1,
    fontSize: FONT_SIZE_TEXT,
    color: 'black',
    marginLeft: 20,
    marginRight: 15
  },
  viewItemLinha: {
    //flex: 1,
    borderRadius: 5,
    borderColor: 'gray',
    flexDirection: 'row',
    borderBottomWidth: 1,
    //justifyContent: 'space-between',
    //height: 150,
    alignItems: "center",
    marginBottom: 2,
    marginTop: 2,
    minHeight: 70,
    //marginRight: 10,
    //marginLeft: 10
  },
  viewMain: {
    flex: 1,
    //marginRight: 10,
    //marginLeft: 10,
    marginTop: 2,
    backgroundColor: 'white'
  },
  buttonContinuar: {
    width: 200,
    backgroundColor: '#F9690E',
    alignSelf: 'center'
  },
  viewTotalColetado: {
    //flex: 1,
    backgroundColor: '#FF8C00',
    borderRadius: 5,
    padding: MARGIN_PADRAO_LATERAL,
    //marginLeft: 10,
    //marginTop: MARGIN_PADRAO_LATERAL,
    //alignSelf: 'center',
    alignItems: 'center',
    //height: 80,
    height: TOTAL_COLETADO_HEIGHT,
    //height: Dimensions.get("window").height * 0.2,
    width: (Dimensions.get("window").width * 0.45),
  },
  ViewTotal: {
    flexDirection: 'row',
    height: TOTAL_COLETADO_HEIGHT,
    padding: MARGIN_PADRAO_LATERAL,
    justifyContent: 'center',
    marginBottom: MARGIN_PADRAO_LATERAL
  },
  ValueTotalColetado: {
    //marginLeft: 10,
    marginTop: 5,
    fontSize: FONT_SIZE_TEXT,
    color: 'white',
    textAlign: "center"
  },
  textTotalColetado: {
    fontSize: FONT_SIZE_TEXT,
    fontWeight: 'bold',
    color: 'white',
    textAlign: "center"
  },
});

export default styles;
