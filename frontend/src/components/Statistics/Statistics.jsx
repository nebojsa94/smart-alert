import React, { Component } from 'react';
import { Doughnut, Line } from 'react-chartjs-2';

import './Statistics.scss';
import connect from 'react-redux/es/connect/connect';
import { fetchStatistics } from '../../actions/apiActions';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.fetchStatistics();
  }

  render() {
    const {
      statistics,
    } = this.props;

    return (
      <div className="statistics-wrapper">
        <div className="container">
          {
            statistics &&
            <div className="grid">
              <div className="grid-column">
                <h1>Alerts per day</h1>
                <Line data={statistics.transactions} />
              </div>
              <div className="grid-column">
                {/*<h1>Transaction calls</h1>*/}
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  statistics: state.app.statistics,
});

const mapDispatchToProps = {
  fetchStatistics,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
