INSERT INTO family_relations (person_id, relative_id, connection_type)
SELECT person_id, father_id, 'father'
FROM person
WHERE father_id IS NOT NULL;

INSERT INTO family_relations (person_id, relative_id, connection_type)
SELECT person_id, mother_id, 'mother'
FROM person
WHERE mother_id IS NOT NULL;

INSERT INTO family_relations (person_id, relative_id, connection_type)
SELECT person_id, spouse_id, 'spouse'
FROM person
WHERE spouse_id IS NOT NULL;

INSERT INTO family_relations (person_id, relative_id, connection_type)
SELECT father_id, person_id, 'son'
FROM person
WHERE father_id IS NOT NULL;

INSERT INTO family_relations (person_id, relative_id, connection_type)
SELECT mother_id, person_id, 'daughter'
FROM person
WHERE mother_id IS NOT NULL;

INSERT INTO family_relations (person_id, relative_id, connection_type)
SELECT p1.person_id, p2.person_id, 'sibling'
FROM person p1
JOIN person p2 ON p1.father_id = p2.father_id AND p1.mother_id = p2.mother_id
WHERE p1.person_id != p2.person_id AND p1.father_id IS NOT NULL AND p1.mother_id IS NOT NULL;
