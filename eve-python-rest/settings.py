RESOURCE_METHODS = ['GET','POST'] # dla calej kolekcji

ITEM_METHODS = ['GET','PUT','DELETE'] # dla konkretnego id

X_DOMAINS = '*'
X_HEADERS = ['Authorization','If-Match','Access-Control-Expose-Headers','Content-Type','Pragma','Cache-Control']
X_EXPOSE_HEADERS = ['Origin', 'X-Requested-With', 'Content-Type', 'Accept']
CACHE_CONTROL = 'max-age=1,must-revalidate'

PAGINATION = False
PAGINATION_LIMIT = 9999999
PAGINATION_DEFAULT = 25

DATE_FORMAT ='%Y-%m-%dT%H:%M:%S'

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
    'pagination': True,
    'datasource': {
        'source': 'users',
        'filter': {'role': 'student'},
        'projection': {'password': 0},
        'default_sort': [('class_id', 1), ('lastname',1)]
    }
}

students_all = {
    'datasource': {
        'source': 'users',
        'filter': {'role': 'student'},
        'projection': {'password': 0},
        'default_sort': [('class_id', 1)]
    }
}

grades_schema = {
    'gradevalue': {
        'type': 'string',
        'allowed': ["1", "1+", "2-", "2", "2+", "3-", "3", "3+", "4-", "4", "4+", "5-", "5", "5+", "6-", "6", "6+"],
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
    'url': 'students/<regex("[a-f0-9]{24}"):student_id>/grades',
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
    },
    'datasource': {
        'default_sort': [('name', 1)]
    },
    'hateoas': False
}

subjects = {
    'item_title': 'subject',
    'schema': {
        'name': {
            'type': 'string',
            'unique': True
        }
    },
    'datasource': {
        'default_sort': [('name', 1)]
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
    },
    'datasource': {
        'default_sort': [('testdate', -1)]
    }
}
#typ(spr, kart, odp, zad. domowe), tytuł, data, przedmiot, klasa(czyli uczniowie), nauczyciel

attendances_schema = {
    'student_id': {
        'type': 'objectid',
        'data_relation': {
             'resource': 'users',
             'field': '_id',
             'embeddable': True
        },
        'required': True
    },
    'lesson_id': {
        'type': 'objectid',
        'data_relation': {
             'resource': 'lessons',
             'field': '_id',
             'embeddable': True
        },
        'required': True
    },
    'status': {
        'type': 'string',
        'allowed': ["absent", "present", "justified"], #nieobecny (czyli nieuspr.), obecny, usprawiedliwony
        'required': True
    }
}

attendances = {
    'item_title': 'attendance',
    'schema': attendances_schema
}

students_attendances = {
    'url': 'students/<regex("[a-f0-9]{24}"):student_id>/attendances',
    'schema': attendances_schema,
    "datasource": {"source": "attendances"},
    'hateoas': False
}

absences = {
    'url': 'students/<regex("[a-f0-9]{24}"):student_id>/absences',
    'schema': attendances_schema,
    "datasource": {
        "source": "attendances",
        'filter': {'status': 'absent'}
    },
    'hateoas': False
}

lessons = {
    'item_title': 'lesson',
    'pagination': True,
    'schema': {
        'lessondate': {
            'type': 'datetime',
            'required': True
        },
        'class_id': {
            'type': 'objectid',
            'data_relation': {
                 'resource': 'classes',
                 'field': '_id',
                 'embeddable': True
            }
        },
        'teacher_id': {
            'type': 'objectid',
            'data_relation': {
                 'resource': 'users',
                 'field': '_id',
                 'embeddable': True
            }
        },
        'subject_id': {
            'type': 'objectid',
            'data_relation': {
                 'resource': 'subjects',
                 'field': '_id',
                 'embeddable': True
            },
        }
    },
    'datasource': {
        'default_sort': [('lessondate', -1)]
    }
}


DOMAIN = {
    'users': users, 
    'students': students,
    'students_all': students_all,
    'grades': grades,
    'students_grades': students_grades,
    'classes': classes, 
    'subjects': subjects,
    'tests': tests,
    'attendances': attendances,
    'students_attendances': students_attendances,
    'absences': absences,
    'lessons': lessons
}