import React, { useState } from 'react';

import "./Login.css";
import Header from '../Header/Header';

const Login = ({ onClose }) => {

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [open,setOpen] = useState(true)

  let login_url = window.location.origin+"/djangoapp/login";

  const login = async (e) => {
    e.preventDefault();

    const res = await fetch(login_url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "userName": userName,
            "password": password
        }),
    });
    
    const json = await res.json();
    if (json.status != null && json.status === "Authenticated") {
        sessionStorage.setItem('username', json.userName);
        setOpen(false);        
    }
    else {
      alert("The user could not be authenticated.")
    }
};

  if (!open) {
    window.location.href = "/";
  };
  

  return (
    <div style={{ backgroundColor: "#1F1F1F" }}>
      <Header/>
    <div onClick={onClose}>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className='modalContainer'
      >
          <form className="login_panel" style={{}} onSubmit={login}>
              <div>
                <span className="input_field" style={{ color: "#F5F5F5", fontWeight: "bold" }}> Username </span>
                <input type="text"  name="username" placeholder="Username" className="input_field" onChange={(e) => setUserName(e.target.value)}
                style={{ border: "none", borderRadius: "10px", backgroundColor: "#F5F5F5", padding: "10px" }}/>
              </div>

              <div>
                <span className="input_field" style={{ color: "#F5F5F5", fontWeight: "bold" }}> Password </span>
                <input name="psw" type="password"  placeholder="Password" className="input_field" onChange={(e) => setPassword(e.target.value)}
                style={{ border: "none", borderRadius: "10px", backgroundColor: "#F5F5F5", padding: "10px" }}/>            
              </div>

              <div>
                <input className="btn action_button" type="submit" value="Login"
                style={{ border: "none", borderRadius: "10px", backgroundColor: "#3E5A20", color: "#F5F5F5", padding: "5px 20px",  }}/>
                <input className="btn action_button" type="button" value="Cancel" onClick={()=>setOpen(false)}
                style={{ border: "none", borderRadius: "10px", backgroundColor: "#8E0111", color: "#F5F5F5", padding: "5px 20px"}}/>
              </div>

              <a className="loginlink" href="/register" style={{ color: "#F5F5F5", textDecoration: "none" }}>Register Now</a>
          </form>
      </div>
    </div>
    </div>
  );
};

export default Login;
