import React from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import UserStore from 'stores/UserStore';
import { ReactComponent as Logo } from '../../../assets/logo.svg';
import "./RegisterPage.scss";


class RegisterPage extends React.Component<RouteComponentProps<{ code?: string }>> {

    handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        var formData = new FormData(e.currentTarget);

        const username = formData.get('username') as string;
        const password = formData.get('password') as string;
        const reapeatedPassword = formData.get('repeat-password') as string;
        const inviteCode = formData.get("inviteCode") as string;
        const email = formData.get("email") as string;

        UserStore.register(username, email, password, inviteCode);
    }

    render() {
        let bgImage = 'https://m.media-amazon.com/images/M/MV5BMzgxMmQxZjQtNDdmMC00MjRlLTk1MDEtZDcwNTdmOTg0YzA2XkEyXkFqcGdeQXVyMzQ2MDI5NjU@._V1_SX300.jpg';

        return (
            <div className="center-container">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={12} lg={9} className="col-xxl-7">
                            <Card>
                                <Form onSubmit={this.handleSubmit} id="register-form">
                                    <Row noGutters>

                                        <Col className="left" style={{ backgroundImage: `url(${bgImage})` }}>

                                            <div className="content pb-3">
                                                <div className="text-center mb-3">
                                                    <Logo width="100%" height="100%" />
                                                </div>
                                                <p className="moto">Sign up and watch any Movie or TV series without any ads...</p>

                                                {
                                                    (this.props.match.params.code) ?
                                                        <input type="hidden" name="inviteCode" value={this.props.match.params.code} required />
                                                        :
                                                        <Form.Group controlId="inviteCode">
                                                            <Form.Label>Invite code</Form.Label>
                                                            <Form.Control name="inviteCode" placeholder="XXX-XXX" type="text" required />
                                                        </Form.Group>
                                                }

                                            </div>
                                        </Col>

                                        <Col className="right">

                                            <Card.Title>Sign Up</Card.Title>

                                            <Form.Group controlId="username">
                                                <Form.Label>Username</Form.Label>
                                                <Form.Control name="username" placeholder="Username" type="text" required />
                                            </Form.Group>

                                            <Form.Group controlId="email">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control name="email" placeholder="Email" type="email" required />
                                            </Form.Group>

                                            <Form.Group controlId="password">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control placeholder="Password" name="password" type="password" required />
                                            </Form.Group>

                                            <Form.Group controlId="repeat-password">
                                                <Form.Label>Repeat the password</Form.Label>
                                                <Form.Control placeholder="Password" name="repeat-password" type="password" required />
                                            </Form.Group>

                                            <div className="d-flex">
                                                <Button variant="outline-primary" className="ml-auto" type="submit">Register</Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }

}

export default withRouter(RegisterPage);