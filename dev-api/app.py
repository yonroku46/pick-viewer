# -- coding: utf-8 --

from flask import Flask,request,jsonify,abort
from flask.wrappers import Response
from flask_cors import CORS,cross_origin
from werkzeug.utils import secure_filename
from datetime import datetime
from src import dbGenerator
import urllib.request as urlreq
import configparser
import ipaddress
import smtplib
from email.mime.text import MIMEText
import random
from io import StringIO
from PIL import Image
from src.utils import SQLHelper as mng

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
CORS(app, support_credentials=True)

config = configparser.ConfigParser()
config.read("config/System.Config")

ALLOW_NETWORKS = ["127.0.0.1"]

gen = dbGenerator.dbGenerator()

@app.before_request
def before_request():
    remoteIp = ipaddress.ip_address(request.remote_addr)

    for allow in ALLOW_NETWORKS:
        ipNetwork = ipaddress.ip_network(allow)
        if remoteIp in ipNetwork:
            return
    return abort(403, 'access denied')

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS')
  return response

# server status to check
@app.route("/api/server")
def server():
    return (jsonify({'status': True}), 200)

# server status to check
@app.route("/api/check/<ip>", methods=["POST"])
def check(ip):
    try:
        key = '2021081820122944633152'
        query = 'http://whois.kisa.or.kr/openapi/ipascc.jsp?query={}&key={}&answer=json'.format(ip, key)
        req = urlreq.urlopen(query).read().decode("utf-8")
        return (jsonify(req), 200)
    except Exception as e:
        app.logger.info("Exception:{}".format(e))
        return (jsonify({'error': 'Not found'}), 404)

# return to 404 error
@app.errorhandler(404)
def not_found(error):
    return (jsonify({'error': 'Not found'}), 404)

# login event
@app.route('/api/login', methods=['POST'])
def login():
    params = request.get_json()
    user_email = params['user_email']
    user_pw = params['user_pw']

    try:
        query = gen.getQuery("sql/SELECT_login.sql", {"user_email": user_email, "user_pw": user_pw})
        rows = mng.fetch(query)
        if (rows):
            query = gen.getQuery("sql/SELECT_userCoupon.sql", {"user_cd": rows['user_cd']})
            coupons = mng.fetch_all(query)
            for coupon in coupons:
                coupon['use'] = False
            rows['coupon'] = coupons
            query = gen.getQuery("sql/UPDATE_login.sql", {"user_cd": rows['user_cd']})
            mng.fetch(query)
            if rows['permission'] == 1:
                del rows['employment']
            return (jsonify(rows), 200)
        else:
            return (jsonify(rows), 200)
    except Exception as e:
        app.logger.info("Exception:{}".format(e))
        return (jsonify({'error': 'Not found'}), 404)

# signup event
@app.route('/api/signup', methods=['POST'])
def signup():
    params = request.get_json()
    user_email = params['user_email']
    user_name = params['user_name']
    user_pw = params['user_pw']

    try:
        query = gen.getQuery("sql/UPDATE_signup.sql", {"user_name": user_name, "user_pw": user_pw, "user_email": user_email})
        mng.fetch(query)
        return (jsonify(True), 200)
    except Exception as e:
        app.logger.info("Exception:{}".format(e))
        return (jsonify({'error': 'Not found'}), 404)

@app.route('/api/mailService', methods=['POST'])
def mailService():
    params = request.get_json()
    user_email = params['user_email']
    permission = params['permission']

    try:
        query = gen.getQuery("sql/SELECT_mailService_check.sql", {"user_email": user_email})
        rows = mng.fetch(query)
        count = rows['count']
        if (0 < count):
            # Already exists
            return (jsonify(False), 200)
    except Exception as e:
        app.logger.info("Exception:{}".format(e))
        return (jsonify({'error': 'Not found'}), 404)

    ID = config.get("SMTP","Id")
    KEY = config.get("SMTP","Key")
    TO = user_email
    pin = random.randint(100000,999999)

    # TLS Security
    smtp = smtplib.SMTP('smtp.gmail.com', 587)
    smtp.starttls() 
    smtp.login(ID, KEY)

    html = '회원님의 인증번호는\n{}\n입니다.\n(본 이메일은 발신전용이며 회신이 되지 않습니다.)'.format(pin)
    if (permission != 1):
        html += '\n\n스태프/매니저 회원은 영업일기준 1일이내, 본 메일로 상세 등록절차를 안내해 드립니다.\n감사합니다.'

    msg = MIMEText(html)
    msg['Subject'] = '[Pick] 회원가입 인증안내' 

    try:
        query = gen.getQuery("sql/INSERT_signup.sql", {"user_email": user_email, "permission": permission, "pin": pin})
        if permission != 1:
            query = gen.getQuery("sql/INSERT_signup_staff.sql", {"user_email": user_email, "permission": permission, "pin": pin})
        mng.fetch(query)
        smtp.sendmail(ID, TO, msg.as_string())
        smtp.quit()
        return (jsonify(True), 200)
    except Exception as e:
        app.logger.info("Exception:{}".format(e))
        return (jsonify({'error': 'Not found'}), 404)

@app.route('/api/certifiService', methods=['POST'])
def certifiService():
    params = request.get_json()
    user_email = params['user_email']
    certifi = params['certifi']

    try:
        query = gen.getQuery("sql/SELECT_certifiService.sql", {"user_email": user_email, "certifi": certifi})
        rows = mng.fetch(query)
        count = rows['count']
        if count == 1:
            query = gen.getQuery("sql/UPDATE_certifiService_reset.sql", {"user_email": user_email})
            mng.fetch(query)
            return (jsonify(True), 200)
        else:
            return (jsonify(False), 200)
    except Exception as e:
        app.logger.info("Exception:{}".format(e))
        return (jsonify({'error': 'Not found'}), 404)

# helpPage
@app.route('/api/helpService', methods=['POST'])
def helpService():
    params = request.get_json()
    user_email = params['user_email']

    try:
        query = gen.getQuery("sql/SELECT_mailService_check.sql", {"user_email": user_email})
        rows = mng.fetch(query)
        count = rows['count']

        if count == 1:
            ID = config.get("SMTP","Id")
            KEY = config.get("SMTP","Key")
            TO = user_email
            pin = random.randint(100000,999999)

            # TLS Security
            smtp = smtplib.SMTP('smtp.gmail.com', 587)
            smtp.starttls() 
            smtp.login(ID, KEY)

            html = '회원님의 인증번호는\n{}\n입니다.\n(본 이메일은 발신전용이며 회신이 되지 않습니다.)'.format(pin)

            msg = MIMEText(html)
            msg['Subject'] = '[Pick] 비밀번호 재설정 인증안내'

            try:
                query = gen.getQuery("sql/UPDATE_helpService.sql", {"user_email": user_email, "pin": pin})
                mng.fetch(query)
                smtp.sendmail(ID, TO, msg.as_string())
                smtp.quit()
                return (jsonify(True), 200)
            except Exception as e:
                app.logger.info("Exception:{}".format(e))
                return (jsonify({'error': 'Not found'}), 404)
        else:
            # Not exists
            return (jsonify(False), 200)
    except Exception as e:
        app.logger.info("Exception:{}".format(e))
        return (jsonify({'error': 'Not found'}), 404)

@app.route('/api/resetService', methods=['POST'])
def resetService():
    params = request.get_json()
    user_email = params['user_email']
    user_pw = params['user_pw']

    try:
        query = gen.getQuery("sql/UPDATE_resetService.sql", {"user_pw": user_pw, "user_email": user_email})
        mng.fetch(query)
        return (jsonify(True), 200)
    except Exception as e:
        app.logger.info("Exception:{}".format(e))
        return (jsonify({'error': 'Not found'}), 404)

# bookingPage
@app.route('/api/shoplist', methods=['POST'])
def getShopList():
    params = request.get_json()
    category = params['category']

    categoryList = ['hairshop', 'restaurant', 'cafe']
    if (category == categoryList[0]):
        category = 'HS'
    elif (category == categoryList[1]):
        category = 'RT'
    elif (category == categoryList[2]):
        category = 'CF'

    try:
        query = gen.getQuery("sql/SELECT_shopList.sql", {"category": category})
        rows = mng.fetch_all(query)
        return (jsonify(rows), 200)
    except Exception as e:
        app.logger.info("Exception:{}".format(e))
        return (jsonify({'error': 'Not found'}), 404)

@app.route('/api/shopInfo', methods=['POST'])
def getShopInfo():
    params = request.get_json()
    shop_cd = params['shop_cd']
    permission = params['permission']
    try:
        query = gen.getQuery("sql/SELECT_shopInfo.sql", {"shop_cd": shop_cd})
        rows = mng.fetch(query)

        if permission != 3:
            del rows['shop_serial']

        if rows['staff_list'] != None:
            staff_list = rows['staff_list'].replace(",","','")
            query = gen.getQuery("sql/SELECT_shopStaffList.sql", {"staff_list": staff_list})
            rows['staff_list'] = mng.fetch_all(query)

        if rows['menu_list'] != None:
            menu_list = rows['menu_list'].replace(",","','")
            query = gen.getQuery("sql/SELECT_shopMenuList.sql", {"shop_cd": shop_cd, "menu_list": menu_list})
            rows['menu_list'] = mng.fetch_all(query)
            categoryDict = {}
            for menu in rows['menu_list']:
                category = menu['menu_category']
                if category not in categoryDict:
                    categoryDict[category] = None
            rows['menu_categorys'] = list(dict.fromkeys(categoryDict))

        return (jsonify(rows), 200)
    except Exception as e:
        app.logger.info("Exception:{}".format(e))
        return (jsonify({'error': 'Not found'}), 404)

@app.route('/api/favorite', methods=['POST'])
def favorite():
    params = request.get_json()
    user_cd = params['user_cd']
    shop_cd = params['shop_cd']
    isFavorite = params['isFavorite']
    try:
        if isFavorite:
            query = gen.getQuery("sql/DELETE_favorite.sql", {"user_cd": user_cd, "shop_cd": shop_cd})
            mng.fetch(query)
            return (jsonify(False), 200)
        else:
            query = gen.getQuery("sql/INSERT_favorite.sql", {"user_cd": user_cd, "shop_cd": shop_cd})
            mng.fetch(query)
            return (jsonify(True), 200)
    except Exception as e:
        app.logger.info("Exception:{}".format(e))
        return (jsonify({'error': 'Not found'}), 404)

@app.route('/api/getFavorites', methods=['POST'])
def getFavorites():
    params = request.get_json()
    user_cd = params['user_cd']
    try:
        query = gen.getQuery("sql/SELECT_favorites.sql", {"user_cd": user_cd})
        rows = mng.fetch_all(query)
        return (jsonify(rows), 200)
    except Exception as e:
        app.logger.info("Exception:{}".format(e))
        return (jsonify({'error': 'Not found'}), 404)

@app.route('/api/booking', methods=['POST'])
def booking():

    def convertOrder(orders):
        result = ''
        for order in orders:
            result += str(order['menu_cd']) + '&' + str(order['num']) + ','
        return result[:-1]

    params = request.get_json()
    user_cd = params['user_cd']
    shop_cd = params['shop_cd']
    booking_time = params['booking_time']
    booking_price = params['booking_price']
    booking_detail = params['booking_detail']
    category = params['category']
    try:
        if category == 'hairshop':
            query = gen.getQuery("sql/INSERT_booking_hairshop.sql", 
            {"user_cd": user_cd, "shop_cd": shop_cd, "booking_category": category, "booking_time": booking_time, "booking_price": booking_price,
            "designer": booking_detail['designer'], "style": booking_detail['style'], "discount": booking_detail['discount']})
        elif category == 'restaurant':
            booking_detail['orders'] = convertOrder(booking_detail['orders'])
            query = gen.getQuery("sql/INSERT_booking_restaurant.sql", 
            {"user_cd": user_cd, "shop_cd": shop_cd, "booking_category": category, "booking_time": booking_time, "booking_price": booking_price,
            "customers": booking_detail['customers'], "orders": booking_detail['orders'], "discount": booking_detail['discount']})
        elif category == 'cafe':
            booking_detail['orders'] = convertOrder(booking_detail['orders'])
            query = gen.getQuery("sql/INSERT_booking_cafe.sql", 
            {"user_cd": user_cd, "shop_cd": shop_cd, "booking_category": category, "booking_time": booking_time, "booking_price": booking_price,
            "customers": booking_detail['customers'], "orders": booking_detail['orders'], "discount": booking_detail['discount']})
        mng.fetch(query)
        return (jsonify(True), 200)
    except Exception as e:
        app.logger.info("Exception:{}".format(e))
        return (jsonify({'error': 'Not found'}), 404)

@app.route('/api/googleMap', methods=['GET'])
def googleMap():
    key = 'AIzaSyCEP8l9Pe7skIiL1KiXd54DZUHKSn8aTg0'
    return (jsonify(key), 200)

# imgUpload Service
@app.route('/api/imgUpload', methods=['POST'])
def imgUpload():
    f = request.files['file']
    call = request.values['call']
    
    # mypage usericon upload
    if call == 'user':
        user_cd = request.values['user_cd']
        public = '../dev-viewer/public/'
        path = 'images/' + call + '/' + user_cd + '.png'
        f.save(public + path)
        try:
            query = gen.getQuery("sql/UPDATE_userIcon.sql", {"path": path, "user_cd": user_cd})
            mng.fetch(query)
            return (jsonify(path), 200)
        except Exception as e:
            app.logger.info("Exception:{}".format(e))
            return (jsonify({'error': 'Not found'}), 404)
    # shop img upload
    elif call == 'shop':
        shop_cd = request.values['shop_cd']
        public = '../dev-viewer/public/'
        path = 'images/' + call + '/' + shop_cd + '.png'
        f.save(public + path)
        try:
            query = gen.getQuery("sql/UPDATE_shopImg.sql", {"path": path, "shop_cd": shop_cd})
            mng.fetch(query)
            return (jsonify(path), 200)
        except Exception as e:
            app.logger.info("Exception:{}".format(e))
            return (jsonify({'error': 'Not found'}), 404)
    # menu img upload
    elif call == 'menu':
        menu_cd = request.values['menu_cd']
        public = '../dev-viewer/public/'
        path = 'images/' + call + '/' + menu_cd + '.png'
        f.save(public + path)
        try:
            query = gen.getQuery("sql/UPDATE_menuImg.sql", {"path": path, "menu_cd": menu_cd})
            mng.fetch(query)
            return (jsonify(path), 200)
        except Exception as e:
            app.logger.info("Exception:{}".format(e))
            return (jsonify({'error': 'Not found'}), 404)

# Mypage
@app.route('/api/bookingList', methods=['POST'])
def bookingList():
    params = request.get_json()
    user_cd = params['user_cd']
    try:
        query = gen.getQuery("sql/SELECT_bookingList.sql", {"user_cd": user_cd})
        rows = mng.fetch_all(query)

        for row in rows:
            row['booking_time'] = row['booking_time'].strftime("%Y%m%d %H:%M:%S")
        
        return (jsonify(rows), 200)
    except Exception as e:
        app.logger.info("Exception:{}".format(e))
        return (jsonify({'error': 'Not found'}), 404)

@app.route('/api/infoUpdate', methods=['POST'])
def infoUpdate():
    params = request.get_json()
    user_info = params['user_info']
    user_email = params['user_email']
    try:
        query = gen.getQuery("sql/UPDATE_userInfo.sql", {"user_info": user_info, "user_email": user_email})
        mng.fetch(query)
        return (jsonify(True), 200)
    except Exception as e:
        app.logger.info("Exception:{}".format(e))
        return (jsonify({'error': 'Not found'}), 404)

@app.route('/api/favoriteList', methods=['GET'])
def favoriteList():
    params = request.args
    user_cd = params.get('user_cd')
    try:
        query = gen.getQuery("sql/SELECT_favoriteList.sql", {"user_cd": user_cd})
        rows = mng.fetch_all(query)

        for row in rows:
            category = ''
            if row['shop_serial'][0:2] == 'HS':
                category = 'hairshop'
            elif row['shop_serial'][0:2] == 'RT':
                category = 'restaurant'
            elif row['shop_serial'][0:2] == 'CF':
                category = 'cafe'
            row['category'] = category
            del row['shop_serial']

        return (jsonify(rows), 200)
    except Exception as e:
        app.logger.info("Exception:{}".format(e))
        return (jsonify({'error': 'Not found'}), 404)

@app.route('/api/submitEmployment', methods=['POST'])
def submitEmployment():
    params = request.get_json()
    user_cd = params['user_cd']
    submit_shop_cd = params['submit_shop_cd']
    permission = params['permission']
    try:
        if (permission != 1):
            query = gen.getQuery("sql/SELECT_shopSerial.sql", {"submit_shop_cd": submit_shop_cd})
            rows = mng.fetch(query)

            if rows['count'] == 0:
                # nonexistent serial
                return (jsonify(False), 200)
            elif rows['count'] == 1:
                # exchange shop_serial -> shop_cd
                submit_shop_cd = rows['shop_cd']

            query = gen.getQuery("sql/INSERT_userEmployment_request.sql", {"user_cd": user_cd, "submit_shop_cd": submit_shop_cd})
            mng.fetch(query)
            query = gen.getQuery("sql/UPDATE_userEmployment.sql", {"user_cd": user_cd, "submit_shop_cd": submit_shop_cd})
            mng.fetch(query)
            
            return (jsonify(True), 200)
        else:
            return (jsonify(False), 200)
    except Exception as e:
        app.logger.info("Exception:{}".format(e))
        return (jsonify({'error': 'Not found'}), 404)

# Dashboard
@app.route('/api/shopRequestList', methods=['GET'])
def shopRequestList():
    params = request.args
    shop_cd = params.get('shop_cd')
    try:
        query = gen.getQuery("sql/SELECT_shopRequestList.sql", {"shop_cd": shop_cd})
        rows = mng.fetch_all(query)
        return (jsonify(rows), 200)
    except Exception as e:
        app.logger.info("Exception:{}".format(e))
        return (jsonify({'error': 'Not found'}), 404)

@app.route('/api/saveShopInfo', methods=['POST'])
def saveShopInfo():
    params = request.get_json()
    shop = params['shop']
    staff_list = shop['staff_list']
    menu_list = shop['menu_list']
    try:
        # nothing to save
        origin = params['origin']
        if shop == origin:
            return (jsonify(True), 200)

        # shopInfo event
        query = gen.getQuery("sql/UPDATE_saveShopInfo.sql", {"shop_cd": shop['shop_cd'], "shop_location": shop['shop_location'], "shop_info": shop['shop_info'], "shop_tel": shop['shop_tel'], "shop_img": shop['shop_img'], "shop_open": shop['shop_open'], "shop_close": shop['shop_close'], "shop_holiday": shop['shop_holiday'], "location_lat": shop['location_lat'], "location_lng": shop['location_lng']})
        mng.fetch(query)

        # staffInfo event
        userCdDict = {}
        for staff in staff_list:
            userCdDict[staff['user_cd']] = staff

        origin = params['origin']
        for origin in origin['staff_list']:
            if origin not in staff_list:
                # update
                if origin['user_cd'] in userCdDict.keys():
                    query = gen.getQuery("sql/UPDATE_staffInfoManage.sql", {"user_cd": userCdDict[origin['user_cd']]['user_cd'], "info": userCdDict[origin['user_cd']]['info'], "career": userCdDict[origin['user_cd']]['career']})
                    mng.fetch(query)
                # delete
                else:
                    query = gen.getQuery("sql/DELETE_staffInfoManage_user.sql", {"user_cd": origin['user_cd']})
                    mng.fetch(query)
                    query = gen.getQuery("sql/DELETE_staffInfoManage_shop.sql", {"shop_cd": shop['shop_cd'], "user_cd": origin['user_cd']})
                    mng.fetch(query)

        # menuInfo event
        menuCdDict = {}
        newMenu = {}
        for menu in menu_list:
            menuCdDict[menu['menu_cd']] = menu
            if str(menu['menu_cd']).find("add") == 0:
                newMenu[menu['menu_cd']] = menu
        
        origin = params['origin']
        for origin in origin['menu_list']:
            if origin not in menu_list:
                # update
                if origin['menu_cd'] in menuCdDict.keys():
                    print("update", menuCdDict[origin['menu_cd']])
                # delete
                else:
                    print("delete", origin)

        for menu in newMenu:
            # add
            print("add", newMenu[menu])
        
        return (jsonify(True), 200)
    except Exception as e:
        app.logger.info("Exception:{}".format(e))
        return (jsonify({'error': 'Not found'}), 404)

@app.route('/api/userRequestConfirm', methods=['POST'])
def userRequestConfirm():
    params = request.get_json()
    shop_cd = params['shop_cd']
    user_cd = params['user_cd']
    request_cd = params['request_cd']
    request_stat = params['request_stat']
    try:
        # 1: accept(m_shop.staffList에 user_cd추가, m_user.additional에 info,career추가)
        if request_stat == 1:
            query = gen.getQuery("sql/UPDATE_userEmployment_add.sql", {"user_cd": user_cd})
            mng.fetch(query)
            query = gen.getQuery("sql/UPDATE_shopStaffList_add.sql", {"user_cd": user_cd, "shop_cd": shop_cd})
            mng.fetch(query)
        # 2: refuse(m_user.additional['employment']를 삭제)
        elif request_stat == 2:
            query = gen.getQuery("sql/UPDATE_userEmployment_del.sql", {"user_cd": user_cd})
            mng.fetch(query)

        query = gen.getQuery("sql/UPDATE_shopRequest.sql", {"request_cd": request_cd, "request_stat": request_stat})
        mng.fetch(query)

        # 이후에 승인/거절 결과 메일발송 코드 작성예정

        return (jsonify(True), 200)
    except Exception as e:
        app.logger.info("Exception:{}".format(e))
        return (jsonify({'error': 'Not found'}), 404)

# ReviewPage
@app.route('/api/sendReview', methods=['POST'])
def sendReview():
    params = request.get_json()
    isStaff = params['isStaff']
    user_cd = params['user_cd']
    shop_cd = params['shop_cd']
    review_text = params['review_text']
    try:
        if isStaff:
            review_reply = params['review_reply']
            ratings = None
        else:
            review_reply = None
            ratings = params['ratings']
        query = gen.getQuery("sql/INSERT_shopReview.sql", {"user_cd": user_cd, "shop_cd": shop_cd, "review_reply": review_reply, "ratings": ratings, "review_text": review_text})
        mng.fetch(query)
        return (jsonify(True), 200)
    except Exception as e:
        app.logger.info("Exception:{}".format(e))
        return (jsonify({'error': 'Not found'}), 404)

@app.route('/api/deleteReview', methods=['POST'])
def deleteReview():
    params = request.get_json()
    user_cd = params['user_cd']
    shop_cd = params['shop_cd']
    review_cd = params['review_cd']
    try:
        query = gen.getQuery("sql/UPDATE_shopReview_del.sql", {"review_cd": review_cd, "user_cd": user_cd, "shop_cd": shop_cd})
        mng.fetch(query)
        return (jsonify(True), 200)
    except Exception as e:
        app.logger.info("Exception:{}".format(e))
        return (jsonify({'error': 'Not found'}), 404)

@app.route('/api/reviewList', methods=['GET'])
def reviewList():
    params = request.args
    shop_cd = params.get('shop_cd')
    try:
        query = gen.getQuery("sql/SELECT_reviewList.sql", {"shop_cd": shop_cd})
        rows = mng.fetch_all(query)

        for row in rows:
            row['reply_list'] = []
            
            if row['delete_flag'] != 0:
                row['user_name'] = None
                row['user_img'] = None
                row['user_cd'] = None
                row['review_text'] = '삭제된 리뷰입니다.'

        for row in rows[:]:

            if row['review_reply'] != None:
                for review in rows:
                    if review['review_cd'] == row['review_reply']:
                        target = rows.index(review)

                if rows[target]['delete_flag'] == 0:
                    rows[target]['reply_list'].append(rows.pop(rows.index(row)))
                else:
                    rows.pop(rows.index(row))

        
        return (jsonify(rows), 200)
    except Exception as e:
        app.logger.info("Exception:{}".format(e))
        return (jsonify({'error': 'Not found'}), 404)

# Bad Request
@app.route('/<code>')
def getTest(code):
    remoteIp = ipaddress.ip_address(request.remote_addr)
    app.logger.info("remoteIp:{} / code:{}".format(remoteIp, code))
    return abort(403, 'access denied')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)