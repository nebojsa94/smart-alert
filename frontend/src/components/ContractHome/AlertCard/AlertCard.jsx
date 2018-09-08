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
      date = new Date()
    } = this.props.alert;

    return (
      <div className={`alert-card-container danger-${danger}`}>
        <div className="alert-icon" />
        <div className="meta">
          <span className="date">{prettifyDate(date)}</span>
          <h3>{name}</h3>
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