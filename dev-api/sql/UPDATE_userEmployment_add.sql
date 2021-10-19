UPDATE public.m_user
SET additional = JSON_MERGE(additional, JSON_OBJECT('info','','career',''))
WHERE user_cd = ':user_cd:'
;