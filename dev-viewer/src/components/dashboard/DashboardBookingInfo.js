import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Label, Icon, Table, Button, Header, Segment } from 'semantic-ui-react';
import moment from 'moment';
import axios from 'axios';
import * as api from '../../rest/api'

export default function DashboardBookingInfo(props) {

    // userSelector:redux값 획득
    const value = useSelector( (state) => state );
    // dispatch:값변경요청등 수행
    const dispatch = useDispatch();
    // 처리만하고 결과값은 리턴하지않음

    function add() {
        dispatch({type: 'add'})
    }
    function check() {
        console.log(value);
    }

    const [loading, setLoading] = useState(false);
    const [getMoment, setMoment] = useState(moment());
    const [bookingList, setBookingList] = useState([]);

    const categoryList = ['hairshop', 'restaurant', 'cafe'];

    useEffect(() => {
        setLoading(true);
        return new Promise(function(resolve, reject) {
          axios
            .get(api.shopBookingList, {
              params: {
                'shop_cd': '1'
              }
            })
            .then(response => resolve(response.data))
            .catch(error => reject(error.response))
        })
        .then(res => {
          if (res !== null) {
            setBookingList(res);
            setLoading(false);
          }     
        })
        .catch(err => {
          alert("현재 서버와의 연결이 원활하지 않습니다. 관리자에게 문의해주세요.");
          setLoading(false);
        })
    },[])
    
    function bookingInfo(targetId) {
        const target = bookingList.filter(booking => booking.booking_cd === targetId);
    }

    const timeArr = [];
    new Array(24).fill().forEach((acc, index) => {
        timeArr.push(moment( {hour: index} ).format('HH:mm'));
        // timeArr.push(moment({ hour: index, minute: 30 }).format('HH:mm'));
    })

    const startHour = 9;
    const endHour = 24;

    for (let i = 0; i < startHour; i++) {
        timeArr.shift()
    }
    for (let i = 0; i <  23 - endHour; i++) {
        timeArr.pop()
    }

    const today = getMoment;
    const originYear = parseInt(moment().format('YYYY'));
    const originMonth = parseInt(moment().format('MM'));
    const originDay = parseInt(moment().format('DD'));

    const firstWeek = today.clone().startOf('month').week();
    const lastWeek = today.clone().endOf('month').week() === 1 ? 53 : today.clone().endOf('month').week();

    const weekArr = ["일", "월", "화", "수", "목", "금", "토"];
    function calendarHeadRender() {
        const result = [];
        for (let i = 0; i < weekArr.length; i++) {
            result.push(
                <Table.HeaderCell>{weekArr[i]}</Table.HeaderCell>
            );
        }
        return result;
    };

    function dayClick(e) {
        setMoment(getMoment.date(e.target.innerText));
        console.log(getMoment)
        const dbDate = getMoment.format('YYYY-MM-DD')
    }
    
    function lastMonth() {
        setMoment(getMoment.clone().subtract(1, 'month'));
    }
    function nextMonth() {
        setMoment(getMoment.clone().add(1, 'month'));
    }

    function calendarRender() {
        let result = [];
        let week = firstWeek;
        for (week; week <= lastWeek; week++) {
            result = result.concat(
            <Table.Row className='center'>
            {
                Array(7).fill(0).map((_data, index) => {
                let days = today.clone().startOf('year').week(week).startOf('week').add(index, 'day');

                if (getMoment.format('YYYYMMDD') === days.format('YYYYMMDD')) {
                    return(
                        <Table.Cell onClick={dayClick} className='mypage-table-active table-today'>
                            <span>{days.format('D')}</span>
                        </Table.Cell>
                    );
                } else if (days.format('MM') !== today.format('MM')) {
                    return(
                        <Table.Cell className='table-other-month'>
                            <span>{days.format('D')}</span>
                        </Table.Cell>
                    );
                } else {
                    if ( (parseInt(today.format('YYYY')) === originYear && parseInt(days.format('MM')) <= originMonth) && (parseInt(days.format('D')) < originDay) ) {
                        return(
                            <Table.Cell className='table-other-month'>
                                <span>{days.format('D')}</span>
                            </Table.Cell>
                        );
                    } else {
                        return(
                            <Table.Cell onClick={dayClick} className='mypage-table-active'>
                                <span>{days.format('D')}</span>
                            </Table.Cell>
                        );
                    }
                }
                })
            }
          </Table.Row>
        );
      }
      return result;
    }

    function timeRender() {
        let result = [];

        const target = bookingList.filter(booking => booking.booking_time.match(props.today));
        let cnt = target.length;

        if (cnt !== 0) {
            for (let i = 0; i < cnt; i++) {
                result = result.concat(
                    timeArr.map(time => (
                    <Table.Row className='center'>
                        {target[i].booking_time.substr(9).split(":")[0] ===  time.split(":")[0] &&
                        <>
                        <Table.Cell className='mypage-tt-time'>
                            <span>{time}</span>
                        </Table.Cell>
                        <Table.Cell style={{fontWeight:'bold', textAlign:'left'}}>
                            {target[i].booking_category === categoryList[0] &&
                            <span>
                                <Icon className='mypage-tt-icon' name='cut'/>
                                {target[i].shop_name}
                            </span>
                            }
                            {target[i].booking_category === categoryList[1] &&
                            <span>
                                <Icon className='mypage-tt-icon' name='food'/>
                                {target[i].shop_name} ({target[i].customers}명)
                            </span>
                            }
                            {target[i].booking_category === categoryList[2] &&
                            <span>
                                <Icon className='mypage-tt-icon' name='coffee'/>
                                {target[i].shop_name} ({target[i].customers}명)
                            </span>
                            }
                            <Icon name='angle double right' className='mypage-tt-info' onClick={() => bookingInfo(target[i].booking_cd)}/>
                        </Table.Cell>
                        </>
                        }
                    </Table.Row> 
                    )
                )
                );
            }
        } else {
            result = result.concat(
            <Table.Cell colSpan='2' className='mypage-tt-time'>
                <Segment className='mypage-tt-nodata' placeholder>
                    <Header icon>
                    <Icon name='qq'/>
                    등록된 예약이 없습니다.
                    </Header>
                </Segment>
            </Table.Cell>
            );
        }

        return result;
    }

    return(
        <>
        <div style={{marginBottom:'4em'}}></div>
        <Button onClick={() => add('test')}>add</Button>
        <Button onClick={() => check()}>check</Button>
        <Table unstackable>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell colSpan='7' className='mypage-table-month'>
                        <h4>
                        {parseInt(today.format('YYYY')) === originYear && parseInt(today.format('MM')) <= originMonth
                        ? <Icon name='chevron left' className='mypage-table-btn1-disable'/>
                        : <Icon name='chevron left' className='mypage-table-btn1' onClick={lastMonth}/>
                        }
                        {today.format('YYYY / MM')}
                        <Icon name='chevron right' className='mypage-table-btn2' onClick={nextMonth}/>
                        </h4>
                    </Table.HeaderCell>
                </Table.Row>
                <Table.Row className='center'>
                    {calendarHeadRender()}
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {calendarRender()}
            </Table.Body>
        </Table>

        <Table unstackable>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell className='mypage-tt-header'>시간대</Table.HeaderCell>
                <Table.HeaderCell>예약일정</Table.HeaderCell>
            </Table.Row>
        </Table.Header>

        <Table.Body>
            {timeRender()}
        </Table.Body>
    </Table>
    </>
    );
}