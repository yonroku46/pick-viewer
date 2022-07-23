import React, { useEffect, useState, useRef } from "react";
import * as api from '../../rest/api'
import axios from 'axios';
import { Editor } from '@toast-ui/react-editor';
import { Link, withRouter } from "react-router-dom";
import { Table, Icon, Header, Button, Input } from 'semantic-ui-react';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import '@toast-ui/editor/dist/toastui-editor.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';

function NoticeWritePage(props) {

    const editorRef = useRef();

    const handleRegisterButton = () => {
        // 입력창에 입력한 내용을 HTML 태그 형태로 취득
        console.log(editorRef.current?.getInstance().getHTML());
        // 입력창에 입력한 내용을 MarkDown 형태로 취득
        console.log(editorRef.current?.getInstance().getMarkdown());
      };

    return(
    <>
    <div className='notice-main'>
        <div className='notice-editor'>
            <Header as='h2' className='header'>게시글 작성</Header>
            <Input className='title' size='small' placeholder='제목을 입력해주세요.'/>
            <Editor
                ref={editorRef}
                placeholder="내용을 입력해주세요."
                previewStyle="vertical"
                height="580px"
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
            <Button primary className='submit' onClick={handleRegisterButton}>저장</Button>
        </div>
    </div>
    <script src="ckeditor/ckeditor.js"></script>
    </>
    )
  };

  export default withRouter(NoticeWritePage);