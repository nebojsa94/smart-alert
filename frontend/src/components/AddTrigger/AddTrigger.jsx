import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { triggerTypes } from '../../actions/apiActions';
import './AddTrigger.scss';

class AddTrigger extends Component {
  constructor(props) {
    super(props);
    this.addTrigger = this.addTrigger.bind(this)
  }

  addTrigger() {
    this.props.closeModal()
  }

  render() {
    return (
      <div className="modal add-trigger-modal">
        <div className="container">
          <h2 className="has-subtitle">Add trigger</h2>
          <p className="subtitle">Set up a new trigger for your contract. </p>
          <h3>Type</h3>
          <div className="trigger-types-wrapper">
            {
              triggerTypes.map((trigger) => (
                <label key={trigger.type}>
                  <input type="radio" name="type" />
                  <div className={`trigger-type-wrapper danger-${trigger.danger}`}>
                    <h3 title={trigger.type}>{trigger.name}</h3>
                    <p>{trigger.description}</p>
                  </div>
                </label>
              ))
            }
          </div>

          <h3>Alert</h3>
          <div className="alerts-wrapper">
            <div className="alert-wrapper">
              <label><input type="checkbox" name="" id="" />Email</label>
            </div>
            <div className="alert-wrapper">
              <label className="disabled">
                <input type="checkbox" name="" id="" disabled />Slack
                <span className="locked">Slack integration not set up</span>
              </label>
            </div>
            <div className="alert-wrapper">
              <label className="disabled">
                <input type="checkbox" name="" id="" disabled />SMS
                <span className="locked">SMS integration not set up</span>
              </label>
            </div>
          </div>

          <div className="modal-buttons">
            <button className="button light" onClick={this.addTrigger}>Add trigger</button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  activeTriggers: state.app.activeTriggers,
});
const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddTrigger);