UPDATE public.m_user
SET additional = JSON_REPLACE(additional,'$.info',':info:','$.career',':career:')
WHERE user_cd = ':user_cd:'
;