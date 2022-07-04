import { useState } from 'react';
import { Link, withRouter } from "react-router-dom";
import { Link as Scroll } from "react-scroll";
import { Icon, Table, Segment, Button, Header } from 'semantic-ui-react'
import moment from 'moment';

function MyTimeTable(props) {
    let [tableStat, setTableStat] = useState(true);;
    
    // remainder: 다음 시간까지 남은시간
    // const remainder = 60 - (getMoment.minute() % 30);
    // const thisHour = parseInt(getMoment.format('HH'));
    
    const categoryList = ['hairshop', 'restaurant', 'cafe'];
    const bookingList = props.bookingList;
    
    function bookingInfo(targetId) {
        const target = bookingList.filter(booking => booking.bookingCd === targetId);
        props.history.push({
            pathname: '/mypage/schedule',
            state: { bookingCd: target[0].bookingCd}
        })
    }

    const timeArr = [];
    new Array(24).fill().forEach((acc, index) => {
        timeArr.push(moment( {hour: index} ).format('HH:mm'));
        // timeArr.push(moment({ hour: index, minute: 30 }).format('HH:mm'));
    })

    const startHour = 9;
    const endHour = 24;

    for (let i = 0; i < startHour; i++) {
        timeArr.shift();
    }
    for (let i = 0; i <  23 - endHour; i++) {
        timeArr.pop();
    }

    function emptySort() {
        setTableStat(!tableStat)
    }

    function timeRender() {
        let result = [];

        const target = bookingList.filter(booking => booking.bookingTime.match(props.today));
        const cnt = target.length;
        if (cnt !== 0) {
            result = result.concat(
                timeArr.map(time => (
                target.map(booking => booking.bookingTime.substr(11).split(":")[0] === time.split(":")[0] ?
                    <Table.Row className='center'>
                        <Table.Cell className='mypage-tt-time'>
                            <span>{time}</span>
                        </Table.Cell>
                        <Table.Cell className='mypage-tt-schedule'>
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
                    </Table.Row> 
                    :
                    <Table.Row className='center'>
                        <Table.Cell className={tableStat ? 'mypage-tt-time none' : 'mypage-tt-time'}>
                            <span>{time}</span>
                        </Table.Cell>
                        <Table.Cell className={tableStat ? 'mypage-tt-empty none' : 'mypage-tt-empty'}>
                        </Table.Cell> 
                    </Table.Row>
                )))
            );
        } else {
            result = result.concat(
            <Table.Cell colSpan='2' className='mypage-tt-time'>
                <Segment className='mypage-tt-nodata' placeholder>
                    <Header icon>
                    <Icon name='qq'/>
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
    <Table unstackable>
        <Table.Header>
            <Table.Row id='tt'>
                <Table.HeaderCell className='mypage-tt-header'>
                    시간대
                </Table.HeaderCell>
                <Table.HeaderCell className='mypage-tt-header-right'>
                    예약일정
                    <Icon name={tableStat ? 'sort amount down' : 'sort amount up'} onClick={emptySort}/>
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