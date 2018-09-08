import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './components/Home/Home';
import Dashboard from './components/Dashboard/Dashboard';

class Routes extends React.Component {

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/index/:id" component={Dashboard} />
        </div>
      </Router>
    );
  }
}

export default Routes;
