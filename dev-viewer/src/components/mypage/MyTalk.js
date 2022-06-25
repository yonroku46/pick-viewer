import React, { useEffect, useState, useReducer } from "react";
import { Link, withRouter } from "react-router-dom";
import { Image, List, Menu, Icon, Dropdown } from 'semantic-ui-react'
import * as api from '../../rest/api'
import axios from 'axios';

function MyTalk(props) {

    const [activeItem, setActiveItem] = useState('home');
    const [page, setPage] = useState(1);

    useEffect(() => {
        // 사용자의 스케쥴이 아닌경우 접근거부
        const params = { 
          'page': page
        };
        return new Promise(function(resolve, reject) {
          axios
            .post(api.roomlist, params)
            .then(response => resolve(response.data))
            .catch(error => reject(error.response))
        })
        .then(res => {
          if (res) {
            console.log(res);
          }
        })
        .catch(err => {
          alert("해당 예약정보를 찾을 수 없습니다. 지속시 문의 바랍니다.");
          props.history.goBack(1);
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
        <Menu attached='top' className='mytalk-menu'>
            <Dropdown item icon='th list' simple>
                <Dropdown.Menu>
                <Dropdown.Item>
                    <Icon name='dropdown'/>
                        <span className='text'>정렬</span>
                        <Dropdown.Menu>
                            <Dropdown.Item>최신순</Dropdown.Item>
                            <Dropdown.Item>읽지않은순</Dropdown.Item>
                        </Dropdown.Menu>
                </Dropdown.Item>
                <Dropdown.Item>기능1</Dropdown.Item>
                <Dropdown.Divider/>
                <Dropdown.Item>기능2</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            <Menu.Menu position='right'>
                <div className='ui right aligned category search item'>
                <div className='ui transparent icon input'>
                    <input className='prompt' type='text' placeholder='고객명 검색'/>
                    <i className='search link icon' />
                </div>
                <div className='results' />
                </div>
            </Menu.Menu>
        </Menu>

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