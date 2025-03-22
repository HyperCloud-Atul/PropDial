import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const MyColumnChart = () => {
    const data = [
        { name: 'Nov', Electricity: 5000 },
        { name: 'Dec', Electricity: 2000 },
        { name: 'Jan', Electricity: 5002 },
        { name: 'Feb', Electricity: 500 },
        { name: 'Mar', Electricity: 200 },
        { name: 'Apr', Electricity: 1500 },       
    ];
    return (
        <div className='chart_card column_chart_card'>
            <h3 className="title">
                Electricity Bill Of Last 6 Month
            </h3>
            <br></br>
            <div style={{ width: '100%' }} className=''>
                <BarChart width={420} height={300} data={data} className=" graph_container">
                    {/* <CartesianGrid strokeDasharray="" /> */}
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Electricity" fill="#008080" />
                </BarChart>

            </div> </div>
    )
}

export default MyColumnChart
