import React, { useEffect, useState, useReducer } from "react";
import { useParams, Link } from "react-router-dom";
import { Label, Button, Container, Divider, Grid, Segment, Image, Icon, Loader, Modal } from 'semantic-ui-react'
import * as api from '../../rest/api'
import axios from 'axios';

export default function TalkPage(props) {
    const isAuthorized = sessionStorage.getItem('isAuthorized');
    if (isAuthorized === null) {
        props.history.goBack(1);
    }
    const {talk_cd} = useParams();
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));

    useEffect(() => {
        // 사용자의 토크내역이 아닌경우 접근거부
        if (talk_cd === null) {
            alert('잘못된 접근입니다.')
            props.history.goBack(1);
        }
    }, [])

    return(
        <>
        <div className='talk-main'>
            talkPage
        </div>
        </>
    )
  };