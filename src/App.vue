<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Fintual</span>
        <span class="font-weight-light">Challenge</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-content>
      <div>
        <h1>Your portfolio beteween {{ last13QuoteDatesFormatted[range[0]] }} and {{ last13QuoteDatesFormatted[range[1]] }}</h1>

        <h3>Current value of portfolio at {{ last13QuoteDatesFormatted[12] }} </h3>
        <h2>{{ currentValueOfPortfolio }}</h2>


        <h3>Profit</h3>
        <h2>$ {{ profit.toFixed() }} USD</h2>
        <br>

        <h3>Annualized return</h3>
        <h2>{{ (annualizedReturn*100).toFixed() }} %</h2>
        <br>

        <compo-chart :data="dataTableForChart"></compo-chart>

        <v-layout>
          <v-flex pa-5>
            <v-range-slider
              :tick-labels="last13QuoteDatesFormatted"
              always-dirty
              min="0"
              max="12"
              thumb-label
              thumb-size="64"
              ticks="always"
              v-model="range"
            >
              <template v-slot:thumb-label="props">
                <span>{{ last13QuoteDatesFormatted[props.value] }}</span>
              </template>
            </v-range-slider>
          </v-flex>
        </v-layout>


      </div>
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
      range: [0, 12]
    };
  },
  computed: {
    portfolio() {
      return new Portfolio(stocksData);
    },
    dateT0() {
      return this.last13QuoteDates[this.range[0]];
    },
    dateT1() {
      return this.last13QuoteDates[this.range[1]];
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
      return this.portfolio.getValueOfPortfolioAt(this.last13QuoteDates[12])
    },
    last13QuoteDates() {
      return this.portfolio.getLast13QuoteDates();
    },
    last13QuoteDatesFormatted() {
      return this.portfolio.getLast13QuoteDatesFormatted();
    },
    dataTableForChart() {
      return this.portfolio.getDataTableForChart(this.range[0], this.range[1]);
    }
  }
};
</script>
