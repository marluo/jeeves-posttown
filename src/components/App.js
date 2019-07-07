import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import JeevesLogin from "./JeevesLogin";
import { connect } from "react-redux";
import JeevesDashBoard from "./JeevesDashBoard";
import JeevesAddPost from "./JeevesAddPost";
import JeevesEditPost from "./JeevesEditPost";
import JeevesViewPost from "./JeevesViewPost";
import history from "../history";
import PrivateRoute from "./PrivateRoute";
import Header from "./Header";
import JeevesRegister from "./JeevesRegister";
import JeevesProfile from "./JeevesProfile";
import { needToLogin } from "../actions";

const App = () => {
  return (
    <div className="bg-light-gray vh-100 dt w-100">
      <Router history={history}>
        <Header />
        <Route path="/" exact component={JeevesLogin} />
        <PrivateRoute path="/info/dashboard" component={JeevesDashBoard} />
        <PrivateRoute path="/info/edit/:id" exact component={JeevesEditPost} />
        <PrivateRoute path="/info/view/:id" exact component={JeevesViewPost} />
        <PrivateRoute path="/info/add" exact component={JeevesAddPost} />
        <Route path="/info/register" exact component={JeevesRegister} />
        <PrivateRoute
          path="/info/profile/:id"
          exact
          component={JeevesProfile}
        />
      </Router>
    </div>
  );
};

export default App;
