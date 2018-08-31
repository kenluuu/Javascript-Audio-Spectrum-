import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home.js';
import NavBar from './NavBar.js';
import Visualizer from './Visualizer.js';

import './App.css';



class App extends Component {

  render() {
    return (
        <Router>
          <div style={style.appStyle}>
              <Route path="/*" component={ NavBar }/>
              <Switch>
                <Route exact path="/track/:id" component={Visualizer}/>
                <Route  path="/" component={Home}/>
              </Switch>


          </div>
        </Router>

    )
  }
}


const style = {
  appStyle : {
    
    display: 'flex',
    justifyContent: 'center',
    height: '100%'
  }
}
export default App;
