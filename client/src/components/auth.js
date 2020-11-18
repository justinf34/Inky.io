class Auth {
  constructor() {
    this.loginInfo = {
      authenticated: false,
      user: {},
      error: "",
    };
  }
  login(callBack) {
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
        authenticated = true;
        this.loginInfo.authenticated = true;
        this.loginInfo.user = responseJson.user;
        callBack();
      })
      .catch((error) => {
        this.loginInfo.authenticated = false;
        this.loginInfo.error = "Failed to authenticate user";
      });
  }
  logout(callBack) {
    window.open("http://localhost:8888/auth/logout", "_self");

    this.authenticated = false;
  }
  isAuthenticated() {
    return this.loginInfo;
  }
}
export default new Auth();
