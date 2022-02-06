import { useEffect, useState, useReducer } from "react";
import { useParams, Link } from "react-router-dom";
import { Dimmer, Button, Item, Grid, Segment, Image, Icon, Loader, Modal, Header, Statistic, Card } from 'semantic-ui-react'
import BookingCalendar from "./BookingCalendar";
import BookingTimeTable from "./BookingTimeTable";
import * as api from '../../rest/api'
import axios from 'axios';
import MapContainer from "../public/MapContainer";
import Slider from "react-slick";
import { Link as Scroll } from "react-scroll";
import moment from "moment";

export default function BookingDetail(props) {
  const isAuthorized = sessionStorage.getItem("isAuthorized");

  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  const favorites = JSON.parse(sessionStorage.getItem('favorites'));
  const user_cd = userInfo ? userInfo.user_cd : null;
  const permission = userInfo ? userInfo.permission : null;
  const [couponList, setCouponList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [useCouponList, setUseCouponList] = useState([]);

  // 공통 default
  const shopDefault = 'images/shop/default.png';
  const staffDefault = 'images/user/default.png';
  const menuDefault = 'images/menu/default.png';

  const customersList = [
    {'customers_cd':1, 'customers':'1명'},
    {'customers_cd':2, 'customers':'2명'},
    {'customers_cd':3, 'customers':'3 ~ 4명'},
    {'customers_cd':5, 'customers':'5명 이상'}
  ]
  
  const [shop, setShop] = useState([]);
  const [shopImages, setShopImages] = useState([]);
  const {shop_cd} = useParams();
  const category = (props.location.pathname).split('/')[2];

  const [isFavorite, setIsFavorite] = useState(false);
  const [clickFavorite, setClickFavorite] = useState(false);

  const [modalOpen, setModalOpen] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)

  const [mapOpen, setMapOpen] = useState(false)
  
  const [finalCheck, setFinalCheck] = useState(false)

  useEffect(() => {
    userInfo && setCouponList(userInfo.coupon);
    if (favorites) {
      favoriteJudge();
    }
    const params = { 
      'shop_cd': shop_cd,
      'permission': permission
    };
    return new Promise(function(resolve, reject) {
      axios
        .post(api.shopInfo, params)
        .then(response => resolve(response.data))
        .catch(error => reject(error.response))
    })
    .then(res => {
      if (res !== null) {
        setShop(res);
        makeImageList(res.shop_img);
      }
    })
    .catch(err => {
      alert("현재 서버와의 연결이 원활하지 않습니다. 관리자에게 문의해주세요.");
    })
  }, [])

  function makeImageList(shop_img) {
    const result = [];
    for (let index = 0; index < 4; index++) {
        result.push(shop_img[index] ? shop_img[index] : shopDefault);
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

  function sendBooking() {
    setModalLoading(true);
    setModalOpen(true);
    const timeStamp = dbDate + " " + dbTime + ":00";
    const booking_detail = {};
    if (category === 'hairshop') {
      booking_detail.designer = dbDesigner;
      booking_detail.style = orderList[0].menu_cd;
      booking_detail.discount = discount;
    } else {
      booking_detail.customers = dbCustomers;
      booking_detail.orders = orderList;
      booking_detail.discount = discount;
    }
    const params = { 
      'user_cd': user_cd,
      'shop_cd': shop_cd,
      'booking_time': timeStamp,
      'booking_detail': booking_detail,
      'booking_price': resultPrice,
      'category': category
    };
    return new Promise(function(resolve, reject) {
      axios
        .post(api.booking, params)
        .then(response => resolve(response.data))
        .catch(error => reject(error.response))
    }).then(data => {
        if (data) {
          dispatch({ type: 'CLOSE_MODAL' })
          setModalLoading(false);
        } else {
          alert("예약에 실패하였습니다. 잠시 후 시도해주세요.")
          setModalLoading(false);
        }
      }
    )
  }
    
  function DesignerBtnClick(targetId) {
    const target = shop.staff_list.find(staff => staff.user_cd === targetId);
    setDesigner(target.user_name);
    setDbDesigner(target.user_cd);
    setDesignerSelected(true);
    setShowDesigner(false);
  }

  function hairShopMenuBtnClick(targetId) {
    const target = shop.menu_list.find(menu => menu.menu_cd === targetId);
    const price = target.menu_price;
    const orderTarget =  orderList.find(order => order.menu_cd === targetId);
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
    const target = customersList.find(customers => customers.customers_cd === targetId);
    setCustomers(target.customers);
    setDbCustomers(target.customers_cd);
    setCustomersSelected(true);
    setShowCustomers(false);
  }

  function shopMenuBtnClick(targetId) {
    const target = shop.menu_list.find(menu => menu.menu_cd === targetId);
    const price = target.menu_price;
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
    const target = shop.menu_list.find(menu => menu.menu_cd === targetId);
    const price = target.menu_price;
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
    const coupon = couponList.find(coupon => coupon.coupon_cd === targetId);
    couponList[couponList.indexOf(coupon)].use = !couponList[couponList.indexOf(coupon)].use;
    setCouponList(couponList);
    
    if (coupon.use) {
      useCouponList.push(coupon.coupon_cd);
      setResultPrice(resultPrice - coupon.coupon_discount);
    } else {
      useCouponList.splice(useCouponList.indexOf(coupon.coupon_cd), 1);
      setResultPrice(resultPrice + coupon.coupon_discount);
    }
    setUseCouponList(useCouponList);
  }

  function designerToggle() {
    {shop.staff_list === null || shop.staff_list.length === 0
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
    {shop.menu_list === null || shop.menu_list.length === 0
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
    dispatch({ type: 'OPEN_MODAL' });
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
    if (user_cd === null) {
      alert('로그인이 필요합니다');
      return;
    }
    setClickFavorite(true);
    const params = { 
      'user_cd': user_cd,
      'shop_cd': shop_cd,
      'isFavorite': isFavorite
    };
    return new Promise(function(resolve, reject) {
      axios
        .post(api.favorite, params)
        .then(response => resolve(response.data))
        .catch(error => reject(error.response))
    }).then(data => {
      setIsFavorite(data);
      if (data) {
        shop.favorite_num = shop.favorite_num + 1;
        setShop(shop)
      } else {
        shop.favorite_num = shop.favorite_num - 1;
        setShop(shop)
      }
      getFavorite(user_cd);
      }
    )
  }

  function getFavorite(user_cd) {
    const params = { 
      'user_cd': user_cd
    };
    return new Promise(function(resolve, reject) {
      axios
        .post(api.getFavorite, params)
        .then(response => resolve(response.data))
        .catch(error => reject(error.response))
    }).then(data => {
      sessionStorage.setItem('favorites', JSON.stringify(data));
      setClickFavorite(false);
      }
    )
  }

  function mapToogle() {
    setMapOpen(!mapOpen);
  }

  function favoriteJudge() {
    favorites.map(favorite => {
      if (shop_cd === String(favorite.shop_cd)) {
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

  function convertWeek(key) {
    const target = weeks.filter(day => day.key.match(key));
    const result = target[0].text;
    return result;
}

  function dateConvert(date) {
    return moment(date).format("YYYY년 MM월 DD일");
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

  const visibleDesigner = showDesigner && (shop.staff_list.map(staff =>
    <>
    <Item.Group unstackable className={dbDesigner === staff.user_cd ? 'detailpage-service-menu detailpage-selected' : 'detailpage-service-menu'} key={staff.user_cd} onClick={() => DesignerBtnClick(staff.user_cd)}>
      <Item className='detailpage-service'>
        <Item.Image className='detailpage-service-img' src={api.imgRender(staff.user_img === null ? staffDefault : staff.user_img)}/>
        <Item.Content header={staff.user_name + ' (' + staff.career +') '} meta={staff.info}/>
      </Item>
    </Item.Group>
    {dbDesigner === staff.user_cd &&
      <Item className='detailpage-service-num'>
        <Icon color='violet' className='detailpage-service-minus' name='check circle'/>
      </Item>
    }
    </>
    ));

  const visibleHairShopMenu = showShopMenu && (shop.menu_categorys.map(category => 
    <>
    <Header as='h3' className='detailpage-service-header' dividing>
      <Icon name='slack hash'/>
      <Header.Content>{category}</Header.Content>
    </Header>
    {
    shop.menu_list.filter(list => list.menu_category.match(category)).map(menu => 
      <>
      <Item.Group unstackable className={0 < menu.num ? 'detailpage-service-menu detailpage-selected' : 'detailpage-service-menu'} key={menu.menu_cd}>
        <Item className='detailpage-service' onClick={() => hairShopMenuBtnClick(menu.menu_cd)}>
          <Item.Image className='detailpage-service-img' src={api.imgRender(menu.menu_img === null ? menuDefault : menu.menu_img)}/>
          <Item.Content header={menu.menu_name} meta={comma(menu.menu_price) + '원'} description={menu.menu_description === null ? '' : menu.menu_description}/>
        </Item>
      </Item.Group>
      {0 < menu.num &&
        <Item className='detailpage-service-num'>
          <Icon color='violet' className='detailpage-service-minus' name='check circle'/>
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
        <Button onClick={() => CustomersBtnClick(customers.customers_cd)}>{customers.customers}</Button>
      )}
    </Item.Group>

  const visibleMenu = showShopMenu && (shop.menu_categorys.map(category => 
      <>
      <Header as='h3' className='detailpage-service-header' dividing>
        <Icon name='slack hash'/>
        <Header.Content>{category}</Header.Content>
      </Header>
      {
      shop.menu_list.filter(list => list.menu_category.match(category)).map(menu => 
        <>
        <Item.Group unstackable className={0 < menu.num ? 'detailpage-service-menu detailpage-selected' : 'detailpage-service-menu'} key={menu.menu_cd}>
          <Item className='detailpage-service' onClick={() => shopMenuBtnClick(menu.menu_cd)}>
            <Item.Image className='detailpage-service-img' src={api.imgRender(menu.menu_img === null ? menuDefault : menu.menu_img)}/>
            <Item.Content header={menu.menu_name} meta={comma(menu.menu_price) + '원'} description={menu.menu_description === null ? '' : menu.menu_description}/>
          </Item>
        </Item.Group>
        {0 < menu.num &&
        <Item className='detailpage-service-num'>
          <Icon color='violet' className='detailpage-service-minus' name='minus circle' onClick={() => shopMenuBtnMinusClick(menu.menu_cd)}/>
          {menu.num}
          <Icon color='violet' className='detailpage-service-plus' name='plus circle' onClick={() => shopMenuBtnClick(menu.menu_cd)}/>
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
                onClick={() => CouponClick(coupon.coupon_cd)}
                header={{content: useCouponList.indexOf(coupon.coupon_cd) !== -1 ? comma(coupon.coupon_discount) + '원 할인' : coupon.coupon_name}}
                meta={useCouponList.indexOf(coupon.coupon_cd) !== -1 ? <Icon name='checkmark'/> : comma(coupon.coupon_discount) + '원'}
                className={useCouponList.indexOf(coupon.coupon_cd) !== -1  && 'coupon-checked'}/>
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
      const coupon = couponList.find(coupon => coupon.coupon_cd === useCouponList[target]);
      result += coupon.coupon_discount;
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
    <div className='detailpage'>
      {/* <div className='booking-nav'>
        test
      </div> */}
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
        <p className='detailpage-name'>{shop.shop_name}
          <span className='detailpage-call'>
            <a href={`tel:${shop.shop_tel}`}><Icon name='phone square'/></a>
          </span>
          <span className='detailpage-review'>
            <Link to={`/review/${category}/${shop_cd}`}>
              <Button className='detailpage-link-btn' inverted color='violet'>리뷰보기 <Icon name='angle double right'/></Button>
            </Link>
          </span>
        </p>
        <p className='detailpage-time'><Icon name='clock outline'/>{shop.shop_open}~{shop.shop_close} 
          <span className='detailpage-holiday'>({shop.shop_holiday === 'none' ? '휴무일 없음' : convertWeek(shop.shop_holiday) + ' 휴무'})</span>
        </p>
        <p className='detailpage-info'><Icon name='list alternate outline'/>{shop.shop_info}</p>
        <p className='detailpage-location'><Icon name='map outline'/>{shop.shop_location}
          <Scroll className='detailpage-icon' to='map' offset={-56} spy={true} smooth={true}>
            <Icon id='map' onClick={mapToogle} name={mapOpen ? 'angle up' : 'angle down'}/>
          </Scroll>
        </p>
        {mapOpen && 
          (shop.location_lat === 0 && shop.location_lng === 0
          ? <h4 className='detailpage-location-empty'>위치정보 미등록 매장입니다</h4>
          : <MapContainer shop={shop}/>
          )
        }
      </Segment>

      {/* 리뷰 정보 탭*/}
      <Segment className='review-info'>
        <Statistic.Group size='mini' widths='three' inverted>
          <Statistic>
            <Statistic.Value className='review-tab-icon' onClick={favorite}><Icon name={isFavorite ? 'like' : 'like outline'}/> {shop.favorite_num === undefined ? 0 : comma(shop.favorite_num)}</Statistic.Value>
            <Statistic.Label className='review-tab-label' onClick={favorite}>즐겨찾기</Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value className='review-tab-icon' onClick={() => props.history.push(`/review/${category}/${shop_cd}`)}><Icon name='comments outline'/> {shop.review_num === undefined ? 0 : comma(shop.review_num)}</Statistic.Value>
            <Statistic.Label className='review-tab-label' onClick={() => props.history.push(`/review/${category}/${shop_cd}`)}>총 리뷰수</Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value className='review-tab-icon' onClick={() => props.history.push(`/review/${category}/${shop_cd}`)}><Icon name='star outline'/> {shop.ratings_ave}</Statistic.Value>
            <Statistic.Label className='review-tab-label' onClick={() => props.history.push(`/review/${category}/${shop_cd}`)}>만족도</Statistic.Label>
          </Statistic>
        </Statistic.Group>
      </Segment>

      {/* 메뉴 탭 */}
      <Grid columns={1} className='detailpage-menu-btn'>
        <Grid.Row>
          
          {couponContent()}

          {category === 'hairshop' && designerContent()}
          {category === 'restaurant' && customersContent()}
          {category === 'cafe' && customersContent()}

          {shopMenuContent()}

          <BookingCalendar setDbDate={setDbDate}/>

          {shop !== undefined 
          ? <BookingTimeTable setDbTime={setDbTime} shop={shop} dbDate={dbDate}/>
          : <BookingTimeTable setDbTime={setDbTime}/>
          }

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
            {shop.shop_name}
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
                {orderList.map(order => (
                  <li>
                    {order.menu_name} {comma(order.menu_price)}원
                    <span className='booking-modal-order-num'>
                      {1 < order.num && order.num}
                    </span>
                  </li>
                ))}
                {couponList.map(coupon => (
                  useCouponList.indexOf(coupon.coupon_cd) !== -1 &&
                  <>
                  <li>
                    <Icon name='minus circle'/>쿠폰할인 {'-' + comma(coupon.coupon_discount)}원
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
            <Button primary onClick={sendBooking}>예약하기</Button>
            :
            <Button secondary onClick={() => {setFinalCheck(true)}}>
               <Icon name='checkmark'/> 확인하였습니다
            </Button>
            }
        </Modal.Actions>
      </Modal>
      }

      {/* 예약 완료 모달 */}
      <Modal basic onOpen={() => setModalOpen(true)} open={modalOpen} size='small'>
      {modalLoading ? <Loader size='large'>예약중...</Loader>
      :
      <>
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
          <Link to='/booking'>
            <Button inverted>
              <Icon name='search'/> 둘러보기
            </Button>
          </Link>
        </Modal.Actions>
      </>
      }
      </Modal>
  </div>
  )
}
