import React, { useEffect, useState, useReducer } from "react";
import * as api from '../../rest/api'
import axios from 'axios';
import { Link, withRouter } from "react-router-dom";
import { Table, Icon, Label, Button, Input, Header, Container } from 'semantic-ui-react';

function NoticeDetail(props) {

    return(
    <>
    <div className='notice-main'>
        <div className='notice-contents-background'>
        </div>
        <div className='notice-contents'>
            <Container text>
                <Header as='h1'>
                    컨텐츠 헤더 테스트입니다
                    <Header.Subheader as='h5'>
                        2022.05.31
                    </Header.Subheader>
                </Header>
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
                Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus
                viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet.
                Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi.
                </p>
                <Table celled structured unstackable>
                    <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell rowSpan='2'>Name</Table.HeaderCell>
                        <Table.HeaderCell rowSpan='2'>Type</Table.HeaderCell>
                        <Table.HeaderCell rowSpan='2'>Files</Table.HeaderCell>
                        <Table.HeaderCell colSpan='3'>Languages</Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell>Ruby</Table.HeaderCell>
                        <Table.HeaderCell>JavaScript</Table.HeaderCell>
                        <Table.HeaderCell>Python</Table.HeaderCell>
                    </Table.Row>
                    </Table.Header>

                    <Table.Body>
                    <Table.Row>
                        <Table.Cell>Alpha Team</Table.Cell>
                        <Table.Cell>Project 1</Table.Cell>
                        <Table.Cell textAlign='right'>2</Table.Cell>
                        <Table.Cell textAlign='center'>
                        <Icon color='green' name='checkmark' size='large' />
                        </Table.Cell>
                        <Table.Cell />
                        <Table.Cell />
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell rowSpan='3'>Beta Team</Table.Cell>
                        <Table.Cell>Project 1</Table.Cell>
                        <Table.Cell textAlign='right'>52</Table.Cell>
                        <Table.Cell textAlign='center'>
                        <Icon color='green' name='checkmark' size='large' />
                        </Table.Cell>
                        <Table.Cell />
                        <Table.Cell />
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>Project 2</Table.Cell>
                        <Table.Cell textAlign='right'>12</Table.Cell>
                        <Table.Cell />
                        <Table.Cell textAlign='center'>
                        <Icon color='green' name='checkmark' size='large' />
                        </Table.Cell>
                        <Table.Cell />
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>Project 3</Table.Cell>
                        <Table.Cell textAlign='right'>21</Table.Cell>
                        <Table.Cell textAlign='center'>
                        <Icon color='green' name='checkmark' size='large' />
                        </Table.Cell>
                        <Table.Cell />
                        <Table.Cell />
                    </Table.Row>
                    </Table.Body>
                </Table>

            </Container>
            <Header className='notice-contents-footer' as='h3' icon textAlign='center'>
                <Icon name='paw' circular/>
                <Header.Content>관리자1</Header.Content>
                <Header.Subheader>자기소개</Header.Subheader>
            </Header>
        </div>
    </div>
    </>
    )
  };

  export default withRouter(NoticeDetail);