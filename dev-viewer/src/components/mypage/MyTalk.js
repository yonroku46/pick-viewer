import React, { useEffect, useState, useReducer } from "react";
import { Link, withRouter } from "react-router-dom";
import { Image, List, Menu, Icon, Dropdown } from 'semantic-ui-react'
import * as api from '../../rest/api'
import axios from 'axios';

function MyTalk(props) {

    const [activeItem, setActiveItem] = useState('home');
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
          if (res) {
            console.log(res);
          }
        })
        .catch(err => {
          alert("메세지 내역을 불러올 수 없습니다. 지속시 문의 바랍니다.");
        })
      }, [])

    function talkInfo(targetId) {
        const target = targetId;
        props.history.push('/talk/' + target);
    }

    function handleItemClick(e, { name }) {
        setActiveItem(name);
    }

    return (
        <>
        <List celled className='mytalk-list'>
            <List.Item onClick={() => talkInfo('1')}>
                <Image avatar className='mytalk-user-icon' src='https://react.semantic-ui.com/images/avatar/small/helen.jpg' />
                <List.Content>
                    <List.Header>고객1</List.Header>
                    첫방문인데 문의 있습니다!
                </List.Content>
                <span className='mytalk-mark'/>
                <span className='mytalk-time'>09:01</span>
            </List.Item>
            <List.Item>
                <Image avatar className='mytalk-user-icon' src='https://react.semantic-ui.com/images/avatar/small/daniel.jpg' />
                <List.Content>
                    <List.Header>고객2</List.Header>
                    예약일정 바꿀 수 있을까요?
                </List.Content>
                <span className='mytalk-mark'/>
                <span className='mytalk-time'>08:55</span>
            </List.Item>
            <List.Item>
                <Image avatar className='mytalk-user-icon' src='https://react.semantic-ui.com/images/avatar/small/daniel.jpg' />
                <List.Content>
                    <List.Header>고객3</List.Header>
                    문의드립니다
                </List.Content>
                <span className='mytalk-time'>08:51</span>
            </List.Item>
        </List>
        </>
    );
}

export default withRouter(MyTalk);