import React from 'react'

import { Link } from 'react-router-dom';

import "./Blog.css"

const Blog = () => {
    const blogOptions = {
        items: 3,
        dots: false,
        loop: true,
        margin: 30,
        nav: false,
        smartSpeed: 1500,
        autoplay: true,
        autoplayTimeout: 3000,
        responsive: {
            // Define breakpoints and the number of items to show at each breakpoint
            0: {
                items: 1,
            },
            768: {
                items: 2,
            },
            992: {
                items: 3,
            },
        },
    };
    return (
        <section className="blog_sect sect_padding">
            hi
        </section>
    )
}

export default Blog
