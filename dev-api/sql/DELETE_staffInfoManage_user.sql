UPDATE public.m_user
SET additional = JSON_REMOVE(additional,'$.info','$.career','$.employment')
WHERE user_cd = ':user_cd:'
;