<script>
import { Pie } from 'vue-chartjs'

export default {
  extends: Pie,
  mounted() {
    this.renderChart(
      {
        labels: ['Direct', 'Affilliate', 'Sponsored', 'E-mail'],
        datasets: [
          {
            data: [300, 135, 48, 154],
            backgroundColor: ['#08BCC0', '#f7b84b', '#f7b84b', '#ebeff2'],
            borderColor: 'transparent',
          },
        ],
      },
      {
        maintainAspectRatio: true,
        responsive: true,
        legend: {
          display: false,
        },
      }
    )
  },
}
</script>