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

    const talkRoomCd = props.location.state.talkRoomCd;
    const [page, setPage] = useState(1);
    const [talkList, setTalkList] = useState([]);
    const [talkDayList, setTalkDayList] = useState([]);
    const [message, setMessage] = useState('');
    const [scheduleStat, setScheduleStat] = useState(true);

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
          if (res.success) {
            setTalkList(talkTimeRender(res.dataList));
          } else {
            alert("채팅내역 불러오기에 실패하였습니다.");
          }
        })
        .catch(err => {
          alert("잘못된 접근입니다.");
          props.history.goBack(1);
        })
    }, []);
    
    // 첫 실행 후에는 현재 list에있는 이후의 내역만 가져오도록 변경
    useEffect(() => {
      const id = setInterval(() => {
        chatReload();
      }, 2500);
      return () => {
        clearInterval(id);
      };
    });

    function chatReload() {
      return new Promise(function(resolve, reject) {
        axios
          .get(api.talkReload, {
              params: {
                'talkRoomCd': talkRoomCd,
                'lastContentCd': talkList.length !== 0 ? talkList[talkList.length - 1].talkContentCd : 1
              }
            })
          .then(response => resolve(response.data))
          .catch(error => reject(error.response))
      })
      .then(res => {
        if (res.success) {
          const updateList = res.dataList;
          if (0 < updateList.length) {
            setTalkList([talkList, talkTimeRender(updateList)]);
          }
        } else {
          alert("채팅내역 불러오기에 실패하였습니다.");
        }
      })
      .catch(err => {
        alert("잘못된 접근입니다.");
        props.history.goBack(1);
      })
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
            if (res.success) {
              if (res.data.result) {
                setMessage('');
                chatReload();
              }
            } else {
              alert("메세지 전송에 실패하였습니다. 지속시 문의 바랍니다.");
            }
          })
          .catch(err => {
            alert("메세지 전송에 실패하였습니다. 지속시 문의 바랍니다.");
          })
    }

    function talkTimeRender(targetList) {
      let result = [];
      targetList.map(talk => {
        const tmp = talk.sendTime.split("/");
        if (result.indexOf(tmp[0]) == -1) {
          result.push(tmp[0])
        }
      })
      setTalkDayList(result);
      return targetList;
    }

    function bookingDetail() {
        return(
            <>
            <div className={scheduleStat ? 'schedule-header' : 'schedule-header warning'}>
                <span className='left'>
                <Icon name={scheduleStat ? 'check circle outline' : 'warning circle'}/>
                {scheduleStat ? '예약확정' : '예약대기중'}
                </span>
                <span className='right' onClick={() => setScheduleStat(!scheduleStat)}>
                <Icon name='ellipsis vertical'/>
                </span>
            </div>
            </>
        )
    }

    return(
        <>
        <div className='talk-main'>
            {bookingDetail()}
            <div className='talk-main-board'>
              {talkList && talkList.map((talk, idx) =>
              <>
                {talkDayList.map(talkDay =>
                  <div className={idx != 0 && talkList[idx-1].sendTime.split("/")[0] == talk.sendTime.split("/")[0] ? 'none' : talk.sendTime.split("/")[0] == talkDay ? 'talk-day' : 'none'}>
                    {talkDay}
                  </div>
                )}
                <div className={talk.me ? 'talk-box mine' : 'talk-box default'}>
                  <span className={idx != 0 && talkList[idx-1].userName == talk.userName ? 'none' : 'talk-username'}>
                    {talk.userName}
                  </span>
                  <img src={api.imgRender(talk.userImg ? talk.userImg : 'images/user/default.png')} alt="" className="talk-user-icon"/>
                  <div className={talk.me ? 'talk-message mine' : 'talk-message default'}>
                    {talk.message}
                  </div>
                  <span className={talk.me ? 'talk-time mine' : 'talk-time default'}>
                    {talk.sendTime.split("/")[1]}
                  </span>
                </div>
              </>
              )}
            </div>
            <Input type='text' action className='talk-message-input'>
                <Button className='setting' icon='cog'/>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)}/>
                <Button className='submit' type='submit' onClick={sendMessage}>전송</Button>
            </Input>
        </div>
        </>
    )
  };