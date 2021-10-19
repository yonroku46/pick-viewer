SELECT coupon_cd,coupon_name,coupon_discount,coupon_end
FROM public.m_user_coupon
WHERE user_cd = ':user_cd:' OR coupon_end is NULL
AND now() <= coupon_end
;