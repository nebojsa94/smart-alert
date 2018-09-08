import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import './ContractHome.scss'
import AlertCard from './AlertCard/AlertCard';
import { fetchTriggers } from '../../actions/apiActions';
import ActiveTriggers from '../ActiveTriggers/ActiveTriggers';
import { etherscanLink } from '../../services/utils';

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
    const { contractAddress = '0x' } = this.props;
    return (
      <div className="contract-home-wrapper">
        <div className="nav">
          <div className="container">
            <Link className="logo" to="/">SmartAlert</Link>
            <a
              className="ct-address"
              href={etherscanLink(contractAddress)}
              target="_blank" rel="noopener"
            >{contractAddress}</a>
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