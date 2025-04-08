UPDATE person p1
SET spouse_id = (
    SELECT p2.person_id
    FROM person p2
    WHERE p2.spouse_id = p1.person_id
    AND p2.person_id IS NOT NULL
)
WHERE EXISTS (
    SELECT 1
    FROM person p2
    WHERE p2.spouse_id = p1.person_id
    AND p2.person_id IS NOT NULL
)
AND p1.spouse_id IS NULL;
