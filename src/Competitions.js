import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import './App.css';
const api_key= "HOLCAStI6Z0OfdoPbjdSg5b41Q17w2W5P4WuoIBdC66Z54kUEvGWPIe33UYC";

class Competitions extends Component {
   constructor(props) {
       super(props);
       this.state = {
           url: "https://soccer.sportmonks.com/api/v2.0/leagues?api_token=",
           competitions: null,
       };
   }
    componentDidMount () {
        this.getCompetitionsData();
    }

    getCompetitionsData(){
        const self=this;
        fetch(self.state.url+""+api_key).then(results=>results.json()).then(function(data){
            console.log(data.data);
            const estado = Object.assign({},self.state,{competitions:data.data});
            self.setState(estado);
        });
        console.log(self.state.url+""+api_key);
    }

    render() {
        return (
            <div className="listagem-campeaonatos">
                <h2 className="titulo-campeonatos">Competitions Listing</h2>
                <CompetitionsTable competitions={this.state.competitions} />
            </div>
        );
    }
}

class CompetitionsTable extends React.Component{
    competitions(competitions){
        if(competitions!==null) {
            return competitions.map(competition => {
                return(<CompetitionItem competition={competition} onClick={()=>this.renderCompetition(competition)} />)
            });
        }
    }

    renderCompetition(){

    }

    render(){
        const competitions =this.props.competitions;
        console.log(competitions);
        return(
            <div className="table">
                {this.competitions(competitions)}
            </div>
        )
    }
}

class CompetitionItem extends React.Component{

    render(){
        const competition = this.props.competition;
        return(
            <div className="competition">
                <Link to={'/competition/'+competition.id+'/'+competition.current_season_id}>{competition.name}</Link>
            </div>
        )
    }


}

export default Competitions;
