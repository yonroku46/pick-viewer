import React, { useState } from 'react'
import { Link } from "react-router-dom"
import { Button, Form, Grid, Message, Segment, Dimmer, Loader } from 'semantic-ui-react'
import axios from 'axios';
import background from "../../img/loginBackground.png";
import * as api from '../../rest/server'


export default function LoginPage(props) {
  
  // 이미 로그인상태일시 뒤돌아가기
  let isAuthorized = sessionStorage.getItem("isAuthorized");
  if (isAuthorized) {
    props.history.goBack(1);
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function onEmailHandler(e) {
    setEmail(e.currentTarget.value);
  }

  function onPasswordHandler(e) {
    setPassword(e.currentTarget.value);
  }

  function onSubmitHandler(e) {
    // page refresh를 막아줌
    e.preventDefault();
    setLoading(true);
    
    if (email === "" || password === "") {
      alert("이메일 또는 패스워드를 입력해 주세요.");
      setLoading(false);
      return;
    }

    let body = {
      email: email,
      password: password
    }
    
    login(body).then(res => {
      let userInfo = res;
      if (userInfo !== null) {
        // json형으로 변환해서 넣기 : JSON.stringify
        sessionStorage.setItem('isAuthorized', true);
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
        getFavorite(userInfo.user_cd);
        props.history.goBack(1);
      } else {
        setLoading(false);
        alert("이메일 또는 패스워드가 일치하지 않습니다.");
      }
    })
    .catch(err => loginFail())
  }

  function loginFail() {
    setLoading(false);
    alert("현재 서버와의 연결이 원활하지 않습니다. 관리자에게 문의해주세요.");
  }

  function login(body) {
    const params = { 
      'user_email': body.email,
      'user_pw': body.password
    };
    return new Promise(function(resolve, reject) {
      axios
        .post(api.login, params)
        .then(response => resolve(response.data))
        .catch(error => reject(error.response))
    });
  }

  function getFavorite(user_cd) {
    const params = { 
      'user_cd': user_cd
    };
    return new Promise(function(resolve, reject) {
      axios
        .post(api.getFavorite, params)
        .then(response => resolve(response.data))
        .catch(error => reject(error.response))
    }).then(data => {
      sessionStorage.setItem('favorites', JSON.stringify(data));
      }
    )
  }

  return(
    <>
    <div className="login-main">
    {loading ? <Loading /> :
    <Grid className="login-form" textAlign='center' verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <img src={background} className='login-background'/>
        <Form size='large' onSubmit={onSubmitHandler}>
          <Segment stacked>
            <Form.Input 
              fluid icon='user'
              iconPosition='left'
              type='email'
              value={email}
              onChange={onEmailHandler}
              placeholder='이메일'/>
            <Form.Input
              fluid icon='lock'
              iconPosition='left'
              type='password'
              value={password}
              onChange={onPasswordHandler}
              placeholder='비밀번호'
            />
            <Button color='black' fluid size='large' type='submit'>로그인</Button>
          </Segment>
        </Form>
        <Message className='login-form-bottom'>
          <Link className="login-form-message" to="/help">비밀번호 찾기</Link>
          <span className="login-form-message-sp">/</span>
          <Link className="login-form-message" to="/signup">회원가입</Link>
        </Message>
      </Grid.Column>
    </Grid>
    }
    </div>
    </>
    )
  };

function Loading() {
  return(
    <>
    <Dimmer active inverted>
      <Loader size='large'>로딩중</Loader>
    </Dimmer>
    </>
  )
}
