import React from 'react';
import { Container } from "react-bootstrap";
import FadeIn from "react-fade-in";
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import { Footer } from './layout/Footer/Footer';
import ModalUrlListener from './layout/ModalUrlListener';
import MediaPage from './layout/pages/MediaPage';
import SearchResultPage from './layout/pages/SearchResultPage';
import TopBar from './layout/TopBar/TopBar';
import * as H from 'history';
import AccountPage from 'layout/pages/AccountPage/AccountPage';

class PostAuthRouter extends React.Component<RouteComponentProps<any, any, { background?: H.Location }>> {

    render() {
        let location = this.props.location;
        let background = location.state && location.state.background;

        const siteName = "Storrmbox";

        if (this.props.history.length <= 2 || background === undefined) {
            background = this.props.location || { pathname: "/" }
        }

        return (
            <Container className="main-container">
                <FadeIn>
                    {/* <hr /> */}
                    <Switch location={background || location}>
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

                        <Route path="/account">
                            <TopBar siteName={siteName} />
                            <AccountPage />
                            <Footer />
                        </Route>

                        <Route path={["/", "/all"]}>
                            <TopBar siteName={siteName} />
                            <MediaPage key="all" categoryName="All" />
                            <Footer />
                        </Route>
                    </Switch>
                </FadeIn>
                {background && <Route path="/m/:id" children={<ModalUrlListener />} />}
            </Container>
        )
    }
}

export default withRouter(PostAuthRouter);