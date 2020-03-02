import React from 'react';
import { Button, Container, Card, Form, Row, Col } from 'react-bootstrap';
import AuthStore from '../../../stores/AuthStore';
import { ReactComponent as Logo } from '../../../assets/logo.svg';
import style from "./LoginPage.module.scss";


class LoginPage extends React.Component {

    handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        var formData = new FormData(e.currentTarget);
        var rememberMe = formData.get('rememberme') !== null;
        AuthStore.login(formData.get('username') as string, formData.get('password') as string, rememberMe);
    }

    render() {

        return (
            <div className="center-container">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={8} lg={6} className="col-xxl-4">
                            <Card>
                                <Card.Body>
                                    <div className={`${style.pageLogo} text-center`}>
                                        <Logo width="90%" height="100%" />
                                    </div>
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