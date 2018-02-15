// ACCOUNT-SIGNIN

import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import { setUser } from '../../redux/actions/actions-user.js';
import { API_BASE_URL } from '../../utils';
import './account-signin.css';

import CreateAccountForm from '../create-account-form';
import SigninForm from '../signin-form';

class AccountSignin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createAccount: false,
      signinMessage: '',
      createAccountMessage: '',
      loading: false
    };
    this.toggleCreateAccount = this.toggleCreateAccount.bind(this);
    this.handleSignInSubmit = this.handleSignInSubmit.bind(this);
    this.handleCreateAccountSubmit = this.handleCreateAccountSubmit.bind(this);
  }

  toggleCreateAccount() {
    this.setState(prevState => ({ createAccount: !prevState.createAccount }));
  }

  handleCreateAccountSubmit(email, password1, password2) {
    if (password1 === password2) {
      this.setState({ loading: true });
      axios.post(
        `${API_BASE_URL}auth/register`,
        { email, password: password1 }
      )
        .then(() => {
          this.setState({
            createAccount: false,
            signinMessage: 'Account created. You may now sign in.',
            loading: false
          });
        })
        .catch(e => {
          this.setState({
            createAccountMessage: e.response.data.error,
            loading: false
          });
        });
    }
  }

  handleSignInSubmit(email, password) {
    const { setUser, hideDropDown } = this.props;
    this.setState({ loading: true });

    axios.post(
      `${API_BASE_URL}auth/login`,
      { email, password }
    )
      .then(res => {
        this.setState({ loading: false });
        hideDropDown();
        const { authToken, email, userId } = res.data;
        localStorage.setItem('authToken', authToken);
        setUser({ email, id: userId });
      })
      .catch(e => {
        this.setState({
          signinMessage: e.response.data.error,
          loading: false
        });
      });
  }

  render() {
    const { signinMessage, createAccountMessage, loading } = this.state;
    return (
      <div className="account-signin">
        {
          this.state.createAccount
            ? <CreateAccountForm
              message={createAccountMessage}
              onCancelClick={this.toggleCreateAccount}
              onSubmit={this.handleCreateAccountSubmit}
              loading={loading}
            />
            : <SigninForm
              message={signinMessage}
              onCreateClick={this.toggleCreateAccount}
              onSubmit={this.handleSignInSubmit}
              loading={loading}
            />
        }
      </div>
    );
  }
}


function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setUser }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountSignin);
