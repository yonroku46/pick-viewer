import React, { useEffect, useState, useReducer } from "react";
import { useParams, Link } from "react-router-dom";
import { Label, Button, Container, Divider, Grid, Segment, Image, Icon, Loader, Modal } from 'semantic-ui-react'
import * as api from '../../rest/api'
import axios from 'axios';

export default function SchedulePage(props) {
    const isAuthorized = sessionStorage.getItem('isAuthorized');
    if (isAuthorized === null) {
      props.history.goBack(1);
    }
    const {booking_cd} = useParams();
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    let [scheduleStat, setScheduleStat] = useState(true);;

    useEffect(() => {
      // 사용자의 스케쥴이 아닌경우 접근거부
      if (booking_cd === null) {
        alert('잘못된 접근입니다.')
        props.history.goBack(1);
      }
    }, [])

    return(
        <>
        <div className='schedule-main'>

          <div className={scheduleStat ? 'schedule-header' : 'schedule-header warning'}>
            <span className='left'>
              <Icon name={scheduleStat ? 'check circle outline' : 'warning circle'}/>
            {scheduleStat ? '예약확정' : '예약대기중'}
            </span>
            <span className='right' onClick={() => setScheduleStat(!scheduleStat)}>
              <Icon name='ellipsis vertical'/>
            </span>
          </div>

          <div className='schedule-content'>
            <label><Icon name='angle right'/>미추헤어샵</label>
          </div>
        </div>
        </>
    )
  };