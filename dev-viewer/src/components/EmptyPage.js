import { Image, Button, Icon } from 'semantic-ui-react';
import err from '../img/404error.jpg'

export default function Empty(props) {

  return(
    <>
    <div className="empty-main">
      <Image src={err} style={{margin:'auto'}}/>
      <Button className='empty-back-btn' inverted color='red' onClick={() => props.history.goBack(1)}>
        <Icon name='angle double left'/>
        이전 페이지로
      </Button>
    </div>
    </>
    )
  };