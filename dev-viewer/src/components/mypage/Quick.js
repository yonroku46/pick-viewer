import {useState} from 'react';
import robo from '../../img/robo.png';
import { Icon, Card, Segment, Menu } from 'semantic-ui-react'

export default function Quick() {

    return (
        <>    
        <Segment>
        <Card
            image={robo}
            header='모던미용실'
            meta='커트'
            color='blue'
            description='미용실 메모'
            extra={<a><Icon name='street view'/>최종예약일 : 2020.08.21</a>}
            className='quick-card'
        />
        </Segment>
        <Segment>
        <Card
            image={robo}
            header='모던미용실'
            meta='커트'
            color='blue'
            description='미용실 메모'
            extra={<a><Icon name='street view'/>최종예약일 : 2020.08.21</a>}
            className='quick-card'
        />
        </Segment>
        </>
    );
}