<template>
  <v-app>
<!--     <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Fintual</span>
        <span class="font-weight-light">Challenge</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

    </v-toolbar> -->

      <v-toolbar class="elevation-0 primary" dark>
    <v-toolbar-side-icon></v-toolbar-side-icon>
    <v-toolbar-title>Fintual Challenge</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">

    </v-toolbar-items>
  </v-toolbar>

    <v-content>
      <v-container class="container" grid-list-xl>
        <h1
          :class="{
            'display-1': $vuetify.breakpoint.lgAndUp,
            'headline': $vuetify.breakpoint.mdAndDown,
            'title': $vuetify.breakpoint.xs,
            }"
          class="py-2"
        >Your portfolio beteween {{ arrayOflast13QuoteDatesFormatted[range[0]] }} and {{ arrayOflast13QuoteDatesFormatted[range[1]] }}</h1>
        <v-layout
          justify-space-between
          fill-height
          :class="{
          'row': this.$vuetify.breakpoint.mdAndUp,
          'column':!this.$vuetify.breakpoint.mdAndUp
        }"
        >
          <v-flex md4>
            <v-card class="pa-2">
              <v-card-text>
                <v-layout
                  row>
                  <v-flex>
                    <figure>
                      <figcaption class="body-2 text-uppercase">Portfolio Profit</figcaption>
                      <p class="display-1 my-1">$ {{ profit.toFixed() }}</p>
                    </figure>
                  </v-flex>

                  <v-flex>
                    <figure>
                      <figcaption class="body-2 text-uppercase">Annualized return</figcaption>
                      <p class="display-1 my-1">{{ (annualizedReturn*100).toFixed() }} %</p>
                    </figure>
                  </v-flex>
                </v-layout>

                <v-layout>
                  <v-flex>
                    <figure>
                      <figcaption class="body-2 text-uppercase">Profit by stock</figcaption>

                      <template v-for="stock in portfolio.stocksOfPortfolio">
                        <v-list class="body-2 my-2" dense>
                          <v-layout justify-space-between row>
                            <v-flex md6>{{ stock.name }} ({{stock.symbol }})</v-flex>
                            <v-flex
                              md6
                              :class="{greenText:(getProfitForStockX(stock.symbol)>0), redText:(getProfitForStockX(stock.symbol)<0)}"
                              class="textRight"
                            >
                              <v-icon
                                small
                                color="#d23f31"
                                v-if="(getProfitForStockX(stock.symbol)<0)"
                              >mdi-arrow-down</v-icon>
                              <v-icon
                                small
                                color="#0f9d58"
                                v-if="(getProfitForStockX(stock.symbol)>0)"
                              >mdi-arrow-up</v-icon>
                              $ {{getProfitForStockX(stock.symbol).toFixed()}}
                              <span
                                class="currency"
                              >USD</span>
                            </v-flex>
                          </v-layout>
                        </v-list>
                        <v-divider class="divider"></v-divider>
                      </template>
                    </figure>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex md8>
            <v-card class="pa-2">
<v-card-text>
              <figure>
                      <figcaption class="body-2 text-uppercase">Total value of your portfolio through time</figcaption>
                      <compo-chart :data="dataTableForChart"></compo-chart>
                    </figure>
</v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
        <v-layout v-if="$vuetify.breakpoint.mdAndUp">


          <v-flex class="slider">
            <v-range-slider
              :tick-labels="arrayOflast13QuoteDatesFormatted"
              always-dirty
              min="0"
              max="12"
              thumb-label
              thumb-size="64"
              ticks="always"
              tick-size="2"
              v-model="range"
            >
              <template v-slot:thumb-label="props">
                <span>{{ arrayOflast13QuoteDatesFormatted[props.value] }}</span>
              </template>
            </v-range-slider>
          </v-flex>

        </v-layout>
        <h4>mp 0 {{monthPicked0}}</h4><br>
<h4>mp 1 {{monthPicked1}}</h4><br>
<h4>dt0 {{dateT0}}</h4><br>
<h4>dt1 {{dateT1}}</h4>
   <v-layout row wrap v-if="!$vuetify.breakpoint.mdAndUp">



    <v-flex xs12 sm6>
      <v-date-picker v-model="monthPicked0" color="primary" type="month" :allowed-dates="dateIsAllowedInDatePicker"></v-date-picker>
    </v-flex>
    <v-flex xs12 sm6 class="hidden-xs-only">
      <v-date-picker v-model="monthPicked1" color="primary" type="month" :allowed-dates="dateIsAllowedInDatePicker"></v-date-picker>
    </v-flex>
  </v-layout>


      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import CompoChart from "./components/CompoChart";

import { Portfolio, Stock } from "./simple-class";
import stocksData from "./data/stocks.json";
import { format } from "path";

export default {
  name: "app",
  components: {
    CompoChart
  },
  data() {
    return {
      range: [0, 12],
      forceReloadComponent: 1,
      monthPicked0:'2018-05',
      monthPicked1:'2019-05',

    };
  },
  computed: {
    portfolio() {
      return new Portfolio(stocksData);
    },
    dateT0() {
      if(this.$vuetify.breakpoint.mdAndUp) return this.arrayOflast13QuoteDates[this.range[0]]
      else {
        let formattedArray = this.arrayOflast13QuoteDates.map(el => el.substring(0,7))
        let indexInArray = formattedArray.indexOf(this.monthPicked0)
        return this.arrayOflast13QuoteDates[indexInArray]
      }
    },
    dateT1() {
      if(this.$vuetify.breakpoint.mdAndUp) return this.arrayOflast13QuoteDates[this.range[1]]
      else {
        let formattedArray = this.arrayOflast13QuoteDates.map(el => el.substring(0,7))
        let indexInArray = formattedArray.indexOf(this.monthPicked1)
        return this.arrayOflast13QuoteDates[indexInArray]
      }
    },
    profit() {
      return this.portfolio.getProfitBetween(this.dateT0, this.dateT1);
    },
    annualizedReturn() {
      return this.portfolio.getAnnualizedReturnBetween(
        this.dateT0,
        this.dateT1
      );
    },
    currentValueOfPortfolio() {
      return this.portfolio.getValueOfPortfolioAt(
        this.arrayOflast13QuoteDates[12]
      );
    },
    arrayOflast13QuoteDates() {
      return this.portfolio.getArrayOfLast13QuoteDates();
    },
    arrayOflast13QuoteDatesFormatted() {
      return this.portfolio.getArrayOfLast13QuoteDatesFormatted();
    },
    dataTableForChart() {
      return this.portfolio.getDataTableForChart(this.range[0], this.range[1]);
    }
  },
  methods: {
    getProfitForStockX(stockSymbol) {
      return this.portfolio.getProfitForStockX(
        this.dateT0,
        this.dateT1,
        stockSymbol
      );
    },
    dateIsAllowedInDatePicker(date) {
      let formattedArray = this.arrayOflast13QuoteDates.map(el => el.substring(0,7))
      return formattedArray.indexOf(date) != -1
      console.log(arrayOfMonths)
    }
  }
};
</script>


<style>
.slider * {
  font-size: 15px;
}

.v-card {
  height: 100%;
}
.listOfStocksProfit li {
  text-decoration: none;
  list-style-type: none;
  width: 100%;
}
.greenText {
  color: #0f9d58;
}
.redText {
  color: #d23f31;
}
.currency {
  color: rgba(0, 0, 0, 0.62);
  font-weight: 400;
}
.divider:last-of-type {
  display: none;
}
.textRight {
  text-align: right;
} 
</style>
