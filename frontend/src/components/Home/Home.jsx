import React from 'react';
import { Link, Redirect } from 'react-router-dom';

import './Home.scss';
import { addContract } from '../../actions/contractActions';
import { connect } from 'react-redux';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contracts: [],
      name: 'DemoContract.sol',
      address: '0xf0417825227c5bdcb39d2d9f44e069be3d0f69c4',
      abi: '[{"constant":false,"inputs":[{"name":"_number","type":"uint256"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]',
      blockNumber: '8651544',
      network: 'kovan',
      shouldRedirect: false,
      error: '',
      showForm: false,
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  componentDidMount() {
    let contracts = localStorage.getItem('contracts') || '[]';

    this.setState({
      contracts: JSON.parse(contracts),
    });
  }

  handleInput(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  async handleFormSubmit(e) {
    e.preventDefault();
    this.setState({ error: '' });
    const {
      address,
      abi,
      network,
      name,
      blockNumber,
    } = this.state;
    // Add name to form?
    try {
      await this.props.addContract(name, address, abi, network, blockNumber);
      this.setState({
        shouldRedirect: true,
      });
    } catch (error) {
      console.log(error);
      this.setState({ error });
    }
  }

  render() {
    const {
      contracts,
      address,
      name,
      abi,
      blockNumber,
      shouldRedirect,
    } = this.state;

    if (shouldRedirect) {
      return (
        <Redirect to={`/index/${address}`} />
      );
    }

    return (
      <div className='home-page'>
        <div className="centered-container">
          <div className="title-wrapper">
            <h1>SmartAlert</h1>
            <p>Watchdog for your contracts</p>
          </div>
          <hr />
          {
            contracts.length > 0 &&
            !this.state.showForm && [
              <div className="saved-contracts" key="1">
                <h2>Recent contracts</h2>
                {
                  contracts.map(contract => (
                    <div key={contract.id} className="contract">
                      <a
                        className="recent-ct"
                        onClick={() => {
                          this.setState({
                            address: contract.address,
                            shouldRedirect: true,
                          });
                        }}>{contract.name} - {contract.address}</a>
                    </div>
                  ))
                }

                <button className="button light full-width"
                        onClick={() => this.setState({ showForm: true })}>
                  Add new contract
                </button>
              </div>,
            ]
          }

          {
            (this.state.showForm || contracts.length === 0) &&
            <div>
              <h2>Add new contract</h2>
              <form onSubmit={this.handleFormSubmit} className="form-wrapper">
                <div className="form-group">
                  <input placeholder="Contract name" name="name"
                         onChange={this.handleInput} value={name} type="text" />
                </div>
                <div className="form-group">
                  <input placeholder="Enter your contract address" name="address"
                         onChange={this.handleInput} value={address} type="text" />
                </div>
                <div className="form-group">
                  <textarea placeholder="ABI" name="abi" onChange={this.handleInput} value={abi} />
                </div>
                <div className="form-group">
                  <input
                    placeholder="Contract creation block number"
                    name="blockNumber"
                    onChange={this.handleInput} value={blockNumber} type="text" />
                </div>
                <div className="form-group">
                  <select name="" id="">
                    <option value="Kovan">Kovan</option>
                  </select>
                </div>
                <div className="button-wrapper">
                  {this.state.error}
                  {
                    contracts.length > 0 &&
                    <button className="button light"
                            onClick={() => this.setState({ showForm: false })}>
                      Cancel
                    </button>
                  }
                  <button className="button" onClick={this.handleFormSubmit} type="submit">
                    Add Contract
                  </button>
                </div>
              </form>
            </div>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  addContract,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
