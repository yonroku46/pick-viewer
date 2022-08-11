import React, { useEffect, useState, useReducer } from "react";
import * as api from '../../rest/api'
import axios from 'axios';
import { useParams, Link, withRouter } from "react-router-dom";
import { Icon, Header, Container } from 'semantic-ui-react';
import { Viewer } from '@toast-ui/react-editor';

function NoticeViewer(props) {

    const {noticeCd} = useParams();
    const [notice, setNotice] = useState(null);
    const [loading, setLoading] = useState(true);

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

    return(
    <>
    <div className='notice-main'>
        {!loading && notice && <>
        <div className='notice-contents-background'>
        </div>
        <div className='notice-contents'>
            <Container text fluid>
                <Header as='h1'>
                    {notice.noticeTitle}
                    <Header.Subheader as='h5'>
                        {notice.updateTime}
                    </Header.Subheader>
                </Header>
                <Viewer className='notice-viewer' initialValue={notice.noticeContent}/>
            </Container>
            <Header className='notice-contents-footer' as='h3' icon textAlign='center'>
                <div className='notice-contents-arrow'/>
                <Icon name='paw' circular/>
                <Header.Content>{notice.userName}</Header.Content>
                <Header.Subheader>{notice.userInfo}</Header.Subheader>
            </Header>
        </div>
        </>
        }
    </div>
    </>
    )
  };

  export default withRouter(NoticeViewer);