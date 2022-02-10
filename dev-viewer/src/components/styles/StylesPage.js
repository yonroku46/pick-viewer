import React, { useEffect, useState, useReducer } from "react";
import { Label, Button, Container, Divider, Grid, Segment, Image, Icon, Loader, Modal } from 'semantic-ui-react'
import * as api from '../../rest/api'
import axios from 'axios';

export default function StylesPage(props) {

    const [consent, setConsent] = useState(false);
    const postCd = '1';

    return(
        <>
        <div className='styles-main'>
            <div className='styles-posts'>
                <Grid columns={1}>
                    <Grid.Column className='styles-post' onClick={() => props.history.push(`/styles/${postCd}`)}>
                        <Segment padded>
                            <Label attached='bottom left'><Icon name='camera'/></Label>
                            <Image src={api.imgRender('images/shop/default.png')}/>
                        </Segment>
                        <Container className='styles-post-contents' textAlign='justified'>
                            <b>Title</b>
                            <Divider/>
                            <p>
                                Test more more more.
                                Pick your best shop. Pick your best shop. Pick your best shop. Pick your best shop. Pick your best shop. Pick your best shop. Pick your best shop. Pick your best shop. Pick your best shop. Pick your best shop. Pick your best shop. Pick your best shop. Pick your best shop. Pick your best shop.
                            </p>
                            <Container className='styles-post-writer' textAlign='right'>{'Right Aligned'}・{'3dayas ago'}</Container>
                        </Container>
                    </Grid.Column>
                    <Grid.Column className='styles-post'>
                        <Segment padded>
                            <Label attached='bottom left'><Icon name='comments'/></Label>
                            <Image src={api.imgRender('images/menu/default.png')}/>
                        </Segment>
                        <Container className='styles-post-contents' textAlign='justified'>
                            <b>Title</b>
                            <Divider/>
                            <p>
                                Test more more more.
                                Pick your best shop.
                            </p>
                            <Container className='styles-post-writer' textAlign='right'>{'Right Aligned'}・{'3dayas ago'}</Container>
                        </Container>
                    </Grid.Column>
                    <Grid.Column className='styles-post'>
                        <Segment padded>
                            <Label attached='bottom left'><Icon name='camera'/></Label>
                            <Image src={api.imgRender('images/user/default.png')}/>
                        </Segment>
                        <Container className='styles-post-contents' textAlign='justified'>
                            <b>Title</b>
                            <Divider/>
                            <p>
                                Test more more more.
                                Pick your best shop.
                            </p>
                            <Container className='styles-post-writer' textAlign='right'>{'Right Aligned'}・{'3dayas ago'}</Container>
                        </Container>
                    </Grid.Column>
                </Grid>
                <div className='styles-content-final-empty'> </div>
            </div>
        </div>
        </>
    )
  };