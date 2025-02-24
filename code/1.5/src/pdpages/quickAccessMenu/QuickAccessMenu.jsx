import React from 'react';
import { Link } from 'react-router-dom';
// import css 
import './QuickAccessMenu.scss';

const QuickAccessMenu = ({ menuItems }) => {
    return (
        <div className="qa_menu">          
                {menuItems.map((item, index) => (
                    <Link to={item.link} className="qam_single" key={index}>
                        <div className="icon">
                            <img src={item.icon} alt={item.name} />
                        </div>
                        <h5>{item.name}</h5>
                    </Link>
                ))}           
        </div>
    );
}

export default QuickAccessMenu;
