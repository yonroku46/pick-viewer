import React, { useEffect, useState, useRef } from "react";
import * as api from '../../rest/api'
import axios from 'axios';
import { Editor } from '@toast-ui/react-editor';
import { Link, withRouter } from "react-router-dom";
import { Icon, Dropdown, Header, Button, Input, Checkbox } from 'semantic-ui-react';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import '@toast-ui/editor/dist/toastui-editor.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';

function NoticeWritePage(props) {

    const categoryOptions = [
        { key: 'n', text: '공지사항', value: 'notice' },
        { key: 'p', text: '패치노트', value: 'patch' },
        { key: 'e', text: '이벤트', value: 'event' },
    ]
    const [category, setCategory] = useState(categoryOptions[0].value);
    const [title, setTitle] = useState('');
    const [activate, setActivate] = useState(true);
    const editorRef = useRef();

    function noticeSubmit() {
        if (window.confirm(activate ? "본 내용을 저장 및 공개 하시겠습니까?" : "비공개 상태입니다. 본 내용을 저장하시겠습니까?")) {
            const contentHTML = editorRef.current?.getInstance().getHTML();
            const contentMarkDown = editorRef.current?.getInstance().getMarkdown();
            if (category === "" || title === "" || contentHTML === "") {
                alert("미입력된 항목이 존재합니다.");
                return;
            }
            const params = {
                'category': category,
                'title': title,
                'content': contentHTML
              };
              return new Promise(function(resolve, reject) {
                axios
                  .post(api.noticeSave, params)
                  .then(response => resolve(response.data))
                  .catch(error => reject(error.response))
            })
            .then(data => {
                const result = data.data.result;
                if (result.success) {
                    props.history.push('/help/notice/' + result.noticeCd);
                } else {
                    alert('저장에 실패하였습니다. 잠시 후 다시 시도하여 주세요.')
                }
            })
            .catch(err => {
                alert('저장에 실패하였습니다. 잠시 후 다시 시도하여 주세요.')
            })
        } else {
            return;
        }
    };

    return(
    <>
    <div className='notice-main'>
        <div className='notice-editor'>
            <Header as='h4'>
                <Icon name='write square'/>게시글 작성 {!activate && ' (비공개)'}
            </Header>
            <div className='notice-editor-title'>
                <Dropdown 
                    selection
                    className='category'
                    options={categoryOptions} 
                    value={category} 
                    placeholder={categoryOptions[0]}
                    onChange={(e, { value }) => setCategory(value)}/>
                <Input size='small' className='title' placeholder='제목을 입력해주세요.' value={title} onChange={(e, { value }) => setTitle(value)}/>
            </div>
            <Editor
                ref={editorRef}
                placeholder="내용을 입력해주세요."
                previewStyle="vertical"
                height="540px"
                initialEditType="wysiwyg" // 초기 입력모드 설정(디폴트 markdown)
                plugins={[colorSyntax]}
                toolbarItems={[
                    ['heading', 'bold', 'italic', 'strike'],
                    ['hr', 'quote'],
                    ['ul', 'ol', 'task', 'indent', 'outdent'],
                    ['table', 'image', 'link'],
                    ['code', 'codeblock']
                ]}
            />
            <div className='notice-editor-bottom'>
                <Button secondary className='submit' onClick={noticeSubmit}>저장</Button>
                <Checkbox label={activate ? <Icon size='large' name='eye'/> : <Icon size='large' name='eye slash'/>} checked={activate} onChange={(e, { checked }) => setActivate(checked)}/>
            </div>
        </div>
    </div>
    </>
    )
  };

  export default withRouter(NoticeWritePage);