import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, withRouter, useHistory, NavLink } from 'react-router-dom';


function Header() {

    const [input, setInput] = useState('');
    const history = useHistory();

    const searchKey = () => {
        console.log(input)
        history.push(`/inbox/${input}`)
      }
    

  return (
    <div className="header">
      <div className="flex__spread padding-header">
        

        

       
 <div className="flex__row">
          <input className="search-input input-small" placeholder="Find Inbox by Key..." value={input} onInput={e => setInput(e.target.value)}/>
          <button className="form-search" type="button" onClick={() => searchKey()}><i class="las la-search"></i></button>
          </div>

          <NavLink to="/" className="frame__demos header-margin">
        <i class="las la-home"></i>
        </NavLink>
      
     
      </div>
      
    </div>
  );
}

export default withRouter(Header);