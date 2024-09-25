import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import PropTypes from 'prop-types';

Chart.register(...registerables, ChartDataLabels);

const StackedBarChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const labels = data.map(item => item.name);
    const colors_bg = ['#595959', '#ff0000', '#00b0f0', '#70ad47', '#ffc000'];
    const projectNames = ['Allocated-Working', 'NotAllocated-Working', 'Allocated-Available', 'Available', 'Reserved'];

    const projects = data.reduce((result, item) => {
      item.projects.forEach(prj => {
        const prjId = prj.projectId;
        if (!result[prjId]) {
          const labelIndex = projectNames.indexOf(prj.allocationType);
          result[prjId] = {
            label: prj.allocationType,
            data: Array(data.length).fill(0),
            backgroundColor: colors_bg[labelIndex] || '#000000',
            account: prj.account,
          };
        }
      });
      return result;
    }, {});

    const calculateMonthsDifference = (startDate, endDate) => {
      if (!startDate || !endDate) return 0;
      const start = new Date(startDate);
      const end = new Date(endDate);
      return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    };

    data.forEach((item, index) => {
      item.projects.forEach(prj => {
        const prjId = prj.projectId;
        const monthsDifference = calculateMonthsDifference(prj.startDate, prj.endDate);
        projects[prjId].data[index] = monthsDifference;
      });
    });

    const chartData = {
      datasets: Object.values(projects),
      labels: labels,
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      barThickness: 30,
      scales: {
        x: {
          stacked: true,
          position: 'top',
          ticks: {
            callback: function(value) {
              const months = [
                'Apr 2024', 'May 2024', 'Jun 2024', 'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024',
                'Jan 2025', 'Feb 2025', 'Mar 2025'
              ];
              return months[value] || value;
            },
            stepSize: 1,
            maxRotation: 0,
            autoSkip: false,
            font: {
              size: 10,
            },
          },
          grid: {
            display: false,
          },
        },
        y: {
          stacked: true,
          barPercentage: 0.5,
          ticks: {
            padding: 0,
            callback: function(value, index) {
              return labels[index];
            },
          },
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          display: function(context) {
            return context.dataset.account !== null && context.dataset.data[context.dataIndex] > 0;
          },
          formatter: function(value, context) {
            return context.dataset.account;
          },
          color: 'white',
          anchor: 'center',
          align: 'center',
        },
      },
    };

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: options,
      plugins: [ChartDataLabels],
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={chartRef} style={{ width: '100vw', height: '100vh' }} />;
};

StackedBarChart.propTypes = {
  data: PropTypes.array.isRequired,
};

export default StackedBarChart;
