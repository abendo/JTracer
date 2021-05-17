# JTracer

Motivation
------------------
With the Covid-19 infection spread everywhere in the world, countries, companies, and businesses have been affected. Henceforth, the health of the community is being gambled,and furthermore the global economy. Many public and/or private institutions in light of this flare-up, are consolidating their endeavors to find an effective solution so that transmissionis eased back, and hindered where conceivable. Applications are in this manner easily accessed and have different advantageous capacities associated with the Covid-19 pandemic. Thereupon, tracing and warning applications can help break the chain of coronavirus infections and save lives. 

Description
------------------
Tracer is a web-based contact tracing application, developed especially for Jacobs University Bremen.   Students and instructors are required to scan a QR-code which is attached to  the  door  or  in  the  entrance  of  a  lecture  hall.   The  contact  details  of  the  user  are then forwarded to the university,  which can manage them through the JTracer Access Management System (ACS) - not part of this project. When there is an outbreak, this information will be managed by the respective admin. The records are stored in a user’s private digital diary and also uploaded to the server.

Architecture Notes
------------------
* Backend is written in Python and uses Flask as a light weight server
* For Database the system uses Sqlite for local testing and MariaDB for production
* The frontend is written in JavaScript, React and served using a Node.js server.
* The frontend communicates with the backend using REST architecture.
* The Authentication is done by using **SESSION_KEY** which should be set in the HTTP request header. **SESSION_KEY** can be obtained by calling `authenticate/` endpoint with appropriate `email` and `passwordHash`. The **SESSION_KEY** expires in 20 mins. 

Steps to setup & start the backend server
---------------------------------------------
* Have python virtual env installed. Create a virtual env in the root directory of the backend: `virtualenv venv`
* Switch to the venv: `source venv/bin/activate`
* Install all the python requirements: `pip3 install -r requirements.txt`
* Copy .env.sample to .env `cp .env.sample .env` (For production you need to modify the env variables appropriately to point to correct MariaDB instance)
* Run the inital database migration from the root backend directory `yoyo apply`
* From the root backend directory run `python3 main.py`

Steps to setup & start the frontend server
------------------------------------------
* Check if the backend is running
* Make sure you have `Node.js` installed 
* Install all the required packages using `npm install`
* Run `npm start` to run in the development mode

Contributions 
------------------
* The great thing about open-source projects is that many people can see and contribute. If one is interested, please fork the repository and create a pull request with main.
* Contact information: **albrit.bendo@gmail.com**