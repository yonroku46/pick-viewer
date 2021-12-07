SELECT
    booking_cd,booking_category,booking_time,booking_price,
    JSON_UNQUOTE(JSON_EXTRACT(booking_detail,'$.style')) as style,
    JSON_UNQUOTE(JSON_EXTRACT(booking_detail,'$.designer')) as designer,
    JSON_UNQUOTE(JSON_EXTRACT(booking_detail,'$.discount')) as discount,
    JSON_UNQUOTE(JSON_EXTRACT(booking_detail,'$.customers')) as customers,
    JSON_UNQUOTE(JSON_EXTRACT(booking_detail,'$.orders')) as orders,
    mb.shop_cd,ms.shop_name
FROM
    public.m_booking mb INNER JOIN public.m_shop ms ON mb.shop_cd = ms.shop_cd
WHERE
    mb.booking_stat = 0
AND
    mb.shop_cd = ':shop_cd:'
;