import React from 'react';
import { Link } from 'react-router-dom';

import './Home.scss';
import { getContractId } from '../../actions/contractActions';
import { connect } from 'react-redux';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contracts: [],
      address: '',
      abi: '',
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

    return (
      <div className='home-page'>
        <div className="centered-container">
          <div className="title-wrapper">
            <h1>Smart alert</h1>
            <p>Watchdog for your contracts</p>
          </div>

          {
            contracts.length > 0 &&
            <div className="saved-contracts">
              <p>Saved contracts</p>
              {
                contracts.map(contract => (
                  <div key={contract} className="contract">
                    {contract}
                  </div>
                ))
              }
            </div>
          }

          <form onSubmit={this.handleFormSubmit} className="form-wrapper">
            <div className="form-group">
              <label htmlFor="">Address</label>
              <input value={address} type="text" />
            </div>
            <div className="form-group">
              <label htmlFor="">ABI:</label>
              <textarea value={abi} />
            </div>
            <div className="form-group">
              <label htmlFor="">Network:</label>
              <select name="" id="">
                <option value="" disabled></option>
                <option value="Kovan">Kovan</option>
              </select>
            </div>
            <button onClick={this.handleFormSubmit} type="submit">Get my report</button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  getContractId,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
