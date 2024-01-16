import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Icon, Table, Button, Header, Segment, Label, Image } from 'semantic-ui-react';
import moment from 'moment';
import axios from 'axios';
import * as api from '../../rest/api'

export default function DashboardBookingInfo(props) {
    const isAuthorized = sessionStorage.getItem('isAuthorized');
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    const role = userInfo ? userInfo.role : null;
    if (isAuthorized === null) {
        props.history.goBack(1);
    }

    // // userSelector:redux값 획득
    // const value = useSelector( (state) => state );
    // // dispatch:값변경요청등 수행
    // const dispatch = useDispatch();
    // // 처리만하고 결과값은 리턴하지않음

    // function add() {
    //     dispatch({type: 'add'})
    // }
    // function check() {
    //     console.log(value);
    // }

    const [shop, setShop] = useState(props.shop);
    const [loading, setLoading] = useState(false);
    const [getMoment, setMoment] = useState(moment());
    const [bookingList, setBookingList] = useState([]);
    const [activeStaff, setActiveStaff] = useState(null);

    const userimgDefault =  'images/user/default.png';
    const tableimgDefault = 'images/menu/default.png';

    const categoryList = ['hairshop', 'restaurant', 'cafe'];
    const shopCategory = props.shop.shopSerial.substr(0, 2) === 'HS' ? categoryList[0] : 
                         props.shop.shopSerial.substr(0, 2) === 'RT' ? categoryList[1] :
                         props.shop.shopSerial.substr(0, 2) === 'CF' ? categoryList[2] : undefined;

    useEffect(() => {
        setLoading(true);
        return new Promise(function(resolve, reject) {
          axios
            .get(api.shopBookingList, {
              params: {
                'shopCd': props.shop.shopCd,
                'role': role
              }
            })
            .then(response => resolve(response.data))
            .catch(error => reject(error.response))
        })
        .then(data => {
          if (data.success) {
            setBookingList(data.dataList);
            setLoading(false);
          }     
        })
        .catch(err => {
          alert("현재 서버와의 연결이 원활하지 않습니다. 관리자에게 문의해주세요.");
          setLoading(false);
        })
    },[])
    
    function bookingInfo(targetId) {
        const target = bookingList.filter(booking => booking.bookingCd === targetId);
    }

    const timeArr = [];
    new Array(24).fill().forEach((acc, index) => {
        timeArr.push(moment( {hour: index} ).format('HH:mm'));
        // timeArr.push(moment({ hour: index, minute: 30 }).format('HH:mm'));
    })

    const startHour = Number(shop.shopOpen.substring(0,2));
    const endHour = Number(shop.shopClose.substring(0,2));

    for (let i = 0; i < startHour; i++) {
        timeArr.shift()
    }
    for (let i = 0; i <  23 - endHour; i++) {
        timeArr.pop()
    }

    const today = getMoment;

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
        setMoment(getMoment.clone().date(e.target.innerText));
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

                if (getMoment.format('YYYY-MM-DD') === days.format('YYYY-MM-DD')) {
                    // 오늘날짜
                    return(
                        <Table.Cell onClick={dayClick} className='mypage-table-active table-today' key={index}>
                            <span>{days.format('D')}</span>
                            {bookingList.filter(booking => booking.bookingTime.substr(0,10) === days.format('YYYY-MM-DD')).length !== 0 &&
                                <Button disabled className='mypage-booking-date' size='mini' icon='star'/>
                            }
                        </Table.Cell>
                    );
                } else if (days.format('MM') !== today.format('MM')) {
                    // 다른달 날짜
                    return(
                        <Table.Cell key={index} className='table-other-month'>
                            <span>{days.format('D')}</span>
                            {bookingList.filter(booking => booking.bookingTime.substr(0,10) === days.format('YYYY-MM-DD')).length !== 0 &&
                                <Button disabled className='mypage-booking-date-other' size='mini' icon='star'/>
                            }
                        </Table.Cell>
                    );
                } else {
                    // 이번달 오늘제외 날짜
                    return(
                        <Table.Cell onClick={dayClick} className='mypage-table-active' key={index}>
                            <span>{days.format('D')}</span>
                            {bookingList.filter(booking => booking.bookingTime.substr(0,10) === days.format('YYYY-MM-DD')).length !== 0 &&
                                <Button disabled className='mypage-booking-date' size='mini' icon='star'/>
                            }
                        </Table.Cell>
                    );
                }
                })
            }
          </Table.Row>
        );
      }
      return result;
    }

    function staffRender() {
        let result = [];
        
        const target = bookingList.filter(booking => booking.bookingTime.match(today.format("YYYY-MM-DD")));
        const cnt = target.length;
        let targetList = [];
        
        if (cnt > 0) {
            if (shopCategory === categoryList[0]) {
                // 헤어샵의경우 매니저별
                target.forEach(booking => targetList.push(booking.designer))
                const targetStaff = shop.staffList.filter(staff => targetList.indexOf(staff.userCd.toString()) !== -1)

                result = result.concat(
                    <Form.Field className='dashboard-booking-select'>
                        {targetStaff.map(staff =>
                        <Label as='a' className={staff.userCd === activeStaff && 'dashboard-booking-selected'} onClick={() => activeStaff !== staff.userCd ? setActiveStaff(staff.userCd) : setActiveStaff(null)}>
                            <Image avatar spaced='right' src={api.imgRender(staff.userImg === null ? userimgDefault : staff.userImg)}/>
                            {staff.userName}
                        </Label>
                        )}
                    </Form.Field>
                );
            } else {
                // 카페,레스토랑의 경우 테이블별
                result = result.concat(
                <Form.Field className='dashboard-booking-select'>
                    <Label as='a'>
                        <Image avatar spaced='right' src={api.imgRender(tableimgDefault)}/>
                        테이블1
                    </Label>
                </Form.Field>
                )
            }
        }
        return result;
    }

    function timeRender() {
        let result = [];

        const activeList = activeStaff !== null ? bookingList.filter(booking => booking.designer.match(activeStaff)) : bookingList;
        const target = activeList.filter(booking => booking.bookingTime.match(today.format("YYYY-MM-DD")));
        const cnt = target.length;

        if (cnt > 0) {
            result = result.concat(
                timeArr.map(time => (
                <Table.Row className='center'>
                    <Table.Cell className='mypage-tt-time'>
                        <span>{time}</span>
                    </Table.Cell>

                    {target.map(booking => 
                    booking.bookingTime.substr(11).split(":")[0] ===  time.split(":")[0] &&
                    <Table.Cell style={{fontWeight:'bold', textAlign:'left'}}>
                        {booking.bookingCategory === categoryList[0] &&
                        <span>
                            <Icon className='mypage-tt-icon' name='cut'/>
                            {booking.shopName}
                        </span>
                        }
                        {booking.bookingCategory === categoryList[1] &&
                        <span>
                            <Icon className='mypage-tt-icon' name='food'/>
                            {booking.shopName} ({booking.customers}명)
                        </span>
                        }
                        {booking.bookingCategory === categoryList[2] &&
                        <span>
                            <Icon className='mypage-tt-icon' name='coffee'/>
                            {booking.shopName} ({booking.customers}명)
                        </span>
                        }
                        <Icon name='angle double right' className='mypage-tt-info' onClick={() => bookingInfo(booking.bookingCd)}/>
                    </Table.Cell>
                    )}
                </Table.Row> 
                )
            ));
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
        <Form className='dashboard-viewer-inline'>
            <Form.Field>
                <label><Icon name='angle right'/>예약캘린더</label>
            </Form.Field>
        {/* <Button onClick={() => add('test')}>add</Button>
        <Button onClick={() => check()}>check</Button> */}
        <Table unstackable>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell colSpan='7' className='mypage-table-month'>
                        <h4>
                        <Icon name='chevron left' className='mypage-table-btn1' onClick={lastMonth}/>
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
        
        {staffRender()}

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
    </Form>
    </>
    );
}