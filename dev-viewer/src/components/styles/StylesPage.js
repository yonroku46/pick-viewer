import { Dimmer, Button, List, Item, Grid, Segment, Image, Icon, Loader, Modal } from 'semantic-ui-react'
import * as api from '../../rest/server'
import axios from 'axios';

export default function StylesPage() {
    return(
    <>
    <div className="styles-main">
        <h2>styles page</h2>
        <Item.Group unstackable className='detailpage-service-menu'>
        <Item className='detailpage-service'>
            <Item.Image className='detailpage-service-img' src={api.imgRender('images/shop/default.png')}/>
        </Item>
        </Item.Group>
    </div>
    </>
    )
  };