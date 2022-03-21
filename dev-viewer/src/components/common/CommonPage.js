import React, { useEffect, useState, useReducer } from "react";
import { Label, Container, Divider, Grid, Segment, Image, Icon } from 'semantic-ui-react'
import * as api from '../../rest/api'
import axios from 'axios';

export default function CommonPage(props) {

    const [consent, setConsent] = useState(false);
    const postCd = '1';

    return(
        <>
        <div className='common-main'>
            <div className='common-posts'>
                <Grid columns={2}>
                    <Grid.Column className='common-post' onClick={() => props.history.push(`/common/${postCd}`)}>
                        <Segment padded>
                            <Label attached='bottom left'><Icon name='camera'/></Label>
                            <Image src={api.imgRender('images/shop/default.png')}/>
                        </Segment>
                        <Container className='common-post-contents' textAlign='justified'>
                            <b>Title</b>
                            <Divider/>
                            <p>
                                Test more more more.
                                Pick your best shop. Pick your best shop. Pick your best shop. Pick your best shop. Pick your best shop. Pick your best shop. Pick your best shop. Pick your best shop. Pick your best shop. Pick your best shop. Pick your best shop. Pick your best shop. Pick your best shop. Pick your best shop.
                            </p>
                            <Container className='common-post-writer' textAlign='right'>{'Right Aligned'}・{'3dayas ago'}</Container>
                        </Container>
                    </Grid.Column>
                    <Grid.Column className='common-post'>
                        <Segment padded>
                            <Label attached='bottom left'><Icon name='comments'/></Label>
                            <Image src={api.imgRender('images/menu/default.png')}/>
                        </Segment>
                        <Container className='common-post-contents' textAlign='justified'>
                            <b>Title</b>
                            <Divider/>
                            <p>
                                Test more more more.
                                Pick your best shop.
                            </p>
                            <Container className='common-post-writer' textAlign='right'>{'Right Aligned'}・{'3dayas ago'}</Container>
                        </Container>
                    </Grid.Column>
                    <Grid.Column className='common-post'>
                        <Segment padded>
                            <Label attached='bottom left'><Icon name='camera'/></Label>
                            <Image src={api.imgRender('images/user/default.png')}/>
                        </Segment>
                        <Container className='common-post-contents' textAlign='justified'>
                            <b>Title</b>
                            <Divider/>
                            <p>
                                Test more more more.
                                Pick your best shop.
                            </p>
                            <Container className='common-post-writer' textAlign='right'>{'Right Aligned'}・{'3dayas ago'}</Container>
                        </Container>
                    </Grid.Column>
                </Grid>
                <div className='common-content-final-empty'> </div>
            </div>
        </div>
        </>
    )
  };