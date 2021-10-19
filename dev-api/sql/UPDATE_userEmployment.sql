UPDATE public.m_user
SET additional = JSON_MERGE(additional, JSON_OBJECT('employment',':submit_shop_cd:'))
WHERE user_cd = ':user_cd:'
;