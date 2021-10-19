import {useState} from 'react';
import { Icon, Table, Menu, Label } from 'semantic-ui-react'
import moment from 'moment';
import TimeTable from './TimeTable';

export default function Calendar(props) {

    const [getMoment, setMoment] = useState(moment());
    const [calendarActive, setCalendarActive] = useState(false);

    const today = getMoment;
    const user_cd = props.user_cd;

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

    function calendarToogle() {
        setCalendarActive(!calendarActive);
    }

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
                    return(
                        <Table.Cell onClick={dayClick} className='mypage-table-active table-today' key={index}>
                            <span>{days.format('D')}</span>
                        </Table.Cell>
                    );
                } else if (days.format('MM') !== today.format('MM')) {
                    return(
                        <Table.Cell key={index} className='table-other-month'>
                            <span>{days.format('D')}</span>
                        </Table.Cell>
                    );
                } else {
                    return(
                        <Table.Cell onClick={dayClick} className='mypage-table-active' key={index}>
                            <span>{days.format('D')} <Label circular color='teal' size='tiny' empty/></span>
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
    <div>
    <Table className='mypage-history'>
        <Menu floated='left' compact>
            <Menu.Item>{today.format('MM월 DD일')}</Menu.Item>
            <Menu.Item link icon onClick={calendarToogle}>
                {calendarActive?
                <Icon name='triangle down'/>
                :
                <Icon name='triangle right'/>
                }
            </Menu.Item>
        </Menu>
        <Menu floated='right' onClick={()=>{ console.log("history") }}>
            <Menu.Item as='a' icon>
                <Icon name='history'/>
            </Menu.Item>
        </Menu>
    </Table>
    </div>
    {calendarActive &&
    <>
    <Table unstackable>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell colSpan='7' className='mypage-table-month'>
                    <h4>
                    <Icon name='chevron left' className='mypage-table-btn1' onClick={()=>{ setMoment(getMoment.clone().subtract(1, 'month')) }}/>
                    {today.format('YYYY / MM')}
                    <Icon name='chevron right' className='mypage-table-btn2' onClick={()=>{ setMoment(getMoment.clone().add(1, 'month')) }}/>
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
    }
    <TimeTable today={today.format('YYYYMMDD')} user_cd={user_cd}/>
    </>
  );
}