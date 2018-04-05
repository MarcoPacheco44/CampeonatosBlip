import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import './App.css';

const api_key = "HOLCAStI6Z0OfdoPbjdSg5b41Q17w2W5P4WuoIBdC66Z54kUEvGWPIe33UYC";




class Competitions extends Component {
    constructor(props) {-
        super(props);
        this.state = {
            competitions: null,
        };
    }

    componentDidMount() {
        this.getCompetitionsData();
    }


    getCompetitionsData() {
        const self = this;
        fetch("https://soccer.sportmonks.com/api/v2.0/leagues?api_token=" + api_key).then(results => results.json()).then(function (data) {
            const estado = Object.assign({}, self.state, {competitions: data.data});
            self.setState(estado);
        });
    }

    render() {
        const competitions =this.state.competitions;
        return (<div>
                <div className="container">
                    <div className="listagem-campeonatos">
                        <h2 className="titulo-campeonatos">Competitions Listing</h2>
                        <CompetitionsListing competitions={competitions}/>
                    </div>
                </div>
            </div>
        );
    }
}

class CompetitionsListing extends React.Component {
    competitions(competitions) {
        if (competitions !== null) {
            return competitions.map(competition => {
                return (
                    <CompetitionItem competition={competition} onClick={() => this.renderCompetition(competition)}/>)
            });
        }
    }

    renderCompetition() {

    }

    render() {
        const competitions = this.props.competitions;
        return (
            <div className="competition-listing">
                {this.competitions(competitions)}
            </div>

        )
    }
}

class CompetitionItem extends React.Component {

    render() {
        const competition = this.props.competition;
        return (
            <Link to={'/competition/' + competition.id + '/' + competition.current_season_id}>
                <div className="competition">
                    {competition.name}
                </div>
            </Link>
        )
    }
}



export default Competitions;
