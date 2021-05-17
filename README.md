# JTracer

Description
------------------
Tracer is a web-based contact tracing application, developed especially for Jacobs UniversityBremen.   Students and instructors are required to scan a QR-code which is attachedto  the  door  or  in  the  entrance  of  a  lecture  hall.   The  contact  details  of  the  user  arethen forwarded to the university,  which can manage them through the JTracer AccessManagement System (ACS). When there is an outbreak, this information will be managedby the respective admin. The records are stored in a user’s private digital diary and alsouploaded to the server.

Architecture Notes
------------------
* Backend is written in Python and uses Flask as a light weight server
* For Database the system uses Sqlite for local testing and mariadb for production
* The frontend is written in js + react and served using a node.js server.
* The frontend communicates with the backend using REST architecture.
* The Authentication is done use **SESSION_KEY** which should be set in the HTTP request header. **SESSION_KEY** can be obtained by calling `authenticate/` endpoint with appropriate `email` and `passwordHash`. The **SESSION_KEY** expires in 20 mins. 

Steps to setup & start the backend server
---------------------------------------------
* Make sure you have python virtual env installed. Create a virtual env in the root directory of the backend: `virtualenv venv`
* Switch to the venv: `source venv/bin/activate`
* Install all the python requirements: `pip3 install -r requirements.txt`
* Copy .env.sample to .env `cp .env.sample .env` (For production you need to modify the env variables appropriately to point to correct mariadb instance)
* Run the inital db migration from the root backend directory `yoyo apply`
* From the root backend directory run `python3 main.py`

Steps to setup & start the frontend server
------------------------------------------
* Make sure the backend in running!
* Make sure you have `node.js` installed. Install all the required packages using `npm install`.
* Run `npm start` to run in the development mode. 
