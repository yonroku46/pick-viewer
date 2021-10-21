import {useState} from 'react';
import { Button, Grid, Icon } from 'semantic-ui-react'
import { Link as Scroll } from "react-scroll";
import moment from 'moment';

export default function TimeTable(props) {
    const [getMoment, setMoment] = useState(moment());
    const [menuName, setMenuName] = useState("예약시간을 선택하세요");
    // const [dbTime, setDbTime] = useState(null);
    const [isSelected, setIsSelected] = useState(false);
    const today = moment().format('YYYY-MM-DD');
    const dbDate = props.dbDate !== null ? props.dbDate : today;
    
    function menuNameChange(e) {
        const time = e.target.value;
        const render = parseInt(e.target.value.split(':')[0]) <= 12 ? '오전 ' + time : '오후 ' + time;
        setMenuName(render);
        setIsSelected(true);
        props.setDbTime(time);
        setShowBookingTime(false);
    }

    const [showBookingTime, setShowBookingTime] = useState(false);
    function bookingTimeToggle() {
        setShowBookingTime(!showBookingTime);
    }

    const timeArr = [];
    new Array(24).fill().forEach((acc, index) => {
        timeArr.push(moment( {hour: index} ).format('HH:mm'));
        // timeArr.push(moment({ hour: index, minute: 30 }).format('HH:mm'));
    })

    const thisHour = parseInt(getMoment.format('HH'));
    const startHour = props.shop.shop_open ? parseInt(props.shop.shop_open.substring(0,2)) : 9;
    const endHour = props.shop.shop_close ? parseInt(props.shop.shop_close.substring(0,2)) : 24;

    for (let i = 0; i < startHour; i++) {
        timeArr.shift();
    }
    for (let i = 0; i <  23 - endHour; i++) {
        timeArr.pop();
    }

    function timeRender() {
        let result = [];
        result = result.concat(
        <Grid.Column>
            <Scroll to='timeTable' offset={-56} spy={true} smooth={true}>
            <Button id='timeTable' className={isSelected ? 'detailpage-menu-btn-bg' :'detailpage-menu-btn-sub'} onClick={bookingTimeToggle}>
                <Icon name={isSelected ? 'chevron right' : 'chevron down'}/>
                {menuName}
            </Button>
            </Scroll>
            <div className='timetable-btn-area'>
            {showBookingTime && <p><Icon name='sun outline'/>오전</p>}
            {showBookingTime 
                && timeArr.map(time => (
                    (parseInt(time.substring(0,2)) <= 12)
                    ?
                    (today === dbDate && (parseInt(time.substring(0,2)) <= thisHour))
                    ? <Button disabled className='timetable-btn'>{time}</Button>
                    : <Button className='timetable-btn' value={time} onClick={menuNameChange}>{time}</Button>
                    :
                    <></>
                ))
            }
            </div>
            <div className='timetable-btn-area'>
            {showBookingTime && <p><Icon name='moon outline'/>오후</p>}
            {showBookingTime 
                && timeArr.map(time => (
                    (parseInt(time.substring(0,2)) <= 12)
                    ?
                    <></>
                    :
                    (today === dbDate && (parseInt(time.substring(0,2)) <= thisHour))
                    ? <Button disabled className='timetable-btn'>{time}</Button>
                    : <Button className='timetable-btn' value={time} onClick={menuNameChange}>{time}</Button>
                ))
            }
            </div>
        </Grid.Column>
        );
        // console.log('today',today, 'dbDate',dbDate)
        // console.log('today===dbDate',today === dbDate, '0===thisHour',0 <= thisHour)
        // console.log((today === dbDate && 0 <= thisHour))
        return result; 
    } 

    return (
        <>
        {timeRender()}
        </>
    );
}