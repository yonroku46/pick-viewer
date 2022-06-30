import React, { useEffect, useState, useReducer } from "react";
import { useParams, Link } from "react-router-dom";
import { Input, Accordion, Icon, Button } from 'semantic-ui-react'
import * as api from '../../rest/api'
import axios from 'axios';

export default function TalkPage(props) {
    const isAuthorized = sessionStorage.getItem('isAuthorized');
    if (isAuthorized === null) {
        props.history.goBack(1);
    }
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));

    const [activeIndex, setActiveIndex] = useState(-1);
    const [page, setPage] = useState(1);
    const [talkRoomCd, setTalkRoomCd] = useState();
    const [message, setMessage] = useState('');

    useEffect(() => {
        // 사용자의 토크내역이 아닌경우 접근거부
        return new Promise(function(resolve, reject) {
            axios
              .get(api.roomEnter, {
                  params: {
                      'talkRoomCd': talkRoomCd,
                      'page': page
                  }
                })
              .then(response => resolve(response.data))
              .catch(error => reject(error.response))
          })
          .then(res => {
            if (res) {
              console.log(res);
              setTalkRoomCd(res.data);
            }
          })
          .catch(err => {
            alert("잘못된 접근입니다.");
            props.history.goBack(1);
          })
    }, [])

    function handleClick(e, props) {
        const index = props.index;
        const newIndex = activeIndex === index ? -1 : index
        setActiveIndex(newIndex)
    }

    function sendMessage() {
        return new Promise(function(resolve, reject) {
            const params = { 
                'talkRoomCd': talkRoomCd,
                'message': message
              };
            axios
              .post(api.talkSend, params)
              .then(response => resolve(response.data))
              .catch(error => reject(error.response))
          })
          .then(res => {
            if (res) {
              console.log(res);
              setMessage('');
            }
          })
          .catch(err => {
            alert("메세지 전송에 실패하였습니다. 지속시 문의 바랍니다.");
          })
    }

    function bookingDetail() {
        return(
            <>
            <Accordion fluid styled className='talk-booking-info'>
                <Accordion.Title active={activeIndex === 0} index={0} onClick={handleClick}>
                    <Icon name='dropdown'/>예약상황
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 0}>
                    예약 상세
                </Accordion.Content>
            </Accordion>
            </>
        )
    }

    return(
        <>
        <div className='talk-main'>
            {bookingDetail()}
            <div className='talk-main-board'>
                <div className='talk-box default'>
                    <img src={api.imgRender('images/user/default.png')} alt="" className="talk-user-icon"/>
                    <div className='talk-message default'>
                        내가 상대
                    </div>
                </div>
                <div className='talk-box mine'>
                    <img src={api.imgRender('images/user/default.png')} alt="" className="talk-user-icon"/>
                    <div className='talk-message mine'>
                        내가 로그인 유저
                    </div>
                </div>
            </div>
            <Input type='text' action className='talk-message-input'>
                <Button className='setting' icon='cog'/>
                <input value={message} onChange={(e) => setMessage(e.target.value)}/>
                <Button className='submit' type='submit' onClick={sendMessage}>전송</Button>
            </Input>
        </div>
        </>
    )
  };