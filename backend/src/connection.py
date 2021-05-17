"""Class to manage the DB Operations."""
import os.path
import secrets
import os
import datetime
from dotenv import load_dotenv
import sqlite3
import mariadb
import logging
from .constants import Role

load_dotenv()

is_sqlite = os.getenv("SQLITE")
is_sqlite = is_sqlite.lower() in ['true', '1', 'y', None, '']
sqlite_file = os.getenv("SQLITE_DB")


class Connector:
    """Manage Databse connection."""

    def __init__(self, is_testing=False, test_sqlite=None):
        """Init Databse connection."""
        if is_testing:
            self.conn = sqlite3.connect(
                test_sqlite, check_same_thread=False
            )
        elif is_sqlite is True:
            self.conn = sqlite3.connect(
                sqlite_file, check_same_thread=False)
        else:
            try:
                self.conn = mariadb.connect(
                    user=os.getenv("MARIADB_USERNAME"),
                    password=os.getenv("MARIADB_PASSWORD"),
                    host=os.getenv("MARIADB_HOST"),
                    port=int(os.getenv("MARIADB_PORT", 3306)),
                    database=os.getenv("MARIADB_DATABASE")
                )
            except mariadb.Error as e:
                logging.error('Error_Connector: {}'.format(e))

    def __to_dict(self, cursor, values):
        """Turn a tuple of values into a dictictonary.

        Args:
            cursor: database connection cursor, use right after required query
            values(tuple): a SINGLE TUPLE filled with desired values
        Returns:
            d(dict): a dictionary of key-value pairs
        """
        d = {}
        if not values:
            return None
        for i, v in zip(cursor.description, values):
            d[i[0]] = v
        return d

    def add_user(self, email, password_hash, role, address, phone):
        """Add User to user table.

        Args:
            email (string): email address of the user
            password_hash (string): password
        """
        # TODO: Handle address and phone with the new table structure
        cur = self.conn.cursor()
        try:
            cur.execute(
                'INSERT INTO Participant(email, password_hash, role, address, phone) VALUES (?, ?, ?, ?, ?)',
                (email, password_hash, role.value, address, phone)
            )
            self.conn.commit()
            cur.execute(
                'SELECT id FROM Participant WHERE email = ?',
                (email,)
            )
            _id = cur.fetchall()[0][0]
            return _id
        except (sqlite3.Error, mariadb.Error) as e:
            logging.error('Error_Connector_add_user: {}'.format(e))
            return None
        finally:
            cur.close()

    def get_user(self, email, password_hash):
        """Get All Users."""
        cur = self.conn.cursor()
        try:
            cur.execute(
                'SELECT id, role FROM Participant WHERE email = ? AND password_hash = ?',
                (email, password_hash,)
            )
            res = cur.fetchall()
            if len(res) < 1:
                return None
            return {
                'id': res[0][0],
                'role': res[0][1]
            }
        except (sqlite3.Error, mariadb.Error) as e:
            logging.error(
                'Error_Connector_get_users: {}'.format(e)
            )
            return None
        finally:
            cur.close()

    def add_user_session(self, user_id):
        """Add session for user authentication.

        Args:
            user_id (int): the id of the user
        Returns:
            session_id (string): session id
        """
        cur = self.conn.cursor()
        try:
            token = secrets.token_urlsafe()
            cur.execute(
                'INSERT INTO UserSession (token, user_id) VALUES (?, ?)',
                (token, user_id)
            )
            self.conn.commit()
        except (sqlite3.Error, mariadb.Error) as e:
            logging.error('Error_Connector_add_user_session: {}'.format(e))
            return None
        finally:
            cur.close()
        return token

    def check_session_validity(self, token, role=None):
        """Check the session validity.

        Args:
            token (string): session token
            ROLE (Role): optional role to specify
        Returns:
            user_id (int): the user id associated with the session,
            None if session id is expired or invalid
        """
        cur = self.conn.cursor()
        try:
            if role not in [None, Role.FACULTY_MEMBER, Role.EXTERNAL_GUEST]:
                raise TypeError("expected None, Role.FACULTY_MEMBER, Role.EXTERNAL_GUEST")
            date_30_min_ago = datetime.datetime.utcnow() - datetime.timedelta(minutes=30)
            if role:
                cur.execute(
                    "SELECT s.user_id FROM UserSession s \
                    INNER JOIN Participant u on u.role = ? AND u.id = s.user_id WHERE token = ? AND\
                    s.creation_time >= ? ",
                    (role.value, token, date_30_min_ago)
                )
            else:
                cur.execute(
                    "SELECT user_id FROM UserSession WHERE token = ? AND\
                    creation_time >= ?",
                    (token, date_30_min_ago)
                )
            res = cur.fetchall()
            if len(res) < 1:
                return None

            cur.execute(
                "UPDATE UserSession SET creation_time=CURRENT_TIMESTAMP WHERE token = ?",
                (token,)
            )
            self.conn.commit()
            return res[0][0]
        except (sqlite3.Error, mariadb.Error) as e:
            print(e)
            logging.error(
                'Error_Connector_check_session_validity: {}'.format(e)
            )
            return None
        finally:
            cur.close()

    def get_users(self):
        """Get All Users."""
        cur = self.conn.cursor()
        try:
            cur.execute(
                'SELECT id, email FROM Participant'
            )
            res = cur.fetchall()
            return res
        except (sqlite3.Error, mariadb.Error) as e:
            logging.error(
                'Error_Connector_get_users: {}'.format(e)
            )
            return None
        finally:
            cur.close()
        # maintaining clarity

    def log_user(self, user_id, barcode_id, checkin_time):
        """Log users barcode scanning.

        Args:
            user_id (string): Id of the user.
            barcode_id (string): Barcode scanned

        Returns:
            boolean: If the scan was succcessful
        """
        # TODO: implement log user
        cur = self.conn.cursor()
        try:
            cur.execute(
                'INSERT INTO Checkin(barcodeId, checkinTime, pId) VALUES (?, ?, ?)',
                (barcode_id, checkin_time, user_id)
            )
            self.conn.commit()
        except (sqlite3.Error, mariadb.Error) as e:
            logging.error('Error_log: {}'.format(e))
            return False
        finally:
            cur.close()
            return True

    def get_history(self, user_id):
        """Gets the history of the user

        Args: 
            user_id (string): Id of the user.

        Returns: 
            history (array): Array of the history  
        """
        try:
            cur = self.conn.cursor()
            cur.execute(
                'SELECT barcodeId, checkinTime FROM Checkin WHERE pId = ?',
                (user_id,)
            )
            res = cur.fetchall()
            history = []
            for i in res: 
                his = {
                    "barcodeId"   : i[0],
                    "checkinTime" : i[1]
                }
                history.append(his)
            return history
        except (sqlite3.Error, mariadb.Error) as e:
            logging.error('Error_get_history: {}'.format(e))
            return None
        finally:
            cur.close()        

connector = Connector()
