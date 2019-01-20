import { decorate, observable, action, computed } from "mobx";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { AsyncStorage } from "react-native";

const instance = axios.create({
  baseURL: "http://coffee.q8fawazo.me/api/"
});

class authStore {
  constructor() {
    this.user = null;
    this.isAuthenticated = false;
  }
  setCurrentUser(token) {
    if (token) {
      return AsyncStorage.setItem("token", token).then(() => {
        axios.defaults.headers.common.Authorization = `jwt ${token}`;
        //this.user = jwt_decode(token);
        const decodedUser = jwt_decode(token);
        this.user = decodedUser;
        this.isAuthenticated = true;
      });
    } else {
      return AsyncStorage.removeItem("token").then(() => {
        delete axios.defaults.headers.common.Authorization;
        this.user = null;
      });
    }
  }
  checkForToken() {
    return (
      AsyncStorage.getItem("token")
        //   .then(res => res.data)
        //   .then(Token => Token.token)
        .then(token => {
          if (token) {
            const user = jwt_decode(token);
            if (user.exp > Date.now() / 1000) {
              this.setCurrentUser(token);
            } else {
              this.setCurrentUser();
            }
          }
        })
    );
  }
  registerUser(userData, navigation) {
    let type = "register";
    instance
      .post(`/${type}/`, userData)
      .then(res => res.data)
      .then(user => this.loginUser(userData, navigation))
      .catch(err => console.error(err.response.data));
  }

  loginUser(userData, navigation) {
    let type = "login";
    instance
      .post(`/${type}/`, userData)
      .then(res => res.data)
      .then(user => this.setCurrentUser(user.token))
      .then(() => navigation.replace("CoffeeList"))
      .catch(err => console.error(err.response.data));
  }

  logoutUser() {
    this.setCurrentUser();
  }
}

decorate(authStore, { user: observable });

const AuthStore = new authStore();
AuthStore.checkForToken();
export default AuthStore;
