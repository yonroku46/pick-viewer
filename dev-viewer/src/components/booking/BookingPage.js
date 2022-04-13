import BookingModal from "./BookingModal"
import { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import { Icon, Grid } from 'semantic-ui-react';
import * as api from '../../rest/api'
import axios from 'axios';

export default function BookingPage(props) {
    
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    const userCd = userInfo ? userInfo.userCd : null;
    const {category} = useParams();
    const [favoriteList, setFavoriteList] = useState([]);
    const categoryList = ['hairshop', 'restaurant', 'cafe'];

    if (!categoryList.includes(category)) {
        alert('잘못된 접근입니다.')
        props.history.goBack(1);
    };

    useEffect(() => {
        return new Promise(function(resolve, reject) {
          axios
          .get(api.myFavorites, {
            params: {
              'userCd': userCd
            }
          })
          .then(response => resolve(response.data))
          .catch(error => reject(error.response))
        })
        .then(res => {
          if (res.success) {
              const tmp = [];
              res.dataList.forEach(shop => {
                  tmp.push(shop.shopCd);
              })
              setFavoriteList(tmp);
          }
        })
        .catch(err => {
          alert("현재 서버와의 연결이 원활하지 않습니다. 관리자에게 문의해주세요.");
        })
      }, []); 

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
        {category !== undefined && 
          <BookingModal category={category} favoriteList={favoriteList}/>
        }
    </div>
    </>
    )
  };