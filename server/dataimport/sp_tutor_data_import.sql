USE `tutoriasfei`;
DROP procedure IF EXISTS `sp_tutor_data_import`;

DELIMITER $$
USE `tutoriasfei`$$
CREATE DEFINER=`dba`@`%` PROCEDURE `sp_tutor_data_import`(
  teacher_personnelNum VARCHAR(9),
  teacher_name VARCHAR(60),
  pupils_data TEXT
)
BEGIN
  DECLARE i INT DEFAULT 0; 
  DECLARE pupil_id_name VARCHAR(69);
  DECLARE pupil_id VARCHAR(9);
  DECLARE pupil_name VARCHAR(60);
  
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SIGNAL SQLSTATE 'ERR0R' SET MESSAGE_TEXT = 'ERROR_EN_QUERRY';
  END;
  
  SET autocommit = 0;
  START TRANSACTION;
  
  IF teacher_personnelNum = ''
      OR teacher_name = ''
      OR pupils_data = '' THEN
    SIGNAL SQLSTATE '45000';
  END IF;
  
  DROP TEMPORARY TABLE IF EXISTS temporary_table;
  DROP TEMPORARY TABLE IF EXISTS temporary_table_2;
  
  CREATE TEMPORARY TABLE IF NOT EXISTS temporary_table (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    pupil_id VARCHAR(9),
    pupil_name VARCHAR(60),
    added BOOLEAN DEFAULT FALSE,
    removed BOOLEAN DEFAULT FALSE,
    no_action BOOLEAN DEFAULT FALSE
  );
    
  INSERT IGNORE INTO Tutor (personnelNum, name)
  VALUES(teacher_personnelNum, teacher_name);
  
  process_pupils: LOOP
    
    SET i = i + 1;
    SET pupil_id_name = SPLIT_STR(pupils_data, '|', i);
    
    IF pupil_id_name = '' THEN
      LEAVE process_pupils;
    END IF;
    
    SET pupil_id = SPLIT_STR(pupil_id_name, ',', 1);
    SET pupil_name = SPLIT_STR(pupil_id_name, ',', 2);
    
    INSERT INTO temporary_table (id, pupil_id, pupil_name)
        VALUES(i, pupil_id, pupil_name);
	
    IF (SELECT COUNT(1) FROM Pupil WHERE studentId = pupil_id) = 0 THEN -- NEW PUPIL
    
	  INSERT INTO Pupil (studentId, name, idTutor)
          VALUES (pupil_id, pupil_name, teacher_personnelNum);
	  UPDATE temporary_table SET added = TRUE WHERE id = i;
    
    ELSEIF (SELECT COUNT(1) FROM Pupil
        WHERE studentId = pupil_id AND (idTutor != teacher_personnelNum OR isActive = FALSE)) = 1 THEN
        -- TUTOR CHANGE OR REACTIVATION
      
      UPDATE Pupil SET isActive = TRUE, idTutor = teacher_personnelNum WHERE studentId = pupil_id;
      UPDATE temporary_table SET added = TRUE WHERE id = i;
    
    END IF;
  
  END LOOP process_pupils;
  
  -- REMOVE PUPILS NOT FOUND
  CREATE TEMPORARY TABLE IF NOT EXISTS temporary_table_2 SELECT name AS pupil_name, studentId AS pupil_id
      FROM Pupil p LEFT JOIN temporary_table t ON p.studentId = t.pupil_id
      WHERE p.idTutor = teacher_personnelNum AND p.isActive = TRUE AND t.pupil_id IS NULL;
      
  INSERT INTO temporary_table (pupil_name, pupil_id, removed) SELECT *, TRUE as removed FROM temporary_table_2;
  UPDATE Pupil p INNER JOIN temporary_table_2 t ON p.studentId = t.pupil_id SET p.isActive = FALSE;
  
  -- MARK NO ACTION NEEDED
  UPDATE temporary_table SET no_action = TRUE WHERE added = FALSE AND removed = FALSE;
  
  COMMIT;

  SELECT * FROM temporary_table;
  DROP TEMPORARY TABLE IF EXISTS temporary_table;
  DROP TEMPORARY TABLE IF EXISTS temporary_table_2;
  
END$$

DELIMITER ;