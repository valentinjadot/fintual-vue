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
      <v-container class="container" grid-list-xl>
        <h1
          :class="{
            'display-3': $vuetify.breakpoint.xl,
            'display-2': $vuetify.breakpoint.lg,
            'display-1': $vuetify.breakpoint.md,
            'headline': $vuetify.breakpoint.sm,
            'title': $vuetify.breakpoint.xs,
            }"
        >Your portfolio beteween {{ last13QuoteDatesFormatted[range[0]] }} and {{ last13QuoteDatesFormatted[range[1]] }}</h1>
        <v-layout justify-space-between fill-height :class="{
          'row': this.$vuetify.breakpoint.mdAndUp,
          'column':!this.$vuetify.breakpoint.mdAndUp
        }">
          
          <v-flex md4>
            <v-card class="pa-2">
              <v-card-text>
                <v-layout :class="{
          'row': !this.$vuetify.breakpoint.mdAndUp,
          'column':this.$vuetify.breakpoint.mdAndUp
        }">
                  <v-flex>
                    <figcaption class="title text-uppercase">Profit</figcaption>
                    <p class="display-2 my-2">$ {{ profit.toFixed() }}</p>
                  </v-flex>

                  <v-flex>
                    <figcaption class="title text-uppercase">Annualized return</figcaption>
                    <p class="display-2 my-2">{{ (annualizedReturn*100).toFixed() }} %</p>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>

          <v-flex md8>
            <v-card>
              <compo-chart :data="dataTableForChart"></compo-chart>
            </v-card>
          </v-flex>

        </v-layout>
        <v-layout>
          <v-flex class="slider">
            <v-range-slider
              :tick-labels="last13QuoteDatesFormatted"
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
                <span>{{ last13QuoteDatesFormatted[props.value] }}</span>
              </template>
            </v-range-slider>
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
      return this.portfolio.getValueOfPortfolioAt(this.last13QuoteDates[12]);
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


<style>
.slider * {
  font-size: 15px;
}

.v-card {
  height: 100%;
}
</style>
