
import { Dimensions, StyleSheet, PixelRatio } from 'react-native';

var FONT_SIZE_TITULOS = 20;
var FONT_SIZE_TEXT = 18;
var FONT_SIZE_LIST = 18;
var MARGIN_PADRAO_LATERAL = 10;
var INPUT_HEIGHT = 50;
var BUTTON_WIDTH = 300;

if (PixelRatio.get() <= 2) {
  FONT_SIZE_TEXT = 16;
  FONT_SIZE_TITULOS = 18;
  FONT_SIZE_LIST = 14;
  MARGIN_PADRAO_LATERAL = 5;
  INPUT_HEIGHT = 40;
  BUTTON_WIDTH = 250;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textDescPlaca: {
    fontSize: FONT_SIZE_TITULOS,
    color: 'black',
    alignSelf: 'center',
    fontWeight: "bold",
    ///padding: 10,
    //textAlign: "center",
    //marginTop: 20
  },
  textDescPermissao: {
    fontSize: FONT_SIZE_TITULOS,
    color: 'black',
    alignSelf: 'center',
    ///padding: 10,
    //textAlign: "center",
    //marginTop: 20
  },
  textButtonContinuar: {
    fontSize: FONT_SIZE_TEXT,
    color: 'white',
    fontWeight: "bold",
  },
  inputPlaca: {
    //flex: 1,
    borderWidth: 1,
    width: BUTTON_WIDTH,
    height: INPUT_HEIGHT,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    fontSize: FONT_SIZE_TEXT,
    alignSelf: 'center',
    textAlign: 'center'
  },
  buttonContinuar: {
    width: BUTTON_WIDTH,
    backgroundColor: '#F9690E',
    alignSelf: 'center'
  },
  buttonContinuarPress: {
    width: BUTTON_WIDTH,
    backgroundColor: '#F9690E',
    alignSelf: 'center',
    opacity: 0.5
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    width: BUTTON_WIDTH,
    height: INPUT_HEIGHT,
    alignSelf: 'center',
  },
  modalView: {
    backgroundColor: '#ffd9b3',
    margin: 20,
    width: BUTTON_WIDTH,
    borderRadius: 5,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#F9690E',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    width: BUTTON_WIDTH,
    borderWidth: 1,
    height: INPUT_HEIGHT,
  },
  textStyle: {
    color: 'black',
    textAlign: 'center',
    fontSize: FONT_SIZE_TEXT,
  },
  modalText: {
    textAlign: 'center',
    fontSize: FONT_SIZE_TEXT,
  },
  initValueTextStyle: {
    textAlign: 'center',
    fontSize: FONT_SIZE_TEXT,
  },
  childrenContainerStyle: {
    width: BUTTON_WIDTH,
    height: INPUT_HEIGHT
  },
  touchableStyle: {
    width: BUTTON_WIDTH,
    height: INPUT_HEIGHT,
    borderWidth: 1,
    borderRadius: 4
  },
  selectStyle: {
    width: BUTTON_WIDTH,
    height: INPUT_HEIGHT,
    borderWidth: 0
  }

});

export default styles;
