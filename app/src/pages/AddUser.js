import React, { useState } from 'react';
import axios from 'axios';
import Layout from "../components/Layout/Layout";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import { useNavigate } from "react-router-dom";

const departments = [
    "Werksleitung", "Qualitätsanalyse", "GEEDS eCAD SL HCC", "CIM Vorgesetzter", "Produktionsplanung",
    "HSE", "Verwaltung Allg.", "Verwaltung ETW", "Einkauf Site", "Vert./VK ern. Fakt.",
    "Fertigungssteuerung", "Hardware", "Konst. & Design", "Kunststoffspritzerei", "Projektbüro",
    "Akustik", "Platform SW Engineer", "Qualitätssicherung S", "Finanzwesen Site", "Validierung",
    "Verfahrenstech P0/P1", "Software-Engineers", "Verwaltung Lieferket", "P2 / P3 Entwicklung",
    "Instandhaltung Köppe", "Projektqualität", "Vertrieb / Verkauf", "GEEDS CEM SL HCC",
    "Informationsystem", "DSIS", "VPS / P0", "Unternehmensleit. PL", "Software-Architects",
    "Anlagentechnik", "Software", "Software-Integration", "MES Methoden", "Process PTM",
    "Finanzwesen PL", "SMD-Bestückung", "Testing", "Tech. Projektleitung", "Versand",
    "Personalwesen Site", "Methoden Serienprod.", "Flexible Produktion", "Lager & Warenannahme",
    "Vormontage Telematik", "Endmontage Telematik", "Qualitätssicherung P", "Instandhaltung Fried",
    "Fuhrpark", "Projekteinkauf", "Software-Test", "Auszubil./Ausbildung", "DSIS Friedrichsdorf","Other"
];

const AddUser = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        department: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('api/addUsers.php', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Form Data Submitted:', formData);

            if (response.data.success) {
                alert(response.data.success );
                setFormData({
                    email: '',
                    department: ''
                });
                // navigate("/pathToSomePage"); // Optional: Navigate to another page upon success
            } else if (response.data.error) {
                alert(response.data.error);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to submit form. Please try again later.');
        }
    };

    return (
        <Layout>
            <h1 className="text-center font-semibold p-3 text-4xl">Add User</h1>
            <div className="flex justify-center">
                <form onSubmit={handleSubmit} className="w-full max-w-lg">
                    <div className="w-full px-3 mb-6">
                        <TextField
                            label="Email"
                            variant="outlined"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            fullWidth
                            required
                        />
                    </div>
                    <div className="w-full px-3 mb-6">
                        <Autocomplete
                            options={departments}
                            getOptionLabel={(option) => option}
                            renderInput={(params) => 
                                <TextField 
                                    {...params} 
                                    label="Department" 
                                    variant="outlined" 
                                    required 
                                />}
                            value={formData.department}
                            onChange={(event, newValue) => {
                                setFormData({ ...formData, department: newValue });
                            }}
                            fullWidth
                        />
                    </div>
                    <div className="flex justify-center mt-6">
                        <Button variant="contained" type="submit" color="primary">
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}

export default AddUser;
