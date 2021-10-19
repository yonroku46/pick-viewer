from datetime import timedelta
from redis import Redis
import pymysql
import configparser
from DBUtils.PooledDB import PooledDB, SharedDBConnection

class Config(object):
    config = configparser.ConfigParser()
    config.read("config/System.Config")
    
    DEBUG = True
    PERMANENT_SESSION_LIFETIME = timedelta(minutes=20)
    SESSION_REFRESH_EACH_REQUEST= True
    SESSION_TYPE = "redis"
    PYMYSQL_POOL = PooledDB(
        creator=pymysql,  #  use linked database modules 
        maxconnections=6,  #  maximum number of connections allowed in connection pool, 0 and none indicate that the number of connections is not limited 
        mincached=2,  #  at least idle links created in the link pool when initialized ，0 means not created 
        maxcached=5,  #  the most idle links in the link pool, 0 and none 
        maxshared=3,
        #  the maximum number of links shared in the link pool, 0 and none represent all shared 。PS:  useless because pymysql and mysqldb module  threadsafety they're all 1, whatever the value is ，_maxcached always zero, so always all links are shared 。
        blocking=True,  #  whether to block and wait after no connection is available in the connection pool 。True， waiting for the ；False， don't wait and report an error 
        maxusage=None,  #  the maximum number of times a link can be reused, None express unlimited 
        setsession=[],  #  list of commands executed before starting the session. such as ：["set datestyle to ...", "set time zone ..."]
        ping=0,
        # ping MySQL server to check if the service is available 。#  such as ：0 = None = never, 1 = default = whenever it is requested, 2 = when a cursor is created, 4 = when a query is executed, 7 = always
        host=config.get("Connect","Host"),
        port=3306,
        user=config.get("Connect","User"),
        password=config.get("Connect","Password"),
        database=config.get("Connect","DBName"),
        charset=config.get("Connect","Charset")
    )

class ProductionConfig(Config):
    SESSION_REDIS = Redis(host='192.168.0.94', port='6379')

class DevelopmentConfig(Config):
    SESSION_REDIS = Redis(host='127.0.0.1', port='6379')

class TestingConfig(Config):
    pass