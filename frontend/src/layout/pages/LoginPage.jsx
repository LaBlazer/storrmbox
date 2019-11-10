import React from 'react';
import { API_URL } from '../../configs/constants';
import Axios from 'axios';
import { Button, Container, Card, Form, Row, Col } from 'react-bootstrap';
import { setCookie } from '../../utils/CookieHelper';
import { AuthContext } from '../../contexts/auth-context';


class LoginPage extends React.Component {

    constructor(props) {
        super(props);

        this.handleLogin = this.handleLogin.bind(this);
    }


    async handleLogin(e) {
        e.preventDefault();

        var formData = new FormData(e.target);

        try {
            var data = await Axios.post(`${API_URL}/auth`, {}, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Basic ${Buffer.from(`${formData.get('username')}:${formData.get('password')}`).toString('base64')}`
                }
            });

            if (data.status === 200) {
                setCookie('atkn', data.data.token, new Date(data.data.expires_in * 1000));
                this.context.login();
            }

        } catch (err) {
            //Show error
            alert(err.response.data);
        }
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
                                        <Form.Control id="username" name="username" placeholder="Username" type="text" required />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control placeholder="Password" name="password" type="password" required />
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