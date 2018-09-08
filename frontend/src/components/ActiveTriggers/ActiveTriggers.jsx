import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import './ActiveTriggers.scss';
import { triggerTypeMap } from '../../actions/apiActions';

class ActiveTriggers extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="modal">
        <div className="container">
          <h2 className="has-subtitle">Active triggers</h2>
          {
            !this.props.activeTriggers.length &&
            <p className="empty">
              No active triggers.
            </p>
          }
          {
            this.props.activeTriggers.length > 0 &&
            <div>
              <p className="subtitle">We're currently monitoring for these triggers. </p>
              {
                this.props.activeTriggers.map((trigger) => (
                  <div key={trigger._id} className={`active-trigger-wrapper danger-${trigger.danger}`}>
                    <h3 title={triggerTypeMap[trigger.type].description}>{triggerTypeMap[trigger.type].name}</h3>
                    {/*<p>{JSON.stringify(trigger)}</p>*/}
                    {/*{SHOW TRIGGER PARAMS HERE}*/}
                    <p>
                      <a onClick={() => console.log('Edit ' + trigger.id)}>Edit</a>
                      <a onClick={() => console.log('Remove ' + trigger.id)}>Remove</a>
                    </p>
                  </div>
                ))
              }
            </div>
          }
          <div>
            <button className="button light" onClick={this.props.closeModal}>Done</button>
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
)(ActiveTriggers);