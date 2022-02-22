SELECT COUNT(*) AS count
FROM public.m_booking
WHERE user_cd = ':user_cd:'
AND booking_time = date_format(':booking_time:', '%Y-%m-%d %h:%i:%s');