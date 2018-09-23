from flask import Flask, jsonify, abort, make_response, request
from flask_cors import CORS
from InvalidUsage import InvalidUsage
import psycopg2
from datetime import datetime, timedelta

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

#Connect to Redshift Database
con=psycopg2.connect(dbname= 'dev', host='caffemax-db.cnkm2vec4v38.us-east-1.redshift.amazonaws.com',
port= '5439', user= 'awsuser', password= 'Awsuser2')

cursor = con.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS drink (
    id integer NOT NULL IDENTITY(1,1),
    name varchar(45) NOT NULL,
    caffeine float NOT NULL,
    fluidOunces float DEFAULT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS intake (
    id integer NOT NULL IDENTITY(1,1),
    timestamp datetime NOT NULL,
    user_id integer NOT NULL,
    drink integer NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS client (
    id integer NOT NULL IDENTITY(1,1),
    password varchar(45) NOT NULL,
    firstName varchar(45) NOT NULL,
    lastName varchar(45) NOT NULL,
    username varchar(45) NOT NULL UNIQUE,
    time_between integer NOT NULL,
    sleep_time integer NOT NULL,
    PRIMARY KEY (id)
);""")

BASE_PATH = '/api'

USERS_PATH = '/users'

USER_PATH = '/user'

#Get all users PATH: /api/users
@app.route(BASE_PATH + USERS_PATH, methods=['GET'])
def get_users():
    cursor.execute("select * from client;")
    users = cursor.fetchall()
    con.commit()
    return jsonify({'users': users})

#Get a single user PATH: /api/user?username=''
@app.route(BASE_PATH + USER_PATH, methods=['GET'])
def get_user():
    username = request.args.get('username', type = str).lower()

    cursor.execute("select * from client where username = %s;", (username,))

    user = cursor.fetchone()
    if user is None:
        raise InvalidUsage('User not found', status_code=400)
    return jsonify({'user': user})

#Create a user PATH: /api/user
@app.route(BASE_PATH + USER_PATH, methods=['POST'])
def create_user():
    if not request.json:
        raise InvalidUsage('Invalid Request Sent', status_code=400)

    username = request.json['username'].lower()
    password = request.json['password'].lower()
    firstName = request.json['firstName']
    lastName = request.json['lastName']
    sleep_time = request.json['sleep_time']
    time_between = request.json['time_between']

    cursor.execute("select username from client where username = %s", (username,))

    if cursor.rowcount != 0:
        raise InvalidUsage('Account with username already exists', status_code=400)

    cursor.execute("insert into client(password, firstName, lastName, username, sleep_time, time_between) values (%s, %s, %s, %s, %s, %s);", (password, firstName, lastName, username, sleep_time, time_between,))

    con.commit()

    return jsonify({'user': 'User created'}), 201

#update a users settings PATH: /api/local_settings
#Have to update both settings
@app.route(BASE_PATH + '/settings', methods=['PUT'])
def update_settings():
    if not request.json:
        raise InvalidUsage('Invalid Request Sent', status_code=400)

    user_id = request.json['user_id']
    sleep_time = request.json['sleep_time']
    time_between = request.json['time_between']

    cursor.execute("update client set sleep_time = %s, time_between = %s where id = %s", (sleep_time, time_between, user_id,))

    return jsonify({'settings': 'User settings updated'})

INTAKE_PATH = '/intake'

#get all intakes for a user PATH: /api/intake?userId=1
@app.route(BASE_PATH + INTAKE_PATH, methods=['GET'])
def get_intakes():
    userId = request.args.get('userId', type = int)

    if userId is None:
        raise InvalidUsage('Invalid Request Sent', status_code=400)

    cursor.execute("SELECT * FROM intake JOIN drink ON drink=drink.id WHERE user_id = %s", (userId,))

    intakes = cursor.fetchall()
    con.commit()

    return jsonify({'intakes': intakes})

#create an intake for a user PATH: /api/intake
@app.route(BASE_PATH + INTAKE_PATH, methods=['POST'])
def post_intake():
    if not request.json:
        raise InvalidUsage('Invalid Request Sent', status_code=400)

    userId = request.json['userId']
    drink = request.json['drink']

    cursor.execute("insert into intake(user_id, timestamp, drink) values (%s, %s, %s);", (userId, datetime.now(), drink, ))

    return jsonify({'intake': 'intake created'}), 201

DRINKS_PATH = '/drinks'

#Get all drinks PATH: /api/drinks
@app.route(BASE_PATH + DRINKS_PATH, methods=['GET'])
def get_drinks():
    cursor.execute("select * from drink")

    drinks = cursor.fetchall()

    return jsonify({'drinks': drinks})

#Add a drink to the database PATH: /api/drinks
@app.route(BASE_PATH + DRINKS_PATH, methods=['POST'])
def create_drinks():
    if not request.json:
        raise InvalidUsage('Invalid Request Sent', status_code=400)

    name = request.json['name']
    caffeine = request.json['caffeine']
    fluidOunces = request.json['fluidOunces']

    cursor.execute("insert into drink(name, caffeine, fluidOunces) values(%s, %s, %s)", (name, caffeine, fluidOunces, ))

    return jsonify({'drink': 'drink created'}), 201


#Get a users total daily caffeine intakes
#Needs to be fixed to use a single user
@app.route(BASE_PATH + '/totaldaycaffeine', methods=['GET'])
def total_day_caffeine():
    userId = request.args.get('userId', type = int)

    cursor.execute("SELECT SUM(drink.caffeine) FROM intake JOIN drink ON drink=drink.id WHERE userId = %s timestamp BETWEEN %s AND %s", (userId, atetime.now() - timedelta(seconds = 86400), datetime.now(), ))

    total = cursor.fetchone()

    return jsonify({'caffeine': total})

#check if a user should drink another cup of coffee
@app.route(BASE_PATH + '/should_drink', methods=['GET'])
def should_drink():
    username = request.args.get('username', type = str).lower()

    cursor.execute("select * from client where username = %s;", (username,))

    user = cursor.fetchone()
    if user is None:
        raise InvalidUsage('User not found', status_code=400)

    cursor.execute("SELECT * FROM intake WHERE timestamp BETWEEN %s AND %s", (datetime.now() - timedelta(minutes = user[5]), datetime.now(), ))

    # return jsonify({'should_drink': cursor.fetchall()})

    if cursor.rowcount == 0:
        return jsonify({'should_drink': True})
    else:
        return jsonify({'should_drink': False})


#Handle errors that occur in all endpoints
@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response
