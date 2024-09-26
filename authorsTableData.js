/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import React, { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";

// Update this URL to your Django REST API endpoint
const API_URL = "http://127.0.0.1:8000/getAll/";

export default function Data() {
    const [filters, setFilters] = useState({
        author: "",
        bandwidthType: "",
        skill: "",
        startDate: "",
        endDate: "",
        account: ""
    });
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);

    const Author = ({ image, name, email }) => (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
            <MDAvatar src={image} name={name} size="sm" />
            <MDBox ml={2} lineHeight={1}>
                <MDTypography display="block" variant="button" fontWeight="medium">
                    {name}
                </MDTypography>
                <MDTypography variant="caption">{email}</MDTypography>
            </MDBox>
        </MDBox>
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(API_URL);
                const data = await response.json();
                const formattedData = data.map(item => ({
                    name: <Author image={`data:image/jpeg;base64,${item.Photo}`} name={item.Name} email={item.Email} />,
                    bandwidthType: item.BandWidthType,
                    skill: item.Skill,
                    startDate: item.StartDate,
                    endDate: item.EndDate,
                    account: item.AccountName,
                    action: (
                        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
                            Edit
                        </MDTypography>
                    ),
                }));
                setRows(formattedData);
                setFilteredRows(formattedData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            setFilteredRows(rows.filter(row => {
                const name = row.name?.props.name || '';
                const bandwidthType = row.bandwidthType || '';
                const skill = row.skill || '';
                const startDate = row.startDate || '';
                const endDate = row.endDate || '';
                const account = row.account || '';
                const matchesName = name.toLowerCase().includes(filters.author.toLowerCase());
                const matchesBandwidthType = bandwidthType.toLowerCase().includes(filters.bandwidthType.toLowerCase());
                const matchesSkill = skill.toLowerCase().includes(filters.skill.toLowerCase());
                const matchesStartDate = startDate.toLowerCase().includes(filters.startDate.toLowerCase());
                const matchesEndDate = endDate.toLowerCase().includes(filters.endDate.toLowerCase());
                const matchesAccount = account.toLowerCase().includes(filters.account.toLowerCase());
                return (
                    matchesName &&
                    matchesBandwidthType &&
                    matchesSkill &&
                    matchesStartDate &&
                    matchesEndDate &&
                    matchesAccount
                );
            }));
        }, 300); // Debounce delay
        return () => {
            clearTimeout(handler);
        };
    }, [filters, rows]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    return {
        columns: [
            {
                Header: () => (
                    <MDBox display="flex" flexDirection="column">
                        <MDTypography variant="button" fontWeight="medium">Name</MDTypography>
                        <input
                            type="text"
                            name="author"
                            placeholder="Filter by name"
                            value={filters.author}
                            onChange={handleFilterChange}
                            style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                            onFocus={(e) => e.target.select()} // Keep focus on input
                        />
                    </MDBox>
                ),
                accessor: "name",
                align: "left",
            },
            {
                Header: () => (
                    <MDBox display="flex" flexDirection="column">
                        <MDTypography variant="button" fontWeight="medium">Bandwidth Type</MDTypography>
                        <input
                            type="text"
                            name="bandwidthType"
                            placeholder="Filter by bandwidth type"
                            value={filters.bandwidthType}
                            onChange={handleFilterChange}
                            style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                            onFocus={(e) => e.target.select()} // Keep focus on input
                        />
                    </MDBox>
                ),
                accessor: "bandwidthType",
                align: "left",
            },
            {
                Header: () => (
                    <MDBox display="flex" flexDirection="column">
                        <MDTypography variant="button" fontWeight="medium">Skill</MDTypography>
                        <input
                            type="text"
                            name="skill"
                            placeholder="Filter by skill"
                            value={filters.skill}
                            onChange={handleFilterChange}
                            style={{ width: '100px', padding: '5px', marginTop: '5px' }}
                            onFocus={(e) => e.target.select()} // Keep focus on input
                        />
                    </MDBox>
                ),
                accessor: "skill",
                align: "left",
            },
            {
                Header: () => (
                    <MDBox display="flex" flexDirection="column">
                        <MDTypography variant="button" fontWeight="medium">Start Date</MDTypography>
                        <input
                            type="text"
                            name="startDate"
                            placeholder="Filter by start date"
                            value={filters.startDate}
                            onChange={handleFilterChange}
                            style={{ width: '120px', padding: '5px', marginTop: '5px' }}
                            onFocus={(e) => e.target.select()} // Keep focus on input
                        />
                    </MDBox>
                ),
                accessor: "startDate",
                align: "center",
            },
            {
                Header: () => (
                    <MDBox display="flex" flexDirection="column">
                        <MDTypography variant="button" fontWeight="medium">End Date</MDTypography>
                        <input
                            type="text"
                            name="endDate"
                            placeholder="Filter by end date"
                            value={filters.endDate}
                            onChange={handleFilterChange}
                            style={{ width: '120px', padding: '5px', marginTop: '5px' }}
                            onFocus={(e) => e.target.select()} // Keep focus on input
                        />
                    </MDBox>
                ),
                accessor: "endDate",
                align: "center",
            },
            {
                Header: () => (
                    <MDBox display="flex" flexDirection="column">
                        <MDTypography variant="button" fontWeight="medium">Account</MDTypography>
                        <input
                            type="text"
                            name="account"
                            placeholder="Filter by account"
                            value={filters.account}
                            onChange={handleFilterChange}
                            style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                            onFocus={(e) => e.target.select()} // Keep focus on input
                        />
                    </MDBox>
                ),
                accessor: "account",
                align: "left",
            },
            {
                Header: "Action",
                accessor: "action",
                align: "center",
            },
        ],
        rows: filteredRows.length > 0 ? filteredRows : rows,
    };
}
