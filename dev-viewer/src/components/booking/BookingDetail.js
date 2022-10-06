import { useEffect, useState, useReducer } from "react";
import { useParams, Link } from "react-router-dom";
import person1 from '../../img/person1.png'
import person2 from '../../img/person2.png'
import person3 from '../../img/person3.png'
import person5 from '../../img/person5.png'
import { Dimmer, Button, Item, Grid, Segment, Image, Icon, Loader, Modal, Header, Table, Statistic, Card, Label } from 'semantic-ui-react'
import { Link as Scroll } from "react-scroll";
import moment from "moment";
import MapContainer from "../public/MapContainer";
import Slider from "react-slick";
import * as api from '../../rest/api'
import axios from 'axios';

export default function BookingDetail(props) {
  const isAuthorized = sessionStorage.getItem("isAuthorized");

  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  const favorites = JSON.parse(sessionStorage.getItem('favorites'));
  const userCd = userInfo ? userInfo.userCd : null;
  const role = userInfo ? userInfo.role : null;
  const [couponList, setCouponList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [useCouponList, setUseCouponList] = useState([]);

  // 공통 default
  const shopDefault = 'images/shop/default.png';
  const staffDefault = 'images/user/default.png';
  const menuDefault = 'images/menu/default.png';

  const [getMoment, setMoment] = useState(moment());
  const [calendarActive, setCalendarActive] = useState(false);
  const [timeActive, setTimeActive] = useState(false);

  const weekArr = ["일", "월", "화", "수", "목", "금", "토"];
  const today = getMoment;
  const firstWeek = today.clone().startOf('month').week();
  const lastWeek = today.clone().endOf('month').week() === 1 ? 53 : today.clone().endOf('month').week();
  const originYear = parseInt(moment().format('YYYY'));
  const originMonth = parseInt(moment().format('MM'));
  const originDay = parseInt(moment().format('DD'));
  const originToday = moment().format('YYYY-MM-DD');

  const timeArr = [];
  new Array(24).fill().forEach((acc, index) => {
      timeArr.push(moment( {hour: index} ).format('HH:mm'));
      // timeArr.push(moment({ hour: index, minute: 30 }).format('HH:mm'));
  })
  const thisHour = parseInt(getMoment.format('HH'));
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(24);

  const customersList = [
    {'customersCd':1, 'customers':'1명'},
    {'customersCd':2, 'customers':'2명'},
    {'customersCd':3, 'customers':'3 ~ 4명'},
    {'customersCd':5, 'customers':'5명이상'}
  ]
  
  const [shop, setShop] = useState([]);
  const [shopImages, setShopImages] = useState([]);
  const {shopCd} = useParams();
  const category = (props.location.pathname).split('/')[2];

  const [isFavorite, setIsFavorite] = useState(false);
  const [clickFavorite, setClickFavorite] = useState(false);

  const [modalOpen, setModalOpen] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [modalFinal, setModalFinal] = useState(false)

  const [mapOpen, setMapOpen] = useState(false)
  
  const [finalCheck, setFinalCheck] = useState(false)

  useEffect(() => {
    userInfo && setCouponList(userInfo.coupon);
    if (favorites) {
      favoriteJudge();
    }
    return new Promise(function(resolve, reject) {
      axios
        .get(api.shopInfo, {
          params: {
            'shopCd': shopCd
          }
        })
        .then(response => resolve(response.data))
        .catch(error => reject(error.response))
    })
    .then(res => {
      if (res.success) {
        setShop(res.data);
        makeImageList(res.data.shopImg);
        setStartHour(Number(res.data.shopOpen.substring(0,2)));
        setEndHour(Number(res.data.shopClose.substring(0,2)));
      }
    })
    .catch(err => {
      alert("현재 서버와의 연결이 원활하지 않습니다. 관리자에게 문의해주세요.");
    })
  }, [])

  function makeImageList(shopImg) {
    const imgList = shopImg.split(',');
    const result = [];
    for (let index = 0; index < 4; index++) {
      result.push(imgList[index] ? imgList[index] : shopDefault);
    }
    setShopImages(result);
  }

  const [showCoupon, setShowCoupon] = useState(false);

  const [designerError, setDesignerError] = useState(false);
  const [showDesigner, setShowDesigner] = useState(false);
  const [designerSelected, setDesignerSelected] = useState(false);

  const [customersError, setCustomersError] = useState(false);
  const [showCustomers, setShowCustomers] = useState(false);
  const [customersSelected, setCustomersSelected] = useState(false);
  const [shopMenuError, setShopMenuError] = useState(false);
  const [showShopMenu, setShowShopMenu] = useState(false);
  const [shopMenuSelected, setShopMenuSelected] = useState(false);

  const [calendarSelected, setCalendarSelected] = useState(false);

  const [timetableSelected, setTimetableSelected] = useState(false);

  // for Viewer
  const [designer, setDesigner] = useState(null); 
  const [customers, setCustomers] = useState(null); 
  const [shopMenu, setShopMenu] = useState(null); 
  const [resultPrice, setResultPrice] = useState(null);
  const [discount, setDiscount] = useState(100);
  
  // for DB
  const [dbDesigner, setDbDesigner] = useState(null);
  const [dbCustomers, setDbCustomers] = useState(null);
  const [dbDate, setDbDate] = useState(null);
  const [dbTime, setDbTime] = useState(null);

  // for Title
  const designerTitle = '찾으시는 디자이너가 있으신가요?';
  const hairShopMenuTitle = '어떤 스타일을 원하시나요?';
  const shopCustomersTitle = '방문하실 인원수를 알려 주시겠어요?';
  const shopMenuTitle = '어떤 메뉴를 원하시나요?';

  function getEndTime(bookingTime) {
    const result = moment.utc(bookingTime);
    let tmpTime = null;
    orderList.map(order => {
      if (tmpTime === null) {
        tmpTime = order.menuTime;
      } else {
        if (order.menuTime !== null) {
          if (tmpTime.replace(":", "") < order.menuTime.replace(":", "")) {
            tmpTime = order.menuTime;
          }
        }
      }
    })
    if (tmpTime) {
      const hour = tmpTime.split(":")[0];
      const minutes = tmpTime.split(":")[1];
      result.add(hour,'hour');
      result.add(minutes,'minutes');
    }
    return result;
  }

  function sendBooking() {
    setModalLoading(true);
    const bookingTime = dbDate + " " + dbTime + ":00";
    const bookingEndTime =  getEndTime(bookingTime);
    const checkingTimeContury = moment.utc(bookingTime).local().format('YYYY-MM-DD HH:mm:ss');
    const checkingEndTimeContury = moment.utc(bookingEndTime).local().format('YYYY-MM-DD HH:mm:ss');
    const bookingTimeContury = moment.utc(bookingTime);
    const bookingEndTimeContury = moment.utc(bookingEndTime);
    const bookingDetail = {};
    new Promise(function(resolve, reject) {
      axios
        .get(api.bookingCheck, {
          params: {
            'userCd': userCd,
            'bookingTime': checkingTimeContury,
            'bookingEndTime': checkingEndTimeContury
          }
        })
        .then(response => resolve(response.data))
        .catch(error => reject(error.response))
    })
    .then(res => {
      const result = res.data.result;
      if (!result) {
        alert("해당 시간에 고객님의 다른 일정이 확인되었습니다.\n일정 확인 후 시도해주세요.");
        setModalLoading(false);
        return;
      } else {
        setModalOpen(true);
        if (category === 'hairshop') {
          bookingDetail.designer = dbDesigner;
          bookingDetail.style = orderList[0].menuCd;
          bookingDetail.discount = discount;
        } else {
          bookingDetail.customers = dbCustomers;
          bookingDetail.orders = orderList;
          bookingDetail.discount = discount;
        }
        const params = { 
          'userCd': userCd,
          'shopCd': shopCd,
          'bookingTime': bookingTimeContury,
          'bookingEndTime': bookingEndTimeContury,
          'bookingPrice': resultPrice,
          'category': category,
          'bookingDetail': bookingDetail
        };
        return new Promise(function(resolve, reject) {
          axios
            .post(api.booking, params)
            .then(response => resolve(response.data))
            .catch(error => reject(error.response))
        })
        .then(res => {
          const result = res.data.result;
          if (res.success) {
            if (result) {
              dispatch({ type: 'CLOSE_MODAL' })
              setModalLoading(false);
              setModalFinal(true)
            } else {
              alert("예약에 실패하였습니다. 잠시 후 시도해주세요.")
              setModalLoading(false);
            }
          }
        })
      }
    })
    .catch(err => {
      alert("예약에 실패하였습니다. 잠시 후 시도해주세요.");
      setModalLoading(false);
    })
  }
    
  function DesignerBtnClick(targetId) {
    const target = shop.staffList.find(staff => staff.userCd === targetId);
    setDesigner(target.userName);
    setDbDesigner(target.userCd);
    setDesignerSelected(true);
    setShowDesigner(false);
  }

  function hairShopMenuBtnClick(targetId) {
    const target = shop.menuList.find(menu => menu.menuCd === targetId);
    const price = target.menuPrice;
    const orderTarget =  orderList.find(order => order.menuCd === targetId);
    if (orderTarget === undefined) {
      setResultPrice(resultPrice + price);
      orderList.push(target);
      orderList[orderList.indexOf(target)].num = 1;
      setOrderList(orderList);
    } else {
      setResultPrice(resultPrice - price);
      orderList[orderList.indexOf(target)].num = 0;
      orderList.splice(orderList.indexOf(orderTarget), 1);
      setOrderList(orderList);
    }
    if (orderList.length === 0) {
      setShopMenuSelected(false);
      setShopMenu(null);
    } else {
      setShopMenuSelected(true);
      setShopMenu('선택 메뉴 수 : ' + orderList.length + '개');
    }
  }

  function CustomersBtnClick(targetId) {
    const target = customersList.find(customers => customers.customersCd === targetId);
    setCustomers(target.customers);
    setDbCustomers(target.customersCd);
    setCustomersSelected(true);
    setShowCustomers(false);
  }

  function shopMenuBtnClick(targetId) {
    const target = shop.menuList.find(menu => menu.menuCd === targetId);
    const price = target.menuPrice;
    setResultPrice(resultPrice + price);
    if (orderList.indexOf(target) === -1) {
      orderList.push(target);
      orderList[orderList.indexOf(target)].num = 1;
    } else {
      orderList[orderList.indexOf(target)].num += 1;
    }
    setOrderList(orderList);
    setShopMenu('선택 메뉴 수 : ' + orderList.length + '개');
    setShopMenuSelected(true);
  }

  function shopMenuBtnMinusClick(targetId) {
    const target = shop.menuList.find(menu => menu.menuCd === targetId);
    const price = target.menuPrice;
    setResultPrice(resultPrice - price);
    if (orderList.indexOf(target) !== -1) {
      orderList[orderList.indexOf(target)].num -= 1;
      if (orderList[orderList.indexOf(target)].num === 0) {
        orderList.splice(orderList.indexOf(target), 1);
      }
    }
    setOrderList(orderList);
    orderList.length === 0 ? setShopMenu(null) : setShopMenu('선택 메뉴 수 : ' + orderList.length + '개');
    orderList.length === 0 && setShopMenuSelected(false);
  }

  function CouponClick(targetId) {
    const coupon = couponList.find(coupon => coupon.couponCd === targetId);
    couponList[couponList.indexOf(coupon)].use = !couponList[couponList.indexOf(coupon)].use;
    setCouponList(couponList);
    
    if (coupon.use) {
      useCouponList.push(coupon.couponCd);
      setResultPrice(resultPrice - coupon.couponDiscount);
    } else {
      useCouponList.splice(useCouponList.indexOf(coupon.couponCd), 1);
      setResultPrice(resultPrice + coupon.couponDiscount);
    }
    setUseCouponList(useCouponList);
  }

  function designerToggle() {
    {shop.staffList === null || shop.staffList.length === 0
    ? setDesignerError(!designerError)
    : setShowDesigner(!showDesigner)
    }
  }

  function customersToggle() {
    {customersList === null
    ? setCustomersError(!customersError)
    : setShowCustomers(!showCustomers)
    }
  }

  function shopMenuToggle() {
    {shop.menuList === null || shop.menuList.length === 0
    ? setShopMenuError(!shopMenuError)
    : setShowShopMenu(!showShopMenu)
    }
  }

  function reducer(state, action) {
    switch (action.type) {
      case 'OPEN_MODAL':
        return { open: true, dimmer: action.dimmer }
      case 'CLOSE_MODAL':
        return { open: false }
      default:
        throw new Error()
    }
  }

  function bookingOpen() {
    setFinalCheck(false);
    allClose();
    dispatch({ type: 'OPEN_MODAL' });
  }
  function allClose() {
    setShowCustomers(false);
    setShowDesigner(false);
    setShowShopMenu(false);
    setCalendarActive(false);
    setTimeActive(false);
  }

  function bookingCheck() {
    if (category === 'hairshop') {
      return (dbDesigner === null || dbDate === null || dbTime === null || orderList.length === 0) ? true : false;
    } else if (category === 'restaurant') {
      return (dbCustomers === null || dbDate === null || dbTime === null || orderList.length === 0) ? true : false;
    } else if (category === 'cafe') {
      return (dbCustomers === null || dbDate === null || dbTime === null || orderList.length === 0) ? true : false;
    }
  }

  function favorite() {
    if (clickFavorite === true) {
      return;
    }
    if (userCd === null) {
      alert('로그인이 필요합니다');
      return;
    }
    setClickFavorite(true);
    const params = {
      'userCd': userCd,
      'shopCd': shopCd,
      'isFavorite': isFavorite
    }
    return new Promise(function(resolve, reject) {
      axios
        .post(api.favorite, params)
        .then(response => resolve(response.data))
        .catch(error => reject(error.response))
    })
    .then(res => {
      if (res.success) {
        const result = res.data.result;
        setIsFavorite(result);
        if (result) {
          shop.favoriteNum = shop.favoriteNum + 1;
        } else {
          shop.favoriteNum = shop.favoriteNum - 1;
        }
        setShop(shop)
        myFavorites(userCd);
      } else {
        alert('잠시 후 다시 시도하여 주세요.')
        setClickFavorite(false);
      }
    })
    .catch(err => {
      alert('잠시 후 다시 시도하여 주세요.')
      setClickFavorite(false);
    })
  }

  function myFavorites(userCd) {
    return new Promise(function(resolve, reject) {
      axios
        .get(api.myFavorites, {
          params: {
            'userCd': userCd
          }
        })
        .then(response => resolve(response.data))
        .catch(error => reject(error.response))
    })
    .then(data => {
      sessionStorage.setItem('favorites', JSON.stringify(data.dataList));
      setClickFavorite(false);
    })
    .catch(err => {
    })
  }

  function mapToogle() {
    setMapOpen(!mapOpen);
  }

  function favoriteJudge() {
    favorites.map(favorite => {
      if (shopCd === String(favorite.shopCd)) {
        setIsFavorite(true);
        return;
      }
    })
  }

  function comma(number) {
    let num = number + ""; 
    let point = num.length % 3 ;
    let len = num.length; 
   
    let result = num.substring(0, point); 
    while (point < len) { 
        if (result !== "") result += ","; 
        result += num.substring(point, point + 3); 
        point += 3; 
    } 
    return result;
  }

  const weeks = [
    { key: 'none', value: 'none', text: '휴무없음' },
    { key: 'mon', value: 'mon', text: '월요일' },
    { key: 'tue', value: 'tue', text: '화요일' },
    { key: 'wed', value: 'wed', text: '수요일' },
    { key: 'thu', value: 'thu', text: '목요일' },
    { key: 'fri', value: 'fri', text: '금요일' },
    { key: 'sat', value: 'sat', text: '토요일' },
    { key: 'sun', value: 'sun', text: '일요일' },
  ];
  const weekDaySorter = { 'mon':1 , 'tue':2 , 'wed':3 , 'thu':4 , 'fri':5 , 'sat':6 ,'sun':7 };

  function convertWeek(dayList) {
    let result = '';
    if (Array.isArray(dayList)) {
      dayList.sort(function sortByWeekDay(a, b) {
          return weekDaySorter[a] - weekDaySorter[b];
      });
      dayList.forEach(day => {
          const dayText = weeks.filter(w => w.key.match(day))[0].text.substring(0, 1) + ',';
          result = result + dayText;
      })
      return result.slice(0, result.length - 1);
    }
  }

  function dateConvert(date) {
    return moment(date).format("YYYY년 MM월 DD일");
  }

  function convertMenuTime(time) {
    let result = '';
    const hour = time.split(":")[0];
    const minutes = time.split(":")[1];
    if (parseInt(hour) !== 0) {
      result = hour + '시간';
    }
    if (parseInt(minutes) !== 0) {
      result += ' ' + minutes + '분';
    }
    return result;
  }
    
  const [state, dispatch] = useReducer(reducer, {
    open: false,
    dimmer: undefined,
  })
  const { open, dimmer } = state;
  
  const errorMessege = 
  <div className='detailpage-msg'>
    <h4>표시할 정보가 없습니다</h4>
  </div>

  const visibleDesigner = showDesigner && (shop.staffList.map(staff =>
    <>
    <Item.Group unstackable className={dbDesigner === staff.userCd ? 'detailpage-service-menu detailpage-selected' : 'detailpage-service-menu'} key={staff.userCd} onClick={() => DesignerBtnClick(staff.userCd)}>
      <Item className='detailpage-service'>
        <Item.Image className='detailpage-service-img' src={api.imgRender(staff.userImg === null ? staffDefault : staff.userImg)}/>
        <Item.Content
         header={staff.career ? staff.userName + ' (' + staff.career +') ' : staff.userName} 
         meta={staff.info}/>
      </Item>
    </Item.Group>
    {dbDesigner === staff.userCd &&
      <Item className='detailpage-service-num'>
        <Icon className='detailpage-service-minus pcolor-accent' name='check circle'/>
      </Item>
    }
    </>
    ));

  const visibleHairShopMenu = showShopMenu && (shop.menuCategories.map(category => 
    <>
    <Header as='h3' className='detailpage-service-header'>
      <Header.Content>{category}</Header.Content>
      <div className='middle-line'></div>
    </Header>
    {
    shop.menuList.filter(list => list.menuCategory.match(category)).map(menu => 
      <>
      <Item.Group unstackable className={0 < menu.num ? 'detailpage-service-menu detailpage-selected' : 'detailpage-service-menu'} key={menu.menuCd}>
        <Item className='detailpage-service' onClick={() => hairShopMenuBtnClick(menu.menuCd)}>
          <Item.Image className='detailpage-service-img' src={api.imgRender(menu.menuImg === null ? menuDefault : menu.menuImg)}/>
          <Item.Content 
            header={menu.menuName} 
            meta={comma(menu.menuPrice) + '원'} 
            description={menu.menuDescription === null ? '' : menu.menuDescription}
            extra={menu.menuTime && <Label basic className='menu-time' icon='time' content={convertMenuTime(menu.menuTime)}/>}/>
        </Item>
      </Item.Group>
      {0 < menu.num &&
        <Item className='detailpage-service-num'>
          <Icon className='detailpage-service-minus pcolor-accent' name='check circle'/>
        </Item>
      }
      </>
      )
    }
    </>
  ));

  const visibleCustomers = showCustomers &&
    <Item.Group unstackable className='detailpage-service-customers'>
      {customersList.map(customers =>
        <Button onClick={() => CustomersBtnClick(customers.customersCd)}>
          {customers.customersCd === 1 && <img src={person1}/>}
          {customers.customersCd === 2 && <img src={person2}/>}
          {customers.customersCd === 3 && <img src={person3}/>}
          {customers.customersCd === 5 && <img src={person5}/>}
          {customers.customers}
        </Button>
      )}
    </Item.Group>

  const visibleMenu = showShopMenu && (shop.menuCategories.map(category => 
      <>
      <Header as='h3' className='detailpage-service-header'>
        <Header.Content>{category}</Header.Content>
        <div className='middle-line'></div>
      </Header>
      {
      shop.menuList.filter(list => list.menuCategory.match(category)).map(menu => 
        <>
        <Item.Group unstackable className={0 < menu.num ? 'detailpage-service-menu detailpage-selected' : 'detailpage-service-menu'} key={menu.menuCd}>
          <Item className='detailpage-service' onClick={() => shopMenuBtnClick(menu.menuCd)}>
            <Item.Image className='detailpage-service-img' src={api.imgRender(menu.menuImg === null ? menuDefault : menu.menuImg)}/>
            <Item.Content 
              header={menu.menuName}
              meta={comma(menu.menuPrice) + '원'}
              description={menu.menuDescription === null ? '' : menu.menuDescription}
              extra={menu.menuTime && <Label basic className='menu-time' icon='time' content={convertMenuTime(menu.menuTime)}/>}/>
          </Item>
        </Item.Group>
        {0 < menu.num &&
        <Item className='detailpage-service-num'>
          <Icon className='detailpage-service-minus pcolor-accent' name='minus circle' onClick={() => shopMenuBtnMinusClick(menu.menuCd)}/>
          {menu.num}
          <Icon className='detailpage-service-plus pcolor-accent' name='plus circle' onClick={() => shopMenuBtnClick(menu.menuCd)}/>
        </Item>
        }
        </>
        )
      }
      <div className='detailpage-service-margin'/>
      </>
  ));

  function designerContent() {
    return (
      <Grid.Column>
        <Scroll to='designer' offset={-56} spy={true} smooth={true}>
        <Button id='designer' onClick={designerToggle} className={designerSelected ? 'detailpage-menu-btn-bg' :'detailpage-menu-btn-sub'}>
          <Icon name={designer === null ? 'chevron down' : 'chevron right'}/>
          {designer === null ? designerTitle : '디자이너 : ' + designer}
        </Button>
        </Scroll>
        {visibleDesigner}
        {designerError && errorMessege}
      </Grid.Column>
    );
  }

  function customersContent() {
    return (
      <Grid.Column>
        <Scroll to='customers' offset={-56} spy={true} smooth={true}>
        <Button id='customers' onClick={customersToggle} className={customersSelected ? 'detailpage-menu-btn-bg' :'detailpage-menu-btn-sub'}>
          <Icon name={customers === null ? 'chevron down' : 'chevron right'}/>
          {customers === null ? shopCustomersTitle : '방문인원 : ' + customers }
        </Button>
        </Scroll>
        {visibleCustomers}
        {customersError && errorMessege}
      </Grid.Column>
    );
  }

  function shopMenuContent() {
    return (
      <Grid.Column>
        <Scroll to='shopMenu' offset={-56} spy={true} smooth={true}>
        <Button id='shopMenu' onClick={shopMenuToggle} className={shopMenuSelected ? 'detailpage-menu-btn-bg' :'detailpage-menu-btn-sub'}>
          <Icon name={shopMenu === null ? 'chevron down' : 'chevron right'}/>
          {shopMenu === null ? (category === 'hairshop' ? hairShopMenuTitle : shopMenuTitle) : shopMenu}
        </Button>
        </Scroll>
        {category === 'hairshop' ? visibleHairShopMenu : visibleMenu}
        {shopMenuError && errorMessege}
      </Grid.Column>
    );
  }

  function calendarToogle() {
    setCalendarActive(!calendarActive);
  }

  function dayClick(e) {
    setMoment(getMoment.date(e.target.innerText));
    setDbDate(getMoment.format('YYYY-MM-DD'));
    setCalendarSelected(true)
    setDbTime(null);
    setTimetableSelected(false);
  }

  function lastMonth() {
    if(moment(getMoment.clone().subtract(1, 'month')).isBefore(moment())) {
      setMoment(moment());
      setDbDate(moment().format('YYYY-MM-DD'));
    } else {
      setMoment(getMoment.clone().subtract(1, 'month'));
      setDbDate(getMoment.clone().subtract(1, 'month').format('YYYY-MM-DD'));
    }
    setDbTime(null);
    setTimetableSelected(false);
  }
  function nextMonth() {
    setMoment(getMoment.clone().add(1, 'month'));
    setDbDate(getMoment.clone().add(1, 'month').format('YYYY-MM-DD'));
    setDbTime(null);
    setTimetableSelected(false);
  }

  function calendarHeadRender() {
    const result = [];
    for (let i = 0; i < weekArr.length; i++) {
        result.push(
            <Table.HeaderCell>{weekArr[i]}</Table.HeaderCell>
        );
    }
    return result;
  };

  function calendarRender() {
    let result = [];
    let week = firstWeek;
    for (week; week <= lastWeek; week++) {
        result = result.concat(
        <Table.Row className='center'> {
            Array(7).fill(0).map((_data, index) => {
            let days = today.clone().startOf('year').week(week).startOf('week').add(index, 'day');

            // normal - 80% OK / active - 40% OK / nonactive - 0%
            if (getMoment.format('YYYYMMDD') === days.format('YYYYMMDD')) {
              return(
                <Table.Cell onClick={dayClick} className='mypage-table-active table-today'>
                  <span>{days.format('D')}</span>
                  <Button disabled className='table-booking-date nonactive' size='mini' icon='minus circle'/>
                </Table.Cell>
              );
            } else if (days.format('MM') !== today.format('MM')) {
              return(
                <Table.Cell className='table-other-month'>
                  <span>{days.format('D')}</span>
                  <Button disabled className='table-booking-date active' size='mini' icon='check circle'/>
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
                    <Button disabled className='table-booking-date' size='mini' icon='check circle'/>
                  </Table.Cell>
                );
              }
            }
        })}
      </Table.Row>
      );
    }
    return result;
  }

  function calendarContent() {
    return (
      <>
      <Grid.Column>
          <Scroll to='calendar' offset={-56} spy={true} smooth={true}>
          <Button id='calendar' className={calendarSelected ? 'detailpage-menu-btn-bg' :'detailpage-menu-btn-sub'} onClick={calendarToogle}>
            <Icon name={calendarSelected ? 'chevron right' : 'chevron down'}/>
            {calendarSelected ? '예약일자 : ' + today.format('MM월 DD일') : '예약일자를 선택하세요' }
          </Button>
          </Scroll>
      </Grid.Column>
      {calendarActive &&
      <>
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
      }
      </>
    );
  }

  function timeClick(e) {
    const timeValue = e.target.value;
    const render = parseInt(e.target.value.split(':')[0]) <= 12 ? '오전 ' + timeValue : '오후 ' + timeValue;
    setDbTime(timeValue);
    setTimetableSelected(true);
  }

  function bookingTimeToggle() {
      setTimeActive(!timeActive);
  }

  function timetableContent() {
    for (let i = 0; i < startHour; i++) {
      timeArr.shift();
    }
    for (let i = 0; i <  23 - endHour; i++) {
      timeArr.pop();
    }
    return (
      <Grid.Column>
        <Scroll to='timeTable' offset={-56} spy={true} smooth={true}>
        <Button id='timeTable' className={timetableSelected ? 'detailpage-menu-btn-bg' :'detailpage-menu-btn-sub'} onClick={bookingTimeToggle}>
            <Icon name={timetableSelected ? 'chevron right' : 'chevron down'}/>
            {timetableSelected ? '예약시간 : ' + dbTime : '예약시간을 선택하세요' }
        </Button>
        </Scroll>
        <div className='timetable-btn-area'>
          {timeActive && <p><Icon name='sun outline'/>오전</p>}
          {timeActive 
            && timeArr.map(time => (
              (parseInt(time.substring(0,2)) <= 12)
              ? (originToday === dbDate && (parseInt(time.substring(0,2)) <= thisHour))
                ? <Button disabled className='timetable-btn nonactive'>{time}</Button>
                : <Button className={dbTime == time ? 'timetable-btn-selected' : 'timetable-btn'} value={time} onClick={timeClick}>{time}</Button>
              : <></>
            ))
          }
        </div>
        <div className='timetable-btn-area'>
        {timeActive && <p><Icon name='moon outline'/>오후</p>}
        {timeActive 
          && timeArr.map(time => (
            (parseInt(time.substring(0,2)) <= 12)
            ? <></>
            : (originToday === dbDate && (parseInt(time.substring(0,2)) <= thisHour))
              ? <Button disabled className='timetable-btn nonactive'>{time}</Button>
              : <Button className={dbTime == time ? 'timetable-btn-selected' : 'timetable-btn'} value={time} onClick={timeClick}>{time}</Button>
          ))
        }
        </div>
      </Grid.Column>
    );
  }

  function couponContent() {
    return (
      <Grid.Column>
        <Scroll to='coupon' offset={-56} spy={true} smooth={true}>
        <Button id='coupon' onClick={() => setShowCoupon(!showCoupon)} className={useCouponList.length !== 0 ? 'detailpage-menu-btn-bg' :'detailpage-menu-btn-sub'}>
          <Icon name={useCouponList.length === 0 ? 'chevron down' : 'chevron right'}/>
          {useCouponList.length === 0 ?
            '보유쿠폰 : ' + couponList.length + '개'
          :
            comma(discountPrice()) + '원 할인'
          }
        </Button>
        </Scroll>
        {showCoupon && couponList !== null ?
          couponList.length === 0
          ?
          <div className='detailpage-msg'>
            <h4 onClick={() => setShowCoupon(!showCoupon)}>사용할 수 있는 쿠폰이 없습니다</h4>
          </div>
          :
          <Card.Group className='detailpage-coupon-list' itemsPerRow={2}>
            {couponList.map(coupon =>
              <Card color='violet'
                onClick={() => CouponClick(coupon.couponCd)}
                header={{content: useCouponList.indexOf(coupon.couponCd) !== -1 ? comma(coupon.couponDiscount) + '원 할인' : coupon.couponName}}
                meta={useCouponList.indexOf(coupon.couponCd) !== -1 ? <Icon name='checkmark'/> : comma(coupon.couponDiscount) + '원'}
                className={useCouponList.indexOf(coupon.couponCd) !== -1  && 'coupon-checked'}/>
            )}
          </Card.Group>
        :<></>
        }
      </Grid.Column>
    );
  }

  function discountPrice() {
    let result = 0;
    for (let target in useCouponList) {
      const coupon = couponList.find(coupon => coupon.couponCd === useCouponList[target]);
      result += coupon.couponDiscount;
    }
    return result;
  }

  const settings = {
    dots: true,
    infinite: true,
    arrows: true,
    speed: 500,
    slidesToScroll: 1,
    nextArrow: <Icon name='angle right'/>,
    prevArrow: <Icon name='angle left'/>
  };

  return (
    <div className='detail-main'>
      <div className='detail-content'>
      {shop.length === 0 &&
        <Dimmer active inverted>
          <Loader size='large'/>
        </Dimmer>
      }

      {/* 샵 이미지 탭 */}
      <Segment className="detailpage-main-image" placeholder>
        <Slider {...settings}>
          {shopImages.map(img =>
            <Image src={api.imgRender(img)}/>
          )}
        </Slider>
      </Segment>

      {/* 샵 정보 탭 */}
      <Segment className='detailpage-main'>
        <p className='detailpage-name'>{shop.shopName}
          <span className='detailpage-call'>
            <a href={`tel:${shop.shopTel}`}><Icon name='phone square'/></a>
          </span>
          <span className='detailpage-review'>
            <Link to={`/review/${category}/${shopCd}`}>
              <Button inverted className='detailpage-link-btn pcolor-accent-button'>리뷰보기 <Icon name='angle double right'/></Button>
            </Link>
          </span>
        </p>
        <p className='detailpage-time'><Icon name='clock outline'/>{shop.shopOpen}~{shop.shopClose} 
          <span> ({shop.shopHoliday === '' ? '휴무일 없음' : convertWeek(shop.shopHolidayList) + '요일 휴무'})</span>
        </p>
        <p className='detailpage-info'><Icon name='list alternate outline'/>{shop.shopInfo}</p>
        <p className='detailpage-location'><Icon name='map outline'/>{shop.shopLocation}
          <Scroll className='detailpage-icon' to='map' offset={-56} spy={true} smooth={true}>
            <Icon id='map' className='angle' onClick={mapToogle} name={mapOpen ? 'angle up' : 'angle down'}/>
          </Scroll>
        </p>
        {mapOpen && 
          (shop.locationLat === 0 && shop.locationLng === 0
          ? <h4 className='detailpage-location-empty'>위치정보 미등록 매장입니다</h4>
          : <MapContainer shop={shop}/>
          )
        }
      </Segment>

      {/* 리뷰 정보 탭*/}
      <Segment className='review-info'>
        <Statistic.Group size='mini' widths='three' inverted>
          <Statistic>
            <Statistic.Value className='review-tab-icon' onClick={favorite}><Icon name={isFavorite ? 'like' : 'like outline'}/> {shop.favoriteNum === undefined ? 0 : comma(shop.favoriteNum)}</Statistic.Value>
            <Statistic.Label className='review-tab-label' onClick={favorite}>즐겨찾기</Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value className='review-tab-icon' onClick={() => props.history.push(`/review/${category}/${shopCd}`)}><Icon name='comments outline'/> {shop.reviewNum === undefined ? 0 : comma(shop.reviewNum)}</Statistic.Value>
            <Statistic.Label className='review-tab-label' onClick={() => props.history.push(`/review/${category}/${shopCd}`)}>총 리뷰수</Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value className='review-tab-icon' onClick={() => props.history.push(`/review/${category}/${shopCd}`)}><Icon name='star outline'/> {shop.ratingsAve}</Statistic.Value>
            <Statistic.Label className='review-tab-label' onClick={() => props.history.push(`/review/${category}/${shopCd}`)}>만족도</Statistic.Label>
          </Statistic>
        </Statistic.Group>
      </Segment>

      {/* 메뉴 탭 */}
      <Grid columns={1} className='detailpage-menu-btn'>
        <Grid.Row>
          {/* {couponContent()} */}
          {category === 'hairshop' && designerContent()}
          {category === 'restaurant' && customersContent()}
          {category === 'cafe' && customersContent()}
          {shopMenuContent()}
          {calendarContent()}
          {timetableContent()}
        </Grid.Row>
      </Grid>
      
      {/* 예약/로그인버튼 탭 */}
      {isAuthorized ? 
      <Button secondary animated className='booking-btn' onClick={bookingOpen}>
        <Button.Content visible>예약하기</Button.Content>
        <Button.Content hidden>
          <Icon name='arrow right'/>
        </Button.Content>
      </Button>
      :
      <Link to='/login'>
        <Button secondary className='booking-btn'>
          <Button.Content visible>로그인이 필요합니다</Button.Content>
        </Button>
      </Link>
      }
      
      {/* 예약 확인 모달 */}
      {bookingCheck() ?
      <Modal
        className='booking-modal'
        dimmer={dimmer}
        open={open}
        onClose={() => dispatch({ type: 'CLOSE_MODAL' })}>
        <Modal.Header><Icon name='exclamation triangle'/>예약 오류</Modal.Header>
        <Modal.Content>
          <h4>예약 내용을 다시 확인해주세요</h4>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={() => dispatch({ type: 'CLOSE_MODAL' })}>확인</Button>
        </Modal.Actions>
      </Modal>
      :
      <Modal className='booking-modal' dimmer={dimmer} open={open} onClose={() => dispatch({ type: 'CLOSE_MODAL' })}>
        <Modal.Content>
          <div className='booking-modal-title'>
            <div className='booking-modal-bar'/>
            {shop.shopName}
          </div>
          <Image className='booking-modal-shopimg' src={api.imgRender(shopImages[0])}/>
          <h4><Icon name='calendar check outline'/>예약일시</h4>
            <h3>{dateConvert(dbDate) + ' ' + dbTime}</h3>
          {category === 'hairshop' ?
          <>
          <h4><Icon name='cut'/>담당 디자이너</h4>
            <h3>{designer}</h3>
          </>
          :
          <>
          <h4><Icon name='user circle'/>예약인원</h4>
            <h3>{customers}</h3>
          </>
          }
        </Modal.Content>
        <div className='booking-modal-total'>
            <div className='booking-modal-detail'>
              <ol className='booking-modal-order'>
                {orderList && orderList.map(order => (
                  <li>
                    {order.menuName} {comma(order.menuPrice)}원
                    <span className='booking-modal-order-num'>
                      {1 < order.num && order.num}
                    </span>
                  </li>
                ))}
                {couponList && couponList.map(coupon => (
                  useCouponList.indexOf(coupon.couponCd) !== -1 &&
                  <>
                  <li>
                    <Icon name='minus circle'/>쿠폰할인 {'-' + comma(coupon.couponDiscount)}원
                  </li>
                  </>
                ))}
              </ol>
            </div>
            <div className='booking-modal-price'>
              <span className='booking-modal-price-total'>total</span>
              {comma(resultPrice)}원
            </div>
          </div>
        <Modal.Actions className='booking-modal-bottom'>
            <p>상세내역을 확인하신 후 예약을 눌러주세요</p>
            {finalCheck ? 
            <Button color='violet' onClick={sendBooking}>예약하기</Button>
            :
            <Button secondary className='booking-modal-btn' onClick={() => {setFinalCheck(true)}}>
               <Icon name='checkmark'/> 확인하였습니다
            </Button>
            }
        </Modal.Actions>
      </Modal>
      }

      {/* 예약 완료 모달 */}
      {modalFinal &&
        <Modal basic onOpen={() => setModalOpen(true)} open={modalOpen} size='small'>
        {modalLoading 
        ? <Loader size='large'>예약중...</Loader>
        : <>
          <Header icon>
            <Icon name='handshake outline'/>
            예약 완료
          </Header>
          <Modal.Content>
            <p style={{textAlign:'center'}}>
              예약하신 내역 및 관리는<br/><Link className='pcolor' to='/mypage'>마이페이지</Link>에서 가능합니다.
            </p>
          </Modal.Content>
          <Modal.Actions style={{textAlign:'center'}}>
            <Link to='/'>
              <Button inverted>
                <Icon name='home'/> 홈으로
              </Button>
            </Link>
            <Link to={'/booking/' + category}>
              <Button inverted>
                <Icon name='search'/> 둘러보기
              </Button>
            </Link>
          </Modal.Actions>
         </>
        }
        </Modal>
      }
    </div>
  </div>
  )
}
