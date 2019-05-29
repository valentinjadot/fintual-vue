<template>
<div>

  <GChart
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
          title: 'Portfolio performance',
          isStacked:true,
          hAxis: {title: 'Months',  titleTextStyle: {color: '#333'}},
          vAxis: {minValue: 0},
          backgroundColor: { fill:'transparent' },
          height:600,
          animation: {
            duration:0
          }
        }
    }),
    components: {
    GChart
  }

  }


/* 
   google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart); */

/*       function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ['Year', 'Sales', 'Expenses', 'Bonjour'],
          ['2013',  1000,      400,      300],
          ['2014',  1170,      460,      900],
          ['2015',  660,       1120,     483],
          ['2016',  1030,      540,      1200]
        ]); */


/*         var options = {
          title: 'Company Performance',
          isStacked:true,
          hAxis: {title: 'Year',  titleTextStyle: {color: '#333'}},
          vAxis: {minValue: 0},
          backgroundColor: { fill:'transparent' }
        };
 *//* 
        var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }
 */
</script>

<style>

</style>
