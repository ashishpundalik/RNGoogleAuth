/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Text } from 'react-native';
import { GoogleSignin } from 'react-native-google-signin';

console.ignoredYellowBox = ['Warning: ReactNative.createElement'];

type Props = {};

export default class App extends Component<Props> {

  constructor(props) {
    super(props);

    this.state = {
      isUserLoggedIn: false,
      user: null
    };
  }

  componentDidMount() {
    this.setupGoogleAuth();
  }

  signInWithGoogle() {
    GoogleSignin.signIn()
      .then((user) => {
        console.log(user);
        this.setState({
          isUserLoggedIn: true,
          user
        });
      })
      .catch((err) => {
        console.log('WRONG SIGNIN', err);
      })
      .done();
  }

  async setupGoogleAuth() {
    try {
      await GoogleSignin.hasPlayServices({ autoResolve: true });
      await GoogleSignin.configure({
        iosClientId: '',
        webClientId: '',
        offlineAccess: false
      });

      const user = await GoogleSignin.currentUserAsync();
      if(user !== null && user.id !== null) {
        this.setState({
          isUserLoggedIn: true,
          user
        });
      }
      console.log(user);
    }
    catch (err) {
      console.log("Google signin error", err.code, err.message);
    }
  }

  signOutFromGoogle() {
    GoogleSignin.signOut()
      .then(() => {
        console.log(`User successfully signed out`);
        this.setState({
          isUserLoggedIn: false,
          user: null
        });
      })
      .catch((err) => {
        console.log('Could not signout', err);
      });
  }

  render() {
    console.log("Rendering with state: ", this.state);
    return (
      <View style={ styles.container }>
        { this.state.isUserLoggedIn ?
          <View style={ styles.container }>
            <Text style={ styles.loggedInText }>
              Logged In as { `${this.state.user.givenName} ${this.state.user.familyName}` }
            </Text>
            <TouchableWithoutFeedback onPress={this.signOutFromGoogle.bind(this)}>
              <View style={ styles.button }>
                <Text style={ styles.buttonText }>Signout from Google</Text>
              </View>
            </TouchableWithoutFeedback>
          </View> :
          <TouchableWithoutFeedback onPress={this.signInWithGoogle.bind(this)}>
            <View style={ styles.button }>
              <Text style={ styles.buttonText }>Login With Google</Text>
            </View>
          </TouchableWithoutFeedback>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  button: {
    justifyContent: 'center',
    alignSelf: 'center',
    borderColor: '#000',
    borderWidth: 1,
    padding: 16,
    borderRadius: 5,
    marginTop: 20,
    minWidth: 180
  },
  loggedInText: {
    fontWeight: 'bold'
  },
  buttonText: {
    textAlign: 'center'
  }
});
