import React, { useState, useRef } from 'react';
import { Link } from "react-router-dom";
import robo from '../../img/robo.png';
import src from '../../img/robo.png';
import page1 from '../../img/page1.png'
import page2 from '../../img/page2.png'
import { Button, Segment, Icon, Accordion, Grid, Image, Header, Card, Reveal } from 'semantic-ui-react';

export default function HomePage() {
    let isAuthorized = sessionStorage.getItem("isAuthorized");
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    const permission = userInfo ? userInfo.permission : null;

    const [activeIndex, SetActiveIndex] = useState();

    const handleClick = (e, titleProps) => {
      const { index } = titleProps
      const newIndex = activeIndex === index ? -1 : index
      SetActiveIndex(newIndex)
    }

    //// scroll func start
    // const scrollRef = useRef(null);
    // const [isDrag, setIsDrag] = useState(false);
    // const [startX, setStartX] = useState();

    // const throttle = (func, ms) => {
    //   let throttled = false;
    //   return (...args) => {
    //     if (!throttled) {
    //       throttled = true;
    //       setTimeout(() => {
    //         func(...args);
    //         throttled = false;
    //       }, ms);
    //     }
    //   };
    // };
  
    // function onDragStart(e) {
    //   e.preventDefault();
    //   setIsDrag(true);
    //   setStartX(e.pageX + scrollRef.current.scrollLeft);
    // };
  
    // function onDragEnd() {
    //   setIsDrag(false);
    // };
  
    // function onDragMove(e) {
    //   if (isDrag) {
    //     const { scrollWidth, clientWidth, scrollLeft } = scrollRef.current;
    //     scrollRef.current.scrollLeft = startX - e.pageX;
    
    //     if (scrollLeft === 0) {
    //       setStartX(e.pageX);
    //     } else if (scrollWidth <= clientWidth + scrollLeft) {
    //       setStartX(e.pageX + scrollLeft);
    //     }
    //   }
    // };

    // const delay = 100;
    // const onThrottleDragMove = throttle(onDragMove, delay);
    //// scroll func end

    return(
    <>
     {isAuthorized
     ?
     <></>
     :
      <div className="home-main">
        <h1>바쁜일상<br/>슬기로운 시간활용</h1>
        <Link to='/login'>
          <Button.Content className='home-main-btn circle-h' visible>
          <Icon name='play' style={{margin:'0px'}}/>
          </Button.Content>
        </Link>
      </div>
      }
      {isAuthorized
      ?
      <>
      <Segment className="home-content-top">
        {/* <div className='home-quick-menu'
             onMouseDown={onDragStart}
             onMouseMove={isDrag ? onThrottleDragMove : null}
             onMouseUp={onDragEnd}
             onMouseLeave={onDragEnd}
             ref={scrollRef}>
        <Segment className='home-quick' color='blue'>
          <Icon name='calendar alternate outline' size='big'/>
          <div className='home-quick-name'>메뉴1</div>
        </Segment>
        <Segment className='home-quick' color='blue'>
          <Icon name='sitemap' size='big'/>
          <div className='home-quick-name'>메뉴2</div>
        </Segment>
        <Segment className='home-quick' color='blue'>
          <Icon name='tag' size='big'/>
          <div className='home-quick-name'>메뉴3</div>
        </Segment>
        <Segment className='home-quick' color='blue'>
          <Icon name='cut' size='big'/>
          <div className='home-quick-name'>메뉴4</div>
        </Segment>
        <Segment className='home-quick' color='blue'>
          <Icon name='camera' size='big'/>
          <div className='home-quick-name'>메뉴5</div>
        </Segment>
        </div> */}
          {permission === 3 ?
          <Link to='/dashboard'>
          <Button className='home-content-new'>
              매장관리
              <Icon name='arrow right'/>
            </Button>
          </Link>
          :
          <Link to='/mypage'>
          <Button className='home-content-new' animated>
            <Button.Content visible>
              예약 확인하기
            </Button.Content>
            <Button.Content hidden>
              <Icon name='arrow right'/>마이페이지
            </Button.Content>
            </Button>
          </Link>
          }
        <img src={robo} className='home-robo'/>
      </Segment>
      </>
      :
      <>
      </>
      }

      <Grid container columns={2} className='home-content-main' divided relaxed stackable>
        <Grid.Column>
          <Segment className="home-content-intro">
            <h2 className="home-content-intro-title">예약을 쉽고<br/><span className='pcolor'>스마트</span>하게!</h2>
            <p className="home-content-intro-inline">나에게 맞는 디자이너를 찾는 일은<br/>
              항상 어렵게 느껴집니다.<br/>
              저희 <b>Pick</b>에서는 그 어려움을 해결해<br/>
              드리고 싶었습니다.<br/>
              시술 통계 데이터 기반으로<br/>
              각 지역에서 재예약 많은 디자이너부터<br/>
              매장까지 똑똑하게 추천해드립니다.
            </p>
            <Link to='/styles'>
              <Button inverted color='blue'>추천 헤어보기<Icon name='angle double right'/></Button>
            </Link>
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Segment>
            <Iphone/>
          </Segment>
        </Grid.Column>
      </Grid>
      <hr/>
      <Grid container columns={1}>
        <Grid.Column>
          <Segment className="home-content-1">
          <h4 className='sub-title'>번거로운 예약은 그만</h4>
          <h2><span className='pcolor'>퀵 카드</span>로 해결</h2>
          <Card
            image={robo}
            header='모던미용실'
            meta='커트'
            color='blue'
            description='미용실 메모'
            extra={<a><Icon name='street view'/>최종예약일 : 2020.08.21</a>}
            className='quick-card'
          />

          {/* <Segment circular inverted style={square}>
            <Header as='h2' inverted>
              Step1
            <Header.Subheader>$10.99</Header.Subheader>
            </Header>
          </Segment> */}

        </Segment>
      </Grid.Column>
      </Grid>
      <hr/>
      <Grid container>
        <Grid.Column>
          <Segment className="home-content-2">
          <h4 className='sub-title'>번거로움을 줄이다</h4>
          <h2><span className='pcolor'>지금 바로 </span>사용하세요</h2>
            <Accordion styled className='home-content-2-right'>
              <Accordion.Title
                active={activeIndex === 0}
                index={0}
                onClick={handleClick}
              >
                <Icon name='dropdown'/>
                Question 1
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 0}>
                <p>
                  wait
                </p>
              </Accordion.Content>

              <Accordion.Title
                active={activeIndex === 1}
                index={1}
                onClick={handleClick}
              >
                <Icon name='dropdown'/>
                Question 2
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 1}>
                <p>
                  wait
                </p>
              </Accordion.Content>

              <Accordion.Title
                active={activeIndex === 2}
                index={2}
                onClick={handleClick}
              >
                <Icon name='dropdown'/>
                Question 3
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 2}>
                <p>
                  wait
                </p>
                <p>
                  wait
                </p>
              </Accordion.Content>
            </Accordion>

          </Segment>
        </Grid.Column>
      </Grid>
      <hr/>
      <Grid container>
        <Grid.Column>
          <Segment className="home-content-2">
          <h4 className='pcolor'>Pick앱 서비스</h4>
          <h2 className='center'>스타일이 고민되면?<br/>일단 <span className='pcolor'>전문가</span>에게 물어보자!</h2>
            <Card.Group itemsPerRow={3}>
              <Card raised image={src} />
              <Card raised image={src} />
              <Card raised image={src} />
              <Card raised image={src} />
              <Card raised image={src} />
              <Card raised image={src} />
            </Card.Group>
          </Segment>
        </Grid.Column>
      </Grid>
      {/* <hr />
      <Grid container>
        <Grid.Column>
          <Segment className="home-content-2">
            <h4 className='pcolor'>서브타이틀</h4>
            <h2 className='center'>타이틀<br/>여기가<span className='pcolor'>포인트</span>입니다</h2>
          </Segment>
        </Grid.Column>
      </Grid> */}
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