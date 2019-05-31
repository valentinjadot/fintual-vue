<template>
  <v-app>
    <v-toolbar class="elevation-0 primary" dark>
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title>Fintual Challenge</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down"></v-toolbar-items>
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
        >Your portfolio beteween {{ listOfDates.formatYYYY[range[0]] }} and {{ listOfDates.formatYYYY[range[1]] }}</h1>
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
                <v-layout row>
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
                            <v-flex md6>{{ stock.name }} ({{stock.amount}} units)</v-flex>
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
                  <figcaption
                    class="body-2 text-uppercase"
                  >Total value of your portfolio through time</figcaption>
                  <compo-chart :data="dataTableForChart"></compo-chart>
                </figure>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
        <v-layout v-if="!isSmallScreen">
          <v-flex class="slider">
            <v-range-slider
              :tick-labels="listOfDates.formatYY"
              always-dirty
              min="0"
              max="10"
              thumb-label
              thumb-size="64"
              ticks="always"
              tick-size="2"
              v-model="rangeDefinedByUser.desktopVersion.sliderValues"
            >
              <template v-slot:thumb-label="props">
                <span>{{ listOfDates.formatYY[props.value] }}</span>
              </template>
            </v-range-slider>
          </v-flex>
        </v-layout>

        <v-layout row wrap v-if="isSmallScreen">
          <v-flex xs6 sm6>
            Between 
            <v-select
              v-model="rangeDefinedByUser.mobileVersion.yearPicked0"
              :items="listOfDates.formatYYYY"
              menu-props="auto"
              label="Select year"
              hide-details
              prepend-icon="mdi-calendar"
              
            ></v-select>
          </v-flex>
          <v-flex xs6 sm6>
            and 
            <v-select
              v-model="rangeDefinedByUser.mobileVersion.yearPicked1"
              :items="listOfDates.formatYYYY"
              menu-props="auto"
              label="Select year"
              hide-details
              prepend-icon="mdi-calendar"

            ></v-select>
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
      rangeDefinedByUser: {
        mobileVersion: {
          yearPicked0: -1,
          yearPicked1: -1
        },
        desktopVersion: {
          sliderValues: [0, 10] 
        }
      }
    };
  },
  computed: {
    isSmallScreen() {
      return !this.$vuetify.breakpoint.mdAndUp;
    },
    portfolio() {
      return new Portfolio(stocksData);
    },
    range() {
      if (this.isSmallScreen) {
        let index0 = this.listOfDates.formatYYYY.indexOf(this.rangeDefinedByUser.mobileVersion.yearPicked0)
        let index1 = this.listOfDates.formatYYYY.indexOf(this.rangeDefinedByUser.mobileVersion.yearPicked1)

        if(index0!=-1 && index1!=-1) return [index0,index1]
        else return [0,10]
      } else {
        return this.rangeDefinedByUser.desktopVersion.sliderValues;
      }
    },
    dateT0() {
      return this.listOfDates.formatYYYYMMDD[this.range[0]];
    },
    dateT1() {
      return this.listOfDates.formatYYYYMMDD[this.range[1]];
    },
    profit() {
      console.log("dateT0" + this.dateT0);
      console.log("dateT1" + this.dateT1);
      return this.portfolio.getProfitBetween(this.dateT0, this.dateT1);
    },
    annualizedReturn() {
      return this.portfolio.getAnnualizedReturnBetween(
        this.dateT0,
        this.dateT1
      );
    },
    listOfDates() {
      return this.portfolio.getListOfDates();
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
