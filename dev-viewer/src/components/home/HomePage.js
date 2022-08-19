import React, { useEffect, useState, useRef } from 'react';
import { Link } from "react-router-dom";
import { Link as Scroll } from "react-scroll";
import page1 from '../../img/page1.png'
import page2 from '../../img/page2.png'
import icon1 from '../../img/icon1.png'
import * as api from '../../rest/api'
import axios from 'axios';
import { Button, Segment, Icon, Accordion, Grid, Image, Input, Reveal, Menu, Item } from 'semantic-ui-react';

export default function HomePage(props) {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    const role = userInfo ? userInfo.role : null;

    const [onMouseX, setOnMouseX] = useState();
    const [activeIndex, SetActiveIndex] = useState();
    const [shopList, SetShopList] = useState();
    const [activeItem, setActiveItem] = useState('recommend');
    function handleItemClick (e, { name }) {
      setActiveItem(name);
      name === "event" ? getEventShop() : getNearShop();
      scrollRef.current.scrollLeft = 0;
   }
    const handleClick = (e, titleProps) => {
      const { index } = titleProps;
      const newIndex = activeIndex === index ? -1 : index;
      SetActiveIndex(newIndex);
    }

    const contentList = [
      { "title": "핫플", "color": "red", "icon": "hotjar" },
      { "title": "주변맛집", "color": "yellow", "icon": "utensils" },
      { "title": "빠른예약", "color": "green", "icon": "bolt" },
      { "title": "추천매장", "color": "blue", "icon": "photo" },
      { "title": "추천픽", "color": "purple", "icon": "calendar check outline" }
    ]

    useEffect(() => {
      getNearShop();
    }, [])

    function getEventShop() {
      return new Promise(function(resolve, reject) {
        axios
          .get(api.eventShopList)
          .then(response => resolve(response.data))
          .catch(error => reject(error.response))
      })
      .then(res => {
        if (res.success) {
          SetShopList(res.dataList);
        }
      })
      .catch(err => {
        alert("현재 서버와의 연결이 원활하지 않습니다. 관리자에게 문의해주세요.");
      })
    }

    function getNearShop() {
      return new Promise(function(resolve, reject) {
        axios
          .get(api.nearShopList)
          .then(response => resolve(response.data))
          .catch(error => reject(error.response))
      })
      .then(res => {
        if (res.success) {
          SetShopList(res.dataList);
        }
      })
      .catch(err => {
        alert("현재 서버와의 연결이 원활하지 않습니다. 관리자에게 문의해주세요.");
      })
    }

    //// scroll func start
    const scrollRef = useRef(null);
    const [isDrag, setIsDrag] = useState(false);
    const [startX, setStartX] = useState();

    const throttle = (func, ms) => {
      let throttled = false;
      return (...args) => {
        if (!throttled) {
          throttled = true;
          setTimeout(() => {
            func(...args);
            throttled = false;
          }, ms);
        }
      };
    };
  
    function onDragStart(e) {
      e.preventDefault();
      setIsDrag(true);
      setStartX(e.pageX + scrollRef.current.scrollLeft);
    };
  
    function onDragEnd() {
      setIsDrag(false);
    };
  
    function onDragMove(e) {
      try {
        if (isDrag) {
          const { scrollWidth, clientWidth, scrollLeft } = scrollRef.current;
          scrollRef.current.scrollLeft = startX - e.pageX;
      
          if (scrollLeft === 0) {
            setStartX(e.pageX);
          } else if (scrollWidth <= clientWidth + scrollLeft) {
            setStartX(e.pageX + scrollLeft);
          }
        }
      } catch {
      }
    };

    const delay = 10;
    const onThrottleDragMove = throttle(onDragMove, delay);
    //// scroll func end

    function onMovePage(e, category, shopCd) {
      if (onMouseX === e.pageX) {
        props.history.push(`/booking/${category}/${shopCd}`);
      }
    }

    function searching(e) {
      if (e.key === 'Enter') {
        props.history.push({
          pathname: '/search',
          state: { searchValue: e.target.value }
        })
      }
    }

    return(
    <>
      <div className="home-main">
        <p className='home-main-title-top'><img src={icon1}/></p>
        <p className='home-main-title'>예약은 바로바로</p>
        <p className='home-main-title-bottom'>기다림에서 해방되세요</p>
        <Input iconPosition='left' className='home-main-search' placeholder='위치 또는 매장명을 입력해주세요'>
          <Icon name='search' onClick={() => searching()}/>
          <input onKeyPress={searching}/>
        </Input>
        <Scroll to='main' offset={-56} spy={true} smooth={true}>
          <a className='home-main-scroll'><span/><span/>Scroll</a>
        </Scroll>
      </div>

      <Grid container className='home-content-main-top' divided relaxed stackable>

        <Menu pointing secondary className='home-menu' id='main'>
          <Menu.Item name='recommend' active={activeItem === 'recommend'} onClick={handleItemClick}>
            <span><Icon name='compass outline' size='large'/>주변 추천매장</span>
          </Menu.Item>
          <Menu.Item name='event' active={activeItem === 'event'} onClick={handleItemClick}>
            <span><Icon name='clock outline' size='large'/>이벤트 매장</span>
          </Menu.Item>
        </Menu>

        <Grid container className='content2' divided relaxed stackable>
          <div className={scrollRef.current?.scrollLeft !== 0 ? 'home-quick-menu-background left view' : 'home-quick-menu-background left'} id='first-content'/>
          <div className={scrollRef.current?.scrollLeft !== 2545 ? 'home-quick-menu-background right view' : 'home-quick-menu-background right'}/>
          <div className='home-quick-menu' onMouseDown={onDragStart} onMouseMove={isDrag ? onThrottleDragMove : null} onMouseUp={onDragEnd} onMouseLeave={onDragEnd} ref={scrollRef}>
            {shopList && shopList.map(shop => 
              <div className='content2-quick' onMouseDown={(e) => setOnMouseX(e.pageX)} onClick={(e) => onMovePage(e, shop.category, shop.shopCd)}>
                <Item className='content2-quick-content'>
                  <img src={api.imgRender(shop.shopImg ? shop.shopImg.split(",")[0] : 'images/shop/default.png')}/>
                  <Item.Content>
                    <Item.Header as='h5'>{shop.shopName}</Item.Header>
                    <Item.Meta>{shop.shopInfo}</Item.Meta>
                    <Item.Description>
                      <span><Icon name='star'/>{shop.ratingsAve}</span>
                      <span><Icon name='comment'/>{shop.reviewNum}</span>
                    </Item.Description>
                  </Item.Content>
                </Item>
              </div>
            )}
          </div>
        </Grid>

      </Grid>

      <Grid container className='content1' relaxed unstackable>
        <Grid.Row columns={contentList.length}>
          {contentList.map(content => 
            <Grid.Column>
              <Icon inverted size='big' color={content.color} name={content.icon}/>
              <span>{content.title}</span>
            </Grid.Column>
          )}
        </Grid.Row>
      </Grid>

      <Grid container columns={2} className='home-content-main' divided relaxed stackable>
        <Grid.Column>
          <Segment className="home-content-intro">
            <h2 className="home-content-intro-title">예약을 쉽고<br/><span className='pcolor'>스마트</span>하게!</h2>
            <p className="home-content-intro-inline">원하는 매장을 찾는 일은<br/>
              항상 어렵게 느껴집니다.<br/>
              저희 <span className='pcolor'>Pick</span>에서는 그 어려움을 해결해<br/>
              드리고 싶었습니다.<br/>
              각종 통계 데이터 기반으로<br/>
              주변 지역의 매장 및 장소를<br/>
              하나부터 열까지 똑똑하게 추천해드립니다.
            </p>
            <Link to='/booking/hairshop'>
              <Button inverted color='blue'>추천 매장보기<Icon name='angle double right'/></Button>
            </Link>
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Segment>
            <Iphone/>
          </Segment>
        </Grid.Column>
      </Grid>

      <Grid className='home-content-main content4' container divided relaxed stackable>
        <Grid.Column>
          <Segment>
          <h4 className='sub-title'>번거로움을 줄이다</h4>
          <h2><span className='pcolor'>지금 바로 </span>사용하세요</h2>
            <Accordion styled className='content4-right'>
              <Accordion.Title active={activeIndex === 0} index={0} onClick={handleClick}>
                <Icon name='dropdown'/>
                서비스 정식 출시일은 언제인가요?
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 0}>
                <p>
                  변수가 생길수도 있겠지만<br/>
                  가능하면 올해 겨울중으로 생각하고 있습니다.
                </p>
              </Accordion.Content>

              <Accordion.Title active={activeIndex === 1} index={1} onClick={handleClick}>
                <Icon name='dropdown'/>
                매장을 등록하고 싶어요! 어떻게 하나요?
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 1}>
                <p>
                  출시 후 가이드맵을 보여드릴 예정입니다.
                </p>
              </Accordion.Content>

              <Accordion.Title active={activeIndex === 2} index={2} onClick={handleClick}>
                <Icon name='dropdown'/>
                본 서비스는 무료인가요?
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 2}>
                <p>
                  기본 무료로 서비스 예정이며,<br/>
                  매장의 경우 서비스관리를 위하여<br/>
                  월정액제를 생각중입니다.
                </p>
              </Accordion.Content>
            </Accordion>

          </Segment>
        </Grid.Column>
      </Grid>
    </>
    )
  };

function Iphone() {
  return(
    <>
    <div className="iphonex-container">
    <div className="iphonex">
      <div className="iphonex__case">
        <div className="iphonex__top">
          <div className="iphonex__time">10:30</div>
          <Icon name='battery full' className="iphonex__battery"/>
        </div>
        <div className="iphonex__notch">
         <div className="iphonex__speaker"></div>
         <div className="iphonex__camera"></div>
        </div>
        <div className="iphonex__screen">
          <Reveal animated='fade'>
            <Reveal.Content visible>
              <Image src={page1} className='iphone-screen-img'/>
            </Reveal.Content>
            <Reveal.Content hidden>
              <Image src={page2} className='iphone-screen-img'/>
            </Reveal.Content>
          </Reveal>
        </div>
      </div>
      <div className="iphonex__power"></div>
      <div className="iphonex__volume iphonex__volume--up"></div>
      <div className="iphonex__volume iphonex__volume--down"></div>
    </div>
    </div>
    </>
  )
}