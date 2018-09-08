import { triggerTypeMap } from '../actions/apiActions';
import hdate from 'human-date';


export const prettifyDate = (date) => {
  if (typeof date === 'string') date = new Date(date);
  return hdate.relativeTime(date);
};

export const etherscanLink = address => `https://kovan.etherscan.io/address/${address}`;

export const parseDoughnutData = (labels = [], data = []) => {
  return {
    labels: [...labels],
    datasets: [{
      data: [...data],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56'
      ],
      hoverBackgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56'
      ]
    }]
  };
};

export const parseLineData = (title, data = []) => {
  return {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: title,
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [...data]
      }
    ]
  };
};

export const parseInputOutputs = (inputs, outputs, selectedTrigger, state) => {
  switch (selectedTrigger) {
    case 0:
      inputs.method = state.withdrawMethod;
      break;
    case 6:
      inputs.inputStrings.push({
        position: parseInt(state.ipfsHashPosition),
        value: ''
      });
      break;
    case 8:
      inputs.method = state.validateMethod;
      inputs.inputStrings.push({
        position: parseInt(state.validatePosition),
        value: state.validateRegExp,
      });
      break;
    default:
      break;
  }

  return {
    inputs,
    outputs,
    selectedTrigger,
  };
};

export const listFunctions = (abi, withParams = false) => {
  if (typeof abi === 'string') abi = JSON.parse(abi);
  return abi.filter(item => item.type === 'function' && !item.constant && (withParams ? item.inputs.length : true));
};

export const parseAlert = (alert) => ({
  trigger: triggerTypeMap[alert.trigger.type],
  date: alert.transaction._created,
  parameters: alert.parameters,
  originalObject: alert,
});