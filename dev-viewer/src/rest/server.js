// Public
export const check = "/api/check/";
export const imgUpload = "/api/imgUpload";
export const favorite = "/api/favorite";
export const getFavorite = "/api/getFavorites";

export function imgRender(img) {
    // const render = process.env.PUBLIC_URL + img;
    const PUBLIC_URL = 'http://' + window.location.host + '/';
    const render = PUBLIC_URL + img;
    return render;
}

// HomePage
export const server = "/api/server";

// LoginPage
export const login = "/api/login";

// SignupPage
export const mailService = "/api/mailService";
export const certifiService = "/api/certifiService";
export const signup = "/api/signup";

// HelpPage
export const helpService = "/api/helpService";
export const resetService = "/api/resetService";

// BookingPage
export const shopList = "/api/shoplist";
export const shopInfo = "/api/shopInfo";
export const booking = "/api/booking";

// ReviewPage
export const sendReview = "/api/sendReview";
export const deleteReview = "/api/deleteReview";
export const reviewList = "/api/reviewList";

// MyPage
export const infoUpdate = "/api/infoUpdate";
export const bookingList = "/api/bookingList";
export const submitEmployment = "/api/submitEmployment";
export const favoriteList = "/api/favoriteList";

// DashBoard
export const shopRequestList = "/api/shopRequestList";
export const userRequestConfirm = "/api/userRequestConfirm";
export const saveShopInfo = "/api/saveShopInfo";
export const imgClear = "/api/imgClear";
