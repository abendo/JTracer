"""Middleware to manage connection authentication."""
from functools import wraps
from flask import request, abort
from src.connection import connector


# base function, not decorated
def check_login(role=None):
    """Verify that the request is from a registered user."""
    token = request.headers.get('SESSION-KEY')
    if not token:
        abort(400, 'User not authenticated')
    res = connector.check_session_validity(token, role=role)
    if not res:
        abort(401, 'User SESSION-KEY is invalid or expired')
    return res


def user_registered(f):
    """Verify that the request is from a registered user.

    Returns:
        user_id(int): the id of the user, to
                        be used in a subsequent function
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = check_login()
        return f(user_id, *args, **kwargs)
    return decorated_function
