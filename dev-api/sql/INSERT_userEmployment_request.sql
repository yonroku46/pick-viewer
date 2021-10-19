INSERT INTO public.m_shop_request
(shop_cd,user_cd,request_time)
VALUES 
(':submit_shop_cd:',':user_cd:',now())
;