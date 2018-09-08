import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { etherscanLink, prettifyDate } from '../../../services/utils';

import './AlertCard.scss';

class AlertCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      trigger: {
        name = 'Name missing',
        danger = 'red',
      },
      date = new Date(),
      originalObject: {
        transactionHash = '0x',
      }
    } = this.props.alert;

    return (
      <div className={`alert-card-container danger-${danger}`}>
        <div className="alert-icon" />
        <div className="meta">
          <h3>{name} <span className="date" title={date}>{prettifyDate(date)}</span></h3>
          <p>
            <a target="_blank" rel="noopener" href={etherscanLink(transactionHash)}>
              tx hash: {transactionHash}
            </a>
          </p>
        </div>
      </div>
    );
  }
}

AlertCard.propTypes = {
  // alert: PropTypes.shape
};

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AlertCard);