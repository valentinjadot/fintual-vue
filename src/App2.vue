<template>
<div>
  <h1>Your portfolio in the last 12 months</h1>
  <v-layout>
    <v-flex pa-5>
      <v-range-slider
        :tick-labels="seasons"
        :value="[0, 1]"
        always-dirty
        min="0"
        max="3"
        thumb-label
        thumb-size="64"
        ticks="always"
      >
        <template v-slot:thumb-label="props">
          <span>{{ season(props.value) }}</span>
        </template>
      </v-range-slider>
    </v-flex>
  </v-layout>
  </div>
</template>

<script>
import { Portfolio, Stock } from './simple-class'
import stocksData from './data/stocks.json'

export default {
  name: 'app',
  data () {
    return {}
  },
  computed: {
    portfolio () {
      return new Portfolio(stocksData)
    },
    dateT0 () {
      return '2017-10-31'
    },
    dateT1 () {
      return '2019-05-23'
    },
    profit () {
      return this.portfolio.getProfitBetween(this.dateT0, this.dateT1)
    },
    annualizedReturn () {
      return this.portfolio.getAnnualizedReturnBetween(
        this.dateT0,
        this.dateT1
      )
    }
  },
  components: {}
}
</script>

<style>
</style>
