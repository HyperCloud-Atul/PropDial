import React from 'react'
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';

const MyPieChart = () => {
    const data = [
        { name: 'cancel', sales: 40, fill: '#f5f5f5' },
        { name: 'done', sales: 60, fill: '#008000' },

    ];

    return (
        <div className='chart_card column_chart_card'>
            <h3 className="title">
                PMS
            </h3>
            <br></br>
            <div style={{ width: '100%' }} className=''>
                <PieChart width={420} height={250}>
                
                    <Pie
                       dataKey="sales"
                       data={data} 
                       nameKey="name"
                       cx="50%"
                       cy="50%" 
                        innerRadius={60} // Increase the innerRadius to add space between segments
                        outerRadius={90} // Decrease the outerRadius to give a 3D look
                        label={false} 
                        className="graph_container"
                    >
                         {
                            data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)
                        }
                    </Pie>
                    <Tooltip />
                    {/* <Legend /> */}
                </PieChart>

            </div> </div>
    )
}

export default MyPieChart
