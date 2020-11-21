import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../context/auth-context";

function ProtectedRoute({ component: RouteComponent, ...rest }) {
  const { auth } = useAuth();
  return (
    <React.Fragment>
      <Route
        {...rest}
        render={(props) =>
          auth.authenticated ? (
            <RouteComponent {...props} />
          ) : (
            <Redirect to={"/login"} />
          )
        }
      />
    </React.Fragment>
  );
}

export default ProtectedRoute;
