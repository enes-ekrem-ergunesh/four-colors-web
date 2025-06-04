DELIMITER $$

CREATE PROCEDURE delete_invalid_tokens()
BEGIN
  DELETE FROM tokens
  WHERE created_at <= DATE_SUB(NOW(), INTERVAL 7 DAY)
     OR revoked_at IS NOT NULL;
END$$

DELIMITER ;