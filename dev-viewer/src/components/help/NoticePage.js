import React, { useEffect, useState, useReducer } from "react";
import * as api from '../../rest/api'
import axios from 'axios';
import { Link, withRouter } from "react-router-dom";
import { Table, Icon, Label, Button, Input, Header, Pagination } from 'semantic-ui-react';

function NoticePage(props) {

    const [search, setSearch] = useState('');
    const [activePage, setActivePage] = useState(1);
    const categoryList = ['공지사항', '패치노트', '이벤트'];

    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    const role = userInfo ? userInfo.role : null;

    function handlePaginationChange (e, { activePage }) {
        setActivePage(activePage);
    }

    function noticeInfo(targetId) {
        props.history.push('/help/notice/' + targetId);
    }

    return(
    <>
    <Header className="notice-title">
        공지사항
    </Header>
    <div>
        <Input className='notice-search' iconPosition='left' placeholder='공지사항 검색' value={search} onChange={(e) => setSearch(e.target.value)}>
            <Icon className='search-btn' name='search'/>
            <input className='search-input'/>
        </Input>
        {role === 9 &&
        <Button className='notice-add' basic icon onClick={() => props.history.push('/help/notice/write')}>
            <Icon name='plus'/>
        </Button>
        }
    </div>
    <Table unstackable singleLine selectable>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell>타이틀</Table.HeaderCell>
                <Table.HeaderCell className={props.sp ? 'notice-table-sp' : 'notice-table-writer'}>작성자</Table.HeaderCell>
                <Table.HeaderCell className='notice-table-time'>등록일</Table.HeaderCell>
            </Table.Row>
        </Table.Header>

        <Table.Body className='notice-table-body'>
            <Table.Row onClick={() => noticeInfo('1')}>
                <Table.Cell>
                    <Label color='blue' horizontal>{categoryList[1]}</Label>
                    1.0.0 패치노트
                </Table.Cell>
                <Table.Cell className={props.sp ? 'notice-table-sp' : 'notice-table-writer'}>
                    관리자
                </Table.Cell>
                <Table.Cell className='notice-table-time'>
                    2022.03.08
                </Table.Cell>
            </Table.Row>
            <Table.Row onClick={() => noticeInfo('2')}>
                <Table.Cell>
                    <Label color='teal' horizontal>{categoryList[2]}</Label>
                    Pick이 오픈기념 이벤트 초초초특가!
                </Table.Cell>
                <Table.Cell className={props.sp ? 'notice-table-sp' : 'notice-table-writer'}>
                    관리자
                </Table.Cell>
                <Table.Cell className='notice-table-time'>
                    2022.03.08
                </Table.Cell>
            </Table.Row>
            <Table.Row onClick={() => noticeInfo('3')}>
                <Table.Cell>
                    <Label color='purple' horizontal>{categoryList[0]}</Label>
                    Pick이 오픈하였습니다!
                </Table.Cell>
                <Table.Cell className={props.sp ? 'notice-table-sp' : 'notice-table-writer'}>
                    관리자
                </Table.Cell>
                <Table.Cell className='notice-table-time'>
                    2022.03.08
                </Table.Cell>
            </Table.Row>
            <Table.Row onClick={() => noticeInfo('4')}>
                <Table.Cell>
                    <Label color='black' horizontal>{'비공개'}</Label>
                    Pick이 오픈하였습니다!
                </Table.Cell>
                <Table.Cell className={props.sp ? 'notice-table-sp' : 'notice-table-writer'}>
                    관리자
                </Table.Cell>
                <Table.Cell className='notice-table-time'>
                    2022.03.08
                </Table.Cell>
            </Table.Row>
        </Table.Body>
    </Table>
    <div className='notice-pagination'>
        <Pagination pointing secondary
            defaultActivePage={1}
            firstItem={null}
            lastItem={null}
            onPageChange={handlePaginationChange}
            totalPages={3}
        />
    </div>
    </>
    )
  };

  export default withRouter(NoticePage);