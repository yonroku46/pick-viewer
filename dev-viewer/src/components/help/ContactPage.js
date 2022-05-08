import React, { useEffect, useState, useReducer } from "react";
import * as api from '../../rest/api'
import axios from 'axios';
import { Link, withRouter } from "react-router-dom";
import { Form, Checkbox, Button, Select, Icon, Header } from 'semantic-ui-react';

function ContactPage(props) {

    const [consent, setConsent] = useState(false);
    
    const categoryOptions = [
        { key: 's', text: '시스템 에러사항', value: 'system' },
        { key: 'c', text: '영업 문의 / 제안', value: 'contact' },
        { key: 'o', text: '기타', value: 'other' },
    ]

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [category, setCategory] = useState(categoryOptions[0].value);
    const [detail, setDetail] = useState('');

    function handleSubmit() {
        if (name === "" || email === "" || category === "" || detail === "") {
            alert("작성란에 빈칸이 존재합니다.");
            return;
        }
        const params = { 
            'name': name,
            'email': email,
            'category': category,
            'detail': detail
          };
          return new Promise(function(resolve, reject) {
            axios
              .post(api.contact, params)
              .then(response => resolve(response.data))
              .catch(error => reject(error.response))
        })
        .then(data => {
            const result = data.data.result;
            if (result) {
                setName('');
                setEmail('');
                setCategory(categoryOptions[0].value);
                setDetail('');
                alert('전송이 완료되었습니다.');
                props.history.push('/');
            }
        })
        .catch(err => {
            alert('전송에 실패하였습니다. 잠시 후 다시 시도하여 주세요.')
        })
    }

    return(
    <>
    <Header className="contact-title">
        <Icon name='angle right'/>문의페이지
    </Header>
    <Form onSubmit={handleSubmit}>
        <Form.Field>
            <label>성함</label>
            <input onChange={(e) => setName(e.target.value)}/>
        </Form.Field>
        <Form.Field>
            <label>E-Mail</label>
            <input type='email' onChange={(e) => setEmail(e.target.value)}/>
        </Form.Field>
        <Form.Field>
            <Form.Field 
                control={Select} 
                value={category} 
                options={categoryOptions} 
                label={{ children: '카테고리'}}
                placeholder={categoryOptions[0]}
                onChange={(e, { value }) => setCategory(value)}/>
        </Form.Field>
        <Form.TextArea label='상세내용' className="contact-textarea" onChange={(e) => setDetail(e.target.value)}/>
        <Form.Field className="contact-submit">
            <Checkbox value={consent} onChange={() => setConsent(!consent)} label='메일 수신을 위한 개인정보 제공에 동의합니다'/><br/>
            <Button disabled={!consent} secondary type='submit'>전송하기</Button>
        </Form.Field>
    </Form>
    </>
    )
  };

  export default withRouter(ContactPage);