import React from 'react';
import { Container } from "react-bootstrap";
import MediaCardList from "../MediaCardList";
import FadeIn from "react-fade-in/lib/FadeIn";
import API from "../../utils/API";
import TopBar from '../TopBar/TopBar';
import { Switch, Route } from 'react-router-dom';

class MainPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            mediaContent: []
        }
    }

    async getMedia() {
        try {
            var { data: content } = await API.getPopularContent();

            this.setState({ mediaContent: content });
        } catch (err) {
            console.error(err);
        }
    }

    componentDidMount() {
        this.getMedia();
    }

    render() {
        return (
            <Container className="pt-5">
                <TopBar siteName="Storrmbox" />
                <FadeIn>
                    {/* <hr /> */}
                    <Switch>

                        <Route path="/popular">
                            <h3 className="pt-4">Popular</h3>
                            <MediaCardList mediaList={this.state.mediaContent} />
                        </Route>
                        
                        <Route path="/">
                            <h3 className="pt-4">Home</h3>
                        </Route>
                    </Switch>
                </FadeIn>
            </Container>
        )
    }
}

export default MainPage;