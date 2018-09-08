import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import './ActiveTriggers.scss';

class ActiveTriggers extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="modal">
        <div className="container">
          <h2>Active triggers</h2>
          <div>
            {
              this.props.activeTriggers.map((trigger) => (
                <div key={trigger.id} className={`active-trigger-wrapper danger-${trigger.danger}`}>
                  <h3 title={trigger.type}>{trigger.name}</h3>
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