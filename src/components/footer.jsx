import React from "react";
import { Container, Row, Col} from 'react-bootstrap';

export const Footer = (props) => {

    return (

        <Container fluid>
            <Row className="align-items-center">
                <Col>
                    <h6>Created by <a href="https://twitter.com/FranGamezDev">@FranGamezDev</a></h6>
                </Col>
            </Row>
        </Container>



    );
}