import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Icon, Table, Button, Header, Segment, Label, Image } from 'semantic-ui-react';
import moment from 'moment';
import axios from 'axios';
import * as api from '../../rest/api'

export default function DashboardBookingInfo(props) {

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

    const userimgDefault =  'images/user/default.png';

    const categoryList = ['hairshop', 'restaurant', 'cafe'];
    const shopCategory = props.shop.shop_serial.substr(0, 2) === 'HS' ? categoryList[0] : 
                         props.shop.shop_serial.substr(0, 2) === 'RT' ? categoryList[1] :
                         props.shop.shop_serial.substr(0, 2) === 'CF' ? categoryList[2] : undefined;

    useEffect(() => {
        setLoading(true);
        return new Promise(function(resolve, reject) {
          axios
            .get(api.shopBookingList, {
              params: {
                'shop_cd': props.shop.shop_cd
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

    const startHour = 0;
    const endHour = 24;

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

                if (getMoment.format('YYYYMMDD') === days.format('YYYYMMDD')) {
                    // 오늘날짜
                    return(
                        <Table.Cell onClick={dayClick} className='mypage-table-active table-today' key={index}>
                            <span>{days.format('D')}</span>
                            {bookingList.filter(booking => booking.booking_time.substr(0,8) === days.format('YYYYMMDD')).length !== 0 &&
                                <Button disabled className='mypage-booking-date' size='mini' icon='star'/>
                            }
                        </Table.Cell>
                    );
                } else if (days.format('MM') !== today.format('MM')) {
                    // 다른달 날짜
                    return(
                        <Table.Cell key={index} className='table-other-month'>
                            <span>{days.format('D')}</span>
                            {bookingList.filter(booking => booking.booking_time.substr(0,8) === days.format('YYYYMMDD')).length !== 0 &&
                                <Button disabled className='mypage-booking-date-other' size='mini' icon='star'/>
                            }
                        </Table.Cell>
                    );
                } else {
                    // 이번달 오늘제외 날짜
                    return(
                        <Table.Cell onClick={dayClick} className='mypage-table-active' key={index}>
                            <span>{days.format('D')}</span>
                            {bookingList.filter(booking => booking.booking_time.substr(0,8) === days.format('YYYYMMDD')).length !== 0 &&
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
        
        const target = bookingList.filter(booking => booking.booking_time.match(today.format("YYYYMMDD")));
        const cnt = target.length;
        let targetList = [];
        
        if (cnt > 0) {
            if (shopCategory === categoryList[0]) {
                // 헤어샵의경우 매니저별
                target.forEach(booking => targetList.push(booking.designer))
                const targetStaff = shop.staff_list.filter(staff => targetList.indexOf(staff.user_cd.toString()) !== -1)

                result = result.concat(
                    <Form.Field className='dashboard-bokking-select'>
                        {targetStaff.map(staff =>
                        <Label as='a'>
                            <Image avatar spaced='right' src={api.imgRender(staff.user_img === null ? userimgDefault : staff.user_img)}/>
                            {staff.user_name}
                        </Label>
                        )}
                    </Form.Field>
                );
            } else {
                // 카페,레스토랑의 경우 테이블별
                result = result.concat(
                <Form.Field className='dashboard-bokking-select'>
                    <Label as='a'>
                        <Icon name='calendar outline'/>
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

        const target = bookingList.filter(booking => booking.booking_time.match(today.format("YYYYMMDD")));
        const cnt = target.length;

        if (cnt > 0) {
            for (let i = 0; i < cnt; i++) {
                result = result.concat(
                    timeArr.map(time => (
                    <Table.Row className='center'>
                        {target[i].booking_time.substr(9).split(":")[0] ===  time.split(":")[0] ?
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
                        :
                        <Table.Cell className='mypage-tt-time'>
                            <span>{time}</span>
                        </Table.Cell>
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