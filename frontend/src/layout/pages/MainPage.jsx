import React from 'react';
import { Container } from "react-bootstrap";
import FadeIn from "react-fade-in/lib/FadeIn";
import TopBar from '../TopBar/TopBar';
import { Switch, Route, withRouter } from 'react-router-dom';
import ModalUrlListener from '../ModalUrlListener';
import MediaPage from '../MediaPage';
import SearchResultPage from './SearchResultPage';

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

                        <Route path="/movies">
                            <TopBar siteName={siteName} />
                            <MediaPage key="movie" category="movie" title="Movies" />
                        </Route>

                        <Route path="/series">
                            <TopBar siteName={siteName} />
                            <MediaPage key="series" category="series" title="Series" />
                        </Route>

                        <Route path="/search/:query">
                            <TopBar siteName={siteName} />
                            <SearchResultPage />
                        </Route>

                        <Route path={["/", "/all"]}>
                            <TopBar siteName={siteName} />
                            <h3 className="pt-5">All</h3>
                            {/* <form onSubmit={this.search}>
                                <input type="text" name="text" />
                            </form> */}

                            {/* <MediaCardList mediaList={this.state.result} /> */}

                        </Route>
                    </Switch>
                </FadeIn>
                {background && <Route path="/m/:id" children={<ModalUrlListener />} />}
            </Container>
        )
    }
}

export default withRouter(MainPage);