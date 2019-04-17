import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import JeevesLogin from "./JeevesLogin";
import JeevesDashBoard from "./JeevesDashBoard";
import JeevesAddPost from "./JeevesAddPost";
import JeevesEditPost from "./JeevesEditPost";
import JeevesViewPost from "./JeevesViewPost";
import history from "../history";
import Header from "./Header";
import JeevesRegister from "./JeevesRegister";
import JeevesProfile from "./JeevesProfile";

const App = () => {
  return (
    <div>
      <Router history={history}>
        <Header />
        <div>
          <Route path="/" exact component={JeevesLogin} />
          <Route path="/info/dashboard" exact component={JeevesDashBoard} />
          <Route path="/info/edit/:id" exact component={JeevesEditPost} />
          <Route path="/info/view/:id" exact component={JeevesViewPost} />
          <Route path="/info/add" exact component={JeevesAddPost} />
          <Route path="/info/register" exact component={JeevesRegister} />
          <Route path="/info/profile/:id" exact component={JeevesProfile} />
        </div>
      </Router>
    </div>
  );
};

export default App;
