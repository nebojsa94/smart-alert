import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

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
                <div key={trigger.id}>
                  <h3>{trigger.type}</h3>
                  <div>{JSON.stringify(trigger)}</div>
                  <div>
                    <a onClick={() => console.log('Edit ' + trigger.id)}>Edit</a>
                    <a onClick={() => console.log('Remove ' + trigger.id)}>Remove</a>
                  </div>
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