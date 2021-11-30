import React from "react";
import { Navbar, Container, Nav, NavDropdown, Row, Col} from 'react-bootstrap';

export const Header = (props) => {

    return (

        <Container fluid>
            <Row>
                <Col>
                    <Navbar bg="light" expand="lg">
                        <Container>
                            <Navbar.Brand href="#home">Social crypto stats</Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="me-auto">
                                    <Nav.Link href="#home">Home</Nav.Link>
                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                </Col>
            </Row>
            <Row className="align-items-center">
                <Col>
                    <h1>Monitor your crypto currencies on Twitter</h1>
                </Col>
                <Col><img
                    className="d-block w-100"
                    src="./socialcryptostats/header.jpg"
                  
                /></Col>
            </Row>
        </Container>



    );
}