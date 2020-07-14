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
     Footer
      
    </div>
  );
}

export default withRouter(Header);