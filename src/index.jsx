import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';

import { AppContainer } from 'react-hot-loader';

import './styles/style.scss';

render(
  <AppContainer>
    <div>
      Hello World!
    </div>
  </AppContainer>,
  document.getElementById('app'),
);

module.hot.accept();
