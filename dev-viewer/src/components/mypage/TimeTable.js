import { useEffect, useState } from 'react';
import { Icon, Table } from 'semantic-ui-react'
import moment from 'moment';
import * as api from '../../rest/server';
import axios from 'axios';

export default function TimeTable(props) {
    const [getMoment, setMoment] = useState(moment());
    
    // remainder: 다음 시간까지 남은시간
    // const remainder = 60 - (getMoment.minute() % 30);
    // const thisHour = parseInt(getMoment.format('HH'));
    
    const user_cd = props.user_cd;
    const categoryList = ['hairshop', 'restaurant', 'cafe'];

    useEffect(() => {
        const params = { 
            'user_cd': user_cd
          };
          return new Promise(function(resolve, reject) {
            axios
              .post(api.bookingList, params)
              .then(response => resolve(response.data))
              .catch(error => reject(error.response))
          })
          .then(res => {
            if (res !== null) {
                setBookingList(res);
            }
          })
          .catch(err => {
            alert("현재 서버와의 연결이 원활하지 않습니다. 관리자에게 문의해주세요.");
          })
    }, []); 

    // const tmpEndList = [getMoment.clone().add("1", "h"), getMoment.clone().add("25", "h")];
    // const [bookingEndList, setBookingEndList] = useState(tmpEndList);
    
    const [bookingList, setBookingList] = useState([]);

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

        console.log(props.today)
        console.log(target)

        if (cnt !== 0) {
            for (let i = 0; i < cnt; i++) {
                result = result.concat(
                    timeArr.map(time => (
                    <Table.Row className='center'>
                        {target[i].booking_time.substr(9).split(":")[0] ===  time.split(":")[0] &&
                        <>
                        <Table.Cell className='mypage-tt-time tt-target'>
                            <span>{time}</span>
                        </Table.Cell>
                        <Table.Cell style={{fontWeight:'bold', textAlign:'left'}}>
                            {target[i].booking_category === categoryList[0] &&
                            <span>
                                <Icon name='cut'/>
                                {target[i].shop_name}
                            </span>
                            }
                            {target[i].booking_category === categoryList[1] &&
                            <span>
                                <Icon name='food'/>
                                {target[i].shop_name} ({target[i].customers}명)
                            </span>
                            }
                            {target[i].booking_category === categoryList[2] &&
                            <span>
                                <Icon name='coffee'/>
                                {target[i].shop_name} ({target[i].customers}명)
                            </span>
                            }
                            <Icon name='info circle' className='mypage-tt-info'/>
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
                예약정보 없음
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