import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import './ContractHome.scss'
import AlertCard from './AlertCard/AlertCard';
import { fetchTriggers } from '../../actions/apiActions';
import ActiveTriggers from '../ActiveTriggers/ActiveTriggers';

class ContractHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: '',
    }
  }

  componentDidMount() {
    // fetch active triggers
    this.props.fetchTriggers()
    // fetch alerts for each trigger

  }

  setModal(modal) {
    this.setState({
      showModal: modal,
    })
  }

  render() {
    return (
      <div className="contract-home-wrapper">
        <div className="nav">
          <div className="container">
            <a className="logo" href="">SmartAlert</a>
            <span>contract address</span>
          </div>
        </div>

        <div className="container">
          <div>
            <button>+ Add trigger</button>
            <button onClick={() => this.setModal('active-triggers')}>View triggers</button>
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

        {
          this.state.showModal === 'active-triggers' &&
          <ActiveTriggers closeModal={() => this.setModal('')} />
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchTriggers,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContractHome);