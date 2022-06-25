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
    const {talk_cd} = useParams();
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));

    const [activeIndex, setActiveIndex] = useState(-1);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // 사용자의 토크내역이 아닌경우 접근거부
        if (talk_cd === null) {
            alert('잘못된 접근입니다.')
            props.history.goBack(1);
        }
    }, [])

    function handleClick(e, props) {
        const index = props.index;
        const newIndex = activeIndex === index ? -1 : index
        setActiveIndex(newIndex)
    }

    function sendMessage() {
        console.log(message);
        setMessage('');
    }

    function bookingDetail() {
        return(
            <>
            <Accordion fluid styled>
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
            <div className='talk-message'>
                내가 주인
            </div>
            <div className='talk-message mine'>
                내가 게스트
            </div>
            <Input type='text' action className='talk-message-input'>
                <Button circular icon='cog'/>
                <input value={message} onChange={(e) => setMessage(e.target.value)} onKeyPress={sendMessage}/>
                <Button type='submit' onClick={sendMessage}>전송</Button>
            </Input>
        </div>
        </>
    )
  };