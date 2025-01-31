import './App.scss';
import React from "react";

import { AppContext, APP_CONSTANTS } from "./config/utils/AppContext";

import AppRoute from './config/routes/route';

function App() {

  return (
    <React.Fragment>
      <AppContext.Provider value={APP_CONSTANTS}>
        <AppRoute />
      </AppContext.Provider>
    </React.Fragment>
  );
}

export default App;
