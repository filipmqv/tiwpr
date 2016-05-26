from eve import Eve
from eve.auth import BasicAuth
from flask import jsonify, request

class Authenticate(BasicAuth):
    def check_auth(self, email, password, allowed_roles, resource, method):
        if resource == 'users' and method == 'GET':
            users = app.data.driver.db['users']
            users = users.find_one({'email': email,'password': password})
            
            if users:
                return True
            else:
                return False
        elif resource == 'users' and method == 'POST':
            return email == 'admin' and password == 'password'
        else:
            return True

app = Eve(auth=Authenticate)


@app.route('/hellotest', methods = ['POST'])
def hello_world_post():
	resp = jsonify(email = "Dsfsd")
	resp.status_code = 200
	return resp




if __name__ == '__main__':
    app.run()