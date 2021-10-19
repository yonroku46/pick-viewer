import React, { useState } from 'react'
import axios from 'axios';
import { Link } from "react-router-dom"
import page1 from '../../img/page1.png'
import page2 from '../../img/page2.png'
import * as api from '../../rest/server'
import { Icon, Button, Form, Grid, Segment, Progress, Reveal, Label, Transition, Image } from 'semantic-ui-react'

export default function SignupPage(props) {

  if (sessionStorage.getItem("isAuthorized")) {
    props.history.goBack(1)
  }

  const [percent, setPercent] = useState(0);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);
  const [apiload, setApiload] = useState(false);
  
  const [certifi, setCertifi] = useState('');

  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('');
  const [name, setName] = useState('');
  const [pw, setPw] = useState('');
  const [pwCheck, setPwCheck] = useState('');

  function nextStep() {
    setPercent(percent >= 100 ? 0 : percent + 25);
  }

  function toggleVisibility() {
    setVisible(!visible);
  }

  function emailInput(e) {
    setEmail(e.target.value);
  }
  function certifiInput(e) {
    setCertifi(e.target.value);
  }
  function nameInput(e) {
    setName(e.target.value);
  }
  function pwInput(e) {
    setPw(e.target.value);
  }
  function pwCheckInput(e) {
    setPwCheck(e.target.value);
  }

  // 권한선택
  function step1(e) {
    toggleVisibility();
    setPermission(parseInt(e.target.value));
    nextStep();
  }

  // 이메일 작성
  function step2() {
    toggleVisibility();
    var reg = /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}.[A-Za-z0-9]{1,}$/;

    if (reg.test(email)) {
      setError(null);
      setApiload(true);
      mailService(permission, email).then(res => {
        if (res) {
          alert("인증 이메일을 전송하였습니다. 인증번호를 확인해주세요")
          setApiload(false);
          nextStep();
        } else {
          setError("이미 등록된 이메일 입니다");
          setApiload(false);
        }
      });
    } else {
      setError("이메일 형식을 확인해주세요");
      return;
    }
  }

  // 이메일 인증
  function step3() {
    toggleVisibility();

    setApiload(true);
    certifiService(certifi, email).then(res => {
      if (res) {
        setError(null);
        setApiload(false);
        nextStep();
      } else {
        setError("인증번호가 일치하지 않습니다");
        setApiload(false);
        return;
      }
    });
  }

  // 유저 정보입력
  function step4() {
    toggleVisibility();

    if (!(0 < name.length && 0 < pw.length && 0 < pwCheck.length)) {
      setError("입력하지 않은 정보가 있습니다");
      return;
    }

    if (!(8 <= pw.length)) {
      setError("패스워드가 짧습니다");
      return;
    }

    if (pw !== pwCheck) {
      setError("패스워드가 일치하지 않습니다");
      return;
    }

    setError(null);
    setApiload(true);
    signup(email, name, pw).then(res => {
      if (res) {
        setError(null);
        setApiload(false);
        nextStep();
      } else {
        alert("회원가입에 실패하였습니다. 잠시 후 시도해주세요.");
        setApiload(false);
        return;
      }
    });
  }

  function mailService(permission, email) {
    const params = { 
      'user_email': email,
      'permission': permission
    };
    return new Promise(function(resolve, reject) {
      axios
        .post(api.mailService, params)
        .then(response => resolve(response.data))
        .catch(error => reject(error.response))
    });
  }

  function certifiService(certifi, email) {
    const params = { 
      'user_email': email,
      'certifi': certifi
    };
    return new Promise(function(resolve, reject) {
      axios
        .post(api.certifiService, params)
        .then(response => resolve(response.data))
        .catch(error => reject(error.response))
    });
  }
  
  function signup(email, name, pw) {
    const params = { 
      'user_email': email,
      'user_name': name,
      'user_pw': pw
    };
    return new Promise(function(resolve, reject) {
      axios
        .post(api.signup, params)
        .then(response => resolve(response.data))
        .catch(error => reject(error.response))
    });
  }

  return(
    <>
    <div className="signup-main">
      <div className="signup-main-content">
      <Progress percent={percent} className='signup-progress' indicating/>
      {percent === 0 ?
      <>
         <h2>1 / 4</h2>
         <h1>권한선택</h1>
         <Button.Group vertical fluid className='signup-step1'>
          <Button primary value='1' onClick={step1}><Icon name='cube' size='big'/>일반</Button>
          <Button basic color='blue' value='2' onClick={step1}><Icon name='cubes' size='big'/>스태프 / 매니저</Button>
        </Button.Group>
      </>
      :
      percent === 25 ?
      <>
      <h2>2 / 4</h2>
      <h1>이메일 입력</h1>
      <Grid className="login-form" textAlign='center' verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Form size='large' onSubmit={step2}>
            <Segment stacked>
              <Form.Input fluid icon='mail' name='email' iconPosition='left' placeholder='E-Mail' value={email} onChange={emailInput}/>
              {apiload ?
              <Button loading primary disabled fluid size='large'>
                로딩중
              </Button>
              :
              <Button primary fluid size='large'>
                확인
              </Button>
              }
              <Transition animation='pulse' duration='500' visible={visible}>
                {error !== null ?
                <Label basic color='red' pointing>
                  {error}
                </Label>
                :<></>
                }
              </Transition>
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
      </>
      :
      percent === 50 ?
      <>
      <h2>3 / 4</h2>
      <h1>이메일 인증</h1>
      <Grid className="login-form" textAlign='center' verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Form size='large' onSubmit={step3}>
            <Segment stacked>
              <Form.Input fluid icon='key' name='certifi' iconPosition='left' fluid placeholder='인증번호 입력' value={certifi} onChange={certifiInput}/>
              {apiload ?
              <Button loading primary disabled fluid size='large'>
                로딩중
              </Button>
              :
              <Button primary fluid size='large'>
                확인
              </Button>
              }
              <Transition animation='pulse' duration='500' visible={visible}>
                {error !== null ?
                <Label basic color='red' pointing>
                  {error}
                </Label>
                :<></>
                }
              </Transition>
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
      </>
      :
      percent === 75 ?
      <>
      <h2>4 / 4</h2>
      <h1>회원정보 입력</h1>
      <Grid className="login-form" textAlign='center' verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450, marginTop: '-30px' }}>
          <Form size='large' onSubmit={step4}>
            <Segment stacked>
                <Form.Input fluid icon='user' name='name' iconPosition='left' placeholder='이름' value={name} onChange={nameInput}/>
                <Form.Input fluid icon='lock' name='password' iconPosition='left' placeholder='비밀번호 (8자리 이상)' type='password' value={pw} onChange={pwInput}/>
                <Form.Input fluid icon='lock' name='passwordCheck' iconPosition='left' placeholder='비밀번호 확인' type='password' value={pwCheck} onChange={pwCheckInput}/>
                {apiload ?
                <Button loading primary disabled fluid size='large'>
                  로딩중
                </Button>
                :
                <Button primary fluid size='large'>
                  확인
                </Button>
                }
                <Transition animation='pulse' duration='500' visible={visible}>
                  {error !== null ?
                  <Label basic color='red' pointing>
                    {error}
                  </Label>
                  :<></>
                  }
                </Transition>
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
      </>
      :
      percent === 100 &&
      <>
      <h1>환영합니다!<br/>나만의 <span className='pcolor'>Pick</span>을 즐겨보세요</h1>
      <Iphone/>
      <Link to='/login'>
        <Button color='black' size='big' className='signup-login'>로그인</Button>
      </Link>
      </>
      }
      </div>
    </div>
    </>
    )
  };

  function Iphone() {
    return(
      <>
      <div className="iphonex-container iphonex-signup">
      <div className="iphonex">
        <div className="iphonex__case">
          <div className="iphonex__top">
            <div className="iphonex__time">10:30</div>
            <Icon name='battery full' className="iphonex__battery"/>
          </div>
          <div className="iphonex__notch">
           <div className="iphonex__speaker"></div>
           <div className="iphonex__camera"></div>
          </div>
          <div className="iphonex__screen">
            <Reveal animated='fade'>
              <Reveal.Content visible>
                <Image src={page1} className='iphone-screen-img'/>
              </Reveal.Content>
              <Reveal.Content hidden>
                <Image src={page2} className='iphone-screen-img'/>
              </Reveal.Content>
            </Reveal>
          </div>
        </div>
        <div className="iphonex__power"></div>
        <div className="iphonex__volume iphonex__volume--up"></div>
        <div className="iphonex__volume iphonex__volume--down"></div>
      </div>
      </div>
      </>
    )
  }