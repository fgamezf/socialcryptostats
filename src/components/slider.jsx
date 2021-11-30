import React from "react";
import { Carousel } from 'react-bootstrap';

export const Slider = (props) => {

    return (

        <Carousel fade variant="dark">
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src="header.jpg"
                    alt="First slide"
                />
                <Carousel.Caption>
                    <h5>First slide label</h5>
                    <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>

    );
}