
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import Icon from '@mui/material/Icon';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

function ComplexStatisticsCard({ color, title, count, percentage, icon, sx }) {
  return (
    <Card>
      <MDBox display="flex" alignItems="center" justifyContent="space-between" pt={1} px={2}>
        {/* Icon Container */}
        <MDBox
          sx={{
            backgroundColor: color,
            color: color === "light" ? "dark" : "white",
            borderRadius: "xl",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "2.5rem", // Adjust width to reduce space
            height: "2.5rem", // Adjust height to match width
            mt: -3,
            ...sx, // Apply additional styles from sx prop
          }}
        >
          <Icon fontSize="inherit" color="inherit" style={{ fontSize: "1.5rem" }}>
            {icon}
          </Icon>
        </MDBox>
        {/* Text Container */}
        <MDBox
          sx={{
            textAlign: "right",
            lineHeight: 1.25,
            flex: 1,
            overflow: "hidden", // Ensure text does not overflow
          }}
        >
          <MDTypography
            variant="button"
            fontWeight="light"
            color="text"
            noWrap // Prevent text wrapping
            sx={{ fontSize: "0.7rem" }} // Reduce font size of the title
          >
            {title}
          </MDTypography>
          <MDTypography variant="h4">{count}</MDTypography>
        </MDBox>
      </MDBox>
      <MDBox pb={1} px={1}>
        <MDTypography component="p" variant="button" color="text" display="flex">
          <MDTypography
            component="span"
            variant="button"
            fontWeight="bold"
            color={percentage.color}
          >
            {percentage.amount}
          </MDTypography>
          {percentage.label}
        </MDTypography>
      </MDBox>
    </Card>
  );
}

// Setting default values for the props of ComplexStatisticsCard
ComplexStatisticsCard.defaultProps = {
  color: "info",
  percentage: {
    color: "success",
    text: "",
    label: "",
  },
  sx: {}, // Default empty object for sx prop
};

// Typechecking props for the ComplexStatisticsCard
ComplexStatisticsCard.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  percentage: PropTypes.shape({
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "white",
    ]),
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.string,
  }),
  icon: PropTypes.node.isRequired,
  sx: PropTypes.object, // Prop type for sx prop
};

export default ComplexStatisticsCard;
