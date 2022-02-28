import React, { useState, useRef } from 'react';
import { Link } from "react-router-dom";
import page1 from '../../img/page1.png'
import page2 from '../../img/page2.png'
import * as api from '../../rest/api'
import { Button, Segment, Icon, Accordion, Grid, Image, Input, Reveal } from 'semantic-ui-react';

export default function HomePage(props) {
    let isAuthorized = sessionStorage.getItem("isAuthorized");
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    const permission = userInfo ? userInfo.permission : null;

    const [activeIndex, SetActiveIndex] = useState();

    const eventList = ["images/event/1.png", "images/event/2.png", "images/event/3.png", "images/event/4.png"];

    const handleClick = (e, titleProps) => {
      const { index } = titleProps
      const newIndex = activeIndex === index ? -1 : index
      SetActiveIndex(newIndex)
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
      if (isDrag) {
        const { scrollWidth, clientWidth, scrollLeft } = scrollRef.current;
        scrollRef.current.scrollLeft = startX - e.pageX;
    
        if (scrollLeft === 0) {
          setStartX(e.pageX);
        } else if (scrollWidth <= clientWidth + scrollLeft) {
          setStartX(e.pageX + scrollLeft);
        }
      }
    };

    const delay = 100;
    const onThrottleDragMove = throttle(onDragMove, delay);
    //// scroll func end

    function searching(e) {
      if (e.key === 'Enter') {
        props.history.push({
          pathname: '/search',
          state: { searchValue: e.target.value}
        })
      }
    }

    return(
    <>
      <div className="home-main">
        <p className='home-main-title-top'>Only for you</p>
        <p className='home-main-title'>서비스 오픈 </p>
        <p className='home-main-title-bottom'>나만의 특가를 찾아보세요!</p>
        <Input iconPosition='left' className='home-main-search' placeholder='위치 또는 매장명을 입력해주세요'>
          <Icon name='search' onClick={() => searching()}/>
          <input onKeyPress={searching}/>
        </Input>
      </div>

      <Grid container className='home-content-main content1' divided relaxed stackable>
        <div className='content1-left'>
          <p className='content1-title'>{isAuthorized ? '오늘도 멋진 하루 되세요!' : '아직 회원이 아니신가요?'}</p>
          <p className='content1-subtitle'>저희 서비스는 여러분의 소중한 데이터를 바탕으로</p>
          <p className='content1-subtitle'>보다 나은 서비스를 제공하고 있습니다.</p>
        </div>
        <div className='content1-right'>
        {isAuthorized ?
          permission === 3 ?
            <Link to='/dashboard'>
              <Button color='black'>
                매장관리<Icon name='arrow right'/>
              </Button>
            </Link>
            :
            <Link to='/mypage'>
              <Button color='black'>
                마이페이지<Icon name='arrow right'/>
              </Button>
            </Link>
        :
        <Link to='/login'>
          <Button color='black'>
            로그인 / 회원가입<Icon name='arrow right'/>
          </Button>
        </Link>
        }
        </div>
      </Grid>
      
      {/* <Grid container className='home-content-main content2' divided relaxed stackable>
        <div className='home-quick-menu' onMouseDown={onDragStart} onMouseMove={isDrag ? onThrottleDragMove : null} onMouseUp={onDragEnd} onMouseLeave={onDragEnd} ref={scrollRef}>
          {eventList.map(event => 
            <Link to={`/booking/hairshop`}>
              <span className='content2-quick'>
                <img src={api.imgRender(event)}/>
              </span>
            </Link>
          )}
        </div>
      </Grid> */}

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
            <Link to='/styles'>
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