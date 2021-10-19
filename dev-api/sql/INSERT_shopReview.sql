INSERT INTO public.m_shop_review
(user_cd,shop_cd,review_reply,review_text,ratings,review_time)
VALUES 
(':user_cd:',':shop_cd:',':review_reply:',':review_text:',':ratings:',now())
;