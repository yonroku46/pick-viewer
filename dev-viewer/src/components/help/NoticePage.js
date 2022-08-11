import React, { useEffect, useState, useReducer } from "react";
import * as api from '../../rest/api'
import axios from 'axios';
import { Link, withRouter } from "react-router-dom";
import { Table, Icon, Label, Button, Input, Header, Pagination } from 'semantic-ui-react';

function NoticePage(props) {

    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    const role = userInfo ? userInfo.role : null;

    const [search, setSearch] = useState('');
    const [activePage, setActivePage] = useState(1);
    const [noticeList, setNoticeList] = useState([]);
    const [loading, setLoading] = useState(true);
    const categoryList = {
        notice: '공 지',
        patch: '패 치',
        event: '이벤트'
    };
    const categoryColor = {
        notice: 'blue',
        patch: 'teal',
        event: 'purple'
    };

    useEffect(() => {
        return new Promise(function(resolve, reject) {
          axios
            .get(api.noticeList)
            .then(response => resolve(response.data))
            .catch(error => reject(error.response))
        })
        .then(res => {
          if (res.success) {
            setNoticeList(res.dataList);
          }
          setLoading(false);
        })
        .catch(err => {
          alert("현재 공지사항을 불러올 수 없습니다. 지속시 문의 바랍니다.");
          setLoading(false);
        })
      }, [])

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
                <Table.HeaderCell className='notice-table-time'>등록일</Table.HeaderCell>
            </Table.Row>
        </Table.Header>

        <Table.Body className='notice-table-body'>
            {noticeList.map(notice => 
            <Table.Row onClick={() => noticeInfo(notice.noticeCd)}>
                <Table.Cell>
                    <Label color={notice.activeFlag ? categoryColor[notice.category] : 'black'} horizontal>
                        {notice.activeFlag ? categoryList[notice.category] : '비공개'}
                    </Label>
                    {notice.noticeTitle}
                </Table.Cell>
                <Table.Cell className='notice-table-time'>
                    {notice.updateTime}
                </Table.Cell>
            </Table.Row>
            )}
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