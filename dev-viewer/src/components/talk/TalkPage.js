import React, { useEffect, useState, useRef } from "react";
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
    const scrollRef = useRef();
    const [page, setPage] = useState(1);
    const [talkList, setTalkList] = useState([]);
    const [talkDayList, setTalkDayList] = useState([]);
    const [message, setMessage] = useState('');
    const [scheduleStat, setScheduleStat] = useState(true);
    const noticeMessage = "개인정보 및 선결제 요구는\n각별히 조심해주시기 바랍니다.";

    useEffect(() => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
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

    useEffect(() => {
      scrollToBotton();
    }, [talkList]);
    
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
            setTalkList(talkList.concat(talkTimeRender(updateList)));
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

    function onPress(e) {
      // 조합중의 동작을 막음
      if (e.nativeEvent.isComposing) {
        return;
      }
      // ctrl/shift: 개행, Enter: 전송
      if (e.ctrlKey) {
        setMessage(message + "\n");
      } else if (e.shiftKey) {
        setMessage(message);
      } else if (e.key === 'Enter') {
        sendMessage();
      }
    }

    function sendMessage() {
        if (message.length === 0) {
          return;
        }
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

    function scrollToBotton() {
      scrollRef.current.scrollIntoView();
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
            <div className='talk-main-board'>
              {bookingDetail()}
              {talkList?.length == 0 ?
                <div className='talk-notice'>
                  {noticeMessage}
                </div>
              :
              talkList.map((talk, idx) =>
              <>
                {talkDayList.map(talkDay => idx == 0 ?
                  talk.sendTime.split("/")[0] == talkDay &&
                    <div className='talk-day'>
                      {talkDay}
                    </div>
                  :
                  talkList[idx-1].sendTime.split("/")[0] != talk.sendTime.split("/")[0] && 
                    talk.sendTime.split("/")[0] == talkDay &&
                      <div className='talk-day'>
                        {talkDay}
                      </div>
                )}
                {talk.me ?
                  idx != 0 && talkList[idx-1].userName == talk.userName ?
                  // case1 : mine & not first
                  <div className='talk-box mine'>
                    {talk.sendTime.split("/")[1] != talkList[idx+1]?.sendTime.split("/")[1] &&
                    <span className='talk-time mine'>
                      {talk.sendTime.split("/")[1]}
                    </span>
                    }
                    <div className='talk-message mine'>
                      {talk.message}
                    </div>
                  </div>
                  :
                  // case1-1 : mine
                  <div className='talk-box mine'>
                    <span className='talk-time mine'>
                      {talk.sendTime.split("/")[1]}
                    </span>
                    <div className='talk-message mine'>
                      {talk.message}
                    </div>
                  </div>
                :
                  idx != 0 && talkList[idx-1].userName == talk.userName ?
                  // case2 : default & not first
                  <div className='talk-box default margin'>
                    <div className='talk-message default'>
                      {talk.message}
                    </div>
                    {talk.sendTime.split("/")[1] != talkList[idx+1]?.sendTime.split("/")[1] &&
                    <span className='talk-time default'>
                      {talk.sendTime.split("/")[1]}
                    </span>
                    }
                  </div>
                  :
                  // case2-1 : default
                  <div className='talk-box default'>
                    <span className='talk-username'>
                      {talk.userName}
                    </span>
                    <img src={api.imgRender(talk.userImg ? talk.userImg : 'images/user/default.png')} alt="" className="talk-user-icon"/>
                    <div className='talk-message default'>
                      {talk.message}
                    </div>
                    <span className='talk-time default'>
                      {talk.sendTime.split("/")[1]}
                    </span>
                  </div>
                }
              </>
              )}
              <div className='talk-box-end' ref={scrollRef}/>
            </div>
            <Input type='text' action className='talk-message-input'>
              <textarea value={message} onKeyPress={onPress} onChange={(e) => setMessage(e.target.value)}/>
              <Button className='submit' color='black' type='submit' onClick={sendMessage}>전송</Button>
            </Input>
        </div>
        </>
    )
  };