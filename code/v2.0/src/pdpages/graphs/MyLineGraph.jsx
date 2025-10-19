import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


import './Graphs.scss'
const MyLineGraph = () => {
    const data = [
        { name: 'Nov', Brokerage: 70 },
        { name: 'Dec', Brokerage: 20 },
        { name: 'Jan', Brokerage: 62 },
        { name: 'Feb', Brokerage: 79 },
        { name: 'Mar', Brokerage: 2 },
        { name: 'Apr', Brokerage: 56 },      

    ];
    return (
        <div className='chart_card line_chart_card'>
            <h3 className="title">
                Brokerage Payment Of Last 6 Month
            </h3>
            <br></br>
            <div style={{ width: '100%' }} className=''>
                <LineChart width={420} height={300} data={data} className=" graph_container">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Brokerage" stroke="#0865f8" strokeWidth={4} activeDot={{ r: 10, fill: '#f12711', }}
                    />
                </LineChart>

            </div>




        </div>
    )
}

export default MyLineGraph
