import React, { useEffect, useState, useReducer } from "react";
import * as api from '../../rest/api'
import axios from 'axios';
import { Container, Header, Step, Icon } from 'semantic-ui-react';

export default function AboutPage(props) {

    return(
    <>
    <h2 className="about-title">
        <Icon name='pinterest'/>Pick
    </h2>
    <Header as='h3' dividing>
        About us
    </Header>
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
        </p>
    </Container>

    <Header as='h3' dividing>
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