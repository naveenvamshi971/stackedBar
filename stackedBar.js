import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';

// above ones are from EChart file

import { useMemo } from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// StackedBarChart configurations
import configs from "examples/Charts/BarCharts/StackedBarChart/configs";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";


//from, 8 to 32 are required in ReportsBarChart

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend); 
Chart.register(...registerables, ChartDataLabels);
let projectNames = ['Allocated-Working', 'NotAllocated-Working', 'Allocated-Available', 'Available', 'Reserved'];
const data = [
    {
      name: 'Naveen',
      contractFrom: '2000-03-01',
      contractTo: '2030-03-01',
      projects: [
        {
          projectId: '13415000',
          allocationType: 'Allocated-Working',
          account: "Paramount",
          startDate: '2024-04-01',
          endDate: '2024-06-30',
          monthFrom: '12',
          monthTo: '4',
          personMonths: 4,
          employee: null,
          empty: false,
        },
        {
          projectId: '87141503',
          allocationType: 'NotAllocated-Working',
          account: null,
          startDate: '2024-07-01',
          endDate: '2024-09-30',
          monthFrom: '3',
          monthTo: '8',
          personMonths: 6,
          employee: null,
          empty: true,
        },
        {
          projectId: '61141504',
          allocationType: 'Available',
          account: null,
          startDate: '2024-10-01',
          endDate: '2024-12-31',
          monthFrom: '7.0',
          monthTo: '12',
          personMonths: 2,
          employee: null,
          empty: false,
        },
        {
            projectId: '91141522',
            allocationType: 'Reserved',
            account: "Paramount",
            startDate: '2025-01-01',
            endDate: '2025-02-20',
            monthFrom: '7.0',
            monthTo: '12',
            personMonths: 2,
            employee: null,
            empty: false,
          },
      ],
    },
    {
      name: 'Nithin',
      contractFrom: '2021-04-15',
      contractTo: '2022-04-01',
      projects: [
        {
          projectId: '61241510',
          allocationType: 'Allocated-Working',
          account: "Nokia",
          startDate: '2024-04-01',
          endDate: '2024-06-30',
          monthFrom: '1',
          monthTo: '4',
          personMonths: 4,
          employee: null,
          empty: true,
        },
        {
          projectId: '61241511',
          allocationType: 'Reserved',
          account: "L&T CIT",
          startDate: '2024-07-01',
          endDate: '2024-09-30',
          monthFrom: '1',
          monthTo: '4',
          personMonths: 8,
          employee: null,
          empty: true,
        }
      ],
    },
    {
      name: 'Ritk',
      contractFrom: '2021-04-15',
      contractTo: '2022-04-01',
      projects: [
        {
          projectId: '61241512',
          allocationType: 'Allocated-Working',
          account: "Career",
          startDate: '2024-04-01',
          endDate: '2024-06-30',
          monthFrom: '1',
          monthTo: '4',
          personMonths: 5,
          employee: null,
          empty: true,
        },
        {
          projectId: 'somerandom',
          allocationType: 'Available',
          account: null,
          startDate: '2024-07-01',
          endDate: '2024-09-30',
          monthFrom: '1',
          monthTo: '4',
          personMonths: 2,
          employee: null,
          empty: true,
        },
        {
          projectId: '61241514',
          allocationType: 'Allocated-Working',
          account: "Honda",
          startDate: '2024-10-01',
          endDate: '2024-12-31',
          monthFrom: '1',
          monthTo: '4',
          personMonths: 5,
          employee: null,
          empty: true,
        }
      ],
    },
    {
      name: 'Sai',
      contractFrom: '2021-10-01',
      contractTo: '2024-09-01',
      projects: [
        {
          projectId: '61241520',
          allocationType: 'Allocated-Available',
          account: null,
          startDate: '2024-04-01',
          endDate: '2025-01-01',
          monthFrom: '1',
          monthTo: '4',
          personMonths: 4,
          employee: null,
          empty: true,
        }
      ],
    },
  ];
  
const labels = data.map(item => item.name);
const colors_bg = ['#595959', '#ff0000', '#00b0f0', '#70ad47', '#ffc000']; // Assign colors for each project label
const projects = data.reduce((result, item) => {
    item.projects.forEach(prj => {
      const prjId = prj.projectId;
      if (!result[prjId]) {
        const labelIndex = projectNames.indexOf(prj.allocationType);
        result[prjId] = {
          label: prj.allocationType,
          data: Array(data.length).fill(0),
          backgroundColor: colors_bg[labelIndex] || '#000000', // Default to black if label not found
          account: prj.account, // Add account to the project data
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
    indexAxis: 'y', // Change to horizontal
    barThickness: 30, // Adjust bar thickness
    scales: {
      x: {
        stacked: true,
        position: 'top', // Position x-axis on top
        ticks: {
          callback: function(value) {
            const months = [
              'Apr 2024', 'May 2024', 'Jun 2024', 'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024', 
              'Jan 2025', 'Feb 2025', 'Mar 2025'
            ];
            return months[value] || value;
          },
          stepSize: 1,
          maxRotation: 0, // Prevent label rotation
          autoSkip: false, // Prevent auto-skipping of labels
          font: {
            size: 10, // Adjust font size
          },
        },
        grid: {
          display: false, // Hide grid lines
        },
      },
      y: {
        stacked: true,
        barPercentage: 0.5, // Reduce spacing between bars
        ticks: {
          padding: 0, // Reduce spacing between y-axis labels
          callback: function(value, index, values) {
            return labels[index]; // Display only the names on the y-axis
          },
        },
        grid: {
          display: false, // Hide grid lines
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Hide legend
      },
      datalabels: {
        display: function(context) {
          return context.dataset.account !== null && context.dataset.data[context.dataIndex] > 0; // Display label only if account is not null and data is greater than 0
        },
        formatter: function(value, context) {
          return context.dataset.account; // Display account name
        },
        color: 'white', // Set label color
        anchor: 'center', // Position label in the center of the bar
        align: 'center', // Align label in the center of the bar
      },
    },
  };
/* 
function StackedBarChart({ color, title, description, chart }) {
  const { data, options } = configs(chart.labels || [], chart.datasets || {});

  return (
    <MDBox mt={4.5}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MDBox padding="1rem" sx={{ height: "400px" }}>  
            {useMemo(
              () => (
                <MDBox
                  variant="gradient"
                  bgColor={color}
                  borderRadius="lg"
                  coloredShadow={color}
                  pt={3} px={2}
                  sx={{ height: "100%" }} 
                >
                  <div style={{ width: '100%', height: '100%', overflowX: 'auto' }}>
                    <Bar data={data} options={options} redraw />
                  </div>
                </MDBox>
              ),
              [color, chart]
            )}
          </MDBox>
        </Grid>
      </Grid>
    </MDBox>
  );
}

function StackedBarChart({ chartData, options }) {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
  
    useEffect(() => {
      const ctx = chartRef.current.getContext('2d');
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      chartInstanceRef.current = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: options,
        plugins: [ChartDataLabels], // Add the datalabels plugin
      });
      return () => {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }
      };
    }, [chartData, options]);
  
    return (
      <div>
        <canvas ref={chartRef} />
      </div>
    );
  }



  StackedBarGraph.propTypes = {
    chartData: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
  };
  
*/

  const StackedBarChart = () => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
  
    useEffect(() => {
      const ctx = chartRef.current.getContext('2d');
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      chartInstanceRef.current = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: options,
        plugins: [ChartDataLabels], // Add the datalabels plugin
      });
      return () => {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }
      };
    }, []);
  
    return <canvas ref={chartRef} style={{ width: '100vw', height: '100vh' }} />;
  };
  
export default StackedBarChart;
