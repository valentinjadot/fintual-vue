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
    props:['data'],
    data: () => ({
      chartOptions:{
          title: 'Total value of the portfolio through time',
          isStacked:true,
          hAxis: {
            title: 'Months',  
            titleTextStyle: {
              color: '#333'
              }
            },
          vAxis: {
            format: 'currency'
            },
          backgroundColor: { fill:'transparent' },
          width:'100%',
          height:300,
          animation: {
            duration:0
          },
          focusTarget: 'category', 
          tooltip: {isHtml: true}

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
