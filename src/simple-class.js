export class Portfolio {
  // The class recieve as argument an array continaing all the data of the stocks from the API.
  // We will use this to build the portolio.
  constructor (stocksDataFromAPI) {
    // We initiate the portfolio itself, an array that will contain all the information about each stock (amount, value, etc.)
    this.stocksOfPortfolio = []

    // For each element in the array recieved as argument (data from API)..
    stocksDataFromAPI.forEach(element => {
      // ...we create an instance of Stock...
      let stock = new Stock(element)
      // ...and store it in the stocksOfPortfolio array
      this.stocksOfPortfolio.push(stock)
    })

    // For easy access, we reference the list of dates of the time-serie
    this.listOfDates = Object.keys(this.stocksOfPortfolio[0].monthlyTimeSerie) // VLC explain the 0 value
  }

  getValueOfPortfolioAt (date) {
    let portfolioValue = 0

    // We loop through each stock and sum up the value (price of stock at that date multiplied by amount of stocks hold)
    this.stocksOfPortfolio.forEach(stock => {
      portfolioValue += stock.getPriceAt(date) * stock.amount
    })
    return portfolioValue
  }

  // This method returns the total portfolio profit made between 2 dates
  getProfitBetween (dateT0, dateT1) {
    // The profit made between two date is the difference in value of portfolio between these two dates
    return (
      this.getValueOfPortfolioAt(dateT1) - this.getValueOfPortfolioAt(dateT0)
    )
  }
  getProfitForStockX (dateT0, dateT1, stockSymbol) {
    let focusedStock = this.stocksOfPortfolio.filter(stock => stock.symbol === stockSymbol)
    return (
      focusedStock[0].getTotalValueAt(dateT1) - focusedStock[0].getTotalValueAt(dateT0) // VLC explain why 0 --> changer le nom pour "ForOneStock"
    )
  }

  // Bonus challenge : this method returns the annualized return of the portfolio between two dates
  getAnnualizedReturnBetween (dateT0, dateT1) {
    // To compute the annualized return, we need first to have the cumulative return between the two dates.
    let cumulativeReturn =
      this.getProfitBetween(dateT0, dateT1) /
      this.getValueOfPortfolioAt(dateT0)

    // We need then to know how many days we held these stocks (how many days betwwen dateT0 and dateT1)
    let timestampDateT0 = new Date(dateT0)
    let timestampDateT1 = new Date(dateT1)

    // Transforming a difference in timestamp in a difference of days
    var differenceInSeconds =
      Math.abs(timestampDateT1 - timestampDateT0) / 1000 // VLC remplacer 1000 par une variable global qui explique ce que c'est
    var daysHeld = Math.floor(differenceInSeconds / 86400) // VLC idem (86400)

    // The formula of annualized return is (1 + cumulativeReturn) ^ (365 / daysHeld) - 1
    return (cumulativeReturn + 1) ** (365 / daysHeld) - 1 // VLC idem pour 365 + expliquer le pourquoi du +1 -1, sauf si c'est un fromule connu
  }

  getListOfDates(format) {

    const NUMBER_OF_YEARS = 10 
    const sliceEnd = NUMBER_OF_YEARS+1

    let objectToReturn = {
      formatYYYYMMDD:[],
      formatYYYY:[],
      formatYY:[]
    }

    // We get the closing dates from which we have the stock price in order to be able to compute 10 years of portfolio activity. 
  
    // We reverse the array in order to have a chronological order.

    // Ex: 2018-12-29
    objectToReturn.formatYYYYMMDD = this.listOfDates.filter(priceDate => priceDate.split('-')[1] === '12').slice(0, sliceEnd).reverse()

    // Ex: 2018
    objectToReturn.formatYYYY = objectToReturn.formatYYYYMMDD.map(priceDate => {
      let yearUncorrected = priceDate.split('-')[0]
      let yearCorrected = parseInt(yearUncorrected) + 1
      return yearCorrected
    })

    // Ex: '18
    objectToReturn.formatYY = objectToReturn.formatYYYY.map(year => '\'' + year.toString().substr(-2))

    return objectToReturn

    }
  


  getDataTableForChart (a, b) { // VLC changer les noms a et b pour que cela soit plus representatif
    // We create a table (array of arrays) that will be sent to Google Chart API to generate the graph
    let tableForChart = []

    /*    The table as to be structured like this:

      [
        ['Months', 'Google', 'Amazon', 'Apple'],
        ['2018-05-31',  1000,      400,      300],
        ['2018-06-29',  1170,      460,      900],
        ['2018-05-31',  660,       1120,     483],
        ['2018-04-30',  1030,      540,      1200]
      ]

      */

    // Each array inside "tableForChart" is therefore a line of a table.

    // The first line is the header. It contains the labels of the data.
    // The first collumn will be the list of dates (formatted as i.e. "May, 2019") thus the header is:
    let lineHeader = [{ type: 'string', role: 'domain', label: 'Months' }]

    // The remaining collumn headers will be the name of each Company's stock
    this.stocksOfPortfolio.forEach(stock => lineHeader.push(stock.name))

    // We add a special collumn to configure the tooltip (that appears whe we hover the graph)

    // We add this first completed line to the table
    tableForChart.push(lineHeader)

    // For the remainng lines of the table, we will loop through each of the last 13 quote dates and add the corresponding stocks value
    // VLC tu dis 13 alors qu'il y a 14 veleur, 12 mois, je suis perdu
    for (let i = a; i <= b; i++) {
      let dateOfQuote = this.getListOfDates().formatYY[i]
      // The first collumn of this line is the date itself
      let line = [dateOfQuote]
      // Then we add a collumn for each of the 13 dates with the total value for this stock (price of 1 stock at that date multiplied by amount of stocks owned)
      this.stocksOfPortfolio.forEach(stock => {
        line.push(parseInt(stock.getTotalValueAt(this.getListOfDates().formatYYYYMMDD[i])))
      })

      // We insert the line in the final data table
      tableForChart.push(line)
    }

    return tableForChart
  }
}

export class Stock {
  // We recieve as argument an object (stockData) containing all the relevant information in order to build the Stock object.
  constructor (stockData) {
    this.name = stockData['name']
    this.symbol = stockData['symbol']
    this.amount = stockData['amount']
    this.monthlyTimeSerie = stockData['monthly-time-serie']
  }

  // This method simply returns the price of the stock at a given date.
  // As the data from API contain different price-related values, we arbitraraly chose the price at the closing of the market which is stored under the key "4. close".
  getPriceAt (date) {
    return this.monthlyTimeSerie[date]['4. close']
  }
  getTotalValueAt (date) {
    return (this.monthlyTimeSerie[date]['4. close'] * this.amount).toFixed(2)
  }
}
