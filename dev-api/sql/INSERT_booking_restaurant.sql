INSERT INTO public.m_booking
(user_cd,shop_cd,booking_category,booking_time,booking_price,booking_detail)
VALUES
(':user_cd:',':shop_cd:',':booking_category:',':booking_time:',':booking_price:',
JSON_OBJECT('customers',':customers:','orders',':orders:','discount',':discount:')
);