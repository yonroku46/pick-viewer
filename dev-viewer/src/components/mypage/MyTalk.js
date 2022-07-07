import React, { useEffect, useState, useReducer } from "react";
import { Link, withRouter } from "react-router-dom";
import { Image, List, Menu, Icon, Dropdown } from 'semantic-ui-react'
import * as api from '../../rest/api'
import axios from 'axios';

function MyTalk(props) {

    const [activeItem, setActiveItem] = useState('home');
    const [talkRoomList, setTalkRoomList] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        return new Promise(function(resolve, reject) {
          axios
            .get(api.roomlist, {
                params: {
                    'page': page
                }
              })
            .then(response => resolve(response.data))
            .catch(error => reject(error.response))
        })
        .then(res => {
          if (res.success) {
            setTalkRoomList(res.dataList);
          }
        })
        .catch(err => {
          alert("메세지 내역을 불러올 수 없습니다. 지속시 문의 바랍니다.");
        })
      }, [])
    
    // 첫 실행 후에는 현재 list에있는 이후의 내역만 가져오도록 변경
    useEffect(() => {
      const id = setInterval(() => {
        chatListUpdate();
      }, 5000);
      return () => {
        clearInterval(id);
      };
    });

    function chatListUpdate() {
      return new Promise(function(resolve, reject) {
        axios
          .get(api.roomlist, {
              params: {
                  'page': page
              }
            })
          .then(response => resolve(response.data))
          .catch(error => reject(error.response))
      })
      .then(res => {
        if (res.success) {
          setTalkRoomList(res.dataList);
        }
      })
      .catch(err => {
        alert("메세지 내역을 불러올 수 없습니다. 지속시 문의 바랍니다.");
      })
    }

    function talkInfo(targetId) {
        const target = targetId;
        props.history.push({
            pathname: '/talk',
            state: { talkRoomCd: target}
        })
    }

    return (
        <>
        <div className='mypage-talk-menu'>
            <Icon name='comment outline'/>
            <span className='text'>토크내역</span>
        </div>

        <List celled className='mytalk-list'>
            {talkRoomList && talkRoomList.map(talk =>
                <List.Item onClick={() => talkInfo(talk.talkRoomCd)}>
                    <Image avatar className='mytalk-user-icon' src={api.imgRender(talk.userImg)} />
                    <List.Content className='mytalk-content'>
                        <List.Header>{talk.userName}</List.Header>
                        {talk.message}
                    </List.Content>
                    <span className={talk.read ? '' : 'mytalk-mark'}/>
                    <span className='mytalk-time'>{talk.updateTimeAsString}</span>
                </List.Item>
            )}
        </List>
        </>
    );
}

export default withRouter(MyTalk);