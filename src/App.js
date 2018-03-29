import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Competitions from './Competitions';
import League from './League';

class App extends Component {
    render() {
        return (

            <Router>
                <div className="App">
                    <Route exact path="/" component={Competitions}/>
                    <Route path="/competition/:id/:season" component={League}/>
                </div>
            </Router>
        );
    }
}

const Home = () => <h1>Hello from Home!</h1>;

export default App;
