class dbGenerator(object):

    def getQuery(self, filepath, bindDict):

        if filepath is None:
            return None

        query = ""
        with open(filepath, "r") as f:
            query = f.read()

        if bindDict is None:
            return query

        for k, v in bindDict.items():
            bindVariable = ":" + k + ":"
            if v is None:
                if "'" + bindVariable + "'" in query:
                    query = query.replace("'" + bindVariable + "'", "NULL")
                else:
                    query = query.replace(bindVariable, "NULL")  
            else:
                query = query.replace(bindVariable, str(v))
            
        return query