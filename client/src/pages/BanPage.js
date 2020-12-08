import React, { Component } from "react";
import AuthContext from "../context/AuthContext";
import "../styles/loginPage.css";
import logo from "../images/INKY.png";

class BanPage extends Component {
    render() {
      return (
        <React.Fragment>
            <div className="container">
              <div className="internal-container">
                <img src={logo} className="logo"></img>
                <div className="infoContainer">
                  <p>
                    This account has been suspended permanently. Please contact us for more information.
                  </p>
                </div>
              </div>
            </div>
          )
        </React.Fragment>
      );
    }
  }

export default AuthContext(BanPage);
