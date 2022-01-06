import ShopModal from "./ShopModal"
import { useParams, Link } from "react-router-dom";
import { Menu, Input, Dimmer, Loader, Icon, Grid } from 'semantic-ui-react';

export default function BookingPage(props) {
    const {category} = useParams();
    const categoryList = ['hairshop', 'restaurant', 'cafe'];
    
    // category check
    if (!categoryList.includes(category)) {
        if (category === undefined) {
            props.history.push('/booking/hairshop')
        } else {
            alert('존재하지 않는 카테고리입니다.')
            props.history.goBack(1);
        }
    };

    return(
    <>
    <div className="booking-main">
        <div className="booking-main-category">
            <Grid columns={3} divided>
                <Grid.Row>
                    <Grid.Column onClick={() => {props.history.push('/booking/' + categoryList[0])}} className={category === categoryList[0] ? 'category-active' : 'category-non-active'}>
                        <Icon name='cut' size='big'/>
                        <br/>헤어샵
                    </Grid.Column>
                    <Grid.Column onClick={() => {props.history.push('/booking/' + categoryList[1])}} className={category === categoryList[1] ? 'category-active' : 'category-non-active'}>
                        <Icon name='food' size='big'/>
                        <br/>맛집
                    </Grid.Column>
                    <Grid.Column onClick={() => {props.history.push('/booking/' + categoryList[2])}} className={category === categoryList[2] ? 'category-active' : 'category-non-active'}>
                        <Icon name='coffee' size='big'/>
                        <br/>카페
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
        {category !== undefined && <ShopModal category={category}/>}
    </div>
    </>
    )
  };