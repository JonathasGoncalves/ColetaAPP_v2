export function calcularTotalColetado(coleta) {

  volume = {
    total: 0,
    totalOff: 0,
  }
  coleta.map((coleta) => {
    coleta.coleta.map((ItemColeta) => {
      if (ItemColeta.cod_ocorrencia == '') {
        volume.total += ItemColeta.volume;
      } else {
        volume.totalOff += ItemColeta.volume;
      }
    })
  })

  return volume;
}

export function calcularTotalColetadoPorTanque(coleta, tanqueFind) {
  volume = {
    total: 0,
    totalOff: 0,
  }
  coleta.map((coleta) => {
    coleta.coleta.map((ItemColeta) => {
      if (ItemColeta.tanque == tanqueFind) {
        if (ItemColeta.cod_ocorrencia == '') {
          volume.total += ItemColeta.volume;
        } else {
          volume.totalOff += ItemColeta.volume;
        }
      }
    })
  })
  return volume;
}