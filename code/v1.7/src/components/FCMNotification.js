import zIndex from '@mui/material/styles/zIndex';
import React from 'react';

const FCMNotification = ({ icon, title, body, onClose }) => {
    return (
        <div style={styles.containerouter}>
            <div style={styles.container}>
                <div style={styles.content}>
                    <img src="/assets/img/logo_propdial.png" width={'40%'} alt="/assets/img/logo_propdial.png" style={{ padding: '0px 0px 15px 0px' }} ></img>
                    <br></br>
                    <h4>{title}</h4>
                    <p>{body} Needs to add few more details in the body</p>
                    <button onClick={onClose} style={styles.button}>Close</button>
                </div>
            </div>
        </div>
    );
};

const styles = {

    containerouter:
    {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        padding: '10px',
        background: 'rgba(0,0,0,0.6)',
        zIndex: '9999',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        backgroundColor: '#fff',
        boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
        borderRadius: 5,
        padding: '20px 10px',
        maxWidth: '375px',
        width: '100%',
    },
    content: {
        textAlign: 'center',
    },
    button: {
        marginTop: 10,
        padding: '5px 15px',
        backgroundColor: '#fa631c',
        color: '#fff',
        border: 'none',
        borderRadius: 5,
        cursor: 'pointer',
    }
};

export default FCMNotification;
