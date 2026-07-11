import React from "react";
import LoginPanel from "./components/Login/Login";
import RegisterContainer from "./components/Register/Register";
import Dealers from "./components/Dealers/Dealers";
import Dealer from "./components/Dealers/Dealer";
import PostReview from "./components/Dealers/PostReview";
import { Routes, Route } from "react-router-dom";

function App() {
  return React.createElement(
    Routes,
    null,
    React.createElement(Route, {
      path: "/login",
      element: React.createElement(LoginPanel)
    }),
    React.createElement(Route, {
      path: "/register",
      element: React.createElement(RegisterContainer)
    }),
    React.createElement(Route, {
      path: "/dealers",
      element: React.createElement(Dealers)
    }),
    React.createElement(Route, {
      path: "/dealer/:id",
      element: React.createElement(Dealer)
    }),
    React.createElement(Route, {
      path: "/postreview/:id",
      element: React.createElement(PostReview)
    })
  );
}

export default App;
