import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import './ContractHome.scss'
import AlertCard from './AlertCard/AlertCard';

class ContractHome extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="contract-home-wrapper">
        <div className="nav">
          <a className="logo" href="">Logo</a>
          <span>contract address</span>
        </div>

        <div className="container">
          <div>
            <button>+ Add trigger</button>
            <button>View triggers</button>
          </div>
          <div>
            <h2>Latest alerts</h2>
            <AlertCard alert={{}} />
          </div>
          <div>
            <h2>Past alerts</h2>
            <AlertCard alert={{}} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContractHome);