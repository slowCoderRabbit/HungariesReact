import React from 'react'
import firebase from './firebase'

class App extends React.Component {
  handleChange = (e) => {
    const { name, value } = e.target
    this.setState({
      [name]: value
    })
  }
  configureCaptcha = () => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        this.onSignInSubmit();
        console.log("reCAPTCHA verified");
      }
    });

  }
  onSignInSubmit = (e) => {
    e.preventDefault();
    this.configureCaptcha();
    const phoneNumber = "+" + this.state.mobile;
    console.log(phoneNumber);
    const appVerifier = window.recaptchaVerifier;
    firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
      .then((confirmationResult) => {

        window.confirmationResult = confirmationResult;
        console.log("OTP Sent....!!");
        alert("OTP Sent! Please check you mobile phone!");

      }).catch((error) => {

        console.log("SMS NOT SENT ERROR....!!");
        alert("Error!!! OTP Not Sent! Please add countery code as well!");

      });

  }
  onOTPSubmit = (e) => {  
    e.preventDefault();  
    const code = this.state.otp;
    console.log(code);
    window.confirmationResult.confirm(code).then((result) => {
      // User signed in successfully.
      const user = result.user;
      console.log(JSON.stringify(user))
      alert("User Verified Sucessfully!!")
      // ...
    }).catch((error) => {
      console.log(JSON.stringify(error))
    });
  }
  render() {
    return (
      <div>
        <h2>Login Form</h2>
        <form onSubmit={this.onSignInSubmit}>
          <div id='sign-in-button'></div>
          <input type='number' name='mobile' placeholder='Mobile number'
            required onChange={this.handleChange} />
          <button type='submit'>Submit</button>
        </form>
        <h2>Enter Form</h2>
        <form onSubmit={this.onOTPSubmit}>
          <input type='number' name='otp' placeholder='OTP number' required onChange={this.handleChange} />
          <button type='submit'>Submit</button>
        </form>
      </div>
    )
  }

}
export default App