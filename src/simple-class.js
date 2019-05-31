
// ********************************************************************
//
//  CLASS STOCK
//
// ********************************************************************

export class Stock {
  // We recieve as argument an object (stockData) containing all the relevant information in order to build the Stock object.
  constructor (stockData) {
    this.name = stockData['name']
    this.symbol = stockData['symbol']
    this.amount = stockData['amount']
    this.monthlyTimeSerie = stockData['monthly-time-serie']
  }

  // Returns the amount of shares owned
  getAmount () {
    return this.amount
  }

  // Returns the price of the stock at a given date. As the data from API contain different price-related values, we arbitraraly chose the price at the closing of the market which is stored under the key "4. close".
  getPriceAt (date) {
    return this.monthlyTimeSerie[date]['4. close']
  }
  // Returns the shareholing value owned (price of the share times the amount of shares owned)
  getShareholdingValueAt (date) {
    return this.getAmount() * this.getPriceAt(date)
  }
  // Returns the profit made by holding these shares between these two dates
  getShareholdingProfitBetween (dateT0, dateT1) {
    return this.getShareholdingValueAt(dateT1) - this.getShareholdingValueAt(dateT0)
  }
}






// ********************************************************************
//
//  CLASS PORTFOLIO
//
// ********************************************************************


export class Portfolio {
  // The class recieve as argument an array continaing all the data regarding the stocks in JSON (from an API for example).

  // We will use this to build the portolio.
  constructor (stocksDataFromAPI) {
    // We initiate the portfolio itself, an array that will contain all the information about each stock (amount, value, etc.)
    this.stocksOfPortfolio = []

    // For each element in the array recieved as argument (data from API)..
    stocksDataFromAPI.forEach(stockData => {
      // ...we create an instance of Stock...
      let stock = new Stock(stockData)
      // ...and store it in the stocksOfPortfolio array
      this.stocksOfPortfolio.push(stock)
    })

    // We also create a property that will hold an array containing all the dates for which we have prices.
    // The dates are the keys in the object "monthlyTimeSerie" (see the structe of the JSON), so we just store the list of the keys (of the first stock but would work with any other stock) and we have a list of the dates.
    this.listOfDates = Object.keys(this.stocksOfPortfolio[0].monthlyTimeSerie)
  }

  // Returns the total value of the portfolio at a certain date
  getPortfolioValueAt (date) {
    // We loop through each stock and sum up the total value of that stock (price of the share * amount of shares)
    return parseInt(this.stocksOfPortfolio
      .map(stock => stock.getShareholdingValueAt(date))
      .reduce((accumulator, shareholdingValue) => accumulator + shareholdingValue))
    
  }

  // Returns the total portfolio profit made between 2 dates
  getProfitBetween (dateT0, dateT1) {
    return this.getPortfolioValueAt(dateT1) - this.getPortfolioValueAt(dateT0)
  }

  // ***************
  // Bonus challenge : this method returns the annualized return of the portfolio between two dates
  // ***************

  getAnnualizedReturnBetween (dateT0, dateT1) {
    // To compute the annualized return, we need first to have the cumulative return between the two dates.
    let cumulativeReturn =
      this.getProfitBetween(dateT0, dateT1) / this.getPortfolioValueAt(dateT0)

    // We need then to know how many days we held these stocks (how many days betwwen dateT0 and dateT1)
    let timestampDateT0 = new Date(dateT0)
    let timestampDateT1 = new Date(dateT1)

    // Transforming a difference of timestamp in a difference of days

    var differenceInSeconds =
      Math.abs(timestampDateT1 - timestampDateT0) / 1000 // Timestamp are in miliseconds so we convert it in seconds first
    var daysHeld = Math.floor(differenceInSeconds / 86400) // There are 86400 seconds in a day

    // The formula of annualized return is:
    // (1 + cumulativeReturn) ^ (365 / daysHeld) - 1
    return (cumulativeReturn + 1) ** (365 / daysHeld) - 1
  }


  // ***********************************************************************************************
  //
  // These are two aditionnal methods used in order to visualize and play around with the portfolio
  // 
  // ***********************************************************************************************

  getListOfDates () {

    // For this visualisation, we arbitraraly focus on the last 10 years
    const NUMBER_OF_YEARS = 10

    // We then need 11 points in time to compute 10 years of portfolio evolution
    const sliceEnd = NUMBER_OF_YEARS + 1

    // This method will return an object conaining the dates in different formatting
    let objectToReturn = {
      formatYYYYMMDD: [],
      formatYYYY: [],
      formatYY: []
    }


    // Ex: 2018-12-29
    objectToReturn.formatYYYYMMDD = this.listOfDates
      .filter(priceDate => priceDate.split('-')[1] === '12')
      .slice(0, sliceEnd)
      .reverse()

    // Ex: 2018
    objectToReturn.formatYYYY = objectToReturn.formatYYYYMMDD.map(priceDate => {
      let yearUncorrected = priceDate.split('-')[0]
      let yearCorrected = parseInt(yearUncorrected) + 1
      return yearCorrected
    })

    // Ex: '18
    objectToReturn.formatYY = objectToReturn.formatYYYY.map(
      year => "'" + year.toString().substr(-2)
    )

    return objectToReturn
  }

  getDataTableForChart (dateT0, dateT1) {

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


    let start = this.getListOfDates().formatYYYYMMDD.indexOf(dateT0)
    let end = this.getListOfDates().formatYYYYMMDD.indexOf(dateT1)
    // For the remainng lines of the table, we will loop through each of the last 13 quote dates and add the corresponding stocks value
    // VLC tu dis 13 alors qu'il y a 14 veleur, 12 mois, je suis perdu
    for (let i = start; i <= end; i++) {
      let dateOfQuote = this.getListOfDates().formatYY[i]
      // The first collumn of this line is the date itself
      let line = [dateOfQuote]
      // Then we add a collumn for each of the 13 dates with the total value for this stock (price of 1 stock at that date multiplied by amount of stocks owned)
      this.stocksOfPortfolio.forEach(stock => {
        line.push(
          parseInt(
            stock.getShareholdingValueAt(this.getListOfDates().formatYYYYMMDD[i])
          )
        )
      })

      // We insert the line in the final data table
      tableForChart.push(line)
    }

    return tableForChart
  }
}





