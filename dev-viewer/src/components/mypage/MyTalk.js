import {useState} from 'react';
import { Image, List, Label } from 'semantic-ui-react'

export default function MyTalk() {

    return (
        <>    
        <List celled className='mytalk-list'>
            <List.Item>
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