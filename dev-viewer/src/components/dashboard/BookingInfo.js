import { useState } from 'react';
import { Label, Icon, Table, Button, Grid } from 'semantic-ui-react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';

export default function BookingInfo(props) {

    // userSelector:redux값 획득
    const getUserInfo = useSelector( (state) => state );
    // dispatch:값변경요청등 수행
    const dispatch = useDispatch();

    console.log(getUserInfo);
    // 처리만하고 결과값은 리턴하지않음
    console.log(dispatch({type: 'function1'}));

    const [getMoment, setMoment] = useState(moment());

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

    return(
        <>
        <Label className='dashboard-viewer-title' attached='top'>
            <Icon name='chart bar outline'/>예약정보
        </Label>
        <Table unstackable className='booking-table'>
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
    </>
    );
}