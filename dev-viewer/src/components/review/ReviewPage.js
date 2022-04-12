import { useEffect, useState, useReducer } from "react";
import { useParams, Link } from "react-router-dom";
import { Dimmer, Button, Comment, Label, Segment, Image, Icon, Loader, Form, Statistic, Rating, Modal } from 'semantic-ui-react'
import MapContainer from "../public/MapContainer";
import * as api from '../../rest/api';
import axios from 'axios';
import Slider from "react-slick";
import { Link as Scroll } from "react-scroll";

export default function ReviewPage(props) {
  const isAuthorized = sessionStorage.getItem("isAuthorized");

  const [reload, setReload] = useState(0);

  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  const favorites = JSON.parse(sessionStorage.getItem('favorites'));
  const user_cd = userInfo ? userInfo.user_cd : null;
  const role = userInfo ? userInfo.role : null;

  // 공통 default
  const shopDefault = 'images/shop/default.png';
  const userimgDefault =  'images/user/default.png';
  
  const [shop, setShop] = useState([]);
  const [isStaff, setIsStaff] = useState(false);
  const {shop_cd} = useParams();
  const category = (props.location.pathname).split('/')[2];
  const [shopImages, setShopImages] = useState([]);

  const [comment, setComment] = useState('');
  const [reviewList, setReviewList] = useState([]);
  const [targetReview, setTargetReview] = useState(null);
  const [targetReply, setTargetReply] = useState(null);
  const [ratings, setRatings] = useState(4);
  const [sendLoading, setSendLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  const [isFavorite, setIsFavorite] = useState(false);
  const [clickFavorite, setClickFavorite] = useState(false);
  const [mapOpen, setMapOpen] = useState(false)

  useEffect(() => {
    if (favorites) {
      favoriteJudge();
    }
    const params = { 
      'shop_cd': shop_cd,
      'role': role
    };
    return new Promise(function(resolve, reject) {
      axios
        .post(api.shopInfo, params)
        .then(response => resolve(response.data))
        .catch(error => reject(error.response))
    })
    .then(res => {
      if (res !== null) {
        setShop(res);
        staffJudge(res);
        getReviewList(res.shop_cd);
        makeImageList(res.shop_img);
      }
    })
    .catch(err => {
      alert("현재 서버와의 연결이 원활하지 않습니다. 관리자에게 문의해주세요.");
    })
  }, [reload])

  function makeImageList(shop_img) {
    const result = [];
    for (let index = 0; index < 4; index++) {
        result.push(shop_img[index] ? shop_img[index] : shopDefault);
      }
      setShopImages(result);
  }

  function staffJudge(res) {
    let staffList = [];
    if (res.staff_list != null) {
      for (let staff of res.staff_list) {
        staffList.push(staff.user_cd);
      }
      setIsStaff(staffList.indexOf(user_cd) !== -1);
    } else {
      return;
    }
  }

  function getReviewList(shop_cd) {
    setReviewLoading(true);
    return new Promise(function(resolve, reject) {
      axios
        .get(api.reviewList, {
          params: {
            'shop_cd': shop_cd
          }
        })
        .then(response => resolve(response.data))
        .catch(error => reject(error.response))
    })
    .then(res => {
      if (res !== null) {
        setReviewList(res);
        setReviewLoading(false);
      }
    })
    .catch(err => {
      alert("현재 서버와의 연결이 원활하지 않습니다. 관리자에게 문의해주세요.");
      setReviewLoading(false);
    })
  }

  function sendReview() {
    if (comment.length <= 0) {
      alert("리뷰 길이가 너무 짧습니다.");
      return;
    } else if (300 < comment.length) {
      alert("리뷰 글자수가 너무 많습니다. (최대 300자)");
      return;
    }

    const params = {
      'isStaff': isStaff,
      'user_cd': user_cd,
      'shop_cd': shop_cd,
      'review_text': comment
    };

    if (isStaff) {
      if (targetReply === null) {
        alert("답글을 남길 상대가 지정되지 않았습니다.");
        return
      } else {
        params.review_reply = targetReply.review_cd;
      }
    } else {
      params.ratings = ratings;
    }

    setSendLoading(true);
    
    return new Promise(function(resolve, reject) {
      axios
        .post(api.sendReview, params)
        .then(response => resolve(response.data))
        .catch(error => reject(error.response))
    })
    .then(res => {
      if (res) {
        alert("리뷰가 작성되었습니다.");
        setReload(reload + 1);
        setComment('');
      } else {
        alert("리뷰 작성에 실패하였습니다. 지속시 관리자에게 문의해주세요.");
      }
      setSendLoading(false);
    })
    .catch(err => {
      alert("현재 서버와의 연결이 원활하지 않습니다. 관리자에게 문의해주세요.");
      setSendLoading(false);
    })
  }

  function deleteReview(review_cd) {
    setSendLoading(true);

    const params = { 
      'user_cd': user_cd,
      'shop_cd': shop_cd,
      'review_cd': review_cd
    };
    return new Promise(function(resolve, reject) {
      axios
        .post(api.deleteReview, params)
        .then(response => resolve(response.data))
        .catch(error => reject(error.response))
    })
    .then(res => {
      if (res) {
        alert("리뷰 삭제가 완료되었습니다.");
        dispatch({ type: 'close' });
        setReload(reload + 1);
      } else {
        alert("리뷰 삭제에 실패하였습니다. 지속시 관리자에게 문의해주세요.");
      }
      setSendLoading(false);
    })
    .catch(err => {
      alert("현재 서버와의 연결이 원활하지 않습니다. 관리자에게 문의해주세요.");
      setSendLoading(false);
    })
  }

  function commentInput(e) {
    setComment(e.target.value);
  }

  function handleRate(e, { rating, maxRating }) {
    setRatings(rating);
  }

  function clickReply(targetId) {
    const reply = reviewList.find(review => review.review_cd === targetId);
    setTargetReply(reply);
  }

  function mypostJudge(viewer) {
    return viewer === user_cd;
  }

  function reviewEdit(targetId) {
    dispatch({ type: 'open', size: 'tiny' });
    setTargetReview(targetId);
  }

  function mapToogle() {
    setMapOpen(!mapOpen);
  }

  const [state, dispatch] = useReducer(deleteModal, {
    open: false,
    size: undefined,
  })
  const { open, size } = state;

  function deleteModal(state, action) {
    switch (action.type) {
      case 'close':
        return { open: false }
      case 'open':
        return { open: true, size: action.size }
      default:
        throw new Error('Unsupported action')
    }
  }

  function favorite() {
    if (clickFavorite === true) {
      return;
    }
    if (user_cd === null) {
      alert('로그인이 필요합니다');
      return;
    }
    setClickFavorite(true);
    const params = { 
      'user_cd': user_cd,
      'shop_cd': shop_cd,
      'isFavorite': isFavorite
    };
    return new Promise(function(resolve, reject) {
      axios
        .post(api.favorite, params)
        .then(response => resolve(response.data))
        .catch(error => reject(error.response))
    })
    .then(data => {
      setIsFavorite(data);
      if (data) {
        shop.favorite_num = shop.favorite_num + 1;
        setShop(shop)
      } else {
        shop.favorite_num = shop.favorite_num - 1;
        setShop(shop)
      }
      getFavorite(user_cd);
    })
  }

  function getFavorite(user_cd) {
    const params = { 
      'user_cd': user_cd
    };
    return new Promise(function(resolve, reject) {
      axios
        .post(api.getFavorite, params)
        .then(response => resolve(response.data))
        .catch(error => reject(error.response))
    })
    .then(data => {
      sessionStorage.setItem('favorites', JSON.stringify(data));
      setClickFavorite(false);
    })
  }

  function favoriteJudge() {
    favorites.map(favorite => {
      if (shop_cd === String(favorite.shop_cd)) {
        setIsFavorite(true);
        return;
      }
    })
  }

  function timeForToday(value) {
    const today = new Date();
    const timeValue = new Date(value);
    timeValue.setHours(timeValue.getHours() - 9)
    
    const betweenTime = Math.floor((today.getTime() - timeValue.getTime()) / 1000 / 60);
    
    if (betweenTime < 1) {
      return '방금전';
    }
    if (betweenTime < 60) {
      return `${betweenTime}분 전`;
    }

    const betweenTimeHour = Math.floor(betweenTime / 60);
    if (betweenTimeHour < 24) {
      return `${betweenTimeHour}시간 전`;
    }

    const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
    if (betweenTimeDay < 31) {
      return `${betweenTimeDay}일 전`;
    }

    const betweenTimeMonth = Math.floor(betweenTime / 60 / 24 / 30);
    if (betweenTimeMonth < 13) {
      return `${betweenTimeMonth}개월 전`;
    }

    return `${Math.floor(betweenTimeDay / 365)}년 전`;
  }

  function comma(number) {
    let num = number + ""; 
    let point = num.length % 3 ;
    let len = num.length; 
   
    let result = num.substring(0, point); 
    while (point < len) { 
        if (result !== "") result += ","; 
        result += num.substring(point, point + 3); 
        point += 3; 
    } 
    return result;
  }

  const settings = {
    dots: true,
    infinite: true,
    arrows: true,
    speed: 500,
    slidesToScroll: 1,
    nextArrow: <Icon name='angle right'/>,
    prevArrow: <Icon name='angle left'/>
  };

  return (
    <div className='detail-main'>
      <div className='detail-content'>
        {reviewLoading  &&
          <Dimmer active inverted>
            <Loader size='large'/>
          </Dimmer>
        }
        {shop.length === 0 &&
          <Dimmer active inverted>
            <Loader size='large'/>
          </Dimmer>
        }

        {/* 샵 이미지 탭 */}
        <Segment className="detailpage-main-image" placeholder>
          <Slider {...settings}>
            {shopImages.map(img =>
              <Image src={api.imgRender(img)}/>
            )}
          </Slider>
        </Segment>

        {/* 샵 정보 탭 */}
        <Segment className='detailpage-main'>
          <p className='detailpage-name'>{shop.shop_name}
            <span className='detailpage-call'>
              <a href={`tel:${shop.shop_tel}`}><Icon name='phone square'/></a>
            </span>
            <span className='detailpage-review'>
              <Link to={`/booking/${category}/${shop_cd}`}>
                <Button className='detailpage-link-btn' color='violet'>예약하기 <Icon name='angle double right'/></Button>
              </Link>
            </span>
          </p>
          <p className='detailpage-time'><Icon name='clock outline'/>{shop.shop_open}~{shop.shop_close}</p>
          <p className='detailpage-info'><Icon name='list alternate outline'/>{shop.shop_info}</p>
          <p className='detailpage-location'><Icon name='map outline'/>{shop.shop_location} 
            <Scroll className='detailpage-icon' to='map' offset={-56} spy={true} smooth={true}>
              <Icon id='map' onClick={mapToogle} name={mapOpen ? 'angle up' : 'angle down'}/>
            </Scroll>
          </p>
          {mapOpen && 
            (shop.location_lat === 0 && shop.location_lng === 0
            ? <h4 className='detailpage-location-empty'>위치정보 미등록 매장입니다</h4>
            : <MapContainer shop={shop}/>
            )
          }
        </Segment>

        {/* 리뷰 정보 탭*/}
        <Segment className='review-info'>
          <Statistic.Group size='mini' widths='three' inverted>
            <Statistic>
              <Statistic.Value className='review-tab-icon' onClick={favorite}><Icon name={isFavorite ? 'like' : 'like outline'}/> {shop.favorite_num === undefined ? 0 : comma(shop.favorite_num)}</Statistic.Value>
              <Statistic.Label>즐겨찾기</Statistic.Label>
            </Statistic>
            <Statistic>
              <Statistic.Value><Icon name='comments outline'/> {shop.review_num === undefined ? 0 : comma(shop.review_num)}</Statistic.Value>
              <Statistic.Label>총 리뷰수</Statistic.Label>
            </Statistic>
            <Statistic>
              <Statistic.Value><Icon name='star outline'/> {shop.ratings_ave}</Statistic.Value>
              <Statistic.Label>만족도</Statistic.Label>
            </Statistic>
          </Statistic.Group>
        </Segment>
        
        {/* 리뷰 탭 */}
        {/* 0. 아직 댓글 없음 */}
        {reviewList.length === 0 &&
        <div className='review-no-comment'>
          <Icon name='comment alternate' size='huge'/>
          <h4>아직 댓글이 없습니다</h4>
        </div>
        }
        <Comment.Group className='review-comment-area'>
          {reviewList.map(review => (
            review.reply_list.length === 0 ?
            <>
            {/* 1. 댓글 없는 리뷰 */}
            {review.user_name !== null ?
            <Comment className='review-style'>
              <Comment.Avatar src={api.imgRender(review.user_img === null ? userimgDefault : review.user_img)}/>
              <Comment.Content>
                <Rating icon='star' defaultRating={review.ratings} maxRating={5} size='mini' disabled/><br/>
                <Comment.Author as='a'>{review.user_name}</Comment.Author>
                <Comment.Metadata>{timeForToday(review.review_time)}</Comment.Metadata>
                {mypostJudge(review.user_cd) && 
                  <Label className='review-comment-label-setting' onClick={() => reviewEdit(review.review_cd)}>
                    <Icon name='ellipsis vertical'/>
                  </Label>
                }
                <Comment.Text className='review-comment-text'>
                  {review.review_text}
                </Comment.Text>
                {isStaff && 
                <Scroll to='reply' spy={true} smooth={true}>
                  <Comment.Actions onClick={() => clickReply(review.review_cd)}>
                    <Comment.Action>답글달기</Comment.Action>
                  </Comment.Actions>
                </Scroll>
                }
              </Comment.Content>
            </Comment>
            :
            // 1_1. 삭제된 댓글 알림표시
            <Comment className='review-style-deleted'>
              <Comment.Content>
                <p>{review.review_text}</p>
              </Comment.Content>
            </Comment>
            }
            </>
            :
            <>
            {/* 2. 댓글 있는 리뷰 */}
            {review.user_name !== null ?
            <Comment className='review-style'>
              <Comment.Avatar src={api.imgRender(review.user_img === null ? userimgDefault : review.user_img)}/>
              <Comment.Content>
                <Rating icon='star' defaultRating={review.ratings} maxRating={5} size='mini' disabled/><br/>
                <Comment.Author as='a'>{review.user_name}</Comment.Author>
                <Comment.Metadata>{timeForToday(review.review_time)}</Comment.Metadata>
                {mypostJudge(review.user_cd) && 
                  <Label className='review-comment-label-setting' onClick={() => reviewEdit(review.review_cd)}>
                    <Icon name='ellipsis vertical'/>
                  </Label>
                }
                <Comment.Text className='review-comment-text'>
                  {review.review_text}
                </Comment.Text>
                {isStaff && 
                <Scroll to='reply' spy={true} smooth={true}>
                  <Comment.Actions onClick={() => clickReply(review.review_cd)}>
                    <Comment.Action>답글달기</Comment.Action>
                  </Comment.Actions>
                </Scroll>
                }
              </Comment.Content>

              {/* 3. 리뷰 대댓글 */}
              <div className='reply-style-top'>
              {review.reply_list.map(reply => (
                reply.user_name !== null ?
                <Comment.Group className='reply-style-outline'>
                  <Comment className='reply-style'>
                    <Comment.Avatar src={api.imgRender(reply.user_img === null ? userimgDefault : reply.user_img)}/>
                    <Comment.Content>
                      <Comment.Author as='a'>{reply.user_name}</Comment.Author>
                      <Label className='review-comment-label' color='violet' size='mini' horizontal>STAFF</Label>
                      <Comment.Metadata>{timeForToday(reply.review_time)}</Comment.Metadata>
                      {mypostJudge(reply.user_cd) && 
                        <Label className='review-comment-label-setting' onClick={() => reviewEdit(reply.review_cd)}>
                          <Icon name='ellipsis vertical'/>
                        </Label>
                      }
                      <Comment.Text className='review-comment-text'>
                        {reply.review_text}
                      </Comment.Text>
                    </Comment.Content>
                  </Comment>
                </Comment.Group>
                :
                // 3_1. 삭제된 대댓글 미표시
                <></>
              ))}
              </div>
            </Comment>
            :
            // 2_1. 삭제된 댓글 알림표시(대댓글도 미표시)
            <Comment className='review-style-deleted'>
              <Comment.Content>
                <p>{review.review_text}</p>
              </Comment.Content>
            </Comment>
            }
            </>
          ))}
        </Comment.Group>

        <Form className='review-write-area' id='reply' reply>
          {isStaff ?
          targetReply &&
          <Form.Field className='review-rating'>
            <label><Icon name='angle double left'/><span className='pcolor'>{targetReply.user_name}</span> 님에게 답글</label>
            <Comment className='review-style-replyview'>
              <Comment.Content>
                <Rating icon='star' rating={targetReply.ratings} maxRating={5} size='mini' disabled/><br/>
                <p>{targetReply.review_text}</p>
              </Comment.Content>
            </Comment>
          </Form.Field>
          :
          <Form.Field className='review-rating'>
            <label>만족도</label>
            <Rating icon='star' defaultRating={4} maxRating={5} size='huge' onRate={handleRate}/>
          </Form.Field>
          }
          <Form.Field>
            <Form.TextArea placeholder={isStaff ? '이용자에게 답글을 남겨보세요!' : '여러분의 솔직한 평가를 남겨주세요!'} value={comment} onChange={commentInput}/>
            <span className='review-comment-length'>{comment.length} / 300</span>
          </Form.Field>

          <Form.Field className='review-submit-btn'>
            {isAuthorized ? 
              sendLoading ?
              <Button loading secondary disabled className='booking-btn'>
                로딩중
              </Button>
              :
              <Button secondary className='booking-btn' onClick={sendReview}>
                작성하기
              </Button>
            :
            <Link to='/login'>
              <Button secondary className='booking-btn'>
                <Button.Content visible>로그인이 필요합니다</Button.Content>
              </Button>
            </Link>
            }
          </Form.Field>
        </Form>

        <Modal size={size} open={open} onClose={() => dispatch({ type: 'close' })}>
          <Modal.Header>정말로 삭제하시겠습니까?</Modal.Header>
            <Modal.Actions>
              <Button negative onClick={() => dispatch({ type: 'close' })}>취소</Button>
              <Button positive onClick={() => deleteReview(targetReview)}>확인</Button>
            </Modal.Actions>
        </Modal>
      </div>
    </div>
  )
}
