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
  const userCd = userInfo ? userInfo.userCd : null;
  const role = userInfo ? userInfo.role : null;

  // 공통 default
  const shopDefault = 'images/shop/default.png';
  const userimgDefault =  'images/user/default.png';
  
  const [shop, setShop] = useState([]);
  const [isStaff, setIsStaff] = useState(false);
  const {shopCd} = useParams();
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
    return new Promise(function(resolve, reject) {
      axios
        .get(api.shopInfo,  {
          params: {
            'shopCd': shopCd
          }
        })
        .then(response => resolve(response.data))
        .catch(error => reject(error.response))
    })
    .then(res => {
      if (res.success) {
        setShop(res.data);
        staffJudge(res.data);
        getReviewList(res.data.shopCd);
        makeImageList(res.data.shopImg);
      }
    })
    .catch(err => {
      alert("현재 서버와의 연결이 원활하지 않습니다. 관리자에게 문의해주세요.");
    })
  }, [reload])

  function makeImageList(shopImg) {
    const imgList = shopImg.split(',');
    const result = [];
    for (let index = 0; index < 4; index++) {
      result.push(imgList[index] ? imgList[index] : shopDefault);
    }
    setShopImages(result);
  }

  function staffJudge(data) {
    let staffList = [];
    if (data.staffList != null) {
      for (let staff of data.staffList) {
        staffList.push(staff.userCd);
      }
      setIsStaff(staffList.indexOf(userCd) !== -1);
    } else {
      return;
    }
  }

  function getReviewList(shopCd) {
    setReviewLoading(true);
    return new Promise(function(resolve, reject) {
      axios
        .get(api.reviewList, {
          params: {
            'shopCd': shopCd
          }
        })
        .then(response => resolve(response.data))
        .catch(error => reject(error.response))
    })
    .then(res => {
      if (res.success) {
        setReviewList(res.dataList);
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
      'userCd': userCd,
      'shopCd': shopCd,
      'reviewText': comment
    };

    if (isStaff) {
      if (targetReply === null) {
        alert("답글을 남길 상대가 지정되지 않았습니다.");
        return
      } else {
        params.reviewReply = targetReply.reviewCd;
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
    .then(data => {
      if (data.success) {
        alert("리뷰가 작성되었습니다.");
        setReload(reload + 1);
        setComment('');
        setTargetReply(null);
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

  function reviewDelete(reviewCd) {
    setSendLoading(true);

    const params = { 
      'userCd': userCd,
      'shopCd': shopCd,
      'reviewCd': reviewCd
    };
    return new Promise(function(resolve, reject) {
      axios
        .post(api.reviewDelete, params)
        .then(response => resolve(response.data))
        .catch(error => reject(error.response))
    })
    .then(data => {
      if (data.success) {
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
    const reply = reviewList.find(review => review.reviewCd === targetId);
    setTargetReply(reply);
  }

  function mypostJudge(viewer) {
    return viewer === userCd;
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
    if (userCd === null) {
      alert('로그인이 필요합니다');
      return;
    }
    setClickFavorite(true);
    const params = { 
      'userCd': userCd,
      'shopCd': shopCd,
      'isFavorite': isFavorite
    };
    return new Promise(function(resolve, reject) {
      axios
        .post(api.favorite, params)
        .then(response => resolve(response.data))
        .catch(error => reject(error.response))
    })
    .then(res => {
      if (res.success) {
        const result = res.data.result;
        setIsFavorite(result);
        if (result) {
          shop.favoriteNum = shop.favoriteNum + 1;
        } else {
          shop.favoriteNum = shop.favoriteNum - 1;
        }
        setShop(shop)
        myFavorites(userCd);
      } else {
        alert('잠시 후 다시 시도하여 주세요.')
        setClickFavorite(false);
      }
    })
    .catch(err => {
      alert('잠시 후 다시 시도하여 주세요.')
      setClickFavorite(false);
    })
  }

  function myFavorites(userCd) {
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
    .then(data => {
      sessionStorage.setItem('favorites', JSON.stringify(data.dataList));
      setClickFavorite(false);
    })
  }

  function favoriteJudge() {
    favorites.map(favorite => {
      if (shopCd === String(favorite.shopCd)) {
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
          <p className='detailpage-name'>{shop.shopName}
            <span className='detailpage-call'>
              <a href={`tel:${shop.shopTel}`}><Icon name='phone square'/></a>
            </span>
            <span className='detailpage-review'>
              <Link to={`/booking/${category}/${shopCd}`}>
                <Button inverted className='detailpage-link-btn pcolor-accent-button'>예약하기 <Icon name='angle double right'/></Button>
              </Link>
            </span>
          </p>
          <p className='detailpage-time'><Icon name='clock outline'/>{shop.shopOpen}~{shop.shopClose}</p>
          <p className='detailpage-info'><Icon name='list alternate outline'/>{shop.shopInfo}</p>
          <p className='detailpage-location'><Icon name='map outline'/>{shop.shopLocation} 
            <Scroll className='detailpage-icon' to='map' offset={-56} spy={true} smooth={true}>
              <Icon id='map' onClick={mapToogle} name={mapOpen ? 'angle up' : 'angle down'}/>
            </Scroll>
          </p>
          {mapOpen && 
            (shop.locationLat === 0 && shop.locationLng === 0
            ? <h4 className='detailpage-location-empty'>위치정보 미등록 매장입니다</h4>
            : <MapContainer shop={shop}/>
            )
          }
        </Segment>

        {/* 리뷰 정보 탭*/}
        <Segment className='review-info'>
          <Statistic.Group size='mini' widths='three' inverted>
            <Statistic>
              <Statistic.Value className='review-tab-icon' onClick={favorite}><Icon name={isFavorite ? 'like' : 'like outline'}/> {shop.favoriteNum === undefined ? 0 : comma(shop.favoriteNum)}</Statistic.Value>
              <Statistic.Label>즐겨찾기</Statistic.Label>
            </Statistic>
            <Statistic>
              <Statistic.Value><Icon name='comments outline'/> {shop.reviewNum === undefined ? 0 : comma(shop.reviewNum)}</Statistic.Value>
              <Statistic.Label>총 리뷰수</Statistic.Label>
            </Statistic>
            <Statistic>
              <Statistic.Value><Icon name='star outline'/> {shop.ratingsAve}</Statistic.Value>
              <Statistic.Label>만족도</Statistic.Label>
            </Statistic>
          </Statistic.Group>
        </Segment>
        
        {/* 리뷰 탭 */}
        {/* 0. 아직 댓글 없음 */}
        {reviewList && reviewList.length === 0 &&
        <div className='review-no-comment'>
          <Icon name='comment alternate' size='huge'/>
          <h4>아직 댓글이 없습니다</h4>
        </div>
        }
        <Comment.Group className='review-comment-area'>
          {reviewList && reviewList.map(review => (
            review.replyList.length === 0 ?
            <>
            {/* 1. 댓글 없는 리뷰 */}
            {review.userName !== null ?
            <Comment className='review-style'>
              <Comment.Avatar src={api.imgRender(review.userImg === null ? userimgDefault : review.userImg)}/>
              <Comment.Content>
                <Rating icon='star' defaultRating={review.ratings} maxRating={5} size='mini' disabled/><br/>
                <Comment.Author as='a'>{review.userName}</Comment.Author>
                <Comment.Metadata>{timeForToday(review.reviewTime)}</Comment.Metadata>
                {mypostJudge(review.userCd) && 
                  <Label className='review-comment-label-setting' onClick={() => reviewEdit(review.reviewCd)}>
                    <Icon name='ellipsis vertical'/>
                  </Label>
                }
                <Comment.Text className='review-comment-text'>
                  {review.reviewText}
                </Comment.Text>
                {isStaff && 
                <Scroll to='reply' spy={true} smooth={true}>
                  <Comment.Actions onClick={() => clickReply(review.reviewCd)}>
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
                <p>{review.reviewText}</p>
              </Comment.Content>
            </Comment>
            }
            </>
            :
            <>
            {/* 2. 댓글 있는 리뷰 */}
            {review.userName !== null ?
            <Comment className='review-style'>
              <Comment.Avatar src={api.imgRender(review.userImg === null ? userimgDefault : review.userImg)}/>
              <Comment.Content>
                <Rating icon='star' defaultRating={review.ratings} maxRating={5} size='mini' disabled/><br/>
                <Comment.Author as='a'>{review.userName}</Comment.Author>
                <Comment.Metadata>{timeForToday(review.reviewTime)}</Comment.Metadata>
                {mypostJudge(review.userCd) && 
                  <Label className='review-comment-label-setting' onClick={() => reviewEdit(review.reviewCd)}>
                    <Icon name='ellipsis vertical'/>
                  </Label>
                }
                <Comment.Text className='review-comment-text'>
                  {review.reviewText}
                </Comment.Text>
                {isStaff && 
                <Scroll to='reply' spy={true} smooth={true}>
                  <Comment.Actions onClick={() => clickReply(review.reviewCd)}>
                    <Comment.Action>답글달기</Comment.Action>
                  </Comment.Actions>
                </Scroll>
                }
              </Comment.Content>

              {/* 3. 리뷰 대댓글 */}
              <div className='reply-style-top'>
              {review.replyList.map(reply => (
                reply.userName !== null ?
                <Comment.Group className='reply-style-outline'>
                  <Comment className='reply-style'>
                    <Comment.Avatar src={api.imgRender(reply.userImg === null ? userimgDefault : reply.userImg)}/>
                    <Comment.Content>
                      <Comment.Author as='a'>{reply.userName}</Comment.Author>
                      <Label className='review-comment-label' color='violet' size='mini' horizontal>STAFF</Label>
                      <Comment.Metadata>{timeForToday(reply.reviewTime)}</Comment.Metadata>
                      {mypostJudge(reply.userCd) && 
                        <Label className='review-comment-label-setting' onClick={() => reviewEdit(reply.reviewCd)}>
                          <Icon name='ellipsis vertical'/>
                        </Label>
                      }
                      <Comment.Text className='review-comment-text'>
                        {reply.reviewText}
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
                <p>{review.reviewText}</p>
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
            <label><Icon name='angle double left'/><span className='pcolor'>{targetReply.userName}</span> 님에게 답글</label>
            <Comment className='review-style-replyview'>
              <Comment.Content>
                <Rating icon='star' rating={targetReply.ratings} maxRating={5} size='mini' disabled/><br/>
                <p>{targetReply.reviewText}</p>
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
              <Button positive onClick={() => reviewDelete(targetReview)}>확인</Button>
            </Modal.Actions>
        </Modal>
      </div>
    </div>
  )
}
