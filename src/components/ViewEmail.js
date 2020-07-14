import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { withRouter, Link } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from "./Modal";
import useModal from './useModal';
import icon from './icon.png'
function ViewEmail(props) {
    const [transactionsInfo, setTransactionsInfo] = useState(false) 
    const pubid = props.match.params.pubid;  
   // const {isShowing, setisShowing} = useState(false)
    const apiUrl = "/generate/transaction";

    useEffect(() => {
     // console.log(pubid)
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
                //console.log(res.chain)
                var datarr = []
                var x;
                for (x in res.chain) {
                 //console.log(res.chain[x].transactions)
                 var chaintransactions = res.chain[x].transactions
                 var y;
                 for (y in chaintransactions) {
                   //console.log(chaintransactions[y])
                  if (chaintransactions[y].recipient_public_key == "819f300d06092a864886f70d010101050003818d0030818902818100bef76201a65252c0b52288f7555c9bb593ab2225052cf4c0e5f3672c5993d950a3a7cdf62e9e580a4af845c7b22274d70bcad9d7bd29870ebf010842a821e979eedfecbcacb154104602f43ae8b8bb92f13fdf06eb7fd9bf83c198db767f7198da70a4f7b755d69b33b670d4a11c4d0cf254a9a0cbe3468684ac4bce486c6b130203010001") {
                    console.log(chaintransactions[y])
                    datarr.push(chaintransactions[y])

                  }
                 }
            

               
                }
                setTransactionsInfo(datarr)
            
            }).catch((error) => console.log(error))
    }, []);


   
   


      return (
        <div>
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

No Messages
</div>
}
        </div>
      );
}



export default withRouter(ViewEmail);