import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addTrigger, triggerTypes } from '../../actions/apiActions';
import './AddTrigger.scss';
import { parseInputOutputs } from '../../services/utils';

class AddTrigger extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTrigger: null,
      method: '',
      ipfsHashPosition: null,
      validateMethod: '',
      validatePosition: null,
      validateRegExp: null,
    };

    this.addTrigger = this.addTrigger.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  handleOptionChange(e) {
    this.setState({
      selectedTrigger: parseInt(e.target.value, 10)
    });
  }

  handleInput(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  addTrigger() {
    const {
      selectedTrigger,
    } = this.state;
    let defaultInputs = {
      method: '',
      inputUint: [],
      inputString: [],
      outputUint: [],
      outputString: []
    };

    let defaultOutputs = {
      outputUint: [],
      outputString: [],
    };

    const { inputs, outputs } = parseInputOutputs(defaultInputs, defaultOutputs, selectedTrigger, this.state);

    // Get inputs

    console.log(triggerTypes, selectedTrigger, triggerTypes[selectedTrigger]);
    this.props.addTrigger(inputs, outputs, triggerTypes[selectedTrigger]);
    this.props.closeModal();
  }

  render() {
    const {
      selectedTrigger,
    } = this.state;

    const customTriggers = [0, 6, 8];

    return (
      <div className="modal add-trigger-modal">
        <div className="container">
          <h2 className="has-subtitle">Add trigger</h2>
          <p className="subtitle">Set up a new trigger for your contract. </p>
          <h3>Type</h3>
          <div className="trigger-types-wrapper">
            {
              triggerTypes.map((trigger, index) => (
                <label key={trigger.type}>
                  <input
                    value={index} type="radio" name="type"
                    onChange={this.handleOptionChange}
                  />
                  <div className={`trigger-type-wrapper danger-${trigger.danger}`}>
                    <h3 title={trigger.type}>{trigger.name}</h3>
                    <p>{trigger.description}</p>
                  </div>
                </label>
              ))
            }
          </div>

          {
            customTriggers.indexOf(selectedTrigger) >= 0 &&
            <div className="additional-fields form-wrapper">
              <h3>Additional information</h3>
              {
                selectedTrigger === 0 &&
                <input
                  name="method"
                  onChange={this.handleInput}
                  type="text"
                  placeholder="Your withdraw function name"
                />
              }
              {
                selectedTrigger === 6 &&
                <input
                  name="ipfsHashPosition"
                  onChange={this.handleInput}
                  type="number"
                  placeholder="Position of your ipfsHash parameter"
                />
              }
              {
                selectedTrigger === 8 &&
                <div>
                  <input
                    name="validateMethod"
                    onChange={this.handleInput}
                    type="text"
                    placeholder="Method to validate"
                  />
                  <input
                    name="validatePosition"
                    onChange={this.handleInput}
                    type="text"
                    placeholder="Position of the parameter to validate"
                  />
                  <input
                    name="validateRegExp"
                    onChange={this.handleInput}
                    type="text"
                    placeholder="Your RegExp expression"
                  />
                </div>
              }
            </div>
          }

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
            <button className="button light" onClick={this.props.closeModal}>Cancel</button>
            <button className="button" onClick={this.addTrigger}>Add trigger</button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  activeTriggers: state.app.activeTriggers,
});
const mapDispatchToProps = (dispatch) => bindActionCreators({
  addTrigger,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddTrigger);