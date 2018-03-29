import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './App.css';
const api_key = "HOLCAStI6Z0OfdoPbjdSg5b41Q17w2W5P4WuoIBdC66Z54kUEvGWPIe33UYC";

class League extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: "https://soccer.sportmonks.com/api/v2.0/standings/season/",
            league: null,
            standings: null,
            id: this.props.match.params.id,
            season: this.props.match.params.season,
            sort: {
                column: null,
                type: null,
            }
        };

    }

    componentDidMount() {
        if (this.state.id !== null && this.state.season !== null) {
            this.getLeagueData();
        }
    }



    sum(team, column) {
        return parseInt(team.away[column]) + parseInt(team.home[column]);
    }

    goal(team) {
        return parseInt(team.away.goals_against) + parseInt(team.away.goals_scored) + parseInt(team.home.goals_against) + parseInt(team.home.goals_scored);
    }

    fillTable(standings) {
        if (standings !== null) {
            return standings.map((team) => {
                return (
                    <tr>
                        <td>{team.position}</td>
                        <td>{team.team_name} </td>
                        <td>{this.sum(team, 'games_played')}</td>
                        <td>{this.sum(team, 'won')}</td>
                        <td>{this.sum(team, 'draw')}</td>
                        <td>{this.sum(team, 'lost')}</td>
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
                return (header !== 'points') ? parseInt(a[header]) - parseInt(b[header]) : parseInt(a['total']['points']) - parseInt(b['total']['points']);
            });
            const changeSort = {column: header, type: 'asc'};
            const estado = Object.assign({}, this.state, {standings: dados, sort: changeSort});
            this.setState(estado);
        } else {
            dados.sort(function (a, b) {
                return (header !== 'points') ? parseInt(b[header]) - parseInt(a[header]) : parseInt(b['total']['points']) - parseInt(a['total']['points']);
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
        }else{
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

    sortSum(header) {
        var self = this;
        var dados = this.state.standings;

        const sort = this.state.sort;

        if (sort.column !== header || sort.type !== 'asc') {
            dados.sort(function (a, b) {
                return self.sum(a, header) - self.sum(b, header);
            });
            const sort = {column: header, type: 'asc'};
            const estado = Object.assign({}, this.state, {standings: dados, sort: sort});
            this.setState(estado);
        }else{
            dados.sort(function (a, b) {
                return self.sum(b, header) - self.sum(a, header);
            });
            const sort = {column: header, type: 'desc'};
            const estado = Object.assign({}, this.state, {standings: dados, sort: sort});
            this.setState(estado);
        }
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
        }else{
            dados.sort(function (a, b) {
                return self.goal(b) - self.goal(a);
            });
            const sort = {column: header, type: 'desc'};
            const estado = Object.assign({}, this.state, {standings: dados, sort: sort});
            this.setState(estado);
        }
    }

    sortDifference(header) {
        var self = this;
        var dados = this.state.standings;

        const sort = this.state.sort;

        if (sort.column !== header || sort.type !== 'asc') {
        dados.sort(function (a, b) {
            return parseInt(a.total.goal_difference) - parseInt(b.total.goal_difference);
        });
        const sort = {column: header, type: 'asc'};
        const estado = Object.assign({}, this.state, {standings: dados, sort: sort});
        this.setState(estado);

        } else{
            dados.sort(function (a, b) {
                return parseInt(b.total.goal_difference) - parseInt(a.total.goal_difference);
            });
            const sort = {column: header, type: 'desc'};
            const estado = Object.assign({}, this.state, {standings: dados, sort: sort});
            this.setState(estado);
        }
    }

    getLeagueData() {
        const self = this;
        fetch(self.state.url + "" + self.state.season + "?api_token=" + api_key).then(results => results.json()).then(function (data) {
            const estado = Object.assign({}, self.state, {standings: data.data[0].standings.data});
            self.setState(estado);
        });
        console.log(self.state.url + "" + self.state.id + "?api_token=" + api_key);
    }

    render() {
        return (
            <div className="listagem-campeaonatos">
                <h2 className="titulo-League">Standings</h2>
                <table className="table">
                    <thead>
                    <tr>
                        <th onClick={() => this.sort('position')}>Position</th>
                        <th onClick={() => this.sortName()}>Team Name</th>
                        <th onClick={() => this.sortSum('games_played')}>Played</th>
                        <th onClick={() => this.sortSum('won')}>Won</th>
                        <th onClick={() => this.sortSum('draw')}>Drawn</th>
                        <th onClick={() => this.sortSum('lost')}>Lost</th>
                        <th onClick={() => this.sortGoal('goals')}>Goal</th>
                        <th onClick={() => this.sortDifference('difference')}>Difference</th>
                        <th onClick={() => this.sort('points')}>Points</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.fillTable(this.state.standings)}
                    </tbody>
                </table>
            </div>
        );
    }
}
export default League;
