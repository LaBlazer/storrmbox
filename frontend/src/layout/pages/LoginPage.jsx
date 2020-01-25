import React from 'react';
import { Button, Container, Card, Form, Row, Col } from 'react-bootstrap';
import AuthStore from '../../stores/AuthStore';


class LoginPage extends React.Component {

    constructor(props) {
        super(props);

        this.handleLogin = this.handleLogin.bind(this);
    }

    handleLogin(e) {
        e.preventDefault();

        var formData = new FormData(e.target);
        var rememberMe = formData.get('rememberme') !== null;
        AuthStore.login(formData.get('username'), formData.get('password'), rememberMe);
    }

    render() {

        return (
            <div className="center-container">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={6}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Sign In</Card.Title>

                                    <Form onSubmit={this.handleLogin}>
                                        <Form.Group>
                                            <Form.Label>Username</Form.Label>
                                            <Form.Control id="username" name="username" placeholder="Username" type="text" required />
                                        </Form.Group>

                                        <Form.Group>
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control placeholder="Password" name="password" type="password" required />
                                        </Form.Group>
                                        <Form.Group controlId="rememberMeCheckBox">
                                            <Form.Check type="checkbox" name="rememberme" label="Remember me" className="mb-2" />
                                        </Form.Group>
                                        <Button variant="outline-primary" type="submit">Login</Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }

}

export default LoginPage;