import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from "./Modal";
import useModal from './useModal';

function ViewEmail(props) {

    useEffect(() => {
        getChain()
        getTransactions()
    }, []);

    function getChain() {
        fetch('http://127.0.0.1:5001/chain', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
             
    
            },
         
          })
            .then(res => res.json())
            .then((res) => {
                console.log(res)
              
            }).catch((error) => console.log(error))
    }

    function resolveNodes() {
        fetch('http://127.0.0.1:5001/nodes/resolve', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
             
    
            },
         
          })
            .then(res => res.json())
            .then((res) => {
                console.log(res)
              
            }).catch((error) => console.log(error))
    }

    function getTransactions() {
        fetch('http://127.0.0.1:5001/transactions/get', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
             
    
            },
         
          })
            .then(res => res.json())
            .then((res) => {
                console.log(res)
              
            }).catch((error) => console.log(error))
    }


    const mineBlock = () => {
        //  console.log(data)
           fetch('http://127.0.0.1:5001/mine', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
             
    
            },
           
          })
            .then(res => res.json())
            .then((res) => {
             console.log(res)
    
            }).catch((error) => console.log(error)) 
        }

   


      return (
        <div>
      <button type="button" onClick={() => mineBlock()}>Mine Blocks </button>
        </div>
      );
}



export default withRouter(ViewEmail);