import React from 'react';
import { Link } from 'react-router-dom';
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

// import css 
import './QuickAccessMenu.scss';

const QuickAccessMenu = ({ menuItems }) => {
    // owl carousel option start
    const qamoptions = {
        items: 8,
        dots: false,
        loop: false,
        margin: 20,
        nav: true,
        smartSpeed: 1500,
        autoplayTimeout: 10000,
        responsive: {
            0: {
                items: 1,
            },
            768: {
                items: 2,
            },
            992: {
                items: 8,
            },
        },
    };
    // owl carousel option end
    return (
        <div className="qa_menu">
            <OwlCarousel className="owl-theme" {...qamoptions}>
                {menuItems.map((item, index) => (
                    <Link to={item.link} className="item qam_single" key={index}>
                        <div className="icon">
                            <img src={item.icon} alt={item.name} />
                        </div>
                        <h5>{item.name}</h5>
                    </Link>
                ))}
            </OwlCarousel>
        </div>
    );
}

export default QuickAccessMenu;
