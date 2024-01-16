import React, { useEffect, useState, useReducer } from "react";
import { useParams, Link } from "react-router-dom";
import { Label, Button, Container, Divider, Grid, Segment, Image, Icon, Loader, Modal } from 'semantic-ui-react'
import * as api from '../../rest/api'
import axios from 'axios';

export default function PostPage(props) {

    const {post_cd} = useParams();

    useEffect(() => {
        console.log(post_cd);
    }, [])

    return(
        <>
        <div className='post-main'>
            {post_cd}
        </div>
        </>
    )
  };