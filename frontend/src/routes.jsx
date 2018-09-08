import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './components/Home/Home';
import ContractHome from './components/ContractHome/ContractHome';

class Routes extends React.Component {

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/index" component={ContractHome} />
        </div>
      </Router>
    );
  }
}

export default Routes;
