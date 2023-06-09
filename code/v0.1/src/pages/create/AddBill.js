import { useState, useEffect } from 'react'
import { useCollection } from '../../hooks/useCollection'
import { useAuthContext } from '../../hooks/useAuthContext'
import { timestamp } from '../../firebase/config'
import { useFirestore } from '../../hooks/useFirestore'
import { useDocument } from '../../hooks/useDocument'
import Select from 'react-select'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import DatePicker from 'react-datepicker';
import Avatar from '../../components/Avatar'

// styles
import './AddBill.css'
import { el } from 'date-fns/locale'

export default function AddBill(props) {
    const { state } = useLocation()
    const { propertyid } = state
    const navigate = useNavigate()
    const { addDocument, response } = useFirestore('bills')
    const { document: property, error: propertyerror } = useDocument('properties', propertyid)
    const { document: masterDataBillType, error: masterDataBillTyperror } = useDocument('master', 'BILLTYPE')

    const { user } = useAuthContext()
    const { documents } = useCollection('users')
    const [users, setUsers] = useState([])
    const [toggleFlag, setToggleFlag] = useState(false)

    // form field values
    // const [propertyid, setPropertyID] = useState('')
    const [billSubject, setBillSubject] = useState('')
    const [billDetails, setBillDetails] = useState('')
    // const [billPayer, setBillPayer] = useState([])  
    // const [assignedUser, setAssignedUser] = useState([])      
    const [billType, setBillType] = useState('')
    const [billAmount, setBillAmount] = useState(0)
    const [agencyCommissionAmount, setAgencyCommissionAmount] = useState(0)
    const [taxAmount, setTaxAmount] = useState(0)
    const [adjustmentAmount, setAdjustmentAmount] = useState(0)
    const [billTotalAmount, setBillTotalAmount] = useState(0)
    const [status, setStatus] = useState('pending')
    const [billDueDate, setBillDueDate] = useState(new Date())
    const [formError, setFormError] = useState(null)
    const [billTypeOptionsSorted, setbillTypeOptionsSorted] = useState(null);

    // const [billTypeOptions, setBillTypeOptions] = useState(null);

    let billTypeOptions;
    if (masterDataBillType) {
        billTypeOptions = masterDataBillType.data.map(billTypeData => ({
            label: billTypeData.toUpperCase(),
            value: billTypeData
        }))
    }

    // create user values for react-select
    useEffect(() => {

        if (documents) {
            setUsers(documents.map(user => {
                var userDetails = user.displayName + '(' + user.roles + ')';
                // console.log('userDetails:', userDetails)
                return { value: { ...user, id: user.id }, label: userDetails }
            }))
        }

        if (billTypeOptions) {
            setbillTypeOptionsSorted(billTypeOptions.sort((a, b) =>
                a.label.localeCompare(b.label)
            ));
        }

    }, [documents, billTypeOptions])

    const usersSorted = users.sort((a, b) =>
        a.label.localeCompare(b.label)
    );

    const billAmountAdded = async (val) => {
        setBillAmount(val)
        let total = (Number(val) + Number(agencyCommissionAmount) + Number(taxAmount)) + Number(adjustmentAmount);
        setBillTotalAmount(total);
    }

    const agencyCommissionAmountAdded = async (inputval) => {
        setAgencyCommissionAmount(inputval)
        let total = (Number(billAmount) + Number(inputval) + Number(taxAmount)) + Number(adjustmentAmount);
        setBillTotalAmount(total);
    }

    const taxAmountAdded = async (inputval) => {
        setTaxAmount(inputval)
        let total = (Number(billAmount) + Number(agencyCommissionAmount) + Number(inputval)) + Number(adjustmentAmount);
        setBillTotalAmount(total);
    }

    const adjustmentAmountAdded = async (inputval) => {
        setAdjustmentAmount(inputval)
        let total = Number(billAmount) + Number(agencyCommissionAmount) + Number(taxAmount) + Number(inputval);
        setBillTotalAmount(total);
    }

    // const billAmountAdded = async (val) => {

    //     console.log('billTotalCalulation')
    //     setBillAmount(val)
    //     setAgencyCommissionAmount(val)
    //     setTaxAmount(val)
    //     setAdjustmentAmount(val)

    //     let total = (billAmount + agencyCommissionAmount + taxAmount) - adjustmentAmount;
    //     setBillTotalAmount(total);
    // }

    const billTotalCalculation = async (val) => {

        console.log('billTotalCalulation')
        setBillAmount(val)
        setAgencyCommissionAmount(val)
        setTaxAmount(val)
        setAdjustmentAmount(val)

        let total = (Number(billAmount) + Number(agencyCommissionAmount) + Number(taxAmount)) - Number(adjustmentAmount);
        setBillTotalAmount(total);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError(null)

        // if (!category) {
        //     setFormError('Please select a property category.')
        //     return
        // }
        // if (billPayer.length < 1) {
        //     setFormError('Please assign the bill to at least 1 user')
        //     return
        // }

        // property.assignedUsersList

        // const billPayerList = billPayer.map(u => {
        //     return {
        //         displayName: u.value.displayName,
        //         photoURL: u.value.photoURL,
        //         id: u.value.id
        //     }
        // })

        // const assignedUsersList = assignedUser.map(u => {
        //     return {
        //         displayName: u.value.displayName,
        //         photoURL: u.value.photoURL,
        //         id: u.value.id
        //     }
        // })

        const bill = {
            propertyid,
            billSubject,
            billDetails,
            // billPayerList,
            taggedUsersList: property.taggedUsersList,
            billType: billType.label,
            billAmount,
            agencyCommissionAmount,
            taxAmount,
            adjustmentAmount,
            billTotalAmount,
            status,
            billDueDate: timestamp.fromDate(new Date(billDueDate))
        }

        await addDocument(bill)
        console.log('addDocument:', bill)
        if (!response.error) {
            navigate('/')
        }
    }

    return (
        <div>


            <div className='page-title'>
                <span className="material-symbols-outlined">
                    real_estate_agent
                </span>
                <h1>Add Bill </h1>
            </div>

            <div style={{ overflow: 'hidden' }}>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="row no-gutters">
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div>
                                <h1 className="owner-heading">Bill Type</h1>
                                <div className="">
                                    <Select className=''
                                        onChange={(option) => setBillType(option)}
                                        options={billTypeOptionsSorted}
                                        value={billType}
                                        styles={{
                                            control: (baseStyles, state) => ({
                                                ...baseStyles,
                                                outline: 'none',
                                                background: '#eee',
                                                borderBottom: ' 1px solid var(--blue-color)'
                                            }),
                                        }}
                                    />
                                    {/* <div className="underline"></div> */}
                                    {/* <span className="material-symbols-outlined">
                                        public
                                    </span> */}
                                </div>
                            </div>

                            <div>
                                <br />
                                <h1 className="owner-heading">Bill Subject</h1>
                                <input
                                    required
                                    type="text"
                                    onChange={(e) => setBillSubject(e.target.value)}
                                    value={billSubject}
                                />
                            </div>

                            <div>
                                <br />
                                <h1 className="owner-heading">Bill Details</h1>
                                <input
                                    type="text"
                                    placeholder='you can put here the complete details'
                                    onChange={(e) => setBillDetails(e.target.value)}
                                    value={billDetails}
                                />
                            </div>

                            <div>
                                <br />
                                <h1 className="owner-heading">Bill Amount</h1>
                                <input
                                    required
                                    type="number"
                                    // onChange={(e) => setBillAmount(e.target.value)}
                                    onChange={(e) => billAmountAdded(e.target.value)}
                                    value={billAmount}
                                />
                            </div>

                            <div>
                                <br />
                                <h1 className="owner-heading">Agency Commission (if any)</h1>
                                <input
                                    required
                                    type="number"
                                    // onChange={(e) => setAgencyCommissionAmount(e.target.value)}
                                    onChange={(e) => agencyCommissionAmountAdded(e.target.value)}
                                    value={agencyCommissionAmount}
                                />
                            </div>

                            <div>
                                <br />
                                <h1 className="owner-heading">Tax (if any) </h1>
                                <input
                                    required
                                    type="number"
                                    // onChange={(e) => setTaxAmount(e.target.value)}
                                    onChange={(e) => taxAmountAdded(e.target.value)}
                                    value={taxAmount}
                                />
                            </div>

                            <div>
                                <br />
                                <h1 className="owner-heading">Adjustment (if any)</h1>
                                <input
                                    required
                                    type="number"
                                    // onChange={(e) => setAdjustmentAmount(e.target.value)}
                                    onChange={(e) => adjustmentAmountAdded(e.target.value)}
                                    value={adjustmentAmount}
                                />
                            </div>

                            <div>
                                <br />
                                <h1 className="owner-heading">Bill Total Amount</h1>
                                <input
                                    readOnly
                                    type="number"
                                    value={billTotalAmount}
                                />
                            </div>

                            <div>
                                <div className="">
                                    <h1 className="owner-heading">Bill Due Date</h1>
                                    <DatePicker
                                        selected={billDueDate}
                                        maxDate={new Date()}
                                        required
                                        onChange={(billDueDate) => setBillDueDate(billDueDate)}
                                    />
                                    <span className="material-symbols-outlined">
                                        calendar_month
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button className="btn">Add Bill</button>
                        {formError && <p className="error">{formError}</p>}
                    </div>
                    <br />
                </form>
            </div >
        </div >
    )
}

