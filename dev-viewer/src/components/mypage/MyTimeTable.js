import { useState } from 'react';
import { Link, withRouter } from "react-router-dom";
import { Link as Scroll } from "react-scroll";
import { Icon, Table, Segment, Button, Header } from 'semantic-ui-react'
import moment from 'moment';

function MyTimeTable(props) {
    
    let [tableStat, setTableStat] = useState(true);
    let [spanList, setSpanList] = useState([]);
    
    // remainder: 다음 시간까지 남은시간
    // const remainder = 60 - (getMoment.minute() % 30);
    // const thisHour = parseInt(getMoment.format('HH'));
    
    const categoryList = ['hairshop', 'restaurant', 'cafe'];
    const bookingList = props.bookingList;
    
    function bookingInfo(targetId) {
        const target = bookingList.filter(booking => booking.bookingCd === targetId);
        props.history.push({
            pathname: '/mypage/schedule',
            state: { bookingCd: target[0].bookingCd }
        })
    }

    const timeArr = [];
    new Array(24).fill().forEach((acc, index) => {
        timeArr.push(moment( {hour: index} ).format('HH:mm'));
        timeArr.push(moment({ hour: index, minute: 30 }).format('HH:mm'));
    })

    const startHour = 9;
    const endHour = 24;

    for (let i = 0; i < startHour * 2; i++) {
        timeArr.shift();
    }
    for (let i = 0; i <  23 - endHour * 2; i++) {
        timeArr.pop();
    }

    function emptySort() {
        setTableStat(!tableStat)
    }

    function includeTime(target, time) {
        const result = target.filter(t => t.bookingTime.substr(11,5).match(time)).length !== 0;
        return result;
    }

    function calcTimeSpan(start, end) {
        if (start === end) {
            return 1;
        } else {
            const endTime = moment(end);
            const startTime = moment(start);
            const result = endTime.diff(startTime, 'minutes') / 30;
            if (result > 1) {
                const spanTarget = moment(end).subtract(30, 'minute').format('hh:mm');
                if (spanList.indexOf(spanTarget) == -1) {
                    spanList.push(spanTarget);
                    setSpanList(spanList);
                }
            }
            return result;   
        }
    }

    function reservationTime(time, endTime) {
        const result = time == endTime ? time + ' ~ ' : time + ' ~ ' + endTime;
        return result;   
    }

    function timeRender() {
        let result = [];
        const targetList = bookingList.filter(booking => booking.bookingTime.match(props.today));
        if (targetList.length !== 0) {
            result = result.concat(
                timeArr.map(time => (
                    includeTime(targetList, time) ?
                        // 해당 시간대에 예약 있음
                        targetList.filter(target => target.bookingTime.substr(11,5).match(time)).map(booking => 
                        <Table.Row className='center'>
                            <Table.Cell className='mypage-tt-time'>
                                <span>{tableStat ? reservationTime(time, booking.bookingEndTime.substr(11,5)) : time}</span>
                            </Table.Cell>
                            <Table.Cell verticalAlign='top' className='mypage-tt-schedule todays' rowspan={calcTimeSpan(booking.bookingTime, booking.bookingEndTime)}>
                                {booking.bookingCategory === categoryList[0] &&
                                <span>
                                    <Icon className='mypage-tt-icon' name='cut'/> {booking.shopName}
                                </span>
                                }
                                {booking.bookingCategory === categoryList[1] &&
                                <span>
                                    <Icon className='mypage-tt-icon' name='food'/>{booking.shopName} ({booking.customers}명)
                                </span>
                                }
                                {booking.bookingCategory === categoryList[2] &&
                                <span>
                                    <Icon className='mypage-tt-icon' name='coffee'/>{booking.shopName} ({booking.customers}명)
                                </span>
                                }
                                <Icon name='angle double right' className='mypage-tt-info' onClick={() => bookingInfo(booking.bookingCd)}/>
                            </Table.Cell>
                        </Table.Row>
                        )
                    :
                        // 해당 시간대에 예약 없음
                        <Table.Row className='center'>
                            <Table.Cell className={tableStat ? 'none' : 'mypage-tt-time'}>
                                <span>{time}</span>
                            </Table.Cell>
                            {tableStat ?
                                <Table.Cell className={'none'}/>
                            :
                                <Table.Cell className={spanList.includes(time) && 'none'}/>
                            }
                        </Table.Row>
                ))
            );
        } else {
            result = result.concat(
                <Table.Cell colSpan='2' className='mypage-tt-time'>
                    <Segment className='mypage-nodata' placeholder>
                        <Header icon>
                        <Icon name='file text outline'/>
                        등록된 예약이 없습니다.
                        </Header>
                        <Link to='/booking/hairshop'>
                            <Button secondary>둘러보기<Icon name='angle double right'/></Button>
                        </Link>
                    </Segment>
                </Table.Cell>
            );
        }

        return result;
    }

  return (
    <>
    <Scroll to='tt' offset={-56} spy={true} smooth={true}>
    <Table unstackable striped>
        <Table.Header>
            <Table.Row id='tt'>
                <Table.HeaderCell className='mypage-tt-header'>
                    {tableStat ? '예약시간' : '시간대'}
                </Table.HeaderCell>
                <Table.HeaderCell className='mypage-tt-header-right'>
                    예약일정
                    <Icon name={tableStat ? 'search plus' : 'search minus'} onClick={emptySort}/>
                </Table.HeaderCell>
            </Table.Row>
        </Table.Header>

        <Table.Body>
            {timeRender()}
        </Table.Body>
    </Table>
    </Scroll>
    </>
  );
}

export default withRouter(MyTimeTable);