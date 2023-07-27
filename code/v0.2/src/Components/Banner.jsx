import React from "react";
import "./Banner.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel } from 'react-bootstrap';

function Banner() {
  return (
    <Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={process.env.PUBLIC_URL + '/Images/find the right fit for you. (68 × 32 in) (60 × 25 in) (55 × 23 in) (50 × 23 in)-min.jpg'}
          alt="First slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={process.env.PUBLIC_URL + '/Images/find the right fit for you. (68 × 32 in) (60 × 25 in) (55 × 23 in) (50 × 23 i.jpg'}
          alt="Second slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={process.env.PUBLIC_URL + '/Images/find the right fit for you. (68 × 32 in) (60 × 25 in) (55 × 23 in) (50 × 23 in.jpg'}
          alt="Third slide"
        />
      </Carousel.Item>
    </Carousel>
  );
}

export default Banner;