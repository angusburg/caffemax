from flask import Flask, jsonify, abort, make_response
app = Flask(__name__)

@app.route('/')
def index_page():
    return 'It works!'

users = [
    {
        'username': u'matt'
    }
]

@app.route('/api/user/<username>', methods=['GET'])
def get_user(username):
    user = [user for user in users if user['username'] == username]
    if len(user) == 0:
        abort(404)
    return jsonify({'user': user[0]})


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)
