SELECT
    ms.shop_cd,ms.shop_name,ms.shop_location,ms.shop_img
FROM
    public.m_favorite mf INNER JOIN public.m_shop ms ON mf.shop_cd = ms.shop_cd
WHERE
    user_cd = ':user_cd:'
;