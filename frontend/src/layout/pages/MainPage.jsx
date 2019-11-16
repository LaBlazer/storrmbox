import React from 'react';
import { Container } from "react-bootstrap";
import FadeIn from "react-fade-in/lib/FadeIn";
import TopBar from '../TopBar/TopBar';
import { Switch, Route, withRouter } from 'react-router-dom';
import ModalUrlListener from '../ModalUrlListener';
import MediaPage from '../MediaPage';

class MainPage extends React.Component {

    render() {
        let location = this.props.location;
        let background = location.state && location.state.background;

        if (this.props.history.length <= 2) {
            background = { pathname: "/" }
        }

        return (
            <Container className="pt-5">
                <TopBar siteName="Storrmbox" />
                <FadeIn>
                    {/* <hr /> */}
                    <Switch location={background || location}>

                        <Route path="/movies">
                            <MediaPage key="movie" category="movie" title="Movies" />
                        </Route>

                        <Route path="/series">
                            <MediaPage key="series" category="series" title="Series" />
                        </Route>

                        <Route path={["/", "/all"]}>
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