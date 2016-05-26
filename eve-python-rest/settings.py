RESOURCE_METHODS = ['GET','POST','DELETE']

ITEM_METHODS = ['GET','PATCH','DELETE']

X_DOMAINS = '*'
X_HEADERS = ['Authorization','If-Match','Access-Control-Expose-Headers','Content-Type','Pragma','Cache-Control']
X_EXPOSE_HEADERS = ['Origin', 'X-Requested-With', 'Content-Type', 'Accept']

users = {
    'additional_lookup': {
        'url': 'regex("[\w]+")',
        'field': 'email',
    },
    'datasource': {
        'projection': {'password': 0}
    },
    'schema': {
        'firstname': {
            'type': 'string',
            'required': True
        },
        'lastname': {
            'type': 'string',
            'required': True
        },
        'email': {
            'type': 'string',
            'unique': True
        },
        'password': {
            'type': 'string',
            'required': True
        },
        'role': {
            'type': 'string',
            'allowed': ["student", "teacher", "parent"],
            'required': True
        },
        # fields for student
        'class': {
            'type': 'objectid',
            'data_relation': {
                 'resource': 'classes',
                 'field': '_id',
                 'embeddable': True
            },
        },
        'registrynumber': {
            'type': 'integer'
        },
        # fields for teacher

        # fields for parent
        'children': {
            'type': 'list', 
            'schema': {
                'type': 'objectid',
                    'data_relation': { 
                        'resource': 'users',
                        'field': '_id', 
                        'embeddable': True
                } 
            }
        }
        
    }
}

classes = {
    'item_title': 'class',
    'schema': {
        'name': {
            'type': 'string',
            'unique': True
        }
    }
}

subjects = {
    'item_title': 'subject',
    'schema': {
        'name': {
            'type': 'string',
            'unique': True
        }
    }
}


DOMAIN = {
    'users': users, 
    'classes': classes, 
    'subjects': subjects
}