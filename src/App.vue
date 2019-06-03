<template>
  <v-app>
    <!--
    ************************
    Header of the page (could be a separate component as the app grows )
    ************************
    -->
    <v-toolbar class="elevation-0 primary" dark>
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title>Fintual Challenge</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down"></v-toolbar-items>
    </v-toolbar>

    <!--
    ************************
    Main content
    ************************
    -->
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
            <!--
    *********************************
    First card containing the stats & figures
    *********************************
            -->
            <v-card class="pa-2">
              <v-card-text>
                <v-layout row>
                  <v-flex>
                    <figure>
                      <figcaption class="body-2 text-uppercase">Portfolio Profit</figcaption>
                      <p class="display-1 my-1">${{ profit }}</p>
                    </figure>
                  </v-flex>

                  <v-flex>
                    <figure>
                      <figcaption class="body-2 text-uppercase">Annualized return</figcaption>
                      <p class="display-1 my-1">{{ annualizedReturn }} %</p>
                    </figure>
                  </v-flex>
                </v-layout>

                <v-layout>
                  <v-flex>
                    <figure>
                      <figcaption class="body-2 text-uppercase">Profit by stock</figcaption>

                      <v-list class="body-2 my-2" dense>
                        <template v-for="stock in portfolio.stocksOfPortfolio">
                          <v-layout v-bind:key="stock.name" justify-space-between row>
                            <v-flex md6>{{ stock.name }} ({{stock.amount}} units)</v-flex>
                            <v-flex
                              md6
                              :class="{greenText:(stock.getShareholdingProfitBetween(dateT0,dateT1)>0), redText:(stock.getShareholdingProfitBetween(dateT0,dateT1)<0)}"
                              class="textRight"
                            >
                              <v-icon
                                small
                                color="#d23f31"
                                v-if="(stock.getShareholdingProfitBetween(dateT0,dateT1)<0)"
                              >mdi-arrow-down</v-icon>
                              <v-icon
                                small
                                color="#0f9d58"
                                v-if="(stock.getShareholdingProfitBetween(dateT0,dateT1)>0)"
                              >mdi-arrow-up</v-icon>
                              $ {{stock.getShareholdingProfitBetween(dateT0,dateT1).toFixed()}}
                              <span
                                class="currency"
                              >USD</span>
                            </v-flex>
                          </v-layout>
                          <v-divider class="divider" v-bind:key="stock.name"></v-divider>
                        </template>
                      </v-list>
                    </figure>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex md8>
            <v-card class="pa-2">
              <!--
    *********************************
    Second card containing the graph
    *********************************
              -->
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

        <!--
    ******************************************************************
    Tools used by user to define the range (depending on screen size)
    ******************************************************************
        -->

        <v-layout v-if="!isSmallScreen">
          <!--
    *********
    Slider (big screens)
    *********
          -->
          <v-flex class="slider">
            <v-range-slider
              :tick-labels="listOfDates.formatYYYY"
              always-dirty
              min="0"
              max="10"
              thumb-label
              thumb-size="64"
              ticks="always"
              tick-size="2"
              v-model="rangeDefinedByUser.desktopVersion.sliderValues"
              :rules="rangeDefinedByUser.sliderValidationRule"
            >
              <template v-slot:thumb-label="props">
                <span>{{ listOfDates.formatYYYY[props.value] }}</span>
              </template>
            </v-range-slider>
          </v-flex>
        </v-layout>

        <v-layout row wrap v-if="isSmallScreen">
          <!--
    *********
    Dropdown selector (small screen)
    *********
          -->
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
              :items="listOfDates.formatYYYY.filter(date => date>rangeDefinedByUser.mobileVersion.yearPicked0)"
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
import CompoChart from './components/CompoChart'

// We import the two classes Portfolio and Stock
import { Portfolio } from './stock-and-portfolio-classes'

// We import the JSON containing the data from API
import stocksDataFromAPI from './data/stocks.json'

export default {
  name: 'app',
  components: {
    CompoChart
  },
  data () {
    return {
      // Depending on the size of the screen, we use two diffenret tools (slide or dropdown selector) to get the range of time
      rangeDefinedByUser: {
        mobileVersion: {
          yearPicked0: -1,
          yearPicked1: -1
        },
        desktopVersion: {
          sliderValues: [0, 10]
        },
        sliderValidationRule: [
          v => v[0] !== v[1] || 'Please select two different years'
        ]
      }
    }
  },
  computed: {
    isSmallScreen () {
      // Vuetify (UI framework) provides breakpoint that we use to switch from the slide to the dropdown selector
      return !this.$vuetify.breakpoint.mdAndUp
    },
    portfolio () {
      // We create a new instance of portfolio using the data from the JSON
      return new Portfolio(stocksDataFromAPI)
    },
    listOfDates () {
      // We get the list of dates for the last 10 years
      return this.portfolio.getListOfDates()
    },
    range () {
      // The range of dates is computed diffrently depending on the tool used to define it (slide for large screen or dropdown selector for small screens)
      if (this.isSmallScreen) {
        let index0 = this.listOfDates.formatYYYY.indexOf(
          this.rangeDefinedByUser.mobileVersion.yearPicked0
        )
        let index1 = this.listOfDates.formatYYYY.indexOf(
          this.rangeDefinedByUser.mobileVersion.yearPicked1
        )

        // Value by default if the user has not picked dates yet
        if (index0 !== -1 && index1 !== -1) return [index0, index1]
        else return [0, 10]
      } else {
        // If we are on a big screen, the range is defined by the range of the slider
        return this.rangeDefinedByUser.desktopVersion.sliderValues
      }
    },
    dateT0 () {
      // Using the range defined by the user, we get the dates to use for computation of profit, annualized return, etc.
      return this.listOfDates.formatYYYYMMDD[this.range[0]]
    },
    dateT1 () {
      return this.listOfDates.formatYYYYMMDD[this.range[1]]
    },
    profit () {
      return this.portfolio.getProfitBetween(this.dateT0, this.dateT1)
    },
    annualizedReturn () {
      return this.portfolio.getAnnualizedReturnBetween(
        this.dateT0,
        this.dateT1
      )
    },
    dataTableForChart () {
      // We get the data for the chart that will be send to the CompoChart component
      return this.portfolio.getDataTableForChart(this.dateT0, this.dateT1)
    }
  }
}
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
