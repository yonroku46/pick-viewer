import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Input, Dimmer, Icon, Button, Loader, Dropdown, Image } from 'semantic-ui-react'
import * as api from '../../rest/api'
import axios from 'axios';

export default function TalkPage(props) {
    const isAuthorized = sessionStorage.getItem('isAuthorized');
    if (isAuthorized === null) {
        props.history.goBack(1);
    }

    const talkRoomCd = props.location.state.talkRoomCd;
    const bookingCd = props.location.state.bookingCd;
    const scrollRef = useRef();
    const [page, setPage] = useState(1);
    const [talkList, setTalkList] = useState([]);
    const [talkDayList, setTalkDayList] = useState([]);
    const [message, setMessage] = useState('');
    const [scheduleStat, setScheduleStat] = useState(true);
    const [loading, setLoading] = useState(true);

    const emoticonBase = 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/noticon/'
    const emoticonList = [
      'EMOTICON_BASE_bbqpsqij4dahbxay5cik.png', 'EMOTICON_BASE_urlhfslsdssycl4awyaf.png', 'EMOTICON_BASE_ypjrdngkpx4tansqg8pr.png',
      'EMOTICON_BASE_xxpktompyafewevsvebm.png', 'EMOTICON_BASE_lkb4rmcrdbxaxdmv6vsq.png', 'EMOTICON_BASE_puw7ewvs87ndly1pamzt.png',
      'EMOTICON_BASE_asnzeopvjcuc50ynymrw.png', 'EMOTICON_BASE_b1nph8nhaqwxuzt4g0tr.png', 'EMOTICON_BASE_tigciwnn53qdtsx5c0ak.png'
    ]
    const emoticonDiv = 3;

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
          }
          setLoading(false);
          scrollToBotton();
        })
        .catch(err => {
          alert("잘못된 접근입니다.");
          setLoading(false);
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

    function sendEmoticon(src) {
      return new Promise(function(resolve, reject) {
        const params = { 
            'talkRoomCd': talkRoomCd,
            'message': src
          };
        axios
          .post(api.talkSend, params)
          .then(response => resolve(response.data))
          .catch(error => reject(error.response))
      })
      .then(res => {
        if (res.success) {
          if (res.data.result) {
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

    function emoticonCovert(src) {
      return src.replace('EMOTICON_BASE_', emoticonBase)
    }

    function scrollToBotton() {
      scrollRef.current.scrollIntoView();
    }

    function bookingDetail() {
        return(
            <>
            {scheduleStat ?
              <div className={scheduleStat ? 'schedule-header' : 'schedule-header warning'}>
                  <span className='left'>
                  <Icon name={scheduleStat ? 'check circle outline' : 'warning circle'}/>
                  {scheduleStat ? '예약확정' : '예약대기중'}
                  </span>
                  <span className='right'>
                    <Dropdown icon='ellipsis vertical' className='icon' pointing='top right'>
                      <Dropdown.Menu>
                        <Dropdown.Item icon='columns' text='예약정보로 이동' onClick={() => props.history.push({pathname: '/mypage/schedule', state: { bookingCd: bookingCd}})}/>
                        <Dropdown.Item icon='zoom-out' text='최소화' onClick={() => setScheduleStat(!scheduleStat)}/>
                        <Dropdown.Item icon='sign-out' text='이전 페이지로' onClick={() => props.history.goBack(1)}/>
                      </Dropdown.Menu>
                    </Dropdown>
                  </span>
              </div>
              :
              <div className='schedule-header mini'>
                <Icon name='plus' onClick={() => setScheduleStat(!scheduleStat)}></Icon>
              </div>
              }
            </>
        )
    }

    return(
        <>
        <div className='talk-main'>
            <div className='talk-main-board'>
              {bookingDetail()}
              {loading ? 
                <Dimmer active inverted>
                  <Loader size='large'></Loader>
                </Dimmer>
              :
              talkList?.length == 0 ?
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
                      {talk.message.startsWith('EMOTICON_BASE_') ? <img src={emoticonCovert(talk.message)}/> : talk.message}
                    </div>
                  </div>
                  :
                  // case1-1 : mine
                  <div className='talk-box mine'>
                    <span className='talk-time mine'>
                      {talk.sendTime.split("/")[1]}
                    </span>
                    <div className='talk-message mine'>
                      {talk.message.startsWith('EMOTICON_BASE_') ? <img src={emoticonCovert(talk.message)}/> : talk.message}
                    </div>
                  </div>
                :
                  idx != 0 && talkList[idx-1].userName == talk.userName ?
                  // case2 : default & not first
                  <div className='talk-box default margin'>
                    <div className='talk-message default'>
                      {talk.message.startsWith('EMOTICON_BASE_') ? <img src={emoticonCovert(talk.message)}/> : talk.message}
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
                      {talk.message.startsWith('EMOTICON_BASE_') ? <img src={emoticonCovert(talk.message)}/> : talk.message}
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
              <Dropdown className='emoticon' icon='meh outline' pointing='top right'>
                <Dropdown.Menu>
                  {[...Array(Math.round(emoticonList.length/emoticonDiv))].map((v,i) =>
                    <Image.Group size='tiny'>
                      {emoticonList.slice(emoticonDiv * i, emoticonDiv * (i+1)).map((src) => 
                        <Image src={emoticonCovert(src)} onClick={() => sendEmoticon(src)}/>
                      )}
                    </Image.Group>
                  )}
                </Dropdown.Menu>
              </Dropdown>
              <Button className='submit' color='black' type='submit' onClick={sendMessage}>전송</Button>
            </Input>
        </div>
        </>
    )
  };