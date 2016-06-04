from eve import Eve
from eve.auth import BasicAuth
from flask import Flask, jsonify, request
import base64

from datetime import timedelta
from flask import make_response, request, current_app
from functools import update_wrapper

# snippet for flask crossdomain
def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, basestring):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, basestring):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers

            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator
# end of snippet for flask crossdomain




class Authenticate(BasicAuth):
	def check_auth(self, email, password, allowed_roles, resource, method):
		#print "entering"
		users = app.data.driver.db['users']
		user = users.find_one({'email': email,'password': password})
		if user:
			if user.get('role') == 'student':
				#some_list = ['abc-123', 'def-456', 'ghi-789', 'abc-456']
				#print "student"
				return True
			elif user.get('role') == 'teacher':
				return True
			elif user.get('role') == 'parent':
				return True
			else:
				#print "not allowed"
				return False
		elif email == 'admin' and password == 'password':
			return True
		else:
			#print "not user"
			return False


app = Eve(auth=Authenticate)


@app.route('/login', methods = ['POST', 'OPTIONS'])
@crossdomain(origin='*',headers=['Content-Type','Authorization'])
def login():
	data = request.get_json()
	email = data.get('email')
	password = data.get('password')
	users = app.data.driver.db['users']
	user = users.find_one({'email': email,'password': password})
	if user:
		hashed = base64.b64encode(email+":"+password)
		resp = jsonify(hash = hashed, role = user.get('role'), myId = str(user.get('_id')))
		resp.status_code = 200
		return resp
	else:
		resp = jsonify(error = 'Wrong email or password.')
		resp.status_code = 401
		return resp

def delete_grades(item):
	grades = app.data.driver.db['grades']
	ok = grades.remove({'test_id': item.get('_id')})
	print "removing grades of this test"
	print ok

if __name__ == '__main__':
	app.on_delete_item_tests += delete_grades
	app.run(threaded=True)
