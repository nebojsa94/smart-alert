import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addTrigger, triggerTypes, fetchTriggers } from '../../actions/apiActions';
import './AddTrigger.scss';
import { listFunctions, parseInputOutputs } from '../../services/utils';

class AddTrigger extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTrigger: null,
      withdrawMethod: '',
      ipfsHashPosition: null,
      validateMethod: '',
      validatePosition: 0,
      validateRegExp: null,
    };

    this.addTrigger = this.addTrigger.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  componentDidMount() {
    const methods = listFunctions(this.props.contractAbi);
    if (!methods.length) return;
    const firstMethodInCt = methods[0].name;
    this.setState({
      validateMethod: firstMethodInCt,
      withdrawMethod: methods.filter(method => method.name === 'withdraw').length
        ? 'withdraw' : firstMethodInCt, // set 'withdraw' as initial withdraw method name if it exists
    })
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
      withdrawMethod: '',
      inputUints: [],
      inputStrings: [],
    };

    let defaultOutputs = {
      outputUints: [],
      outputStrings: [],
    };

    const { inputs, outputs } = parseInputOutputs(defaultInputs, defaultOutputs, selectedTrigger, this.state);

    // Get inputs
    try {
      this.props.addTrigger(inputs, outputs, triggerTypes[selectedTrigger]);
      this.props.fetchTriggers();
      this.props.closeModal();
    } catch (e) {

    }
  }

  render() {
    const {
      selectedTrigger,
    } = this.state;

    const customTriggers = [0, 7, 9];

    return (
      <div className="modal add-trigger-modal" onClick={this.props.closeModal}>
        <div className="container" onClick={(e) => e.stopPropagation()}>
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
                    disabled={trigger.disabled}
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
                selectedTrigger === 0 && // Withdraw function
                <div className="label-wrapper">
                  <label htmlFor="withdrawMethod">
                    Your withdraw function name:
                  </label>
                  <select name="withdrawMethod" onChange={this.handleInput} id="withdrawMethod">
                    {
                      listFunctions(this.props.contractAbi).map(method => (
                        <option key={method.name} value={method.name}>{method.name}</option>
                      ))
                    }
                  </select>
                </div>

              }
              {
                selectedTrigger === 7 && // IPFS Validation
                <div>
                  <div className="label-wrapper">
                    <label htmlFor="validateMethod">
                      Method to validate:
                    </label>
                    <select name="validateMethod" onChange={this.handleInput} id="validateMethod">
                      {
                        listFunctions(this.props.contractAbi, true).map(method => (
                          <option key={method.name} value={method.name}>{method.name}</option>
                        ))
                      }
                    </select>
                  </div>
                  <div className="label-wrapper">
                    <label htmlFor="ipfsHashPosition">
                      IPFS Hash parameter:
                    </label>
                    <select name="ipfsHashPosition" onChange={this.handleInput} id="ipfsHashPosition">
                      {
                        this.state.validateMethod &&
                        listFunctions(this.props.contractAbi, true)
                          .filter(method => method.name === this.state.validateMethod).length &&
                        listFunctions(this.props.contractAbi, true)
                          .filter(method => method.name === this.state.validateMethod)[0]
                          .inputs
                          .map((inputs, i) => (
                            <option key={inputs.name} value={i}>{inputs.name}</option>
                          ))
                      }
                    </select>
                  </div>
                </div>
              }
              {
                selectedTrigger === 9 && // Input criteria
                <div>
                  <div className="label-wrapper">
                    <label htmlFor="validateMethod">
                      Method to validate:
                    </label>
                    <select name="validateMethod" onChange={this.handleInput} id="validateMethod">
                      {
                        listFunctions(this.props.contractAbi).map(method => (
                          <option key={method.name} value={method.name}>{method.name}</option>
                        ))
                      }
                    </select>
                  </div>
                  <div className="label-wrapper">
                    <label htmlFor="validatePosition">
                      Parameter to validate:
                    </label>
                    <select name="validatePosition" onChange={this.handleInput} id="validatePosition">
                      {
                        this.state.validateMethod &&
                        listFunctions(this.props.contractAbi)
                          .filter(method => method.name === this.state.validateMethod).length &&
                        listFunctions(this.props.contractAbi)
                          .filter(method => method.name === this.state.validateMethod)[0]
                          .inputs
                          .map((inputs, i) => (
                            <option key={inputs.name} value={i}>{inputs.name}</option>
                          ))
                      }
                    </select>
                  </div>
                  <div className="label-wrapper">
                    <label htmlFor="validatePosition">
                      RegEx expression:
                    </label>
                    <input
                      name="validateRegExp"
                      id="validateRegExp"
                      onChange={this.handleInput}
                      type="text"
                      placeholder="Qm[1-9A-Za-z][^OIl]{43}"
                      className="monospace-input"
                    />
                  </div>
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
  contractAbi: state.app.contractAbi,
});
const mapDispatchToProps = (dispatch) => bindActionCreators({
  addTrigger,
  fetchTriggers,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddTrigger);