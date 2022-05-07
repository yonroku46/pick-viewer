import React, { useEffect, useState, useReducer } from "react";
import * as api from '../../rest/api'
import about from '../../img/about.png'
import axios from 'axios';
import { Container, Header, Step, Icon, Grid, Image } from 'semantic-ui-react';

export default function AboutPage(props) {

    return(
    <>
    <Header as='h5' className="about-title">
        <Icon name='angle right'/>About Pick
    </Header>
    <Grid container stackable columns={2} className='about-intro'>
        <Grid.Column>
            <Image src={about}/>
        </Grid.Column>
        <Grid.Column>
            <Container>
                <p>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo
                ligula eget dolor. Aenean massa strong. Cum sociis natoque penatibus et
                magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis,
                ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa
                quis enim.
                </p>
            </Container>
        </Grid.Column>
    </Grid>
    <hr/>
    <Header as='h3'>
        Manage Flow
    </Header>
    <Step.Group widths={3}>
        <Step>
        <Icon name='truck' />
        <Step.Content>
            <Step.Title>Shipping</Step.Title>
        </Step.Content>
        </Step>
        <Step active>
        <Icon name='credit card' />
        <Step.Content>
            <Step.Title>Billing</Step.Title>
        </Step.Content>
        </Step>
        <Step disabled>
        <Icon name='info' />
        <Step.Content>
            <Step.Title>Confirm Order</Step.Title>
        </Step.Content>
        </Step>
    </Step.Group>
    <Container>
        <p>
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo
        ligula eget dolor. Aenean massa strong. Cum sociis natoque penatibus et
        magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis,
        ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa
        quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget,
        arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.
        Nullam dictum felis eu pede link mollis pretium. Integer tincidunt. Cras
        dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.
        Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim.
        </p>
    </Container>
    </>
    )
  };