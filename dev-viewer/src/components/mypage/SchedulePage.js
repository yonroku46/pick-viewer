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
    const user_cd = userInfo ? userInfo.user_cd : null;
    let [scheduleStat, setScheduleStat] = useState(true);;
    let [bookingInfo, setBookingInfo] = useState({});;

    useEffect(() => {
      // 사용자의 스케쥴이 아닌경우 접근거부
      const params = { 
        'user_cd': user_cd,
        'booking_cd': booking_cd
      };
      return new Promise(function(resolve, reject) {
        axios
          .post(api.getSchedule, params)
          .then(response => resolve(response.data))
          .catch(error => reject(error.response))
      })
      .then(res => {
        if (res) {
          setBookingInfo(res)
        }
      })
      .catch(err => {
        alert("해당 예약정보를 찾을 수 없습니다. 지속시 문의 바랍니다.");
        props.history.goBack(1);
      })
    }, [])

    return(
        <>
        <div className='schedule-main'>

          {/* 예약상황 */}
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
            {/* 예약정보 - 샵정보 */}
            <label><Icon name='angle right'/>{bookingInfo.shop_cd}</label>
            <div>
              {/* 예약가게 사진
              예약일
              예약가게
              예약가게 전화번호 */}
            </div>
            <div>
            {/* 예약정보 - 예약내역 */}
            {/* 예약정보(상세)
            가격(할인있으면 할인내역) */}
            </div>
          </div>

        </div>
        </>
    )
  };