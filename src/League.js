import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import './App.css';

const api_key = "HOLCAStI6Z0OfdoPbjdSg5b41Q17w2W5P4WuoIBdC66Z54kUEvGWPIe33UYC";

class League extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            url: "https://soccer.sportmonks.com/api/v2.0/standings/season/",
            league: null,
            standings: null,
            id: this.props.match.params.id,
            season: this.props.match.params.season,
            sort: {
                column: null,
                type: null,
            },
            show_modal: false,
            team: null,
            is_loading:true,
        };

    }

    componentDidMount() {
        if (this.state.id !== null && this.state.season !== null) {
            this.getLeagueData();
        }
    }

    goal(team) {
        return parseInt(team.overall.goals_against) + parseInt(team.overall.goals_scored);
    }

    fillTable(standings) {
        if (standings !== null) {
            return standings.map((team) => {
                return (
                    <tr onClick={() => this.showTeamModal(team)}>
                        <td>{team.position}</td>
                        <td>{team.team_name} </td>
                        <td>{team.overall.games_played}</td>
                        <td>{team.overall.won}</td>
                        <td>{team.overall.draw}</td>
                        <td>{team.overall.lost}</td>
                        <td>{this.goal(team)}</td>
                        <td>{team.total.goal_difference}</td>
                        <td>{team.total.points}</td>
                    </tr>
                )
            });
        }
    }

    sort(header) {
        var dados = this.state.standings;
        const sort = this.state.sort;

        if (sort.column !== header || sort.type !== 'asc') {
            dados.sort(function (a, b) {
                return (header == 'position') ? parseInt(a[header]) - parseInt(b[header]) : parseInt(a['total'][header]) - parseInt(b['total'][header]);
            });
            const changeSort = {column: header, type: 'asc'};
            const estado = Object.assign({}, this.state, {standings: dados, sort: changeSort});
            this.setState(estado);
        } else {
            dados.sort(function (a, b) {
                return (header == 'position') ? parseInt(b[header]) - parseInt(a[header]) : parseInt(b['total'][header]) - parseInt(a['total'][header]);
            });
            const changeSort = {column: header, type: 'desc'};
            const estado = Object.assign({}, this.state, {standings: dados, sort: changeSort});
            this.setState(estado);
        }
    }

    sortName(header) {
        var dados = this.state.standings;
        const sort = this.state.sort;

        if (sort.column !== header || sort.type !== 'asc') {
            dados.sort(function (a, b) {
                var nameA = a.team_name.toUpperCase();
                var nameB = b.team_name.toUpperCase();

                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            });
            const sort = {column: header, type: 'asc'};
            const estado = Object.assign({}, this.state, {standings: dados, sort: sort});
            this.setState(estado);
        } else {
            dados.sort(function (a, b) {
                var nameA = a.team_name.toUpperCase();
                var nameB = b.team_name.toUpperCase();

                if (nameA > nameB) {
                    return -1;
                }
                if (nameA < nameB) {
                    return 1;
                }
                return 0;
            });
            const sort = {column: header, type: 'desc'};
            const estado = Object.assign({}, this.state, {standings: dados, sort: sort});
            this.setState(estado);
        }
    }

    sortOverall(header) {
        var self = this;
        var dados = this.state.standings;

        const sort = this.state.sort;

        if (sort.column !== header || sort.type !== 'asc') {
            dados.sort(function (a, b) {
                return a.overall[header] - b.overall[header];
            });
            const sort = {column: header, type: 'asc'};
            const estado = Object.assign({}, this.state, {standings: dados, sort: sort});
            this.setState(estado);
        } else {
            dados.sort(function (a, b) {
                return b.overall[header] - a.overall[header];
            });
            const sort = {column: header, type: 'desc'};
            const estado = Object.assign({}, this.state, {standings: dados, sort: sort});
            this.setState(estado);
        }
    }

    toggle(estado) {
        const newState = Object.assign({}, this.state, {show_modal: !estado,team:null});
        this.setState(newState);
    }

    sortGoal(header) {
        var self = this;
        var dados = this.state.standings;
        const sort = this.state.sort;

        if (sort.column !== header || sort.type !== 'asc') {
            dados.sort(function (a, b) {
                return self.goal(a) - self.goal(b);
            });
            const sort = {column: header, type: 'asc'};
            const estado = Object.assign({}, this.state, {standings: dados, sort: sort});
            this.setState(estado);
        } else {
            dados.sort(function (a, b) {
                return self.goal(b) - self.goal(a);
            });
            const sort = {column: header, type: 'desc'};
            const estado = Object.assign({}, this.state, {standings: dados, sort: sort});
            this.setState(estado);
        }
    }

    getLeagueData() {
        const self = this;
        fetch(self.state.url + "" + self.state.season + "?api_token=" + api_key).then(results => results.json()).then(function (data) {
           console.log(data.length);
            if( data.data[0] === undefined) {

           }else{
                const estado = Object.assign({}, self.state, {
                    standings: data.data[0].standings.data,
                    is_loading: false
                });
                self.setState(estado);
            }
        });
        console.log(self.state.url + "" + self.state.season + "?api_token=" + api_key);
    }

    showTeamModal(team) {
        const estado = Object.assign({}, this.state, {team: team,show_modal: true});
        this.setState(estado);
    }

    changeSeason(season) {
        const estado=Object.assign({},this.state,{season:season,is_loading:true});
        this.setState(estado,()=>this.getLeagueData());
    }

    render() {
        const externalCloseBtn = <button onClick={this.toggle} className="close"
                                         style={{color:'red',position: 'absolute', top: '15px', right: '15px'}}
                                         onClick={() => this.toggle(this.state.show_modal)}>&times;</button>;
        return (
            <div className="container">
                <Header onChange={(e)=>this.changeSeason(e)} league={this.state.id} season={this.state.season}/>
                <div className="listagem-campeonatos">

                    <h2 className="titulo-league">Standings</h2>
                    <table className="table">
                        <thead>
                        <tr>
                            <th onClick={() => this.sort('position')}>Position</th>
                            <th onClick={() => this.sortName()}>Team Name</th>
                            <th onClick={() => this.sortOverall('games_played')}>Played</th>
                            <th onClick={() => this.sortOverall('won')}>Won</th>
                            <th onClick={() => this.sortOverall('draw')}>Drawn</th>
                            <th onClick={() => this.sortOverall('lost')}>Lost</th>
                            <th onClick={() => this.sortGoal('goals')}>Goal</th>
                            <th onClick={() => this.sort('goal_difference')}>Difference</th>
                            <th onClick={() => this.sort('points')}>Points</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.is_loading!==true?this.fillTable(this.state.standings):null}
                        </tbody>
                    </table>

                </div>
                {
                    this.state.team !== null ?
                        <MyModal onClick={() => this.toggle(this.state.show_modal)} external={externalCloseBtn}
                                 team={this.state.team} estado={this.state.show_modal}/> : null
                }
            </div>
        );
    }
}

class MyModal extends React.Component {
    state = {
        is_loading:true,
        team:this.props.team,
        squad: null,
        estado: this.props.estado
    };

    componentDidMount() {
        if (this.props.team !== null) {
            this.setState({team_id:this.props.team},()=>this.getTeamPlayers());
        }
    }


    componentWillReceiveProps(){
            this.setState({team_id:this.props.team},()=>this.getTeamPlayers());
    }


    getTeamPlayers() {
        const self = this;
        fetch("https://soccer.sportmonks.com/api/v2.0/teams/" + self.state.team.team_id + "?api_token=" + api_key + "&include=squad").then(results => results.json()).then(function (data) {
            const estado = Object.assign({}, self.state, {squad: data.data});
            self.setState(estado);
        });
        console.log("https://soccer.sportmonks.com/api/v2.0/teams/" + self.state.team.team_id + "?api_token=" + api_key + "&include=squad");
    }

    fillTeamPlayers(players) {
        if (players !== null) {
            return players.map((player) => {
                return (
                    <tr>
                        <td>{player.player_id}</td>
                        <td>{player.position_id} </td>
                        <td>{player.number}</td>
                        <td>{player.appearences}</td>
                        <td>{player.minutes}</td>
                        <td>{player.goals}</td>
                        <td>{player.assists}</td>
                        <td>{player.yellowcards}</td>
                        <td>{player.redcards}</td>
                    </tr>
                )
            });
        }
    }

    render() {

        return (
            <div>
                <Modal isOpen={this.props.estado} external={this.props.external}>
                    <ModalBody>
                        <div className="row">
                            <div className="col-6">

                                <img className="img-fluid" src={this.state.squad ? this.state.squad.logo_path : ''}
                                     alt=""/>
                            </div>
                            <div className="col-6">
                                <div className="team_name">{this.state.squad?this.state.squad.name:null}</div>
                                <div className="row team_information">
                                <div className="team_position col-6"> <b>Position : </b> {this.state.team?this.state.team.position:null}</div>
                                <div className="team_form col-6"><b>Recent form : </b> {this.state.team?this.state.team.recent_form:null}</div>
                                </div>
                            </div>
                        </div>
                        <hr/>
                        <h2 class="text-center">Squad</h2>
                        <div className="container">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>Player</th>
                                    <th>Position</th>
                                    <th>Number</th>
                                    <th>Appearences</th>
                                    <th>Minutes</th>
                                    <th>Goals</th>
                                    <th>Assists</th>
                                    <th>Yellow Cards</th>
                                    <th>Red Cards</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.squad ? this.fillTeamPlayers(this.state.squad.squad.data) : null}
                                </tbody>
                            </table>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        )

    }

}

class Header extends React.Component {
    state = {
        seasons: null,
        season:null,
        league:null
    };

    componentDidMount() {
        this.getSeasons();
    }

    getSeasons() {
        var self = this;
        fetch('https://soccer.sportmonks.com/api/v2.0/seasons?api_token=' + api_key).then(response => response.json())
            .then(function (data) {
                const estado = Object.assign({}, self.state, {seasons: data.data,season:self.props.season,league:self.props.league});
                self.setState(estado);
            })
    }

    fillSeasons() {
        return this.state.seasons.map((season) => {
            if(season.league_id == this.state.league)
                    return (<option value={season.id}>{season.name}</option>);}
        );
    }

    render() {
        return (
            <div className="options col-12">
                <Link to="/" className="pull-left">
                    <div className="go-back">
                        <i className="fa fa-arrow-left"></i> Back
                    </div>
                </Link>
                <div className="selectSeason pull-right form-group col-lg-2 col-md-4 col-xs-12">
                    <select onChange={(e)=>{this.props.onChange(e.target.value)}}  value={this.props.season} className="form-control">
                        {this.state.seasons !== null ? this.fillSeasons() : null}
                    </select>
                </div>
            </div>
        );
    }
}

export default League;