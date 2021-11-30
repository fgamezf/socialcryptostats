import { Line } from "react-chartjs-2";

export const LineChart = ({ chartData }) => {
  return chartData && (

      <Line
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Coin messages"
            },
            legend: {
              display: true,
              position: "bottom"
           }
          },
          scales: {
            y: {
              type: 'linear',
              display: true,
              position: 'left',
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
      
              // grid line settings
              grid: {
                drawOnChartArea: false, // only want the grid lines for one axis to show up
              },
            },
          }
          
        }}
      />

  );
};


