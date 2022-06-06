import { useState } from 'react'
import { Icon, Button, Form, Grid, Header, Segment, Label, Transition } from 'semantic-ui-react'
import * as api from '../../rest/api'
import axios from 'axios';

export default function HelpPwdPage(props) {

  const [apiload, setApiload] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [pin, setPin] = useState('');
  const [certificationStep, setCertificationStep] = useState(false);
  const [resetStep, setResetStep] = useState(false);
  const [pw, setPw] = useState('');
  const [pwCheck, setPwCheck] = useState('');

  function emailInput(e) {
    setEmail(e.target.value);
  }
  function pinInput(e) {
    setPin(e.target.value);
  }
  function pwInput(e) {
    setPw(e.target.value);
  }
  function pwCheckInput(e) {
    setPwCheck(e.target.value);
  }

  // 비밀번호 재설정
  function submit() {
    let reg = /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}.[A-Za-z0-9]{1,}$/;

    if (reg.test(email)) {
      setError(null);
      setApiload(true);
      mailCheck(email).then(data => {
        const result = data.data.result;
        if (result) {
          setError(null);
          alert("인증 이메일을 전송하였습니다. 인증번호를 확인해주세요");
          setApiload(false);
          setCertificationStep(true);
        } else {
          setError("해당 메일유저가 존재하지 않거나, 전송에 실패하였습니다.");
          setApiload(false);
          return;
        }
      });
    } else {
      setError("이메일 형식을 확인해주세요");
      return;
    }
  }

  function submitCertification() {
    setApiload(true);
    certification(email, pin).then(data => {
      const result = data.data.result;
      if (result) {
        setError(null);
        setApiload(false);
        setResetStep(true);
      } else {
        setError("인증번호가 일치하지 않습니다");
        setApiload(false);
        return;
      }
    });
  }

  function helpRest() {
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
    resetPwd(email, pw).then(data => {
      const result = data.data.result;
      if (result) {
        setError(null);
        setApiload(false);
        alert("패스워드 재설정이 완료되었습니다.")
        props.history.goBack(1);
      } else {
        alert("패스워드 재설정에 실패하였습니다. 잠시 후 시도해주세요.");
        setApiload(false);
        return;
      }
    });
  }

  function mailCheck(email) {
    const params = { 
      'userEmail': email
    };
    return new Promise(function(resolve, reject) {
      axios
        .post(api.mailCheck, params)
        .then(response => resolve(response.data))
        .catch(error => reject(error.response))
    });
  }

  function certification(email, pin) {
    const params = { 
      'userEmail': email,
      'pin': pin
    };
    return new Promise(function(resolve, reject) {
      axios
        .post(api.certification, params)
        .then(response => resolve(response.data))
        .catch(error => reject(error.response))
    });
  }

  function resetPwd(email, pw) {
    const params = { 
      'userEmail': email,
      'userPw': pw
    };
    return new Promise(function(resolve, reject) {
      axios
        .post(api.resetPwd, params)
        .then(response => resolve(response.data))
        .catch(error => reject(error.response))
    });
  }

  function ErrorTransition() {
    return(error !== null &&
      <Label basic color='red' pointing>
        {error}
      </Label>
    )
  }

  function step1() {
    // 비밀번호 리셋을 위한 이메일전송
    return(
      <>
      <Header as='h2' color='black' style={{marginLeft:'6px'}}>
        <Icon name='settings'/>
        <Header.Content>
          비밀번호를 잊으셨나요?
        </Header.Content>
      </Header>
      <Form size='large' onSubmit={submit}>
        <Segment stacked>
          <p>회원가입시 등록한 이메일 주소를 입력해주세요</p>
          <Form.Input fluid icon='mail' iconPosition='left' placeholder='E-Mail' value={email} onChange={emailInput}/>
          {apiload ?
            <Button color='black' loading disabled fluid size='large'>
              로딩중
            </Button>
            :
            <Button color='black' fluid size='large'>
              확인
            </Button>
          }
          {ErrorTransition()}
        </Segment>
      </Form>
      </>
    )
  }
  function step2() {
    // 인증번호 확인
    return(
      <>
      <Header as='h2' color='black' style={{marginLeft:'6px'}}>
        <Icon name='settings'/>
        <Header.Content>
          인증번호를 입력해주세요
        </Header.Content>
      </Header>
      <Form size='large' onSubmit={submitCertification}>
        <Segment stacked>
        <Form.Input fluid icon='key' name='pin' iconPosition='left' placeholder='인증번호 입력' value={pin} onChange={pinInput}/>
          {apiload ?
            <Button color='black' loading disabled fluid size='large'>
              로딩중
            </Button>
            :
            <Button color='black' fluid size='large'>
              확인
            </Button>
          }
          {ErrorTransition()}
        </Segment>
      </Form>
      </>
    )
  }
  function step3() {
    // 비밀번호 재설정
    return(
      <>
      <Header as='h2' color='black' style={{marginLeft:'6px'}}>
        <Icon name='settings'/>
        <Header.Content>
          비밀번호 재설정
        </Header.Content>
      </Header>
      <Form size='large' onSubmit={helpRest}>
        <Segment stacked>
        <Form.Input fluid icon='lock' name='password' iconPosition='left' placeholder='비밀번호 (8자리 이상)' type='password' value={pw} onChange={pwInput}/>
        <Form.Input fluid icon='lock' name='passwordCheck' iconPosition='left' placeholder='비밀번호 확인' type='password' value={pwCheck} onChange={pwCheckInput}/>
          {apiload ?
            <Button color='black' loading disabled fluid size='large'>
              로딩중
            </Button>
            :
            <Button color='black' fluid size='large'>
              확인
            </Button>
          }
          {ErrorTransition()}
        </Segment>
      </Form>
      </>
    )
  }

  return(
    <>
    <div className="help-main">
    <Grid className="help-pwd-form" textAlign='center' verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        {resetStep ?
        step3()
        :
        <>
          {certificationStep ?
          step2()
          :
          step1()
          }
        </>
        }
      </Grid.Column>
    </Grid>
    </div>
    </>
    )
  };