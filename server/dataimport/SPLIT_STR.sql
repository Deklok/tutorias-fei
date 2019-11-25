USE `tutoriasfei`;
DROP function IF EXISTS `SPLIT_STR`;

DELIMITER $$
USE `tutoriasfei`$$
CREATE DEFINER=`dba`@`%` FUNCTION `SPLIT_STR`(
  x TEXT,
  delim VARCHAR(12),
  pos INT
) RETURNS text CHARSET latin1
BEGIN

RETURN REPLACE(SUBSTRING(SUBSTRING_INDEX(x, delim, pos),
       LENGTH(SUBSTRING_INDEX(x, delim, pos -1)) + 1),
       delim, ''); 
END$$

DELIMITER ;