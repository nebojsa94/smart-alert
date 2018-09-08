import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import './ContractHome.scss';
import AlertCard from './AlertCard/AlertCard';
import { fetchTriggers } from '../../actions/apiActions';
import ActiveTriggers from '../ActiveTriggers/ActiveTriggers';
import AddTrigger from '../AddTrigger/AddTrigger';

class ContractHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: '',
    };

    this.setActiveTab = this.setActiveTab.bind(this);
  }

  componentDidMount() {
    // fetch active triggers
    this.props.fetchTriggers();
    // fetch alerts for each trigger

  }

  setModal(modal) {
    this.setState({
      showModal: modal,
    });
  }

  setActiveTab(activeTab) {
    this.setState({
      activeTab,
    });
  }

  render() {
    return (
      <div className="contract-home-wrapper">
        <div className="container">
          <div>
            <button className="button light" onClick={() => this.setModal('add-trigger')}>+ Add trigger</button>
            &nbsp;&nbsp;&nbsp;
            <button className="button light" onClick={() => this.setModal('active-triggers')}>View
              triggers
            </button>
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
        {
          this.state.showModal === 'add-trigger' &&
          <AddTrigger closeModal={() => this.setModal('')} />
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  contractAddress: state.app.contractAddress,
});
const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchTriggers,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContractHome);