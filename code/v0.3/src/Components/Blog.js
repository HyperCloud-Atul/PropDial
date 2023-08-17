import React from 'react'
import "./Blog.css"

const Blog = () => {
    return (
        <section className="blog_sect sect_padding">
            <div className='container'>
                <div className="section_title">
                    <h2 class="section_title_effect">Blog</h2>
                    <h3>Journeying Through Untold Stories and Hidden Realms</h3>
                </div>

                <div className='blog_inner'>
                    <div className='row'>

                        <div className='col-md-4'>
                            <div className="card-container">
                                <div className="card-image">
                                    <img src="https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="a brand new sports car" />
                                </div>
                                <div className="card-body">
                                    <span className="card-badge">Lorem ipsum</span>
                                    <h3>
                                        Where does it come from?
                                    </h3>
                                    <p className="card-subtitle">
                                        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old
                                    </p>
                                    <div className="card-author">
                                        <img src="https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="author avatar" />
                                        <div className="author-info">
                                            <p className="author-name">John Doe</p>
                                            <p className="post-timestamp">2h ago</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className='col-md-4'>

                            <div className="card-container">
                                <div className="card-image">
                                    <img src="https://images.unsplash.com/photo-1504728078670-d0a59873c8c4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80" alt="a landscape view full of baloons" />
                                </div>
                                <div className="card-body">
                                    <span className="card-badge">Lorem ipsum</span>
                                    <h3>
                                        Where does it come from?
                                    </h3>
                                    <p className="card-subtitle">
                                        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old
                                    </p>
                                    <div className="card-author">
                                        <img src="https://images.unsplash.com/photo-1504728078670-d0a59873c8c4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80" alt="author avatar" />
                                        <div className="author-info">
                                            <p className="author-name">John Doe</p>
                                            <p className="post-timestamp">2h ago</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='col-md-4'>
                            <div className="card-container">
                                <div className="card-image">
                                    <img src="https://images.unsplash.com/photo-1506422748879-887454f9cdff?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80" alt="a city full of buildings" />
                                </div>
                                <div className="card-body">
                                    <span className="card-badge">Lorem ipsum</span>
                                    <h3>
                                        Where does it come from?
                                    </h3>
                                    <p className="card-subtitle">
                                        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old
                                    </p>
                                    <div className="card-author">
                                        <img src="https://images.unsplash.com/photo-1506422748879-887454f9cdff?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80" alt="author avatar" />
                                        <div className="author-info">
                                            <p>John Doe</p>
                                            <p>2h ago</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>







                    </div>
                </div>

            </div>
        </section>
    )
}

export default Blog
