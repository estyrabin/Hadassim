

CREATE TABLE person (
    person_id INT NOT NULL,
    personal_name VARCHAR(255) NOT NULL,
    family_name VARCHAR(255) NOT NULL,
    gender VARCHAR(255) NOT NULL,
    father_id INT,
    mother_id INT,
    spouse_id INT,
    PRIMARY KEY (person_id)
);

CREATE TABLE family_relations (
    person_id INT,
    relative_id INT,
    connection_type VARCHAR(50)
);
