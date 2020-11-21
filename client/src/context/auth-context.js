import React, { createContext, useState, useEffect } from "react";
const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    authenticated: false,
  });

  useEffect(() => {
    fetch("http://localhost:8888/auth/login/success", {
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
  }, []);

  const logout = () => {
    window.open("http://localhost:8888/auth/logout", "_self");
    setAuth({
      authenticated: false,
    });
  };

  const authContextValue = {
    auth,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => React.useContext(AuthContext);

export { useAuth, AuthProvider };
