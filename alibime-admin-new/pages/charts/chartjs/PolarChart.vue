<script>
import { PolarArea } from 'vue-chartjs'

export default {
  extends: PolarArea,
  mounted() {
    this.renderChart(
      {
        labels: ['Direct', 'Affilliate', 'Sponsored', 'E-mail'],
        datasets: [
          {
            data: [251, 135, 48, 154],
            backgroundColor: ['#08BCC0', '#f7b84b', '#f7b84b', '#ebeff2'],
            borderColor: 'transparent',
          },
        ],
      },
      {
        maintainAspectRatio: true,
        legend: {
          position: 'top',
        },
      }
    )
  },
}
</script>