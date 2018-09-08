import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { prettifyDate } from '../../../services/utils';

import './AlertCard.scss';

class AlertCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      name = 'Name missing',
      danger = 'red',
      date = new Date(),
      txHash = '0x',
    } = this.props.alert;

    return (
      <div className={`alert-card-container danger-${danger}`}>
        <div className="alert-icon" />
        <div className="meta">
          <h3>{name} <span className="date">{prettifyDate(date)}</span></h3>
          <p>tx hash: {txHash}</p>
        </div>
      </div>
    );
  }
}

AlertCard.propTypes = {
  alert: PropTypes.shape
};

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AlertCard);