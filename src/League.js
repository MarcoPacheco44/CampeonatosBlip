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
            sort:{
                column:null,
                type:null,
            }
        };

    }

    componentDidMount() {
        if (this.state.id !== null && this.state.season !== null) {
            this.getLeagueData();
        }
    }

    sortName(header) {
        var dados = this.state.standings;

        dados.sort(function (a,b) {
            var nameA= a[header].toUpperCase();
            var nameB= b[header].toUpperCase();

            if(nameA < nameB){
                return -1;
            }
            if(nameA > nameB ){
                return 1;
            }
            return 0;
        });
        const sort ={column:header,type:'asc'};
        const estado=Object.assign({},this.state,{standings:dados,sort:sort});
        this.setState(estado);
    }

    sort(header){
        var dados = this.state.standings;
        dados.sort(function (a, b) {
            return (header!=='points')?parseInt(a[header]) - parseInt(b[header]):parseInt(a['total']['points']) - parseInt(b['total']['points']);
        });
        const sort ={column:header,type:'asc'};
        const estado=Object.assign({},this.state,{standings:dados,sort:sort});
        this.setState(estado);
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
                        <th onClick={()=>this.sort('position')}>Position</th>
                        <th onClick={()=>this.sortName()}>Team Name</th>
                        <th onClick={()=>this.sortPlayed('Played')}>Played</th>
                        <th onClick={()=>this.sortWon('Won')}>Won</th>
                        <th onClick={()=>this.sortDrawn('Drawn')}>Drawn</th>
                        <th onClick={()=>this.sortLost('Lost')}>Lost</th>
                        <th onClick={()=>this.sortGoal('Goal')}>Goal</th>
                        <th onClick={()=>this.sortDifference('Difference')}>Difference</th>
                        <th onClick={()=>this.sort('points')}>Points</th>
                    </tr>
                    </thead>

                    <TeamsStanding standings={this.state.standings}/>

                </table>
            </div>
        );
    }
}


class TeamsStanding extends React.Component {

    played(team){
        return parseInt(team.away.games_played) + parseInt(team.home.games_played);
    }
    won(team){
        return parseInt(team.away.won) + parseInt(team.home.won);
    }
    drawn(team){
        return parseInt(team.away.draw) + parseInt(team.home.draw);
    }
    lost(team){
        return parseInt(team.away.lost) + parseInt(team.home.lost);
    }

    goal(team){
        return parseInt(team.away.goals_against)+parseInt(team.away.goals_scored) + parseInt(team.home.goals_against) + parseInt(team.home.goals_scored);
    }


    fillTable(standings) {
        if (standings !== null) {
            return standings.map((team) => {
                return (
                    <tr>
                        <td>{team.position}</td>
                        <td>{team.team_name} </td>
                        <td>{this.played(team)}</td>
                        <td>{this.won(team)}</td>
                        <td>{this.drawn(team)}</td>
                        <td>{this.lost(team)}</td>
                        <td>{this.goal(team)}</td>
                        <td>{team.total.goal_difference}</td>
                        <td>{team.total.points}</td>
                    </tr>
                )
            });
        }

    }

    render() {
        const standings = this.props.standings;
        return (
            <tbody>
            {this.fillTable(standings)}
            </tbody>
        );
    }


}


//
// class CompetitionsTable extends React.Component{
//     competitions(competitions){
//         if(competitions!==null) {
//             return competitions.map(competition => {
//                 return(<CompetitionItem competition={competition} onClick={()=>this.renderCompetition(competition)} />)
//             });
//         }
//     }
//
//     renderCompetition(){
//
//     }
//
//     render(){
//         const competitions =this.props.competitions;
//         console.log(competitions);
//         return(
//             <div className="table">
//                 {this.competitions(competitions)}
//             </div>
//         )
//     }
// }
//
// class CompetitionItem extends React.Component{
//
//     render(){
//         const competition = this.props.competition;
//         return(
//             <div className="competition">
//                 <Link to={'/competition/'+competition.id}>{competition.name}</Link>
//             </div>
//         )
//     }
//
//
// }

export default League;
