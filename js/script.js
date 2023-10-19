let tazaCambio = []

axios.get('https://api.exchangerate-api.com/v4/latest/USD')
  .then(response => {
    tazaCambio = Object.entries(response.data.rates).filter(([code]) => 
      ["USD","EUR","JPY","GBP","AUD","CAD","CHF","CNY","SEK","NZD","MXN","SGD","HKD","NOK","KRW","TRY","INR","RUB","BRL","ZAR","ARS"].includes(code)
    ).map(([code, rate]) => ({code, rate}))
  })
  .catch(error => {
    console.error(`Failed to fetch exchange rates: ${error}`)
    var resultado = document.getElementById('resultado')
    resultado.textContent = 'Error: Failed to fetch exchange rates'
  })

function resultadoCambio(divisaDesde, divisaHacia) {
    let desdeRate = tazaCambio.find(moneda => moneda.code === divisaDesde).rate
    let haciaRate = tazaCambio.find(moneda => moneda.code === divisaHacia).rate
    return (haciaRate / desdeRate)
}

function convertir(monto, divisaDesde, divisaHacia) {
    let cambioRate = resultadoCambio(divisaDesde, divisaHacia)
    return monto * cambioRate
}

function storeInput() {
    var desdeMoneda = document.getElementById('desdeMoneda').value
    var monto = document.getElementById('monto').value
    var haciaMoneda = document.getElementById('haciaMoneda').value

    localStorage.setItem('desdeMoneda', desdeMoneda)
    localStorage.setItem('monto', monto)
    localStorage.setItem('haciaMoneda', haciaMoneda)
}

function cuentaConversion() {
    var divisaDesde = localStorage.getItem('desdeMoneda')
    var monto = localStorage.getItem('monto')
    var divisaHacia = localStorage.getItem('haciaMoneda')

    if (tazaCambio.length === 0) {
        var resultado = document.getElementById('resultado')
        resultado.textContent = 'Error: Exchange rates not loaded yet'
        return
      }
    
    if (!isNaN(monto) && tazaCambio.find(moneda => moneda.code === divisaDesde) && tazaCambio.find(moneda => moneda.code === divisaHacia)) {
        let montoConvertido = convertir(monto, divisaDesde, divisaHacia)

        var resultado = document.getElementById('resultado')
        resultado.textContent = `El monto convertido es: ${montoConvertido.toFixed(2)}`
    } else {
        var resultado = document.getElementById('resultado')
        resultado.textContent = 'Monto inválido, ingréselo nuevamente'
    }
}
