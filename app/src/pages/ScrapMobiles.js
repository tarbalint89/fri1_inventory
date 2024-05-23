import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from "../components/Layout/Layout";
import AddScrapMobile from './AddScrapMobile';

const ScrapMobiles = () => {
    const [mobiles, setMobiles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/getScrapMobiles.php')
            .then(response => response.json())
            .then(data => setMobiles(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleAddScrapMobile = () => {
        navigate('/AddScrapMobile'); // Navigate to the AddScrapMobile component
    };

    return (
        <Layout>

                <button 
                    onClick={handleAddScrapMobile}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-3 rounded  my-2 mx-2"
                >
                    Add Scrap 
                </button>
            <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-200">
                        <tr>
                            
                            <th className="px-4 py-2">Model</th>
                            <th className="px-4 py-2">IMEI</th>
                            <th className="px-4 py-2">Serial Number</th>
                            <th className="px-4 py-2">Comment</th>
                            <th className="px-4 py-2">Created At</th>
                            <th className="px-4 py-2">Last Assigned To</th>
                            <th className="px-4 py-2">Scraped Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mobiles.map(mobile => (
                            <tr key={mobile.id} className="text-sm">
                               
                                <td className="border px-4 py-2">{mobile.model}</td>
                                <td className="border px-4 py-2">{mobile.imei}</td>
                                <td className="border px-4 py-2">{mobile.serial_number}</td>
                                <td className="border px-4 py-2">{mobile.comment}</td>
                                <td className="border px-4 py-2">{mobile.created_at.date}</td>
                                <td className="border px-4 py-2">{mobile.assignedTo}</td>
                                <td className="border px-4 py-2">{mobile.scrapedDate.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}

export default ScrapMobiles;
