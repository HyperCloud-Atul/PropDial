import React from 'react'
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
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
            <div className='container'>
                <div className="section_title">
                    <h2 class="section_title_effect">News & Media</h2>
                    <h3>Journeying Through Untold Stories and Hidden Reals</h3>
                </div>

                <div className='blog_inner relative'>
                    <OwlCarousel className="owl-theme" {...blogOptions}>


                        <div className="item card-container">
                            <div className="card-image">
                                <img src="./assets/img/blog1.jpg" />
                            </div>
                            <div className="card-body">
                                {/* <span className="card-badge">Business</span> */}
                                <div className="blog_source">
                                    <img src="./assets/img/blog_source1.webp" alt="" />
                                </div>
                                <h3>
                                    Prop-tech Startup Propdial forays into 2nd home shared ownership space
                                </h3>
                                <p className="card-subtitle">
                                    Propdial, a Gurgaon based prop-tech startup that helps NRIs and Indians living in other cities manage properties from a distance, forays into fast emerging 2nd Home shared ownership space. A growing income of Indian
                                </p>
                                <div className="card-author">
                                    <img src="./assets/img/blog1.jpg" alt="author avatar" />
                                    <div className="author-info">
                                        {/* <p className="author-name">John Doe</p>
                                        <p className="post-timestamp">2h ago</p> */}
                                        <Link className="learn-more pointer" to="https://helloentrepreneurs.in/prop-tech-startup-propdial-forays-into-2nd-home-shared-ownership-space/">
                                            Read More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="item card-container">
                            <div className="card-image">
                                <img src="./assets/img/blog2.webp" />
                            </div>
                            <div className="card-body">
                                {/* <span className="card-badge">Propdial</span> */}
                                <div className="blog_source">
                                    <img src="./assets/img/blog_source2.svg" alt="" />
                                </div>
                                <h3>
                                    [Funding roundup] Cooby, Propdial, Oorjaa, Blue Tokai raise early-stage capital
                                </h3>
                                <p className="card-subtitle">
                                    Property management startup Propdial raises Rs 2 Cr as part of convertible debenture round. Propdial, a Gurugram-based proptech startup that helps NRIs and Indians living in other cities manage properties from a distance
                                </p>
                                <div className="card-author">
                                    <img src="./assets/img/blog2.webp" alt="author avatar" />
                                    <div className="author-info">
                                        {/* <p className="author-name">John Doe</p>
                                        <p className="post-timestamp">2h ago</p> */}
                                        <Link className="learn-more pointer" to="https://yourstory.com/2022/03/early-stage-funding-roundup-cooby-propdial-oorjaa-bluetokai-raise-capital">
                                            Read More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="item card-container">
                            <div className="card-image">
                                <img src="./assets/img/blog3.webp" />
                            </div>
                            <div className="card-body">
                                {/* <span className="card-badge">Agencies</span> */}
                                <div className="blog_source">
                                    <img src="./assets/img/blog_source3.png" alt="" />
                                </div>
                                <h3>
                                    Property management company Propdial to expand to Mumbai, Chennai and Kolkata
                                </h3>
                                <p className="card-subtitle">
                                    Property management and maintenance company Propdial is in talks to raise Rs two crore to expand its operation to Mumbai, Chennai and Kolkata as demand for property management has increased with NRIs unable to come to India due to COVID
                                </p>
                                <div className="card-author">
                                    <img src="./assets/img/blog3.webp" alt="author avatar" />
                                    <div className="author-info">
                                        {/* <p className="author-name">John Doe</p>
                                        <p className="post-timestamp">2h ago</p> */}
                                        <Link className="learn-more pointer" to="https://economictimes.indiatimes.com/industry/services/property-/-cstruction/property-management-company-propdial-to-expand-to-mumbai-chennai-and-kolkata/articleshow/85761366.cms">
                                            Read More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="item card-container">
                            <div className="card-image">
                                <img src="./assets/img/blog4.webp" />
                            </div>
                            <div className="card-body">
                                {/* <span className="card-badge">Propdial</span> */}
                                <div className="blog_source">
                                    <img src="./assets/img/blog_source2.svg" alt="" />
                                </div>
                                <h3>
                                    THIS GURUGRAM-BASED STARTUP IS HELPING PROPERTY OWNERS REMOTELY MANAGE REAL ESTATE
                                </h3>
                                <p className="card-subtitle">
                                    Managing a property is no easy task, especially when you are sitting miles away. The list of tasks includes repairs and maintenance, collection of bills, finding a tenant, getting the paperwork done, and so on.

                                </p>
                                <div className="card-author">
                                    <img src="./assets/img/blog4.webp" alt="author avatar" />
                                    <div className="author-info">
                                        {/* <p className="author-name">John Doe</p>
                                        <p className="post-timestamp">2h ago</p> */}
                                        <Link className="learn-more pointer" to="https://yourstory.com/2021/07/gurugram-startup-helps-property-owners-remotely-manage-real-estate">
                                            Read More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="item card-container">
                            <div className="card-image">
                                <img src="./assets/img/blog5.jpeg" />
                            </div>
                            <div className="card-body">
                                {/* <span className="card-badge">Propdial</span> */}
                                <div className="blog_source">
                                    <img src="./assets/img/blog_source4.png" alt="" />
                                </div>
                                <h3>
                                    Housing.com dials into the property management services game, announces tie-up with Gurugram-based Propdial
                                </h3>
                                <p className="card-subtitle">
                                    In a move that would help India's leading real-estate portal, Housing.com, further expand its footprint; the portal has announced a partnership with Gurugram-based property and rental management technology company, Propdial.
                                    The announcement comes days after the Elara Technologies owned online portal, which also owns PropTiger.com and Makaan.com, announced the launch of Housing Edge, its full-stack rental and allied services platform.

                                </p>
                                <div className="card-author">
                                    <img src="./assets/img/blog5.jpeg" alt="author avatar" />
                                    <div className="author-info">
                                        {/* <p className="author-name">John Doe</p>
                                        <p className="post-timestamp">2h ago</p> */}
                                        <Link className="learn-more pointer" to="https://bwdisrupt.businessworld.in/article/Housing-com-dials-into-the-property-management-services-game-announces-tie-up-with-Gurugram-based-Propdial/09-02-2021-375474/">
                                            Read More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="item card-container">
                            <div className="card-image">
                                <img src="./assets/img/blog1.jpg" />
                            </div>
                            <div className="card-body">
                                {/* <span className="card-badge">Propdial</span> */}
                                <div className="blog_source">
                                    <img src="./assets/img/blog_source5.png" alt="" />
                                </div>
                                <h3>
                                49 Top Indian Property Management Companies and Startups of 2021
                                </h3>
                                <p className="card-subtitle">
                                These startups and companies are taking a variety of approaches to innovating the Property Management industry, but are all exceptional companies well worth a follow.                             

                                </p>
                                <div className="card-author">
                                    <img src="./assets/img/blog1.jpg" alt="author avatar" />
                                    <div className="author-info">
                                        {/* <p className="author-name">John Doe</p>
                                        <p className="post-timestamp">2h ago</p> */}
                                        <Link className="learn-more pointer" to="https://beststartup.asia/49-top-indian-property-management-companies-and-startups-of-2021/">
                                            Read More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="item card-container">
                            <div className="card-image">
                                <img src="./assets/img/blog5.jpeg" />
                            </div>
                            <div className="card-body">
                                {/* <span className="card-badge">Propdial</span> */}
                                <div className="blog_source">
                                    <img src="./assets/img/blog_source6.png" alt="" />
                                </div>
                                <h3>
                                Housing.com Joins Hands With Gurugram-Based Propdial To Tap Into Rental, Property Management Tech
                                </h3>
                                <p className="card-subtitle">
                                National, 9th February 2021:  In a move that would help India s leading real-estate portal, Housing.com, further expand its footprint; the portal has announced a partnership with Gurugram-based property and rental management technology company, Propdial.                            

                                </p>
                                <div className="card-author">
                                    <img src="./assets/img/blog5.jpeg" alt="author avatar" />
                                    <div className="author-info">
                                        {/* <p className="author-name">John Doe</p>
                                        <p className="post-timestamp">2h ago</p> */}
                                        <Link className="learn-more pointer" to="https://www.realtybuzz.in/housing-com-joins-hands-with-gurugram-based-propdial-to-tap-into-rental-property-management-tech/">
                                            Read More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="item card-container">
                            <div className="card-image">
                                <img src="./assets/img/blog6.avif" />
                            </div>
                            <div className="card-body">
                                {/* <span className="card-badge">Propdial</span> */}
                                <div className="blog_source">
                                    <img src="./assets/img/blog_source2.svg" alt="" />
                                </div>
                                <h3>
                                HOW THIS REALTY MANAGED MARKETPLACE OFFERS PEACE OF MIND TO NRI PROPERTY OWNERS
                                </h3>
                                <p className="card-subtitle">
                                Propdial provides end-to-end property management solution to NRIs, where it maintains, manages, and rents out property on their behalf.Not long ago, when Vinay Prajapati was running a real estate brokerage firm catering to NRIs, he would receive lots of queries by them on property maintenance.                         

                                </p>
                                <div className="card-author">
                                    <img src="./assets/img/blog6.avif" alt="author avatar" />
                                    <div className="author-info">
                                        {/* <p className="author-name">John Doe</p>
                                        <p className="post-timestamp">2h ago</p> */}
                                        <Link className="learn-more pointer" to="https://yourstory.com/2017/02/propdial-vinay-prajapati">
                                            Read More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="item card-container">
                            <div className="card-image">
                                <img src="./assets/img/blog7.jpg" />
                            </div>
                            <div className="card-body">
                                {/* <span className="card-badge">Propdial</span> */}
                                <div className="blog_source">
                                    <img src="./assets/img/blog_source7.png" alt="" />
                                </div>
                                <h3>
                                Propdial India: A Name you can Trust Upon A Platform with its Unique Approach
                                </h3>
                                <p className="card-subtitle">
                                Over the past few years, technology has grown by leaps and bounds and the industries across verticals are adapting to it in a large way round. Just like every other industry, the property management industry is also in a constant state of evolution by merging itself with the latest trends.                    

                                </p>
                                <div className="card-author">
                                    <img src="./assets/img/blog7.jpg" alt="author avatar" />
                                    <div className="author-info">
                                        {/* <p className="author-name">John Doe</p>
                                        <p className="post-timestamp">2h ago</p> */}
                                        <Link className="learn-more pointer" to="https://realestate.siliconindia.com/vendor/propdial-india-a-name-you-can-trust-upon--cid-2980.html">
                                            Read More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="item card-container">
                            <div className="card-image">
                                <img src="./assets/img/blog8.webp" />
                            </div>
                            <div className="card-body">
                                {/* <span className="card-badge">Propdial</span> */}
                                <div className="blog_source">
                                    <img src="./assets/img/blog_source3.png" alt="" />
                                </div>

                                <h3>
                                Housing.com partners Propdial to strengthen rental services business
                                </h3>
                                <p className="card-subtitle">
                                Realty portal Housing.com on Tuesday said it has tied up with Gurugram-based property and rental management technology firm Propdial to strengthen its rent services business. The tie-up will help the company to provide property management services such as renting/leasing, tenant background verification, rental agreement and rent collection/bill payment, Housing.com said in a statement.

               

                                </p>
                                <div className="card-author">
                                    <img src="./assets/img/blog8.webp" alt="author avatar" />
                                    <div className="author-info">
                                        {/* <p className="author-name">John Doe</p>
                                        <p className="post-timestamp">2h ago</p> */}
                                        <Link className="learn-more pointer" to="https://economictimes.indiatimes.com/tech/startups/housing-com-partners-propdial-to-strengthen-rental-services-business/articleshow/80768394.cms">
                                            Read More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="item card-container">
                            <div className="card-image">
                                <img src="./assets/img/blog5.jpeg" />
                            </div>
                            <div className="card-body">
                                {/* <span className="card-badge">Propdial</span> */}
                                <div className="blog_source">
                                    <img src="./assets/img/blog_source8.png" alt="" />
                                </div>
                                <h3>
                                Housing.com partners startup Propdial to boost rental services business
                                </h3>
                                <p className="card-subtitle">
                                The tie-up will help the company to provide property management services such as renting/leasing, tenant background verification, rental agreement and rent collection/bill payment, Housing.com said in a statement.           

                                </p>
                                <div className="card-author">
                                    <img src="./assets/img/blog8.png" alt="author avatar" />
                                    <div className="author-info">
                                        {/* <p className="author-name">John Doe</p>
                                        <p className="post-timestamp">2h ago</p> */}
                                        <Link className="learn-more pointer" to="https://www.business-standard.com/article/companies/housing-com-partners-startup-propdial-to-boost-rental-services-business-121020900987_1.html">
                                            Read More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>       





                    </OwlCarousel>









                </div>

            </div>
        </section>
    )
}

export default Blog
