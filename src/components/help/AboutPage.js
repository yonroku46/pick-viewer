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
                </p>
            </Container>
        </Grid.Column>
    </Grid>
    <hr/>
    <Header className='about-title'>
        Guide
    </Header>
    <Step.Group widths={1}>
        <Step>
        <Icon name='search'/>
        <Step.Content>
            <Step.Title>매장찾기 & 예약신청</Step.Title>
            <Step.Description>프로모션 예정일을 노려보는것도 꿀팁</Step.Description>
        </Step.Content>
        </Step>
    </Step.Group>
    <Container>
        <p>
        {/* (설명란) */}
        </p>
    </Container>
    <Icon name='caret down' size='big' className='down-icon'/>
    <Step.Group widths={1}>
        <Step>
        <Icon name='calendar check outline'/>
        <Step.Content>
            <Step.Title>스케쥴 확인</Step.Title>
            <Step.Description>예약완료와 동시에 스케쥴 확정! 매장과 바로바로 연락!</Step.Description>
        </Step.Content>
        </Step>
    </Step.Group>
    <Container>
        <p>
        {/* (설명란) */}
        </p>
    </Container>
    <Icon name='caret down' size='big' className='down-icon'/>
    <Step.Group widths={1}>
        <Step>
        <Icon name='smile outline'/>
        <Step.Content>
            <Step.Title>방문 및 후기작성</Step.Title>
            <Step.Description>후기를 남겨 매장을 응원하고, 모두와 정보를 공유!</Step.Description>
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