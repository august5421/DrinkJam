import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import rootReducer from './reducers/reducers';
import App from './App';
import Callback from './components/Callback';
import './index.css'
import MobileDetector from './components/MobileDetector';

const store = createStore(rootReducer);

const root = document.getElementById('root');
const rootElement = ReactDOM.createRoot(root);

rootElement.render(
  <Provider store={store}>
    <Router>
      <MobileDetector />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/redirect" element={<Callback />} />
      </Routes>
    </Router>
  </Provider>
);
