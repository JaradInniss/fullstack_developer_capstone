import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';


const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState();
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);

  let curr_url = window.location.href;
  let root_url = curr_url.substring(0,curr_url.indexOf("postreview"));
  let params = useParams();
  let id =params.id;
  let dealer_url = root_url+`djangoapp/dealer/${id}`;
  let review_url = root_url+`djangoapp/add_review`;
  let carmodels_url = root_url+`djangoapp/get_cars`;

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(';').shift();
    }
    return null;
  };

  const postreview = async ()=>{
    let name = sessionStorage.getItem("firstname")+" "+sessionStorage.getItem("lastname");
    //If the first and second name are stores as null, use the username
    if(name.includes("null")) {
      name = sessionStorage.getItem("username");
    }
    if(!model || review === "" || date === "" || year === "" || model === "") {
      alert("All details are mandatory")
      return;
    }

    let model_split = model.split(" ");
    let make_chosen = model_split[0];
    let model_chosen = model_split[1];

    let jsoninput = JSON.stringify({
      "name": name,
      "dealership": id,
      "review": review,
      "purchase": true,
      "purchase_date": date,
      "car_make": make_chosen,
      "car_model": model_chosen,
      "car_year": year,
    });

    const csrfToken = getCookie("csrftoken");
    const headers = {
      "Content-Type": "application/json",
      ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
    };

    const res = await fetch(review_url, {
      method: "POST",
      headers,
      credentials: "include",
      body: jsoninput,
  });

  if (!res.ok) {
    alert("Your review could not be posted. Please refresh the page and try again.");
    return;
  }

  const json = await res.json();
  if (json.status === 200) {
      window.location.href = window.location.origin+"/dealer/"+id;
  }

  }
  const get_dealer = async ()=>{
    const res = await fetch(dealer_url, {
      method: "GET"
    });
    const retobj = await res.json();
    
    if(retobj.status === 200) {
      let dealerobjs = Array.from(retobj.dealer)
      if(dealerobjs.length > 0)
        setDealer(dealerobjs[0])
    }
  }

  const get_cars = async ()=>{
    const res = await fetch(carmodels_url, {
      method: "GET"
    });
    const retobj = await res.json();
    
    let carmodelsarr = Array.from(retobj.CarModels)
    setCarmodels(carmodelsarr)
  }
  useEffect(() => {
    get_dealer();
    get_cars();
  },[]);


  return (
    <div>
      <Header/>
      <div  style={{ margin:"5%", justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }}>
      <h2 style={{ color:"#F5F5F5", marginBottom: "20px" }}>{dealer.full_name}</h2>
      
      <div>
          <textarea id='review' cols='50' rows='7' onChange={(e) => setReview(e.target.value)}></textarea>
      </div>
    
      <div style={{ color:"#F5F5F5", display: "flex", flexDirection: "row", justifyContent: "space-between", width: "50%" }}>

        <div className='input_field' style={{ color:"#F5F5F5" }}>
          Purchase Date <input type="date" onChange={(e) => setDate(e.target.value)}/>
        </div>

        <div className='input_field' style={{ color:"#F5F5F5" }}>
          Car Make 
          <select name="cars" id="cars" onChange={(e) => setModel(e.target.value)}>
              <option value="" selected disabled hidden>Choose Car Make and Model</option>
              {carmodels.map(carmodel => (
                  <option value={carmodel.CarMake+" "+carmodel.CarModel}>{carmodel.CarMake} {carmodel.CarModel}</option>
              ))}
          </select>        
        </div >

        <div className='input_field' style={{ color:"#F5F5F5" }}>
          Car Year <input type="int" onChange={(e) => setYear(e.target.value)} max={2023} min={2015}/>
        </div>
      </div>
      

      <div>
        <button className='postreview' onClick={postreview} style={{ color:"#F5F5F5", fontSize: "20px", border: "none", borderRadius: "10px", backgroundColor: "#272E20", padding: "20px 40px" }}>
            Post Review
        </button>
      </div>
    </div>
    </div>
  )
}
export default PostReview
