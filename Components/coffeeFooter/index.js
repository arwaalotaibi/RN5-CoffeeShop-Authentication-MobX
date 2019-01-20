import React, { Component } from "react";
import { observer } from "mobx-react";

import authStore from "../../store/authStore";

import { withNavigation } from "react-navigation";

// NativeBase Components
import { Text, Button, Icon, Footer, FooterTab } from "native-base";

class coffeeFooter extends Component {
  loginButton() {
    return (
      <Button vertical onPress={() => this.props.navigation.navigate("Login")}>
        <Text>Login</Text>
      </Button>
    );
  }
  logoutButton() {
    return (
      <Button vertical onPress={() => authStore.logoutUser()}>
        <Text>Logout</Text>
      </Button>
    );
  }
  render() {
    return (
      <Footer>
        <FooterTab>
          {authStore.user ? this.logoutButton() : this.loginButton()}
        </FooterTab>
      </Footer>
    );
  }
}

export default withNavigation(observer(coffeeFooter));
