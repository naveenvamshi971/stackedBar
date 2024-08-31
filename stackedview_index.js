import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import StackedBarChart from "examples/Charts/BarCharts/StackedBarChart";

import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import DataTable from "examples/Tables/DataTable";
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import authorsTableData from "layouts/tables/data/authorsTableData";
import { pink } from '@mui/material/colors';

const { columns, rows } = authorsTableData();
let projectNames = ['Allocated-Working', 'NotAllocated-Working', 'Allocated-Available', 'Available', 'Reserved'];
const colors_bg = ['#595959', '#ff0000', '#00b0f0', '#70ad47', '#ffc000']; // Assign colors for each project label

function StackedView() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} md={6} lg={2.4}>
          <MDBox mb={1.5}> {/* Adjusted margin-bottom */}
            <ComplexStatisticsCard
              icon="people"
              title="Allocated-Working"
              count={30}
              sx={{ color: '#595959',  backgroundColor: '#FFFFFF'}}
            />
          </MDBox>
        </Grid>
        <Grid item xs={12} md={6} lg={2.4}>
          <MDBox mb={1.5}> {/* Adjusted margin-bottom */}
            <ComplexStatisticsCard 
              sx={{ color: '#ff0000' , backgroundColor: '#FFFFFF'}}
              icon="people" 
              title="NotAllocated-Working" 
              count="20" 
            />
          </MDBox>
        </Grid>
        <Grid item xs={12} md={6} lg={2.4}>
          <MDBox mb={1.5}> {/* Adjusted margin-bottom */}
            <ComplexStatisticsCard 
              icon="people" 
              title="Allocated-Available" 
              count="5" 
              sx={{ color: '#00b0f0', backgroundColor: '#FFFFFF'}}

            />
          </MDBox>
        </Grid>
        <Grid item xs={12} md={6} lg={2.4}>
          <MDBox mb={1.5}> {/* Adjusted margin-bottom */}
            <ComplexStatisticsCard 
              color="dark"
              icon="people" 
              title="Available" 
              count="5" 
              sx={{ color: '#70ad47',  backgroundColor: '#FFFFFF'}}

            />
          </MDBox>
        </Grid>
        <Grid item xs={12} md={6} lg={2.4}>
          <MDBox mb={1.5}> {/* Adjusted margin-bottom */}
            <ComplexStatisticsCard
              color="primary"
              icon="person_add"
              title="Reserved"
              count="10"
              sx={{ color: '#ffc000', backgroundColor: '#FFFFFF'}}

            />
          </MDBox>
        </Grid>
      </Grid>
        

        {/* Allocation Stacked Bar Chart */}
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MDBox mb={3}>
                <StackedBarChart
                  color="info"
                  title="website views"
                  description="Last Campaign Performance"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>


      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default StackedView;
