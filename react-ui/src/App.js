import React, {} from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Main from "./components/Main";
import "./App.css"




const App = () =>
  <Router>
    <div> 
      <Switch>
        <Route exact path="/" component={Main} />
      </Switch>
    </div>
  </Router>;

export default App;