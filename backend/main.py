"""REST Server."""
from flask import Flask, request, abort
from flask import Blueprint, abort, request
from flask_cors import CORS
from flask_expects_json import expects_json
from src.connection import connector
from src.constants import Role
from middleware import user_registered
import json


app = Flask("JTracer")

CORS(app)

# TODO: add address and phone using the similar schema
schemas = {
    'authenticate': {
        'type': 'object',
        'properties': {
            'email': {
                'type': 'string',
                'format': 'email',
            },
            'passwordHash': {
                'type': 'string',
            },
        },
        'required': ['email', 'passwordHash']
    },
    'register': {
        'type': 'object',
        'properties': {
            'email': {
                'type': 'string',
                'format': 'idn-email'
            },
            'role': {
                'type': 'string',
                'pattern': '^(faculty_member|external_guest)$'
            },
            'passwordHash': {
                'type': 'string',
            }, 
            'address': {
                'type': 'string',
            },
            'phone': {
                'type': 'string',
            }
        },
        'required': ['email', 'role', 'passwordHash', 'address', 'phone']
    },
    'log': {
        'type': 'object',
        'properties': {
            'barcode_id': {
                'type': 'string',
            },
            'checkinTme': {
                'type': 'string',
            }
        },
        'required': ['barcode_id']
    },
}


@app.route('/authenticate', methods=['POST'])
@expects_json(schemas['authenticate'])
def authentication(name=None):
    """Verify user with name."""
    data = request.json
    user = connector.get_user(data['email'], data['passwordHash'])
    if not user:
        abort(400, 'Invalid user email or password.')
    token = connector.add_user_session(user['id'])
    if not token:
        abort(400, 'Something went wrong while authentication.')
    return json.dumps(
        {'SESSION-KEY': token, 'id': user['id'], 'role': user['role']}
    ), 200

@app.route('/register', methods=['POST'])
@expects_json(schemas['register'])
def register_user():
    """Register User."""
    data = request.json
    role = Role[data['role'].upper()]
    # Check if data['address'] is defined if not take the default
    # value and pass it to add_user
    # Check if data['phonenumebr'] is defined if not take the
    # default value and pass it to add_user
    user_id = connector.add_user(data['email'], data['passwordHash'], role, data['address'], data['phone'])
    if not user_id:
        abort(400, 'Something went wrong while registration.')
    token = connector.add_user_session(user_id)
    return json.dumps(
        {
            'success': True,
            'SESSION-KEY': token,
            'id': user_id,
            'role': role.value
        }
    ), 200


@app.route('/log', methods=['POST'])
@user_registered
@expects_json(schemas['log'])
def log_user(user_id):
    """Register User."""
    data = request.json
    barcode_id = data['barcode_id']
    checkinTime = data['checkinTime']
    succ = connector.log_user(user_id, barcode_id, checkinTime)
    if not succ:
        abort(400, 'Something went wrong while scanning.')
    return json.dumps(
        {
            'success': True,
        }
    ), 200

@app.route('/past', methods=['GET'])
@user_registered
def get_history(user_id):
    """"History of logs"""
    history = connector.get_history(user_id)
    return json.dumps(
        {"history": history}
    ), 200


@app.route('/')
def welcome():
    """Welcome."""
    return 'Welcome!'

if __name__ == '__main__':
    app.run(port=8086, host='0.0.0.0')
