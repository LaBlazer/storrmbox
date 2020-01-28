import React from 'react';
import { Container } from "react-bootstrap";
import FadeIn from "react-fade-in/lib/FadeIn";
import TopBar from '../TopBar/TopBar';
import { Switch, Route, withRouter } from 'react-router-dom';
import ModalUrlListener from '../ModalUrlListener';
import MediaPage from '../MediaPage';
import SearchResultPage from './SearchResultPage';
import { Footer } from '../Footer/Footer';
import ContentReloader from '../../components/ContentReloader'

class MainPage extends React.Component {

    render() {
        let location = this.props.location;
        let background = location.state && location.state.background;

        const siteName = "Storrmbox";

        if (this.props.history.length <= 2 || background === undefined) {
            background = this.props.location || { pathname: "/" }
        }

        return (
            <Container className="pt-5">
                <FadeIn>
                    {/* <hr /> */}
                    <Switch location={background || location}>

                        {/* DELETE IN PRODUCTION */}
                        <Route path="/content/reload">
                            <ContentReloader />
                        </Route>

                        <Route path="/movies">
                            <TopBar siteName={siteName} />
                            <MediaPage key="movie" category="movie" categoryName="Movies" />
                            <Footer />
                        </Route>

                        <Route path="/series">
                            <TopBar siteName={siteName} />
                            <MediaPage key="series" category="series" categoryName="Series" />
                            <Footer />
                        </Route>

                        <Route path="/search/:query">
                            <TopBar siteName={siteName} />
                            <SearchResultPage />
                            <Footer />
                        </Route>

                        <Route path={["/", "/all"]}>
                            <TopBar siteName={siteName} />
                            <h3 className="pt-5">All</h3>
                            <Footer />
                        </Route>
                    </Switch>
                </FadeIn>
                {background && <Route path="/m/:id" children={<ModalUrlListener />} />}
            </Container>
        )
    }
}

export default withRouter(MainPage);