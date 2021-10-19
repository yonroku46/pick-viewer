UPDATE public.m_user 
SET access_time = now() 
WHERE user_cd = ':user_cd:'
;  