SELECT 
    msr.review_cd,msr.review_reply,msr.user_cd,mu.user_name,mu.user_img,msr.review_text,msr.review_time,msr.ratings,msr.delete_flag
FROM
    public.m_shop_review msr INNER JOIN public.m_user mu ON msr.user_cd = mu.user_cd
WHERE
    msr.shop_cd = ':shop_cd:'
ORDER BY msr.review_time DESC
;