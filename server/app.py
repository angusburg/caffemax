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

intakes = [
    {
        'id': 1,
        'userId': 1,
        'timestamp': 'time'
    },
    {
        'id': 2,
        'userId': 1,
        'timestamp': 'time'
    }
]

drinks = [
    {
        'id' : 1,
        'caffeine': 200,
        'name': 'coffee'
    },
    {
        'id' : 2,
        'caffeine': 100,
        'name': 'coffee2'
    },
    {
        'id' : 3,
        'caffeine': 200,
        'drinkId': 'red bull'
    }

]

BASE_PATH = '/api'

USERS_PATH = '/users'

#User operations
@app.route(BASE_PATH + USERS_PATH, methods=['GET'])
def get_users():
    return jsonify({'users': users})

@app.route(BASE_PATH + USERS_PATH, methods=['GET'])
def get_user():
    username = request.args.get('username', type = str).lower()
    user = [user for user in users if user['username'] == username]
    if len(user) == 0:
        raise InvalidUsage('User not found', status_code=400)
    return jsonify({'user': user[0]})

@app.route(BASE_PATH + USERS_PATH, methods=['POST'])
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

@app.route(BASE_PATH + USERS_PATH, methods=['PUT'])
def update_user():
    if not request.json:
        raise InvalidUsage('Invalid Request Sent', status_code=400)
    user = {
        'username': request.json['username']
    }
    users.append(user)
    return jsonify({'user': user}), 201

INTAKES_PATH = '/intakes'

#intake operations
@app.route(BASE_PATH + INTAKES_PATH, methods=['GET'])
def get_intakes():
    userId = request.args.get('userId', type = int)
    intake_list = [intake for intake in intakes if intake['userId'] == userId]
    if len(intake_list) == 0:
        raise InvalidUsage('No intakes found with the id: ' + str(userId), status_code=400)
    return jsonify({'intakes': intake_list})

@app.route(BASE_PATH + INTAKES_PATH, methods=['POST'])
def post_intake():
    if not request.json:
        raise InvalidUsage('Invalid Request Sent', status_code=400)

    userId = request.json['userId']
    id = request.json['id']
    timestamp = request.json['timestamp']
    intake_list = [intake for intake in intakes if intake['id'] == id]
    if len(intake_list) > 0:
        raise InvalidUsage('Drink already exists', status_code=400)
    intake = {
        'id': id,
        'userId': userId,
        'timestamp': timestamp
    }
    intakes.append(intake)
    return jsonify({'intake': intake}), 201

DRINKS_PATH = '/drinks'

#Drink operations
@app.route(BASE_PATH + DRINKS_PATH, methods=['GET'])
def get_drinks():
    return jsonify({'drinks': drinks})

@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response
