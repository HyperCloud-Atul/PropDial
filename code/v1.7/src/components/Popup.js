import React from 'react'

export default function Popup(props) {

    const handlePopup = (action) => {
        // console.log('Popup Action:', action)

        if (action == 'CANCEL')
            props.setPopupReturn(false)

        if (action == 'CONFIRM')
            props.setPopupReturn(true)

        props.setShowPopupFlag(false)
    }

    return (
        <div className={props.showPopupFlag ? 'pop-up-div open' : 'pop-up-div'}>
            <div>
                <p>
                    {props.msg}
                </p><br />
                <button onClick={() => handlePopup('CONFIRM')} className="theme_btn btn_red pointer no_icon" style={{ margin: '0 20px' }}>CONFIRM</button>
                <button onClick={() => handlePopup('CANCEL')} className="theme_btn btn_fill pointer no_icon" style={{ margin: '0 20px' }}>CANCEL</button>
            </div>
        </div>
    )
}
