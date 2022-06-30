import React, { useEffect, useState, useReducer } from "react";
import { useParams, Link } from "react-router-dom";
import { Label, Button, Container, Divider, Grid, Segment, Image, Icon, Loader, Modal } from 'semantic-ui-react'
import * as api from '../../rest/api'
import axios from 'axios';
import TalkPage from "../talk/TalkPage";

export default function SchedulePage(props) {
    const isAuthorized = sessionStorage.getItem('isAuthorized');
    if (isAuthorized === null) {
      props.history.goBack(1);
    }
    const {bookingCd} = useParams();
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    const userCd = userInfo ? userInfo.userCd : null;
    let [scheduleStat, setScheduleStat] = useState(true);;
    let [bookingInfo, setBookingInfo] = useState({});;

    useEffect(() => {
      // 사용자의 스케쥴이 아닌경우 접근거부
      return new Promise(function(resolve, reject) {
        axios
          .get(api.getSchedule, { 
            params: {
              'userCd': userCd,
              'bookingCd': bookingCd
            }
          })
          .then(response => resolve(response.data))
          .catch(error => reject(error.response))
      })
      .then(res => {
        if (res.success) {
          setBookingInfo(res.data)
        }
      })
      .catch(err => {
        alert("해당 예약정보를 찾을 수 없습니다. 지속시 문의 바랍니다.");
        props.history.goBack(1);
      })
    }, [])

    function moveTalkPage() {
      const designer = bookingInfo.bookingDetail.designer;
      const shopCd = bookingInfo.shopCd;
      if (designer === undefined) {
        console.log(shopCd);
      } else {
        console.log(designer);
      }
    }

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
            {bookingInfo.bookingPrice}
            {/* 예약정보 - 예약내역 */}
            {/* 예약정보(상세)
            가격(할인있으면 할인내역) */}
            </div>
            <Button circular color='black' icon='talk' onClick={moveTalkPage}/>
          </div>

        </div>
        </>
    )
  };