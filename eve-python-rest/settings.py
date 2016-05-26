RESOURCE_METHODS = ['GET','POST','DELETE'] # dla calej kolekcji

ITEM_METHODS = ['GET','PATCH','DELETE'] # dla konkretnego id

X_DOMAINS = '*'
X_HEADERS = ['Authorization','If-Match','Access-Control-Expose-Headers','Content-Type','Pragma','Cache-Control']
X_EXPOSE_HEADERS = ['Origin', 'X-Requested-With', 'Content-Type', 'Accept']

DATE_FORMAT ='%Y-%m-%d %H:%M:%S'

users = {
    'item_title': 'user',
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
        'class_id': {
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
        'children_id': {
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

students = {
    'datasource': {
        'source': 'users',
        'filter': {'role': 'student'},
        'projection': {'password': 0}
    }
}

grades_schema = {
    'gradevalue': {
        'type': 'integer',
        'required': True
    },
    'student_id': {
        'type': 'objectid',
        'data_relation': {
             'resource': 'users',
             'field': '_id',
             'embeddable': True
        },
        'required': True
    },
    'test_id': {
        'type': 'objectid',
        'data_relation': {
             'resource': 'tests',
             'field': '_id',
             'embeddable': True
        },
        'required': True
    }
}

grades = {
    'item_title': 'grade',
    'schema': grades_schema
}

students_grades = {
    'url': 'users/<regex("[a-f0-9]{24}"):student_id>/grades',
    'schema': grades_schema,
    "datasource": {"source": "grades"},
    'hateoas': False
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

# test to coś co można zapowiedzieć
tests = {
    'item_title': 'test',
    'schema': {
        'testtype': {
            'type': 'string',
            'allowed': ["short test", "homework", "essay"],
            'required': True
        },
        'name': {
            'type': 'string',
            'required': True
        },
        'testdate': {
            'type': 'datetime',
            'required': True
        },
        'class_id': {
            'type': 'objectid',
            'data_relation': {
                 'resource': 'classes',
                 'field': '_id',
                 'embeddable': True
            },
        },
        'subject_id': {
            'type': 'objectid',
            'data_relation': {
                 'resource': 'subjects',
                 'field': '_id',
                 'embeddable': True
            },
        },
        'teacher_id': {
            'type': 'objectid',
            'data_relation': {
                 'resource': 'users',
                 'field': '_id',
                 'embeddable': True
            },
        },
        'status': { # 0-zapowiedziany, 1-oceniony (ocenionego nie mozna usunac bez anulowania wczesniej ocen)
            'type': 'integer', 
            'required': True
        }
    }
}
#typ(spr, kart, odp, zad. domowe), tytuł, data, przedmiot, klasa(czyli uczniowie), nauczyciel


DOMAIN = {
    'users': users, 
    'students': students,
    'grades': grades,
    'students_grades': students_grades,
    'classes': classes, 
    'subjects': subjects,
    'tests': tests
}