import React, { useState, useRef, useEffect } from 'react'
import { Item, Icon, Modal, Container, Menu, Button, Input, Label, Message, Transition } from 'semantic-ui-react'
import { Redirect, Link } from 'react-router-dom'
import Calendar from "./MyCalendar";
import Talk from "./MyTalk";
import Favorite from "./MyFavorite";
import * as api from '../../rest/api'
import axios from 'axios';

export default function MyPage(props) {
  
  const isAuthorized = sessionStorage.getItem('isAuthorized');
  if (isAuthorized === null) {
    props.history.goBack(1);
  }

  const [reload, setReload] = useState(0);

  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  const userName = userInfo['userName'] ?? '';
  const email = userInfo['userEmail'] ?? '';
  const userIcon = userInfo['userImg'] ?? 'images/user/default.png';
  const userIntro = userInfo['userInfo'] ?? '자기소개를 입력해보세요!';
  const userCd = userInfo ? userInfo['userCd'] : null;
  const employment = userInfo ? userInfo.employment : null;
  const permission = userInfo ? userInfo['permission'] : null;

  const [icon, setIcon] = useState(userIcon);
  const [intro, setIntro] = useState(userIntro);
  const [submitShopCd, setSubmitShopCd] = useState(null);
  const inputRef = useRef(null);

  const fileType=['image/png','image/jpg','image/jpeg'];

  const [activeItem, setActiveItem] = useState('schdule');
  const [newInfo, setNewInfo] = useState(intro);

  const [bookingList, setBookingList] = useState([]);
  const [favoriteList, setFavoriteList] = useState([]);

  useEffect(() => {
    return new Promise(function(resolve, reject) {
      axios
        .get(api.bookingList, {
          params: {
            'userCd': userCd
          }
        })
        .then(response => resolve(response.data))
        .catch(error => reject(error.response))
    })
    .then(res => {
      if (res.success) {
        setBookingList(res.dataList);
        getFavoriteList();
      } else {
        alert("정보를 받아오는데에 실패하였습니다. 잠시 후 시도해주세요.")
      }
    })
    .catch(err => {
      alert("현재 서버와의 연결이 원활하지 않습니다. 관리자에게 문의해주세요.");
    })
  }, [reload]); 

  function getFavoriteList() {
    return new Promise(function(resolve, reject) {
      axios
      .get(api.favoriteList, {
        params: {
          'userCd': userCd
        }
      })
      .then(response => resolve(response.data))
      .catch(error => reject(error.response))
    })
    .then(res => {
      if (res.success) {
        setFavoriteList(res.dataList);
      } else {
        alert("정보를 받아오는데에 실패하였습니다. 잠시 후 시도해주세요.")
      }
    })
    .catch(err => {
      alert("현재 서버와의 연결이 원활하지 않습니다. 관리자에게 문의해주세요.");
    })
  }

  function newInfoInput(e) {
    setNewInfo(e.target.value);
  }
  function submitShopCdInput(e) {
    setSubmitShopCd(e.target.value);
  }

  const [visible, setVisible] = useState(false);
  const duration = 500;
  const animation = 'fade down';

  const handleItemClick = (e, { name }) => setActiveItem(name);

  // infoEdit modal setting
  const [state, dispatch] = React.useReducer(infoEditodal, {
    open: false,
  })
  const { open } = state

  // submitShopCd modal setting
  const [state2, dispatch2] = React.useReducer(submitShopCdModal, {
    open2: false,
  })
  const { open2 } = state2

  function infoEditodal(state, action) {
    switch (action.type) {
      case 'close':
        return { open: false }
      case 'open':
        return { open: true }
      default:
        throw new Error('Unsupported action')
    }
  }

  function submitShopCdModal(state2, action) {
    switch (action.type2) {
      case 'close':
        return { open2: false }
      case 'open':
        return { open2: true }
      default:
        throw new Error('Unsupported action')
    }
  }

  function setImg() {
    inputRef.current.click();
  };

  // 이미지 업로드api
  function imgUpload(e) {
    const type = e.target.files[0].type;

    if (fileType.indexOf(type) !== -1) {
      const params = new FormData();
      params.append('file', e.target.files[0]);
      params.append('user_cd', userCd);
      params.append('call', 'user');
      axios
        .post(api.imgUpload, params)
        .then((res) => {
          if (res) {
            alert("변경이 완료되었습니다.")
            userInfo['user_img'] = res.data;
            sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
            setIcon(res.data);
            setReload(reload + 1);
          }
        })
        .catch((err) => {
          console.error(err);
          alert("업로드에 실패하였습니다. 잠시 후 시도해주세요.");
        });
    } else {
      alert("파일형식이 올바르지 않습니다.")
    }
  };

  function infoUpdate() {
    if (newInfo.length === 0 || 30 < newInfo.length) {
      alert("자기소개 글자수가 너무 적거나 많습니다.(최대 30자)");
      return;
    }
    let body = {
      user_email: email,
      user_info: newInfo
    }
    axios
      .post(api.infoUpdate, body)
      .then((res) => {
        if (res.data === true) {
          userInfo['user_info'] = newInfo;
          sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
          setIntro(newInfo);
          dispatch({ type: 'close' });
        } else {
          alert("업데이트에 실패하였습니다. 잠시 후 시도해주세요.");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("서버가 원활하지 않습니다. 잠시 후 시도해주세요.");
      });
  }

  function submitEmployment() {
    let body = {
      user_cd: userInfo.user_cd,
      submit_shop_cd: submitShopCd,
      permission: permission
    }
    axios
      .post(api.submitEmployment, body)
      .then((res) => {
        if (res.data === true) {
          userInfo['employment'] = submitShopCd;
          sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
          alert("소속 신청이 완료되었습니다.");
          dispatch2({ type2: 'close' });
          props.history.push('/mypage');
        } else {
          alert("매장코드를 확인 후 다시 시도해주세요.\n지속시 관리자에게 문의 바랍니다.");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("서버가 원활하지 않습니다. 잠시 후 시도해주세요.");
      });
  }
  
  useEffect(() => {
    setVisible(true);
  }, []); 

  return(
    <>
    {!isAuthorized ? <Redirect to="/login" /> :
    <>
    <div className='mypage-main'>
    {(employment === null && permission === 2) &&
    <Transition animation={animation} duration={duration} visible={visible}>
      <Message color='blue' onClick={() => dispatch2({ type2: 'open' })} className='mypage-msg' header='직원이신가요?' content='이 메세지를 눌러 소속을 정해주세요' />
    </Transition>
    }
    <Container className="mypage-content-user">
      <Item.Group divided>
        <Item>
          <input hidden type='file' ref={inputRef} accept=".png, .jpg, .jpeg" onChange={imgUpload}/>
          <img src={api.imgRender(icon)} alt="" className="mypage-user-icon" onClick={setImg}/>
          <Item.Content className="mypage-user-info">
            <Item.Header>
              {userName}
            </Item.Header>
            <Menu floated='right' className='mypage-setting-icon' onClick={() => dispatch({ type: 'open' })}>
              <Menu.Item as='a' icon>
                  <Icon name='cog'/>
              </Menu.Item>
            </Menu>
            <Item.Meta className='mypage-user-mail'>
              <span>{email}</span>
            </Item.Meta>
            <Item.Description className='mypage-user-intro'>
              {intro}
            </Item.Description>

            <Modal size={'tiny'} open={open} onClose={() => dispatch({ type: 'close' })}>
              <Modal.Header>자기소개 수정</Modal.Header>
              <Modal.Content>
                <Input fluid labelPosition='right' type='text' value={newInfo} onChange={newInfoInput} placeholder='최대 30자까지 입력 가능합니다'>
                  <input />
                  <Label>{newInfo.length}/30</Label>
                </Input>
              </Modal.Content>
              <Modal.Actions>
                <Button negative onClick={() => dispatch({ type: 'close' })}>
                  취소
                </Button>
                <Button positive onClick={infoUpdate}>
                  저장
                </Button>
              </Modal.Actions>
            </Modal>

            <Modal size={'tiny'} open={open2} onClose={() => dispatch2({ type2: 'close' })}>
              <Modal.Header>소속 신청</Modal.Header>
              <Modal.Content>
                <Input fluid type='text' onChange={submitShopCdInput} placeholder='매장코드 입력'/>
              </Modal.Content>
              <Modal.Actions>
                <Button negative onClick={() => dispatch2({ type2: 'close' })}>
                  취소
                </Button>
                <Button positive onClick={submitEmployment}>
                  확인
                </Button>
              </Modal.Actions>
            </Modal>

          </Item.Content>
        </Item>
      </Item.Group>
    </Container>

    <Menu pointing secondary className='mypage-menu'>
      <Menu.Item
        name='schdule'
        active={activeItem === 'schdule'}
        onClick={handleItemClick}>
        <Icon name='table' size='large' className='mypage-icon-sp'/><span className='mypage-menu-sp'>예약관리</span>
      </Menu.Item>
      <Menu.Item
        name='talk'
        active={activeItem === 'talk'}
        onClick={handleItemClick}>
        <Icon name='comments' size='large' className='mypage-icon-sp'/><span className='mypage-menu-sp'>메세지</span>
      </Menu.Item>
      <Menu.Item
        name='favorite'
        active={activeItem === 'favorite'}
        onClick={handleItemClick}>
        <Icon name='heart' size='large' className='mypage-icon-sp'/><span className='mypage-menu-sp'>즐겨찾기</span>
      </Menu.Item>
    </Menu>

    <Container className="mypage-content-table">
      {
      activeItem === 'schdule'?
        <Calendar bookingList={bookingList}/>
      :
      activeItem === 'talk'?
        <Talk/>
      :
      activeItem === 'favorite'?
        <Favorite favoriteList={favoriteList}/>
      :
      <></>
      }
    </Container>
    </div>
    </>
    }
    </>
    )
  };