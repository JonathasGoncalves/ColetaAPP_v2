
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
var TOTAL_COLETADO_HEIGHT = 70;

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
  viewItemLinha: {
    borderRadius: 5,
    borderColor: 'gray',
    flexDirection: 'row',
    borderBottomWidth: 0,
    alignItems: "center",
    marginBottom: 2,
    marginTop: 2,
    minHeight: 70
  },
  viewItemLinhaFlex: {
    borderRadius: 5,
    borderColor: 'gray',
    flexDirection: 'row',
    borderBottomWidth: 0,
    alignItems: "center",
    marginBottom: 2,
    marginTop: 2,
    minHeight: 70,
    //width: (Dimensions.get("window").width) * 0.8,
  },
  viewItemLatao: {
    borderRadius: 5,
    borderColor: 'gray',
    flexDirection: 'row',
    borderBottomWidth: 0,
    alignItems: "center",
    marginBottom: 2,
    marginTop: 2,
    minHeight: 70,
    marginLeft: MARGIN_PADRAO_LATERAL
  },
  textTituloFinalizar: {
    flex: 1,
    fontSize: FONT_SIZE_TITULOS,
    color: 'black',
    fontWeight: "bold",
    padding: 10,
    borderRightWidth: 1,
  },
  textvalorFinal: {
    flex: 1,
    fontSize: FONT_SIZE_TEXT,
    color: 'black',
    marginLeft: 10,
    alignSelf: 'center',
  },
  textCod: {
    //flex: 1,
    fontSize: FONT_SIZE_LIST,
    color: 'black',
    marginLeft: MARGIN_PADRAO_LATERAL,
    alignSelf: 'center'
  },
  ViewTotalFinalizar: {
    width: (Dimensions.get("window").width) * 0.9,
    //position: 'absolute'
    //backgroundColor: 'red',
    alignItems: 'center',
    marginRight: width * 0.05,
    marginLeft: width * 0.05
  },
  ViewRadioSelect: {
    padding: MARGIN_PADRAO_VERTICAL_TITULOS
  },
  textLabel: {
    //flex: 1,
    fontSize: FONT_SIZE_TEXT,
    color: 'black',
    marginLeft: 10,
    fontWeight: "bold",
    alignSelf: 'center'
  },
  textLatao: {
    //flex: 1,
    fontSize: FONT_SIZE_TEXT,
    color: 'black',
    marginLeft: 40,
  },
  textNome: {
    //flex: 1,
    fontSize: FONT_SIZE_LIST,
    color: 'black',
    marginLeft: 60,
    marginRight: 15
  },
  textNomeVolumeFora: {
    fontSize: FONT_SIZE_TEXT,
    color: 'red',
    marginLeft: 60,
    marginRight: 15
  },
  viewMain: {
    marginRight: 10,
    marginLeft: 10,
    marginTop: 2,
    backgroundColor: 'white',
  },
  viewMainFlatList: {
    flex: 1,
    marginRight: 10,
    marginLeft: 10,
    backgroundColor: 'white',
    //height: FLATLIST_HEIGHT,
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
    height: TOTAL_COLETADO_HEIGHT + 10,
    padding: MARGIN_PADRAO_LATERAL,
    justifyContent: 'space-between',
    marginTop: MARGIN_PADRAO_VERTICAL_TITULOS,
    marginBottom: MARGIN_PADRAO_VERTICAL_TITULOS,
  },
  textTitulo: {
    fontSize: FONT_SIZE_LIST,
    color: 'black',
    alignSelf: 'center',
    fontWeight: "bold",
    //marginRight: 10,
    // marginLeft: 10,
    //marginBottom: 10,
    padding: 10,
    textAlign: "center",
    //marginTop: 10
  },
  textErro: {
    fontSize: FONT_SIZE_LIST,
    color: 'red',
    alignSelf: 'flex-start',
    fontWeight: "bold",
    //marginRight: 10,
    //marginLeft: 10,
    //marginBottom: 10,
    padding: 10,
    //textAlign: '',
    //marginTop: 10
  },
  textTituloLinha: {
    fontSize: FONT_SIZE_TITULOS_GRANDE,
    color: 'black',
    alignSelf: 'center',
    fontWeight: "bold",
    //marginRight: 10,
    // marginLeft: 10,
    //marginBottom: 10,
    //padding: 10,
    textAlign: "center",
    marginTop: MARGIN_PADRAO_VERTICAL_TITULOS,
    marginBottom: MARGIN_PADRAO_VERTICAL_TITULOS,
  },
  ViewFlatList: {
    width: Dimensions.get("window").width * 0.9,
    //marginRight: Dimensions.get("window").width * 0.05,
    alignSelf: 'center',
    marginTop: 20
  },
  textTituloGeral: {
    fontSize: FONT_SIZE_TEXT,
    color: 'black',
    alignSelf: 'center',
    fontWeight: "bold",
    //marginRight: 10,
    // marginLeft: 10,
    //marginBottom: 10,
    marginTop: 20,
    textAlign: "center"
  },
  textTituloGeralFinalizar: {
    fontSize: FONT_SIZE_TITULOS,
    color: 'black',
    alignSelf: 'center',
    fontWeight: "bold",
    //marginRight: 10,
    // marginLeft: 10,
    marginBottom: 10,
    marginTop: 20,
    textAlign: "center"
  },
  ViewItemList1: {
    //flexDirection: 'row',
    borderWidth: 1,
  },
  viewItemLinhaFinalizar: {
    //borderRadius: 5,
    //borderColor: 'gray',
    //flexDirection: 'column',
    borderBottomWidth: 0,
    //alignItems: "center",
    //marginBottom: 2,
    //marginTop: 2,
    minHeight: 70
  },
  ViewItemList: {
    //flexDirection: 'row',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1
  },
  textButtonContinuar: {
    fontSize: FONT_SIZE_TEXT,
    color: 'white',
    fontWeight: "bold"
  },
  textButtonFinalizar: {
    fontSize: 30,
    color: 'white',
    fontWeight: "bold",
  },
  inputPlaca: {
    //flex: 1,
    borderWidth: 1,
    minHeight: 40,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    fontSize: FONT_SIZE_TEXT,
    textAlign: 'center'
  },
  inputVolume: {
    //flex: 1,
    borderWidth: 1,
    minHeight: 40,
    borderRadius: 5,
    marginTop: 5,
    //marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    fontSize: FONT_SIZE_TEXT,
    textAlign: 'center'
  },
  buttonContinuar: {
    width: BUTTON_WIDTH,
    backgroundColor: '#F9690E',
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20
  },
  buttonContinuarPress: {
    width: BUTTON_WIDTH,
    backgroundColor: '#F9690E',
    alignSelf: 'center',
    alignItems: 'center',
    opacity: 0.5,
    marginBottom: 20,
    marginTop: 20
  },
  buttonTransmitir: {
    width: (Dimensions.get("window").width) * 1,
    backgroundColor: '#F9690E',
    height: (Dimensions.get("window").height) * 0.1
  },
  buttonTransmitirPress: {
    width: (Dimensions.get("window").width) * 1,
    backgroundColor: '#F9690E',
    height: (Dimensions.get("window").height) * 0.1,
    opacity: 0.5,
  },
  buttonFinalizar: {
    width: BUTTON_WIDTH,
    height: 70,
    backgroundColor: '#F9690E',
    alignSelf: 'center',
    position: "absolute",
    marginTop: '150%'
  },
  ViewButton: {
    //marginTop: '100%',
    //position: 'absolute'
    alignItems: 'center',
    //alignContent: 'flex-start',
  },
  ViewInfo: {
    flexDirection: 'row',
    marginLeft: 20,
    justifyContent: 'flex-start'
  },
  textDescPlaca: {
    fontSize: FONT_SIZE_TITULOS,
    color: 'black',
    alignSelf: 'center',
    fontWeight: "bold",
    //marginRight: 10,
    // marginLeft: 10,
    //marginBottom: 10,
    padding: 10,
    textAlign: "center",
    marginTop: 20,
    bottom: 50
  },
  textDescOdometro: {
    fontSize: FONT_SIZE_TITULOS,
    color: 'black',
    alignSelf: 'center',
    fontWeight: "bold",
    //marginRight: 10,
    // marginLeft: 10,
    //marginBottom: 10,
    padding: 10,
    textAlign: "center",
    marginTop: 20,
    width: (Dimensions.get("window").width) * 0.8,
  },
  ViewColetaInfo: {
    flexDirection: 'row',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'flex-start',
    width: (Dimensions.get("window").width) * 0.905,
    marginTop: 30
  },
  itemColetaInfo: {
    width: (Dimensions.get("window").width) * 0.5,
    fontSize: FONT_SIZE_TITULOS,
    color: 'black',
    fontWeight: "bold",
    padding: 10,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 0
  },
  itemColetaInfoLast: {
    width: (Dimensions.get("window").width) * 0.5,
    fontSize: FONT_SIZE_TITULOS,
    color: 'black',
    fontWeight: "bold",
    padding: 10,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    borderLeftWidth: 0
  },
  itemColetaResp: {
    flex: 1,
    width: (Dimensions.get("window").width) * 0.4,
    fontSize: FONT_SIZE_TITULOS,
    color: 'black',
    //fontWeight: "bold",
    padding: 10,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderLeftWidth: 0
  },
  itemColetaRespLast: {
    flex: 1,
    width: (Dimensions.get("window").width) * 0.4,
    fontSize: FONT_SIZE_TITULOS,
    color: 'black',
    //fontWeight: "bold",
    padding: 10,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0
  },
  textInfoColeta: {
    marginLeft: 10,
    marginTop: 10,
    fontSize: FONT_SIZE_TITULOS,
    fontWeight: 'bold',
    color: 'black'
  },
  textInfoColetaErro: {
    marginLeft: 10,
    marginTop: 10,
    fontSize: FONT_SIZE_TITULOS,
    fontWeight: 'bold',
    color: 'red'
  },
  ValueInfoColeta: {
    marginLeft: 10,
    marginTop: 5,
    fontSize: FONT_SIZE_TEXT,
    color: 'black'
  },
  ValueInfoColetaErro: {
    marginLeft: 10,
    marginTop: 5,
    fontSize: FONT_SIZE_TEXT,
    color: 'red',
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
  searchBar: {
    backgroundColor: 'white',
    borderRadius: 10,
    //padding: 5,
    borderWidth: 2,
    //flex: 1,
    height: INPUT_HEIGHT,
    marginLeft: MARGIN_PADRAO_LATERAL,
    marginRight: MARGIN_PADRAO_LATERAL
  },
  searchBarCont: {
    backgroundColor: 'white',
    borderWidth: 0,
    height: INPUT_HEIGHT - 15
  },
  buttonTresh: {
    flex: 1,
    alignSelf: 'center',
    height: 30,
    position: 'absolute',
    right: MARGIN_PADRAO_LATERAL
  },

});

export default styles;

