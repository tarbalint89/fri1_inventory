import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from "../components/Layout/Layout";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import { useSession } from "../globalStates/session.state";
import { useNavigate } from "react-router-dom";

const AddScrapMobile = () => {
    const navigate = useNavigate();
    const [sessionState, sessionAction] = useSession();
    const [formData, setFormData] = useState({
        model: '',
        imei: '',
        serial_number: '',
        comment: '',
        assignedTo: '',
        created_at: new Date().toISOString().split('T')[0],  // Assuming you want the current date for creation
        scrapedDate: new Date().toISOString().split('T')[0],  // Assuming you want the current date for scrap
    });
    const [userOptions, setUserOptions] = useState([]);

    useEffect(() => {
        if (!sessionState.name) {
            axios.post(`api/Layout/get_session_data.php`).then(res => {
                if (res.data.errors === 0) {
                    sessionAction.setSession(res.data.session_data);
                } else {
                    navigate("/login");
                }
            });
        }

        axios.get(`api/GetAllUsers.php`)
            .then(res => {
                if (res.data.success && Array.isArray(res.data.users)) {
                    setUserOptions(res.data.users.map(user => user.email));
                }
            })
            .catch(err => console.error("Failed to fetch users:", err));
    }, [sessionAction, navigate, sessionState.name]);

    const handleChange = (event, value, fieldName) => {
        if (fieldName) {
            setFormData({ ...formData, [fieldName]: value });
        } else if (event.target.name && event.target.value !== undefined) {
            setFormData({ ...formData, [event.target.name]: event.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'api/addScrapMobile.php',  // Adjust your API endpoint accordingly
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Form Data Submitted:', formData);

            if (response.data.success) {
                alert('Submission Successful');
                setFormData({
                    model: '',
                    imei: '',
                    serial_number: '',
                    comment: '',
                    assignedTo: '',
                    created_at: new Date().toISOString().split('T')[0],  // Reset to current date
                    scrapedDate: new Date().toISOString().split('T')[0],  // Reset to current date
                });
            } else if (response.data.error) {
                alert('Submission Failed: ' + response.data.error);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to submit form. Please try again later.');
        }
    };

const models = ['Samsung A54', 'iPhone SE', 'Samsung A53', 'Samsung Tab S8', 'Samsung A55', 'Samsung S24', 'Samsung S23'];

    return (
        <Layout>
            <h1 className="text-center font-semibold p-3 text-4xl">Scraped Mobile</h1>
            <div className="flex justify-center">
                <form onSubmit={handleSubmit} className="w-full max-w-lg">
                    <div className="w-full px-3 mb-6">
                        <Autocomplete
                            freeSolo
                            options={userOptions}
                            value={formData.assignedTo}
                            onChange={(event, newValue) => {
                                handleChange(event, newValue, 'assignedTo');
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Last Assigned To"
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                        />
                    </div>
                    <div className="w-full px-3 mb-6">
                        <Autocomplete
                            freeSolo
                            options={models}
                            value={formData.model}
                            onChange={(event, newValue) => {
                                handleChange(event, newValue, 'model');
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Model"
                                    variant="outlined"
                                    name="model"
                                    fullWidth
                                    required
                                />
                            )}
                        />
                    </div>
                    <div className="w-full px-3 mb-6">
                        <TextField
                            label="IMEI"
                            variant="outlined"
                            name="imei"
                            value={formData.imei}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </div>
                    <div className="w-full px-3 mb-6">
                        <TextField
                            label="Serial Number"
                            variant="outlined"
                            name="serial_number"
                            value={formData.serial_number}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </div>
                    <div className="w-full px-3 mb-6">
                        <TextField
                            label="Comment"
                            variant="outlined"
                            name="comment"
                            multiline
                            rows={4}
                            value={formData.comment}
                            onChange={handleChange}
                            fullWidth
                        />
                    </div>
                    <div className="w-full px-3 mb-6">
                        <TextField
                            label="Created At"
                            type="date"
                            variant="outlined"
                            name="created_at"
                            value={formData.created_at}
                            onChange={handleChange}
                            fullWidth
                            required
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </div>
                    <div className="w-full px-3 mb-6">
                        <TextField
                            label="Scraped Date"
                            type="date"
                            variant="outlined"
                            name="scrapedDate"
                            value={formData.scrapedDate}
                            onChange={handleChange}
                            fullWidth
                            required
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </div>
                    <div className="flex justify-center mt-6 mb-6">
                        <Button variant="contained" type="submit" color="primary">
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}

export default AddScrapMobile;