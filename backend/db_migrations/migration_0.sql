CREATE TABLE Participant(
    id INTEGER,
    email VARCHAR(40) NOT NULL UNIQUE,
    password_hash VARCHAR(40) NOT NULL,
    role VARCHAR(40) NOT NULL,
    address VARCHAR(255),   
    phone VARCHAR(255),
    PRIMARY KEY (id)
);

CREATE TABLE ClassOccupancy(
    classId INTEGER,
    location VARCHAR(40),
    fullyOccupied VARCHAR(40),
    checkinTime VARCHAR(40),
    PRIMARY KEY (classId)
);

CREATE TABLE Checkin(
    checkinId INTEGER,
    barcodeId VARCHAR(40),
    checkinTime VARCHAR(40),
    pId INTEGER,
    -- cId INTEGER,
    PRIMARY KEY (checkinId),
    FOREIGN KEY (pId) REFERENCES Participant(id)
    -- FOREIGN KEY (cId) REFERENCES ClassOccupancy(classId)
);

CREATE TABLE UserSession(
  id INTEGER,
  token VARCHAR(40) UNIQUE,
  creation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  user_id INTEGER,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES Participant(id)
);

