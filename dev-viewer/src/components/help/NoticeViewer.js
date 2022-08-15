import React, { useEffect, useState, useReducer } from "react";
import * as api from '../../rest/api'
import axios from 'axios';
import { useParams, Link, withRouter } from "react-router-dom";
import { Icon, Header, Container, Button } from 'semantic-ui-react';
import { Viewer } from '@toast-ui/react-editor';

function NoticeViewer(props) {

    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    const role = userInfo ? userInfo.role : null;

    const {noticeCd} = useParams();
    const [notice, setNotice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [edit, setEdit] = useState(role == 9);

    useEffect(() => {
        return new Promise(function(resolve, reject) {
          axios
            .get(api.noticeInfo, {
                params: {
                    'noticeCd': noticeCd
                }
              })
            .then(response => resolve(response.data))
            .catch(error => reject(error.response))
        })
        .then(res => {
          if (res.success) {
            setNotice(res.data);
          }
          setLoading(false);
        })
        .catch(err => {
            alert("잘못된 접근입니다.")
            props.history.goBack(1);
        })
      }, [])

    function activeClick() {
      if (window.confirm(notice.activeFlag ? "본 게시물을 비공개로 변경하시겠습니까?" : "본 게시물을 공개로 변경하시겠습니까?")) {
        const params = {
            'noticeCd': notice.noticeCd,
            'activeFlag': notice.activeFlag ? 0 : 1
          };
          return new Promise(function(resolve, reject) {
            axios
              .post(api.noticeEditActive, params)
              .then(response => resolve(response.data))
              .catch(error => reject(error.response))
        })
        .then(data => {
          const result = data.data.result;
          if (result) {
            alert('변경이 완료되었습니다.')
            props.history.goBack(1);
          } else {
            alert('변경에 실패하였습니다. 잠시 후 다시 시도하여 주세요.')
          }
        })
        .catch(err => {
            alert('변경에 실패하였습니다. 잠시 후 다시 시도하여 주세요.')
        })
      } else {
          return;
      }
    }

    function editClick() {
      console.log(api.noticeEdit);
    }

    function deleteClick() {
      if (window.confirm("본 게시물을 삭제 하시겠습니까?")) {
        const params = {
            'noticeCd': notice.noticeCd
          };
          return new Promise(function(resolve, reject) {
            axios
              .post(api.noticeDelete, params)
              .then(response => resolve(response.data))
              .catch(error => reject(error.response))
        })
        .then(res => {
            if (res.success) {
              alert('삭제가 완료되었습니다.')
              props.history.goBack(1);
            } else {
              alert('삭제에 실패하였습니다. 잠시 후 다시 시도하여 주세요.')
            }
        })
        .catch(err => {
            alert('삭제에 실패하였습니다. 잠시 후 다시 시도하여 주세요.')
        })
      } else {
          return;
      }
    }

    return(
    <>
    <div className='notice-main'>
        {!loading && notice && <>
        <div className='notice-contents-background'>
          <div className={edit ? 'notice-contents-title-edit' : 'notice-contents-title'}>
            {edit && 
            <>
              <Button basic icon={notice.activeFlag ? 'eye' : 'eye slash'} onClick={activeClick}/>
              <Button basic icon='edit' onClick={editClick}/>
              <Button basic icon='trash' onClick={deleteClick}/>
            </>
            }
            <Container text fluid>
              <Header as='h1'>
                {notice.noticeTitle}
                <Header.Subheader as='h5'>
                    {notice.updateTime}
                </Header.Subheader>
              </Header>
            </Container>
          </div>
        </div>
        <div className='notice-contents'>
          <Viewer className='notice-viewer' initialValue={notice.noticeContent}/>
        </div>
        <Header className='notice-contents-footer' as='h3' icon textAlign='center'>
          <div className='notice-contents-arrow'/>
          <Icon name='paw' circular/>
          <Header.Content>{notice.userName}</Header.Content>
          <Header.Subheader>{notice.userInfo}</Header.Subheader>
        </Header>
        </>
        }
    </div>
    </>
    )
  };

  export default withRouter(NoticeViewer);