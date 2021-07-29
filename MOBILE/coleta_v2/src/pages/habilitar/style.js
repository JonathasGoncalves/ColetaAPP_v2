import { StyleSheet, PixelRatio } from 'react-native';

var FONT_SIZE_TITULOS = 20;
var FONT_SIZE_TEXT = 18;
var FONT_SIZE_LIST = 18;
var MARGIN_PADRAO_LATERAL = 10;
var INPUT_HEIGHT = 70;
var BUTTON_WIDTH = 200;

if (PixelRatio.get() <= 2) {
  FONT_SIZE_TEXT = 16;
  FONT_SIZE_TITULOS = 18;
  FONT_SIZE_LIST = 14;
  MARGIN_PADRAO_LATERAL = 5;
  INPUT_HEIGHT = 50;
  BUTTON_WIDTH = 170;
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
    textAlign: 'center',
    padding: 10,
    //textAlign: "center",
    marginTop: INPUT_HEIGHT
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
  buttonContinuarPress: {
    width: BUTTON_WIDTH,
    backgroundColor: '#F9690E',
    alignSelf: 'center',
    opacity: 0.5
  },
  textButtonContinuar: {
    fontSize: FONT_SIZE_TEXT,
    color: 'white',
    fontWeight: "bold",
  },
  buttonContinuar: {
    width: BUTTON_WIDTH,
    backgroundColor: '#F9690E',
    alignSelf: 'center'
  },
  buttonSolicitar: {
    width: BUTTON_WIDTH,
    backgroundColor: '#F9690E',
    alignSelf: 'center',
    marginBottom: MARGIN_PADRAO_LATERAL
  },
  textQR: {
    fontSize: FONT_SIZE_TITULOS,
    color: 'black',
    alignSelf: 'center',
    alignItems: 'center',
    fontWeight: "bold",
    textAlign: 'center',
    //backgroundColor: 'red',
    //marginTop: MARGIN_PADRAO_LATERAL,
    marginLeft: MARGIN_PADRAO_LATERAL,
    marginRight: MARGIN_PADRAO_LATERAL,
    marginBottom: MARGIN_PADRAO_LATERAL + 10,
    marginTop: MARGIN_PADRAO_LATERAL + 10
  }
});
export default styles;