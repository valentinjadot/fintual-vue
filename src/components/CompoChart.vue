<template>
<div>

  <GChart class="Gchart"
    type="AreaChart"
    :data="data"
    :options="chartOptions"
  />

</div>
</template>

<script>

import { GChart } from 'vue-google-charts'

export default {
  // The data of the chart are send as a prop to this component and transmit to the Google Chart component
  props: ['data'],
  data: () => ({

    // Here we have all the options for the Google Chart
    chartOptions: {
      isStacked: true,
      hAxis: {
        title: 'Years',
        titleTextStyle: {
          color: '#333'
        }
      },
      vAxis: {
        format: 'currency'
      },
      backgroundColor: { fill: 'transparent' },
      width: '100%',
      height: 350,
      animation: {
        duration: 0
      },
      focusTarget: 'category',
      tooltip: { isHtml: true }

    }
  }),
  components: {
    GChart
  }

}

</script>

<style>
.Gchart {

}
</style>
