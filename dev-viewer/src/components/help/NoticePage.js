import React, { useEffect, useState, useReducer } from "react";
import * as api from '../../rest/api'
import axios from 'axios';
import { Table, Icon, Label } from 'semantic-ui-react';

export default function NoticePage(props) {

    const categoryList = ['공지사항', '패치노트', '이벤트']

    return(
    <>
    <div className="notice-main">
        <h2 className="notice-title">
            <Icon name='thumbtack'/>공지사항
        </h2>
        <Table singleLine selectable>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>타이틀</Table.HeaderCell>
                    <Table.HeaderCell className='notice-table-writer'>작성자</Table.HeaderCell>
                    <Table.HeaderCell className='notice-table-time'>등록일</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                <Table.Row>
                    <Table.Cell>
                        <Label color='blue' horizontal>{categoryList[1]}</Label>
                        1.0.0 패치노트
                    </Table.Cell>
                    <Table.Cell className='notice-table-writer'>
                        관리자
                    </Table.Cell>
                    <Table.Cell className='notice-table-time'>
                        2022.03.08
                    </Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell>
                        <Label color='teal' horizontal>{categoryList[2]}</Label>
                        Pick이 오픈기념 이벤트
                    </Table.Cell>
                    <Table.Cell className='notice-table-writer'>
                        관리자
                    </Table.Cell>
                    <Table.Cell className='notice-table-writer'>
                        2022.03.08
                    </Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell>
                        <Label color='purple' horizontal>{categoryList[0]}</Label>
                        Pick이 오픈하였습니다!
                    </Table.Cell>
                    <Table.Cell className='notice-table-writer'>
                        관리자
                    </Table.Cell>
                    <Table.Cell className='notice-table-writer'>
                        2022.03.08
                    </Table.Cell>
                </Table.Row>
            </Table.Body>
        </Table>
    </div>
    </>
    )
  };