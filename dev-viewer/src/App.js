/* eslint-disable */

import React, { useEffect, useState } from 'react';
import logo from "./img/app-icon.png";
import HomePage from './components/home/HomePage'
import BookingPage from './components/booking/BookingPage'
import DetailPage from './components/booking/DetailPage';
import ReviewPage from './components/review/ReviewPage';
import StylesPage from './components/styles/StylesPage'
import ContactPage from './components/contact/ContactPage'
import LoginPage from './components/login/LoginPage'
import SignupPage from './components/login/SignupPage'
import HelpPage from './components/login/HelpPage'
import MyPage from './components/mypage/MyPage'
import DashboardPage from './components/dashboard/DashboardPage'
import WikiPage from './components/WikiPage'
import EmptyPage from './components/EmptyPage'
import { Link, Route, Switch } from "react-router-dom"
import { Button, Icon, Menu, Modal, Segment, Sidebar } from 'semantic-ui-react';
import * as api from './rest/server'
import './App.css';
import axios from 'axios';

// axios.defaults.baseURL = 'http://3.36.69.67';
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

export default function App() {

  const [ipStat, setIpStat] = useState(true);
  
  useEffect(() => {
     // ip Check
      fetch('https://api.ipify.org/?format=json').then(res =>
      res.json().then(data => {
        return data.ip
      })
      .then(ip => {
        fetch(api.check + ip, { method: 'POST'}).then(res =>
          res.json().then(data => {
            var countryCode = data.split(":");
            if (countryCode[5].includes('JP') || countryCode[5].includes('KR') || countryCode[5].includes('GB')) {
              setIpStat(true);
            } else {
              setIpStat(false);
              console.log("negative ip");
            }
        })
        )
      })
    );
    // server check
    fetch(api.server).then(res =>
      res.json().then(data => {
        data.status ? console.log("connect") : console.log("server disconnect");
      })
    );
  }, []); 

  // menu setting
  const [visible, setVisible] = useState(false);
  const isAuthorized = sessionStorage.getItem("isAuthorized");
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  const permission = userInfo ? userInfo['permission'] : null;

  function toggleMenu() {
    setVisible(!visible);
  };

  function menuClose() {
    setVisible(false);
  }

  function logoutClick() {
    setVisible(false);
    dispatch({ type: 'open', size: 'tiny' });
  }

  function logout() {
    sessionStorage.clear();
    location.href="/";
  }

  // logout modal setting
  const [state, dispatch] = React.useReducer(logoutModal, {
    open: false,
    size: undefined,
  })
  const { open, size } = state

  function logoutModal(state, action) {
    switch (action.type) {
      case 'close':
        return { open: false }
      case 'open':
        return { open: true, size: action.size }
      default:
        throw new Error('Unsupported action')
    }
  }

  return (
    <>
    {ipStat ?
    <div className="App">
      {/* Header */}
      <div className="app-header">
        <div className="menu-left">
          <Link to="/" ><img className="logo" src={logo}/></Link>
        </div>
        <div className="menu-right">
          <div id="menu-icon" className={visible ? 'open': null} onClick={toggleMenu} >
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        {/* menubar */}
        <Sidebar as={Menu}
          animation='overlay' 
          icon='labeled' 
          direction='right'
          className='menubar'
          inverted
          onHide={() => setVisible(false)}
          vertical
          visible={visible}
          width='thin'
        > 
          <Menu.Item as="div" className="menu-language" onClick={menuClose}>
            <Link to="/wiki"><p className="menu-language-text"><Icon name='globe'/>Wiki</p></Link>
          </Menu.Item>
          <Menu.Item as="div" className="menu-user">
          {isAuthorized
            ?
            <Button inverted onClick={logoutClick}>
              로그아웃
            </Button>
            :
            <Link to="/login" onClick={menuClose}>
              <Button inverted>로그인</Button>
            </Link>
          }
          </Menu.Item>
          <Menu.Item as={Link} to='/' onClick={menuClose}>
            <Icon name='home'/>
            홈
          </Menu.Item>
          {
          isAuthorized && (permission === 1 | permission === 2) ?
            <Menu.Item as={Link} to='/mypage' onClick={menuClose}>
              <Icon name='user'/>
              마이페이지
            </Menu.Item>
          :
          isAuthorized && (permission === 3) &&
            <Menu.Item as={Link} to='/dashboard' onClick={menuClose}>
              <Icon name='sitemap'/>
              매장관리
            </Menu.Item>
          }
          {permission !== 3 &&
            <Menu.Item as={Link} to='/booking/' onClick={menuClose}>
              <Icon name='inbox'/>
              예약하기
            </Menu.Item>
          }
          <Menu.Item as={Link} to='/styles' onClick={menuClose}>
            <Icon name='winner'/>
            스타일
          </Menu.Item>
          <Menu.Item as={Link} to='/contact' onClick={menuClose}>
            <Icon name='mail'/>
            문의
          </Menu.Item>
        </Sidebar>
      </div>

      {/* Body */}
      <div className="app-body">
        <Sidebar.Pushable as={Segment} className="body-segment">
          <Sidebar.Pusher dimmed={visible}>
            <Segment basic>
              <Switch>
                <Route exact path="/" component={HomePage} />
                <Route exact path="/booking/" component={BookingPage} />
                  <Route exact path="/booking/:category" component={BookingPage} />
                    <Route path="/booking/hairshop/:shop_cd" component={DetailPage}/>
                    <Route path="/booking/restaurant/:shop_cd" component={DetailPage}/>
                    <Route path="/booking/cafe/:shop_cd" component={DetailPage}/>
                    <Route path="/review/hairshop/:shop_cd" component={ReviewPage}/>
                    <Route path="/review/restaurant/:shop_cd" component={ReviewPage}/>
                    <Route path="/review/cafe/:shop_cd" component={ReviewPage}/>
                <Route exact path="/styles" component={StylesPage} />
                <Route exact path="/contact" component={ContactPage} />
                <Route exact path="/login" component={LoginPage} />
                <Route exact path="/signup" component={SignupPage} />
                <Route exact path="/help" component={HelpPage} />
                <Route exact path="/mypage" component={MyPage} />
                <Route exact path="/dashboard" component={DashboardPage} />
                <Route exact path="/wiki" component={WikiPage} />
                <Route component={EmptyPage} />
              </Switch>
            </Segment>

            {/* Footer */}
            <footer className="app-footer">
              <Icon name='copyright'/>TEAMBEPO
            </footer>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
        <Modal size={size} open={open} onClose={() => dispatch({ type: 'close' })}>
          <Modal.Header>로그아웃 하시겠습니까?</Modal.Header>
            <Modal.Actions>
              <Button negative onClick={() => dispatch({ type: 'close' })}>취소</Button>
              <Button positive onClick={logout}>확인</Button>
            </Modal.Actions>
        </Modal>
    </div>
    :<Route component={EmptyPage}/> 
    }
  </>
  );
}
