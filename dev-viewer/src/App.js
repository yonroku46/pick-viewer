/* eslint-disable */

import React, { useEffect, useReducer, useState } from 'react';
import logo from "./img/app-icon.png";
import HomePage from './components/home/HomePage'
import SearchPage from './components/search/SearchPage'
import BookingPage from './components/booking/BookingPage'
import BookingDetail from './components/booking/BookingDetail';
import ReviewPage from './components/review/ReviewPage';
import CommonPage from './components/common/CommonPage'
import PostPage from './components/common/PostPage'
import LoginPage from './components/login/LoginPage'
import SignupPage from './components/login/SignupPage'
import HelpPage from './components/help/HelpPage'
import NoticeWritePage from './components/help/NoticeWritePage'
import NoticeViewer from './components/help/NoticeViewer'
import HelpPwdPage from './components/help/HelpPwdPage'
import MyPage from './components/mypage/MyPage'
import SchedulePage from './components/mypage/SchedulePage';
import TalkPage from './components/talk/TalkPage';
import DashboardPage from './components/dashboard/DashboardPage'
import WikiPage from './components/WikiPage'
import EmptyPage from './components/EmptyPage'
import { Link, Route, Switch } from "react-router-dom"
import { Button, Icon, Menu, Modal, Segment, Sidebar } from 'semantic-ui-react';
import * as api from './rest/api'
import './App.css';
import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_BASE;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

export default function App() {

  const [countryStat, setCountryStat] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const spList = ['/help/about','/help/notice','/help/contact','/dashboard']
  const updateScroll = () => {
    setScrollPosition(window.scrollY || document.documentElement.scrollTop);
  }

  useEffect(() => {
    window.addEventListener('scroll', updateScroll);
  }, []);
    

  const [visible, setVisible] = useState(false);
  const isAuthorized = sessionStorage.getItem("isAuthorized");
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  const role = userInfo ? userInfo['role'] : null;

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
    return new Promise(function(resolve, reject) {
      axios
        .get(api.logout)
        .then(response => resolve(response.data))
        .catch(error => reject(error.response))
    })
    .then(res => {
      sessionStorage.clear();
      location.href="/";
    })
  }

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
    {countryStat ?
    <div className="App">
      {/* Header */}
      <div className={scrollPosition < 10 || visible ? "app-header invisible" : "app-header"}>
        <div className={scrollPosition < 10 || visible ? "menu-left" : "menu-left pcolor-filter" }>
          <Link to="/" ><img className="logo" src={logo}/></Link>
        </div>
        <div className="menu-center">
        </div>
        <div className={scrollPosition < 10 || visible ? "menu-right" : "menu-right pcolor-filter" }>
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
          inverted
          onHide={() => setVisible(false)}
          vertical
          visible={visible}
          width='thin'
        > 
          <Menu.Item as="div" className="menu-language" onClick={menuClose}>
            <Link to="/wiki"><p className="menu-language-text"><Icon name='globe'/></p></Link>
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
          {isAuthorized && (role === 3) &&
          <Menu.Item as={Link} to='/dashboard' onClick={menuClose}>
            <Icon name='sitemap'/>
            매장관리
          </Menu.Item>
          }
          <Menu.Item as={Link} className='menu-booking' to='/booking/hairshop' onClick={menuClose}>
            <Icon.Group>
              <Icon name='calendar outline'/>
              <Icon corner className='pcolor' name='check circle'/>
            </Icon.Group>
            <div>예약하기</div>
          </Menu.Item>
          {isAuthorized &&
          <Menu.Item as={Link} to='/mypage' onClick={menuClose}>
            <Icon name='user'/>
            마이페이지
          </Menu.Item>
          }
          <Menu.Item as={Link} to='/common' onClick={menuClose}>
            <Icon name='talk'/>
            커뮤니티
          </Menu.Item>
          <Menu.Item as={Link} to='/help/about' onClick={menuClose}>
            <Icon name='handshake'/>
            공지/문의
          </Menu.Item>
        </Sidebar>
      </div>

      {/* Body */}
      <div className="app-body">
        <Sidebar.Pushable as={Segment} className="body-segment">
          <Sidebar.Pusher dimmed={visible}>
            <Segment basic className='background'>
              <Switch>
                <Route exact path="/" component={HomePage}/>
                <Route exact path="/search" component={SearchPage}/>
                <Route exact path="/booking" component={BookingPage}/>
                  <Route exact path="/booking/:category" component={BookingPage}/>
                    <Route path="/booking/hairshop/:shopCd" component={BookingDetail}/>
                    <Route path="/booking/restaurant/:shopCd" component={BookingDetail}/>
                    <Route path="/booking/cafe/:shopCd" component={BookingDetail}/>
                    <Route path="/review/hairshop/:shopCd" component={ReviewPage}/>
                    <Route path="/review/restaurant/:shopCd" component={ReviewPage}/>
                    <Route path="/review/cafe/:shopCd" component={ReviewPage}/>
                <Route exact path="/common" component={CommonPage}/>
                  <Route path="/common/:postCd" component={PostPage}/>
                <Route exact path="/help/pwd" component={HelpPwdPage}/>
                <Route exact path="/help/:item" component={HelpPage}/>
                  <Route exact path="/help/notice/write" component={NoticeWritePage}/>
                  <Route exact path="/help/notice/:noticeCd" component={NoticeViewer}/>
                <Route exact path="/login" component={LoginPage}/>
                <Route exact path="/signup" component={SignupPage}/>
                <Route exact path="/mypage" component={MyPage}/>
                 <Route path="/mypage/schedule" component={SchedulePage}/>
                <Route path="/talk" component={TalkPage}/>
                <Route exact path="/dashboard" component={DashboardPage}/>
                <Route exact path="/wiki" component={WikiPage}/>
                <Route component={EmptyPage}/>
              </Switch>
            </Segment>
            {/* Footer */}
            <footer className={spList.indexOf(window.location.pathname) !== -1 ? 'app-footer footer-border' : 'app-footer'}>
              <Icon name='copyright'/>TEAMBEPO 2022
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
    :
    <Route component={EmptyPage}/> 
    }
  </>
  );
}
