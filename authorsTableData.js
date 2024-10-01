import React, { useState, useEffect } from "react"; 
import MDBox from "components/MDBox"; 
import MDTypography from "components/MDTypography"; 
import MDAvatar from "components/MDAvatar"; 
import MDBadge from "components/MDBadge"; 
import EditModal from './EditModal'; // Import the modal component

const API_URL = "http://127.0.0.1:8000/getAll/"; 

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
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDeveloper, setSelectedDeveloper] = useState(null);

    const handleOpenModal = (developer) => {
        setSelectedDeveloper(developer);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedDeveloper(null);
    };

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
                        <MDTypography 
                            component="a" 
                            href="#" 
                            variant="caption" 
                            color="text" 
                            fontWeight="medium" 
                            onClick={() => handleOpenModal(item)}
                        > 
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

    return (
        <>
            <EditModal 
                open={modalOpen} 
                handleClose={handleCloseModal} 
                developer={selectedDeveloper} 
            />
            <MDBox>
                {/* Your table rendering logic here */}
                {filteredRows.map((row, index) => (
                    <MDBox key={index} display="flex" alignItems="center" justifyContent="space-between">
                        <MDBox>{row.name}</MDBox>
                        <MDBox>{row.bandwidthType}</MDBox>
                        <MDBox>{row.skill}</MDBox>
                        <MDBox>{row.startDate}</MDBox>
                        <MDBox>{row.endDate}</MDBox>
                        <MDBox>{row.account}</MDBox>
                        <MDBox>{row.action}</MDBox>
                    </MDBox>
                ))}
            </MDBox>
        </>
    ); 
}
