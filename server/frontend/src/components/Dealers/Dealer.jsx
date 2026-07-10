import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png"
import neutral_icon from "../assets/neutral.png"
import negative_icon from "../assets/negative.png"
import review_icon from "../assets/reviewbutton.png"
import Header from '../Header/Header';

const Dealer = () => {


  const [dealer, setDealer] = useState({});
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [postReview, setPostReview] = useState(<></>)

  let curr_url = window.location.href;
  let root_url = curr_url.substring(0,curr_url.indexOf("dealer"));
  let params = useParams();
  let id =params.id;
  let dealer_url = root_url+`djangoapp/dealer/${id}`;
  let reviews_url = root_url+`djangoapp/reviews/dealer/${id}`;
  let post_review = root_url+`postreview/${id}`;
  
  const get_dealer = async ()=>{
    const res = await fetch(dealer_url, {
      method: "GET"
    });
    const retobj = await res.json();
    
    if(retobj.status === 200) {
      let dealerobjs = Array.from(retobj.dealer)
      setDealer(dealerobjs[0])
    }
  }

  const get_reviews = async ()=>{
    const res = await fetch(reviews_url, {
      method: "GET"
    });
    const retobj = await res.json();
    
    if(retobj.status === 200) {
      if(retobj.reviews.length > 0){
        setReviews(retobj.reviews)
      } else {
        setUnreviewed(true);
      }
    }
  }

  const senti_icon = (sentiment)=>{
    let icon = sentiment === "positive"?positive_icon:sentiment==="negative"?negative_icon:neutral_icon;
    return icon;
  }

  useEffect(() => {
    get_dealer();
    get_reviews();
    if(sessionStorage.getItem("username")) {
      setPostReview(
        <a href={post_review} style={{ textDecoration: "none", color: "#F5F5F5", fontSize: "20px", border: "none", borderRadius: "10px", backgroundColor: "#272E20", padding: "20px 40px" }}>
            <svg style={{ width:'30px', marginRight:'20px'}} xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#f5f5f5" viewBox="0 0 256 256"><path d="M232,96a16,16,0,0,0-16-16H184V48a16,16,0,0,0-16-16H40A16,16,0,0,0,24,48V176a8,8,0,0,0,13,6.22L72,154V184a16,16,0,0,0,16,16h93.59L219,230.22a8,8,0,0,0,5,1.78,8,8,0,0,0,8-8Zm-42.55,89.78a8,8,0,0,0-5-1.78H88V152h80a16,16,0,0,0,16-16V96h32V207.25Z"></path></svg>
            Write A Review
        </a>
        )
    }
  },[]);  


return(
  <div style={{margin:"20px"}}>
      <Header/>
      <div style={{ marginTop:"20px" }}>
      <h2 style={{ color:"#F5F5F5" }}>{dealer.full_name}{postReview}</h2>
      <h5 style={{color:"#F5F5F5", marginTop: "30px"}}>{dealer['city']},{dealer['address']}, Zip - {dealer['zip']}, {dealer['state']} </h5>
      </div>
      <div class="reviews_panel">
      {reviews.length === 0 && unreviewed === false ? (
        <text style={{ color:"#F5F5F5" }}>Loading Reviews....</text>
      ):  unreviewed === true? <div style={{ color:"#F5F5F5" }}>No reviews yet! </div> :
      reviews.map(review => (
        <div className='review_panel'>
            <img src={senti_icon(review.sentiment)} className="emotion_icon" alt='Sentiment' style={{ color: "#F5F5F5", fontSize: "20px", border: "none", borderRadius: "10px", backgroundColor: "#3E5A20"}}/>
            <div className='review' style={{ color:"#F5F5F5" }}>{review.review}</div>
            <div className="reviewer" style={{ color:"#F5F5F5" }}> User: {review.name}</div>
            <div className="reviewer" style={{ color:"#F5F5F5" }}> Reviewing: {review.car_make} {review.car_model} {review.car_year}</div>
        </div>
      ))}
    </div>  
  </div>
)
}

export default Dealer
