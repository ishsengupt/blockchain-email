import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, withRouter, useHistory } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from "./Modal";
import useModal from './useModal';
import icon from './icon.png'

function SendEmail(props) {
  const [product, setProduct] = useState({ _id: '', sender_public_key: '', sender_private_key: '', recipient_public_key: '', amount: '', messageheader: '', messagecontent: '' });
  const [showLoading, setShowLoading] = useState(false);
  const [modalInfo, setModalInfo] = useState(false)
  const [token, setToken] = useState(false);
  const { isShowing, toggle } = useModal();
  const [transactionsInfo, setTransactionsInfo] = useState(false)
  const [blocksInfo, setBlocksInfo] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [count, setCount] = useState(0)
  const [input, setInput] = useState('');
  // const {isShowing, setisShowing} = useState(false)
  const apiUrl = "/generate/transaction";
  
  const history = useHistory();

  useEffect(() => {
    requestKey()
    getTransactions()
    getChain()
  }, [count]);

  const requestKey = () => {
    fetch('/wallet/new').then(res => res.json()).then(data => {
      setToken(data)
      console.log(data)
    });
  }

  const saveProduct = (e) => {
    setShowLoading(true);
    e.preventDefault();
    const data = { sender_public_key: product.sender_public_key, sender_private_key: product.sender_private_key, recipient_public_key: product.recipient_public_key, amount: product.amount, messageheader: product.messageheader, messagecontent: product.messagecontent };
    // console.log(data)

    fetch('http://127.0.0.1:8081/generate/transaction', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',


      },
      body: JSON.stringify(data),
    })
      .then(res => res.json())
      .then((res) => {
        setModalInfo(res)
        setShowModal(true)
        console.log(res)

      }).catch((error) => console.log(error))

  }

  const searchKey = () => {
    console.log(input)
    history.push(`/inbox/${input}`)
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
        setCount(count+1)
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
        console.log(res.transactions)
        setTransactionsInfo(res.transactions)
      }).catch((error) => console.log(error))
  }

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
        setBlocksInfo(res.chain)
      }).catch((error) => console.log(error))
  }

  const verifyTransaction = (data) => {
    //  console.log(data)
    fetch('http://127.0.0.1:5001/transactions/new', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',


      },
      body: JSON.stringify(data),
    })
      .then(res => res.json())
      .then((res) => {
        console.log(res)
        setShowModal(false)
        setCount(count + 1)
      }).catch((error) => console.log(error))
  }


  const onChange = (e) => {
    e.persist();
    setProduct({ ...product, [e.target.name]: e.target.value });
  }

  function toggleShowModal() {
    console.log("this")
    setShowModal(false)
  }


  return (

    <div className="middle-bar">
      <div className="sidebar">
        <div className="sidebar-info">

          <div className="sidebar-icons-top">
            <i className="las la-coins"></i>
            <i class="lab la-viacoin"></i>
            <i class="lab la-bitcoin"></i>
          </div>
          <div className="sidebar-icons-bottom">
            <i className="las la-coins"></i>
          </div>
        </div>
      </div>
      <div className="generate-row">
        <div className="form-info">

          <div className="form-header-subtitle">
            Public Key
          </div>
          <div className="conform-input">
            {token && token.public_key}
          </div>
          <div className="form-header-subtitle">
            Private Key
          </div>
          <div className="conform-input">
            {token && token.private_key}
          </div>
          <button className="form-send" type="button" onClick={() => requestKey()}>Request Key</button>

        </div>
       
      </div>

      <div className="form-row">

        <Modal
          isShowing={showModal}
          hide={toggle}
          toggleShowModal={toggleShowModal}
          modalInfo={modalInfo}
          verifyTransaction={verifyTransaction}

        />

        <div className="form-title">
          <div className="former-header-title">
            Register Account!
          </div>
          <div className="form-header-subtitle">
            Register with key or profile
          </div>
        </div>

        <div className="line-row">

        </div>

        <Form onSubmit={saveProduct} className="form_info">
          <div className="form-key-row">
            <Form.Group className="form-field ">

              <Form.Control className="form-input form-padding-right" type="text" name="sender_public_key" id="sender_public_key" placeholder="Public Key" value={product.sender_public_key} onChange={onChange} />
            </Form.Group>
            <Form.Group className="form-field ">

              <Form.Control className="form-input form-padding-left" type="text" name="sender_private_key" id="sender_private_key" rows="3" placeholder="Private Key" value={product.sender_private_key} onChange={onChange} />
            </Form.Group>
          </div>
          <Form.Group className="form-field form-width">

            <Form.Control className="form-input form-width" type="text" name="recipient_public_key" id="recipient_public_key" placeholder="Recipient Key" value={product.recipient_public_key} onChange={onChange} />
          </Form.Group>
          <Form.Group className="form-field form-width">

            <Form.Control className="form-input form-width" type="text" name="amount" id="amount" placeholder="Amount" value={product.amount} onChange={onChange} />
          </Form.Group>
          <Form.Group className="form-field form-width">

            <Form.Control className="form-input form-width" type="text" name="messageheader" id="messageheader" placeholder="Header" value={product.messageheader} onChange={onChange} />
          </Form.Group>

          <Form.Group className="form-field form-width">

            <Form.Control className="form-input form-width" type="text" name="messagecontent" id="messagecontent" placeholder="Message" value={product.messagecontent} onChange={onChange} />
          </Form.Group>
          <Button className="form-send" variant="primary" type="submit">
            SEND MESSAGE
              </Button>
        </Form>

      </div>
      <div className="emails-row">
        <div class="mined-blocks">
        <button className="form-send" type="button" onClick={() => mineBlock()}>Mine</button>
          <div className="grid-table">

          <div className="table-row">Current Hash</div>
          <div  className="table-row">Index</div>
          <div  className="table-row">Previous Hash</div>
          <div  className="table-row">Timestamp</div>
          </div>
          {blocksInfo && blocksInfo.map((info) => 
          <div className="grid-table">
          <div  className="table-row">{info.currentHash}</div>
          <div  className="table-row">{info.index}</div>
          <div  className="table-row">{info.previousBlockHash}</div>
          <div  className="table-row">{info.timestamp}</div>
          </div>

          )}
        </div>
        <div className="message_info">
          {transactionsInfo.length > 0 ?

            transactionsInfo.map((info) =>
              <div className="full-message">
                <div className="flex-column">
                  <img className="background-image" src={icon}></img>

                  <i class="lab la-bitcoin smaller-coin"></i>
                </div>
                <div className="message-width">
                  <div className="message-row">
                    <div className="message-top-left">
                    <Link to={`/inbox/${info.recipient_public_key}`} className="no-underlines">
                    {info.recipient_public_key}
              </Link>{" "}
                     
                    </div>
                    <div className="message-top-right">
                      ${info.amount}
                    </div>
                  </div>
                  <div className="message-column">
                    <div className="header-content message-header-subtitle">{info.messageheader}</div>
                    <div className="message-content">{info.messagecontent}</div>



                  </div>
                </div>
              </div>

              

             




            )
          :  <div>

          No Pending Transactions
      </div>
          }

        </div>

      </div>
    </div>

  );
}



export default withRouter(SendEmail);