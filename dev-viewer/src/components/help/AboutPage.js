import React, { useEffect, useState, useReducer } from 'react';
import * as api from '../../rest/api'
import about from '../../img/about.png'
import axios from 'axios';
import { Container, Header, Step, Icon, Grid, Image } from 'semantic-ui-react';

export default function AboutPage(props) {

    return(
    <>
    <Header className='about-title'>
        About Pick
    </Header>
    <Grid container stackable columns={2} className='about-intro'>
        <Grid.Column>
            <Image src={about}/>
        </Grid.Column>
        <Grid.Column>
            <Container>
                <p>
                원하는 매장을 찾는 일은<br/>
                항상 어렵게 느껴집니다.<br/>
                저희 <span className='pcolor'>Pick</span>에서는 그 어려움을 해결드리고자 합니다.<br/>
                각종 통계 데이터 기반으로<br/>
                고객님의 주변 매장 및 장소를<br/>
                똑똑하게 추천해드립니다.
                </p>
            </Container>
        </Grid.Column>
    </Grid>
    <hr/>
    <Header className='about-title'>
        Guide
    </Header>
    <Header className='about-sub-title'>
        {'1. 매장 선택 & 예약신청'}
    </Header>
    <Step.Group widths={1}>
        <Step>
        <Icon name='search'/>
        <Step.Content>
            <Step.Title>매장찾기</Step.Title>
            <Step.Description>프로모션을 노려보는것도 좋아요!</Step.Description>
        </Step.Content>
        </Step>
    </Step.Group>
    <Container>
        <p>
        {/* (설명란) */}
        </p>
    </Container>
    <Header className='about-sub-title'>
        {'2. 예약완료'}
    </Header>
    <Step.Group widths={1}>
        <Step>
        <Icon name='calendar check outline'/>
        <Step.Content>
            <Step.Title>스케쥴 확인</Step.Title>
            <Step.Description>문의사항은 가게와 바로바로 연락해요!</Step.Description>
        </Step.Content>
        </Step>
    </Step.Group>
    <Container>
        <p>
        {/* (설명란) */}
        </p>
    </Container>
    <Header className='about-sub-title'>
        {'3. 방문 및 후기작성'}
    </Header>
    <Step.Group widths={1}>
        <Step>
        <Icon name='rocket'/>
        <Step.Content>
            <Step.Title>감사합니다</Step.Title>
            <Step.Description>후기를 남겨 매장을 응원하고, 정보를 공유해요!</Step.Description>
        </Step.Content>
        </Step>
    </Step.Group>
    <Container>
        <p>
        {/* (설명란) */}
        </p>
    </Container>
    </>
    )
  };