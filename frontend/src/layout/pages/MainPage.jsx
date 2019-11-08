import SearchInput from "../../components/SearchInput";
import React from 'react';
import { Container } from "react-bootstrap";
import TopBar from "../TopBar";
import ResultList from "../ResultList";

class MainPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [
                {
                    title: 'Silicon valley S03E05',
                    size: "250MB",
                    image: "https://m.media-amazon.com/images/M/MV5BOTcwNzU2MGEtMzUzNC00MzMwLWJhZGItNDY3NDllYjU5YzAyXkEyXkFqcGdeQXVyMzQ2MDI5NjU@._V1_SY1000_SX675_AL_.jpg"
                },
                {
                    title: 'ARRESTED DEVELOPMENT (2003)',
                    size: "250MB",
                    image: "https://resizing.flixster.com/oFlhl7tzdY2Pev8WQTyEujtkzeQ=/180x240/v1.dDsyNDIwMjc7ajsxODI0NDsyMDQ4OzM2Mjs0ODM"
                },
                {
                    title: 'Safe (2018)',
                    size: "250MB",
                    image: "https://resizing.flixster.com/nCAH2Y53ZiOo-eIdZIPlr4i0XVw=/180x258/v1.dDszMTE4MzI7ajsxODI1NTsyMDQ4OzQ0MDs2MzA"
                },
                {
                    title: 'SHE\'S GOTTA HAVE IT(2017)',
                    size: "250MB",
                    image: "https://resizing.flixster.com/eBzkDt9G-RrLHuul79ZgV-XPDrY=/180x266/v1.dDsyNjMyODI7ajsxODI2MDsyMDQ4OzMwMDs0NDQ"
                },
                {
                    title: 'LOVE, DEATH & ROBOTS (2019)',
                    size: "250MB",
                    image: "https://resizing.flixster.com/H5mlAc38PfJBtXpbxUwpNGATmWU=/180x267/v1.dDs0MjYwMjg7ajsxODI0MjsyMDQ4OzE1MDA7MjIyMg"
                }
            ]
        }
    }

    render() {
        return (
            <Container>
                <TopBar siteName="Storrmbox" />
                <SearchInput />
                <ResultList data={this.state.data} />
            </Container>
        )
    }
}

export default MainPage;