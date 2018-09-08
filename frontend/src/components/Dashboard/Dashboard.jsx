import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { etherscanLink } from '../../services/utils';
import ContractHome from '../ContractHome/ContractHome';

import './Dashboard.scss';
import connect from 'react-redux/es/connect/connect';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'alerts',
    };

    this.setActiveTab = this.setActiveTab.bind(this);
  }

  setActiveTab(activeTab) {
    this.setState({
      activeTab,
    });
  }

  render() {
    const { activeTab } = this.state;
    const { contractAddress = '0x' } = this.props;
    return (
      <div className="contract-home-wrapper">
        <div className="nav">
          <div className="container">
            <div className="logo-wrapper">
              <Link className="logo" to="/">SmartAlert</Link>
              <div className="tabs">
                <div onClick={() => this.setActiveTab('alerts')}
                     className={activeTab === 'alerts' ? 'tab active' : 'tab'}>Alerts
                </div>
                <div onClick={() => this.setActiveTab('stats')}
                     className={activeTab === 'stats' ? 'tab active' : 'tab'}>Statistics
                </div>
              </div>
            </div>
            <a
              className="ct-address"
              href={etherscanLink(contractAddress)}
              target="_blank" rel="noopener"
            >{contractAddress}</a>
          </div>
        </div>

        {
          activeTab === 'alerts' &&
          <ContractHome />
        }
        {
          activeTab === 'stats' &&
          <div>

          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  contractAddress: state.app.contractAddress,
});

export default connect(
  mapStateToProps,
)(Dashboard);