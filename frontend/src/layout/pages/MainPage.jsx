import SearchInput from "../../components/SearchInput";
import React from 'react';
import { Container } from "react-bootstrap";
import TopBar from "../TopBar";
import MediaCardList from "../MediaCardList";
import FadeIn from "react-fade-in/lib/FadeIn";

class MainPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [
                {
                    title: 'Silicon valley S03E05',
                    image: "https://m.media-amazon.com/images/M/MV5BOTcwNzU2MGEtMzUzNC00MzMwLWJhZGItNDY3NDllYjU5YzAyXkEyXkFqcGdeQXVyMzQ2MDI5NjU@._V1_SY1000_SX675_AL_.jpg",
                    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
                },
                {
                    title: 'ARRESTED DEVELOPMENT (2003)',
                    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
                    image: "https://resizing.flixster.com/oFlhl7tzdY2Pev8WQTyEujtkzeQ=/180x240/v1.dDsyNDIwMjc7ajsxODI0NDsyMDQ4OzM2Mjs0ODM"
                },
                {
                    title: 'Safe (2018)',
                    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
                    image: "https://resizing.flixster.com/nCAH2Y53ZiOo-eIdZIPlr4i0XVw=/180x258/v1.dDszMTE4MzI7ajsxODI1NTsyMDQ4OzQ0MDs2MzA"
                },
                {
                    title: 'SHE\'S GOTTA HAVE IT(2017)',
                    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
                    image: "https://resizing.flixster.com/eBzkDt9G-RrLHuul79ZgV-XPDrY=/180x266/v1.dDsyNjMyODI7ajsxODI2MDsyMDQ4OzMwMDs0NDQ"
                },
                {
                    title: 'LOVE, DEATH & ROBOTS (2019)',
                    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
                    image: "https://resizing.flixster.com/H5mlAc38PfJBtXpbxUwpNGATmWU=/180x267/v1.dDs0MjYwMjg7ajsxODI0MjsyMDQ4OzE1MDA7MjIyMg"
                }
            ]
        }
    }

    render() {
        return (
            <Container>
                {/* <FadeIn> */}
                    <TopBar siteName="Storrmbox" />
                    {/* <h3>Search</h3> */}
                    {/* <SearchInput /> */}
                    <hr />
                    <h3>Popular</h3>
                    <MediaCardList data={this.state.data} />
                {/* </FadeIn> */}
            </Container>
        )
    }
}

export default MainPage;