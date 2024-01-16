import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert } from 'react-bootstrap';
import PhoneInput from 'react-phone-input-2';
import { useSignupPhone } from "../../../hooks/useSignupPhone";

// import css
import "./PropAgentLS.css";

const PropAgentSignup_running = () => {
    // Scroll to the top of the page whenever the location changes start
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    // Scroll to the top of the page whenever the location changes end

    // add and remove class
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [lurl, setLURL] = useState("/");
    const [isLogged, setIsLogged] = useState(false);
    const [loading, setLoading] = useState(false);
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [otp, setOtp] = useState("");
    const [flag, setFlag] = useState(false);
    const [confirmObj, setConfirmObj] = useState("");
    const [resendOTPFlag, setResendOTPFlag] = useState(false);
    const [counter, setCounter] = useState(30);
    const { setUpRecapcha, resendOTP } = useSignupPhone();
    const [sendOTPFlag, setSendOTPFlag] = useState(true);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    // add and remove class

    // floating label code
    const handleInputFocus = (event) => {
        const label = event.target.previousSibling;
        label.classList.add("focused");
    };

    const handleInputBlur = (event) => {
        const label = event.target.previousSibling;
        if (!event.target.value) {
            label.classList.remove("focused");
        }
    };
    // floating label code


    const handleSubmit = (e) => {
        navigate("/propagententerotp");
    };


    const getOTP = async (e) => {
        e.preventDefault();
        setError("");
        if (phone === '' || phone === undefined || phone.length < 10) {
            return setError("Please enter valid Phone Number");
        }
        // if (users.current && users.current.phoneNumber === ("+" + phone)) {
        //   setIsLogged(true);
        // }

        setSendOTPFlag(false);
        try {
            console.log('in try 1', phone);
            const respons = await setUpRecapcha('+' + phone);
            console.log('in try 2', respons);
            setConfirmObj(respons);
            setFlag(true);

        } catch (error) {
            console.log('2 error.message', error.message)
            setError(error.message);
            await resendOTP("+" + phone);
        }
    }

    const verifyOTP = async (e) => {
        e.preventDefault();
        setError("");
        console.log('in verifyOTP')
        setLoading(true);
        if (otp === "" || otp === undefined || otp === null) return;
        try {
            await confirmObj.confirm(otp).then(async (result) => {
                const user = result.user;
                console.log("user", user);

                // navigate("/");
                // console.log(url);
                //if existing users then navigate to requested URL, otherwise go to profile page
                //get user profile
                // await GetUserDetails(user.uid).then((data) => {
                //   console.log('user.uid : ', data);
                //   if (data.id === '0') {
                //     // if (true) {
                //     console.log('data : ', data, ' :: propsData.url : ', lurl);

                //     navigate('/NewRegistration', { state: { url: lurl } });
                //   } else {
                //     console.log('data : ', data);
                //     navigate(lurl);
                //   }

                //   console.log('data : ', data);

                //   setLoading(false);

                // });
            });

        } catch (error) {
            console.log('error.message', error.message)

            setError('Given OTP is not valid, please enter the valid OTP sent to your phone');
            setLoading(false);

            setTimeout(function () {
                setError("");
                setResendOTPFlag(true)
            }, 3000);
        }
    }
    let newArray = phone && phone.match(/^(91|)?(\d{3})(\d{3})(\d{4})$/)

    return (

        <>
            <div className='col-lg-6 col-md-6 col-sm-12'>


                {/* {console.log(users)} */}
                <div className="">
                    {error && <Alert variant='danger'>{error}</Alert>}
                    {<Form onSubmit={getOTP} style={{ display: !flag ? "block" : "none" }}>

                        <div className='mb-b' controlid='formBasicPhoneNumber'>

                            <PhoneInput
                                country={'in'}

                                // onlyCountries={['in', 'us']}
                                value={phone}
                                onChange={setPhone}
                                international
                                keyboardType="phone-pad"
                                // countryCallingCodeEditable={false}
                                countryCodeEditable={false}
                                // disableCountryCode={true}
                                placeholder="Enter Phone Number"
                                inputProps={{
                                    name: 'phone',
                                    required: true,
                                    autoFocus: true
                                }}
                            >
                            </PhoneInput>

                            <br />
                            <div id='recapcha-container'></div>
                        </div>
                        <div className='d-grid gap-2'>
                            <br />
                            {sendOTPFlag && <Button className='mybutton button5' style={{ width: '150px', height: '40px' }} type="submit">
                                Send OTP
                            </Button>}
                            <br></br>
                        </div>
                    </Form>
                    }
                    {
                        <>
                            <Form onSubmit={verifyOTP} style={{ display: flag ? "block" : "none" }}>

                                <div >
                                    {
                                    }
                                    <span style={{ fontSize: '1.1rem', color: '#ff5757' }} > OTP has been sent to phone #
                                        {newArray && newArray.length >= 5 ? +newArray[1] + '-' + newArray[2] + '-' + newArray[3] + '-' + newArray[4] : ''} </span>

                                </div>
                                <div className='txt_field'>
                                    <input type="number" required maxLength={6}
                                        onInput={(e) => {
                                            if (e.target.value.length > e.target.maxLength)
                                                e.target.value = e.target.value.slice(0, e.target.maxLength)
                                        }}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}>

                                    </input>
                                    <label htmlFor="">Enter OTP</label>

                                </div>
                                {<div className='d-grid gap-2'>
                                    {/* <Link to="/"> */}
                                    <div id='recapcha-container'></div>

                                    <button className="mybutton button5" style={{ width: '150px', height: '40px' }}>
                                        <div style={{ display: !loading ? 'block' : 'none' }}>
                                            <span
                                                style={{ paddingLeft: '8px', position: 'relative', top: '-1px', fontSize: '1rem' }}>Login</span>
                                        </div>
                                        <div className='btn-loading' style={{ display: loading ? 'block' : 'none' }}>
                                            <lottie-player id="btnSendOTPLoad"
                                                src="https://assets8.lottiefiles.com/packages/lf20_fiqoxpcg.json" background="transparent"
                                                speed="0.7" loop autoplay></lottie-player>
                                        </div>
                                    </button>
                                </div>}
                            </Form>

                            {resendOTPFlag && <div className='d-grid gap-2' onClick={async (e) => {
                                console.log('resend OTP')
                                setError('');
                                setOtp('');
                                // startTimer();
                                await resendOTP("+" + phone)
                            }
                            }>
                                <Button className='mybutton button5' style={{ width: '150px', height: '40px' }} type="submit">
                                    Re-Send OTP
                                </Button>
                                <br></br>

                            </div>}
                            <br></br>
                        </>
                    }
                    {/* {isLogged && users && users.current && 'user is already logged in'} */}
                </div>

            </div>
            <div>-------------</div>

        </>
    );
};

export default PropAgentSignup_running;
