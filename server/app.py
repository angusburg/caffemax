from flask import Flask, jsonify, abort, make_response, request
from InvalidUsage import InvalidUsage

app = Flask(__name__)

@app.route('/')
def index_page():
    return 'It works!'

users = [
    {
        'username': u'matt',
        'userId': 1
    }
]

coffees = [
    {
        'userId' : 1,
        'caffeine': 200,
        'coffeeId': 'abc123'
    },
    {
        'userId' : 1,
        'caffeine': 200,
        'coffeeId': '123abc'
    },
    {
        'userId' : 2,
        'caffeine': 200,
        'coffeeId': 'abcd1234'
    }

]

BASE_PATH = '/api'

#User operations
@app.route(BASE_PATH + '/users', methods=['GET'])
def get_users():
    return jsonify({'users': users})

@app.route(BASE_PATH + '/user', methods=['GET'])
def get_user():
    username = request.args.get('username', type = str).lower()
    user = [user for user in users if user['username'] == username]
    if len(user) == 0:
        raise InvalidUsage('User not found', status_code=400)
    return jsonify({'user': user[0]})

@app.route(BASE_PATH + '/user', methods=['POST'])
def create_user():
    if not request.json:
        raise InvalidUsage('Invalid Request Sent', status_code=400)

    username = request.json['username'].lower()
    user = [user for user in users if user['username'] == username]
    if len(user) > 0:
        raise InvalidUsage('User already exists', status_code=400)
    user = {
        'username': username
    }
    users.append(user)
    return jsonify({'user': user}), 201

@app.route(BASE_PATH + '/user', methods=['PUT'])
def update_user():
    if not request.json:
        raise InvalidUsage('Invalid Request Sent', status_code=400)
    user = {
        'username': request.json['username']
    }
    users.append(user)
    return jsonify({'user': user}), 201

#Coffee operations
@app.route(BASE_PATH + '/drinks', methods=['GET'])
def get_coffee():
    userId = request.args.get('userId', type = int)
    drinks = [coffee for coffee in coffees if coffee['userId'] == userId]
    if len(drinks) == 0:
        raise InvalidUsage('No drinks found with the id: ' + str(userId), status_code=400)
    return jsonify({'drinks': drinks})


@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response
