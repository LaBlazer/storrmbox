import React from 'react';
import { Container } from "react-bootstrap";
import MediaCardList from "../MediaCardList";
import FadeIn from "react-fade-in/lib/FadeIn";
import API from "../../utils/API";
import TopBar from '../TopBar/TopBar';
import { Switch, Route, withRouter } from 'react-router-dom';
import MediaModalLoader from '../MediaModalLoader';

class MainPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            mediaContent: []
        }

        this.search = this.search.bind(this);
        this.state.result = [
            {
                "id": 1,
                "title": "Silicon Valley",
                "date_released": "2014-01-01",
                "date_end": null,
                "imdb_id": "tt2575988",
                "rating": null,
                "plot": null,
                "poster": "https://m.media-amazon.com/images/M/MV5BOTcwNzU2MGEtMzUzNC00MzMwLWJhZGItNDY3NDllYjU5YzAyXkEyXkFqcGdeQXVyMzQ2MDI5NjU@._V1_SX300.jpg",
                "trailer_youtube_id": "Vm4tx1O9GAc",
                "episode": null,
                "series": null
            },
            {
                "id": 2,
                "title": "Pirates of Silicon Valley",
                "date_released": "1999-01-01",
                "date_end": null,
                "imdb_id": "tt0168122",
                "rating": null,
                "plot": null,
                "poster": "https://m.media-amazon.com/images/M/MV5BNDc2NTE0NzE4N15BMl5BanBnXkFtZTgwMDQ5MzgwMzE@._V1_SX300.jpg",
                "trailer_youtube_id": "lEyrivrjAuU",
                "episode": null,
                "series": null
            },
            {
                "id": 3,
                "title": "The Inventor: Out for Blood in Silicon Valley",
                "date_released": "2019-01-01",
                "date_end": null,
                "imdb_id": "tt8488126",
                "rating": null,
                "plot": null,
                "poster": "https://m.media-amazon.com/images/M/MV5BOGI4NTQxYWUtNzEzMy00MGFiLThjODItNjg4ODI5MmZiMzIwXkEyXkFqcGdeQXVyMzY0MTE3NzU@._V1_SX300.jpg",
                "trailer_youtube_id": "wtDaP18OGfw",
                "episode": null,
                "series": null
            },
            {
                "id": 4,
                "title": "Bill Maher: CrazyStupidPolitics - Live from Silicon Valley",
                "date_released": "2012-01-01",
                "date_end": null,
                "imdb_id": "tt2266679",
                "rating": null,
                "plot": null,
                "poster": "https://m.media-amazon.com/images/M/MV5BZjYxZTc0MTQtMTJiYi00MmZiLWJlN2UtMDQwZjkwYzJiMmJjL2ltYWdlXkEyXkFqcGdeQXVyMTM3NzQ5NzQ@._V1_SX300.jpg",
                "trailer_youtube_id": "5NKgLFrtJ5k",
                "episode": null,
                "series": null
            },
            {
                "id": 5,
                "title": "Start-Ups: Silicon Valley",
                "date_released": "2012-01-01",
                "date_end": null,
                "imdb_id": "tt2343117",
                "rating": null,
                "plot": null,
                "poster": "https://m.media-amazon.com/images/M/MV5BNDQ1MTY3NTE2OF5BMl5BanBnXkFtZTgwNzI1NDAxMzE@._V1_SX300.jpg",
                "trailer_youtube_id": "Vm4tx1O9GAc",
                "episode": null,
                "series": null
            },
            {
                "id": 6,
                "title": "Silicon Valley: The Untold Story",
                "date_released": "2018-01-01",
                "date_end": null,
                "imdb_id": "tt8128854",
                "rating": null,
                "plot": null,
                "poster": "https://m.media-amazon.com/images/M/MV5BNDEwYmI4MjQtMzQwNy00ZDM1LWE1MTgtZGM1MzI2Zjc1OGVjXkEyXkFqcGdeQXVyMzE0MjY5ODA@._V1_SX300.jpg",
                "trailer_youtube_id": "2x_Bxvlbius",
                "episode": null,
                "series": null
            },
            {
                "id": 7,
                "title": "Secrets of Silicon Valley",
                "date_released": "2001-01-01",
                "date_end": null,
                "imdb_id": "tt0282948",
                "rating": null,
                "plot": null,
                "poster": "https://m.media-amazon.com/images/M/MV5BOWFiYjZhM2MtZmZlNC00MGMwLTkyZWMtNTBmNTA5YTFlOTA3XkEyXkFqcGdeQXVyNTM3MDMyMDQ@._V1_SX300.jpg",
                "trailer_youtube_id": "TbKxUYl3WSE",
                "episode": null,
                "series": null
            },
            {
                "id": 8,
                "title": "Silicon Valley Timelapse",
                "date_released": "2008-01-01",
                "date_end": null,
                "imdb_id": "tt1254346",
                "rating": null,
                "plot": null,
                "poster": "https://m.media-amazon.com/images/M/MV5BMTMyNjgwMTcyMl5BMl5BanBnXkFtZTcwNjAxODc3MQ@@._V1_SX300.jpg",
                "trailer_youtube_id": "DyGQ1-sNpOQ",
                "episode": null,
                "series": null
            }
        ]
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

    async search(e) {
        e.preventDefault();
        var fD = new FormData(e.target);

        console.log(await API.search(fD.get('text')));

    }

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
                            <h3 className="pt-5">Movies</h3>
                            <MediaCardList mediaList={this.state.result} />

                        </Route>

                        <Route path="/series">
                            <h3 className="pt-5">Series</h3>
                            <MediaCardList mediaList={this.state.result} />

                        </Route>

                        <Route path={["/", "/all"]}>
                            <h3 className="pt-5">All</h3>
                            {/* <form onSubmit={this.search}>
                                <input type="text" name="text" />
                            </form> */}

                            <MediaCardList mediaList={this.state.result} />

                        </Route>
                    </Switch>
                </FadeIn>
                {background && <Route path="/m/:id" children={<MediaModalLoader />} />}
            </Container>
        )
    }
}

export default withRouter(MainPage);
