import {useState} from 'react';
import { Icon, Table, Menu, Button } from 'semantic-ui-react'
import moment from 'moment';
import TimeTable from './MyTimeTable';

export default function MyCalendar(props) {

    const [getMoment, setMoment] = useState(moment());

    const today = getMoment;
    const bookingList = props.bookingList;

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

  return (
    <>
    <div className='mypage-calendar-menu'>
        <Icon name='clock outline'/>
        <span className='text'>{today.format('MM월 DD일')}</span>
    </div>

    <Table unstackable>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell colSpan='7' className='mypage-table-month'>
                    <h4>
                    <Icon name='chevron left' className='mypage-table-btn1' onClick={()=>{ setMoment(getMoment.clone().subtract(1, 'month')) }}/>
                    {today.format('YYYY / MM')}
                    <Icon name='chevron right' className='mypage-table-btn2' onClick={()=>{ setMoment(getMoment.clone().add(1, 'month')) }}/>
                    <Icon name='redo' className='mypage-table-reset' onClick={() => setMoment(moment())}/>
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

    <TimeTable today={today.format('YYYY-MM-DD')} bookingList={bookingList}/>
    </>
  );
}