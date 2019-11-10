import React from 'react';
import { Container } from "react-bootstrap";
import TopBar from "../TopBar";
import MediaCardList from "../MediaCardList";
import FadeIn from "react-fade-in/lib/FadeIn";
import API from "../../utils/API";

class MainPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            mediaContent: []
        }
    }

    async getMedia() {
        try  {
            var {data: content} = await API.getPopularContent();
            
            this.setState({mediaContent: content});
        } catch (err)  {
            console.error(err);
        }
    }

    componentDidMount() {
        this.getMedia();
    }

    render() {
        return (
            <Container>
                <FadeIn>
                    <TopBar siteName="Storrmbox" />
                    <hr />
                    <h3>Popular</h3>
                    <MediaCardList mediaList={this.state.mediaContent} />
                </FadeIn>
            </Container>
        )
    }
}

export default MainPage;