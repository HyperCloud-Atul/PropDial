import { Link } from 'react-router-dom'
// import Avatar from '../components/Avatar'
// import AddBill from '../pages/create/AddBill'
// import { useNavigate } from 'react-router-dom'
import { numberFormat } from './NumberFormat'

// styles
import './BillList.css'

// const numberFormat = new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "INR",
// });


export default function BillList({ bills }) {
    // console.log('properties: ', properties)

    // const navigate = useNavigate();



    return (
        <>
            {/* <div className='row no-gutters'> */}
            {bills.length === 0 && <p>No Bills Yet!</p>}
            <div div className="row no-gutters" >
                {
                    bills.map(bill => (<>
                        {/* <Link to={`/bills/${bill.id}`} key={bill.id} style={{ textDecoration: 'none' }} > */}
                        <div className="col-lg-6 col-md-12 col-sm-12" style={{ padding: '10px' }}>
                            <div className="default-card">
                                {bill.status === 'pending' &&
                                    <div className={"bill-type " + bill.billType.toLowerCase()}>
                                        <h5>{bill.status}</h5>
                                    </div>
                                }
                                <div className='default-card-inner'>
                                    <div style={{ textAlign: 'left' }}>
                                        <h6>{bill.billType}</h6>
                                        <h1 style={{ color: 'var(--red-color)' }}>
                                            {numberFormat.format(bill.billTotalAmount)}
                                        </h1>
                                        <h3>Due Date :{bill.billDueDate.toDate().toDateString()}</h3>
                                        {/* <h4>Due Date Exceeded : ₹100</h4> */}

                                    </div>
                                    <div>
                                        <h6>Details</h6>
                                        <h3 style={{ color: 'var(--blue-color)' }}>{bill.billDetails}</h3>


                                    </div>
                                </div>
                                <div className='default-card-inner'>
                                    {/* <button className="btn info">Details</button> */}
                                    <div></div>
                                    <button className="btn">Pay Now</button>
                                </div>
                            </div>
                        </div>




                        {/* </Link > */}
                    </>
                    ))
                }
            </div >
            {/* </div > */}
        </>
    )
}
