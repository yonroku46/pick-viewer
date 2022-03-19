import os
import pymysql
from src.setting import conf

confing = conf[os.environ['FLASK_ENV']]

class SQLHelper(object):

    @staticmethod
    def open(cursor):
        POOL = confing.PYMYSQL_POOL
        conn = POOL.connection()
        cursor = conn.cursor(cursor=cursor)
        return conn,cursor

    @staticmethod
    def close(conn,cursor):
        conn.commit()
        cursor.close()
        conn.close()

    @classmethod
    def fetch(cls,sql,cursor =pymysql.cursors.DictCursor):
        conn,cursor = cls.open(cursor)
        cursor.execute(sql)
        obj = cursor.fetchone()
        cls.close(conn,cursor)
        return obj

    @classmethod
    def fetch_all(cls,sql,cursor =pymysql.cursors.DictCursor):
        conn, cursor = cls.open(cursor)
        cursor.execute(sql)
        obj = cursor.fetchall()
        cls.close(conn, cursor)
        return obj