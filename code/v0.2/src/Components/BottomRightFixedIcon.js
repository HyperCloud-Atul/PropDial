import { React } from 'react'

// css 
import './BottomRightFixedIcon.css'

const BottomRightFixedIcon = () => {
    return (
        <div className='brf_icon'>
          
            <a href='https://wa.me/+919582195821'>
            <div className='brfi_single'>
                    <img src='./assets/img/whatsapp.png'></img>
                </div>
            </a>
      
        <a href='Tel: +919582195821'>
        <div className='brfi_single'>
                <img src='./assets/img/phone-call.png'></img>
            </div>
        </a>
        </div>
    )
}

export default BottomRightFixedIcon
