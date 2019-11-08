import React from 'react';
import { AuthContext } from '../../contexts/auth-context';
import { Button, Container, Card, Form, Row, Col } from 'react-bootstrap';


class LoginPage extends React.Component {

    constructor(props) {
        super(props);

        this.handleLogin = this.handleLogin.bind(this);
    }


    handleLogin(e) {
        e.preventDefault();
        // var data = new FormData(e.target);

        //Handle login HERE
        this.context.login()
    }

    render() {

        return (

            <Container>
                <Row className="justify-content-center pt-5">
                    <Col md={6}>
                        <Card>
                            <Card.Body>
                                <Card.Title>Sign In</Card.Title>

                                <Form onSubmit={this.handleLogin}>
                                    <Form.Group>
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control id="username" placeholder="Username" type="text" required/>
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control placeholder="Password" type="password" required/>
                                    </Form.Group>

                                    <Button variant="outline-primary" type="submit">Login</Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }

}
LoginPage.contextType = AuthContext;

export default LoginPage;