import React from 'react';
import { Link, Redirect } from 'react-router-dom';

import './Home.scss';
import { getContractId, getContractIdSuccess } from '../../actions/contractActions';
import { connect } from 'react-redux';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contracts: [],
      address: '0xf0417825227c5bdcb39d2d9f44e069be3d0f69c4',
      abi: '[{"constant":false,"inputs":[{"name":"_number","type":"uint256"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]',
      network: 'kovan',
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

  handleFormSubmit(e) {
    e.preventDefault();
    const {
      address,
      abi,
      network,
    } = this.state;
    this.props.getContractId('test', address, abi, network);
  }

  render() {
    const {
      contracts,
      address,
      abi,
    } = this.state;

    const {
      contractId,
    } = this.props;

    if (contractId) {
      return (
        <Redirect to={`/index/${contractId}`} />
      );
    }

    return (
      <div className='home-page'>
        <div className="centered-container">
          <div className="title-wrapper">
            <h1>SmartAlert</h1>
            <p>Watchdog for your contracts</p>
          </div>

          {
            contracts.length > 0 && [
              <div className="saved-contracts">
                <h2>Recent contracts</h2>
                {
                  contracts.map(contract => (
                    <div key={contract.id} className="contract">
                      <a
                        onClick={() => this.props.getContractIdSuccess(contract.id, contract.address)}>{contract.address}</a>
                    </div>
                  ))
                }
              </div>,
              <h2>Add new contract</h2>
            ]
          }

          <form onSubmit={this.handleFormSubmit} className="form-wrapper">
            <div className="form-group">
              <input placeholder="Enter your contract address" name="address"
                     onChange={this.handleInput} value={address} type="text" />
            </div>
            <div className="form-group">
              <textarea placeholder="ABI" name="abi" onChange={this.handleInput} value={abi} />
            </div>
            <div className="form-group">
              <select name="" id="">
                <option value="Kovan">Kovan</option>
              </select>
            </div>
            <button className="button" onClick={this.handleFormSubmit} type="submit">Get my report
            </button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  contractId: state.app.contractId,
});

const mapDispatchToProps = {
  getContractId,
  getContractIdSuccess,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
