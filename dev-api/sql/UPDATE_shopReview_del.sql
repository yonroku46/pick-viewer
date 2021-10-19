UPDATE
    public.m_shop_review
SET
    delete_flag = '1'
WHERE
    review_cd = ':review_cd:' AND user_cd = ':user_cd:' AND shop_cd = ':shop_cd:'
;