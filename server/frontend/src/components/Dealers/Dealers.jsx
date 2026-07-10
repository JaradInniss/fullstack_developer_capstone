import React, { useState, useEffect } from 'react';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';
import review_icon from "../assets/reviewicon.png"

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);
  // let [state, setState] = useState("")
  let [states, setStates] = useState([])

  // let root_url = window.location.origin
  let dealer_url ="/djangoapp/get_dealers";
  
  let dealer_url_by_state = "/djangoapp/get_dealers/";
 
  const filterDealers = async (state) => {
    dealer_url_by_state = dealer_url_by_state+state;
    const res = await fetch(dealer_url_by_state, {
      method: "GET"
    });
    const retobj = await res.json();
    if(retobj.status === 200) {
      let state_dealers = Array.from(retobj.dealers)
      setDealersList(state_dealers)
    }
  }

  const get_dealers = async ()=>{
    const res = await fetch(dealer_url, {
      method: "GET"
    });
    const retobj = await res.json();
    if(retobj.status === 200) {
      let all_dealers = Array.from(retobj.dealers)
      let states = [];
      all_dealers.forEach((dealer)=>{
        states.push(dealer.state)
      });

      setStates(Array.from(new Set(states)))
      setDealersList(all_dealers)
    }
  }
  useEffect(() => {
    get_dealers();
  },[]);  


let isLoggedIn = sessionStorage.getItem("username") != null ? true : false;
return(
  <div>
      <Header/>

        <table className='table' style={{ width: "95%", margin: "0 auto"}}>
            <tr style={{ backgroundColor: "#2C2C2C" }}>
                <th style={{ color: "#F5F5F5" }}>ID</th>
                <th style={{ color: "#F5F5F5" }}>Dealer Name</th>
                <th style={{ color: "#F5F5F5" }}>City</th>
                <th style={{ color: "#F5F5F5" }}>Address</th>
                <th style={{ color: "#F5F5F5" }}>Zip</th>
                <th>
                    <select style={{ backgroundColor: "#3E5A20", color: "#F5F5F5" }} name="state" id="state" onChange={(e) => filterDealers(e.target.value)}>
                    <option value="" selected disabled hidden>State</option>
                    <option value="All">All States</option>
                    {states.map(state => (
                        <option value={state}>{state}</option>
                    ))}
                    </select>        

                </th>
                {isLoggedIn ? (
                    <th style={{ color: "#F5F5F5" }}>Review Dealer</th>
                    ):<></>
                }
            </tr>
            {dealersList.map(dealer => (
                <tr style={{ color: "#F5F5F5" }}>
                    <td>{dealer['id']}</td>
                    <td><a href={'/dealer/'+dealer['id']}>{dealer['full_name']}</a></td>
                    <td>{dealer['city']}</td>
                    <td>{dealer['address']}</td>
                    <td>{dealer['zip']}</td>
                    <td>{dealer['state']}</td>
                    {isLoggedIn ? (
                        <td>
                            <a href={`/postreview/${dealer['id']}`} style={{ textDecoration: "none", justifyContent: "center", alignItems: "center" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#f5f5f5" viewBox="0 0 256 256"><path d="M232,96a16,16,0,0,0-16-16H184V48a16,16,0,0,0-16-16H40A16,16,0,0,0,24,48V176a8,8,0,0,0,13,6.22L72,154V184a16,16,0,0,0,16,16h93.59L219,230.22a8,8,0,0,0,5,1.78,8,8,0,0,0,8-8Zm-42.55,89.78a8,8,0,0,0-5-1.78H88V152h80a16,16,0,0,0,16-16V96h32V207.25Z"></path></svg>
                            </a>
                        </td>
                    ):<></>
                    }
                </tr>
            ))}
     </table>;
  </div>
)
}

export default Dealers
