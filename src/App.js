import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import SendEmail from './components/SendEmail' 
import ViewEmail from './components/ViewEmail' 
import MineBlocks from './components/MineBlocks' 
import Header from "./Header";
import Footer from "./Footer";

function App() {
  

  return (

 
    <BrowserRouter>
  
      <div className="app-container demo-3">
      <Header />
        <div className="route-container">
          <Switch>
            <Route exact path="/" component={SendEmail} />
            <Route exact path="/inbox/:pubid" component={ViewEmail} />
         
          </Switch>
        </div>
        <Footer />
      </div>
 
  </BrowserRouter>


 
  );
}

export default App;
