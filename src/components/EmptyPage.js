import { Image, Button, Icon } from 'semantic-ui-react';
import err from '../img/404error.png'

export default function Empty(props) {

  return(
    <>
    <div className="empty-main">
      <Image className='empty-main-img' src={err}/>
      <Button className='empty-home-btn' color='black' onClick={() => props.history.push("/")}>
        <Icon name='home'/>
        홈으로
      </Button>
      <Button className='empty-back-btn' color='grey' onClick={() => props.history.goBack(1)}>
        <Icon name='angle double left'/>
        이전 페이지로
      </Button>
    </div>
    </>
    )
  };