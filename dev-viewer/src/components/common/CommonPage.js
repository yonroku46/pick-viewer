import React, { useEffect, useState, useReducer } from "react";
import { Label, Container, Divider, Grid, Segment, Image, Icon } from 'semantic-ui-react'
import StackGrid from 'react-stack-grid';
import * as api from '../../rest/api'
import axios from 'axios';

export default function CommonPage(props) {

    const [consent, setConsent] = useState(false);
    const [sp, setSp] = useState(false);
    const postCd = '1';

    useEffect(() => {
        setSp(window.innerWidth < 767);
    }, [window.innerWidth])

    return(
        <>
        <div className='common-main'>
            <div className='common-posts'>
                <StackGrid columnWidth={sp ? 360 : 260} gutterWidth={10} gutterHeight={10}>
                    <figure>
                        <img src='http://localhost:3000/images/menu/1/1.png'/>
                        <figcaption>image1</figcaption>
                    </figure>
                    <figure>
                        <img src='http://localhost:3000/images/menu/1/2.png'/>
                        <figcaption>image4</figcaption>
                    </figure>
                    <figure>
                        <img src='http://localhost:3000/images/shop/default.png'/>
                        <figcaption>image2</figcaption>
                    </figure>
                    <figure>
                        <img src='http://localhost:3000/images/menu/default.png'/>
                        <figcaption>image3</figcaption>
                    </figure>
                    <figure>
                        <img src='http://localhost:3000/images/menu/1/1.png'/>
                        <figcaption>image1</figcaption>
                    </figure>
                    <figure>
                        <img src='http://localhost:3000/images/menu/1/2.png'/>
                        <figcaption>image4</figcaption>
                    </figure>
                    <figure>
                        <img src='http://localhost:3000/images/shop/default.png'/>
                        <figcaption>image2</figcaption>
                    </figure>
                    <figure>
                        <img src='http://localhost:3000/images/menu/default.png'/>
                        <figcaption>image3</figcaption>
                    </figure>
                </StackGrid>
                <div className='common-content-final-empty'> </div>
            </div>
        </div>
        </>
    )
  };