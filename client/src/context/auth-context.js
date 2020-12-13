import React, { createContext, useState, useEffect } from "react";
import { SERVER_URL } from "../Utils/Constants";
const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    authenticated: false,
  });

  useEffect(() => {
    getUserInfo();
  }, []);

  const logout = () => {
    window.open(SERVER_URL + "/auth/logout", "_self");
    setAuth({
      authenticated: false,
    });
  };

  const getUserInfo = () => {
    fetch(SERVER_URL + "/auth/login/success", {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        throw new Error("failed to authenticate user");
      })
      .then((responseJson) => {
        setAuth({
          authenticated: true,
          user: responseJson.user,
        });
      })
      .catch((error) => {
        setAuth({
          authenticated: false,
          error: "Failed to authenticated user",
        });
      });
  };

  const authContextValue = {
    auth,
    logout,
    getUserInfo,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => React.useContext(AuthContext);

function withAuth(Component) {
  return function WrappedComponent(props) {
    const authCreds = useAuth();
    return <Component {...props} authCreds={authCreds} />;
  };
}

export { useAuth, AuthProvider, withAuth };
