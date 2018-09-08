import React from 'react';
import { Link } from 'react-router-dom';

import './Home.scss';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contracts: [],
    };
  }

  componentDidMount() {
    let contracts = localStorage.getItem('contracts') || [];

    this.setState({
      contracts: JSON.parse(contracts),
    });
  }

  render() {
    const {
      contracts,
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

          <div className="form-wrapper">
            <div className="form-group">
              <label htmlFor="">Address</label>
              <input type="text" />
            </div>
            <div className="form-group">
              <label htmlFor="">ABI:</label>
              <textarea />
            </div>
            <div className="form-group">
              <label htmlFor="">Network:</label>
              <select name="" id="">
                <option value="" disabled></option>
                <option value="Kovan">Kovan</option>
              </select>
            </div>
            <button type="submit">Get my report</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;