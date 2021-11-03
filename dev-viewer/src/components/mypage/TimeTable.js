import { useState } from 'react';
import { Link } from "react-router-dom";
import { Icon, Table, Segment, Button, Header } from 'semantic-ui-react'
import moment from 'moment';

export default function TimeTable(props) {
    const [getMoment, setMoment] = useState(moment());
    
    // remainder: 다음 시간까지 남은시간
    // const remainder = 60 - (getMoment.minute() % 30);
    // const thisHour = parseInt(getMoment.format('HH'));
    
    const categoryList = ['hairshop', 'restaurant', 'cafe'];
    const bookingList = props.bookingList;
    
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