-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema MusicVenue2
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema MusicVenue2
-- -----------------------------------------------------


CREATE SCHEMA IF NOT EXISTS `MusicVenue2` DEFAULT CHARACTER SET utf8 ;
USE `MusicVenue2` ;

-- -----------------------------------------------------
-- Table `MusicVenue2`.`PURCHASER`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MusicVenue2`.`PURCHASER` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(45) NOT NULL,
  `Address` VARCHAR(45) NOT NULL,
  `DOB` VARCHAR(45) NOT NULL,
  `Email` VARCHAR(45) NOT NULL,
  `Password` VARCHAR(45) NOT NULL,
  `Pnum` VARCHAR(45) NULL,
  PRIMARY KEY (`ID`),
  UNIQUE INDEX `ID_UNIQUE` (`ID` ASC) VISIBLE,
  UNIQUE INDEX `Pnum_UNIQUE` (`Pnum` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MusicVenue2`.`SCHEDULE`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MusicVenue2`.`SCHEDULE` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Day` INT NOT NULL,
  `Month` VARCHAR(45) NOT NULL,
  `Year` INT NOT NULL,
  `Time` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE INDEX `ID_UNIQUE` (`ID` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MusicVenue2`.`EVENT`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MusicVenue2`.`EVENT` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(45) NOT NULL,
  `Genre` VARCHAR(45) NOT NULL,
  `SCHEDULE_ID` INT NOT NULL,
  PRIMARY KEY (`ID`, `SCHEDULE_ID`),
  UNIQUE INDEX `ID_UNIQUE` (`ID` ASC) VISIBLE,
  INDEX `fk_EVENT_SCHEDULE1_idx` (`SCHEDULE_ID` ASC) VISIBLE,
  CONSTRAINT `fk_EVENT_SCHEDULE1`
    FOREIGN KEY (`SCHEDULE_ID`)
    REFERENCES `MusicVenue2`.`SCHEDULE` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MusicVenue2`.`SEATING`
-- -----------------------------------------------------


CREATE TABLE IF NOT EXISTS `MusicVenue2`.`SEATING` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Area` VARCHAR(45) NOT NULL,
  `Row` VARCHAR(45) NOT NULL,
  `Snum` VARCHAR(45) NOT NULL,
  `EVENT_ID` INT NOT NULL,
  PRIMARY KEY (`ID`, `EVENT_ID`),
  UNIQUE INDEX `ID_UNIQUE` (`ID` ASC) VISIBLE,
  INDEX `fk_SEATING_EVENT1_idx` (`EVENT_ID` ASC) VISIBLE,
  CONSTRAINT `fk_SEATING_EVENT1`
    FOREIGN KEY (`EVENT_ID`)
    REFERENCES `MusicVenue2`.`EVENT` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MusicVenue2`.`TICKET`
-- -----------------------------------------------------


CREATE TABLE IF NOT EXISTS `MusicVenue2`.`TICKET` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Num` VARCHAR(45) NOT NULL,
  `SEATING_ID` INT NOT NULL,
  `PURCHASER_ID` INT NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`, `SEATING_ID`, `PURCHASER_ID`),
  UNIQUE INDEX `ID_UNIQUE` (`ID` ASC) VISIBLE,
  INDEX `fk_TICKET_SEATING1_idx` (`SEATING_ID` ASC) VISIBLE,
  INDEX `fk_TICKET_PURCHASER1_idx` (`PURCHASER_ID` ASC) VISIBLE,
  CONSTRAINT `fk_TICKET_SEATING1`
    FOREIGN KEY (`SEATING_ID`)
    REFERENCES `MusicVenue2`.`SEATING` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TICKET_PURCHASER1`
    FOREIGN KEY (`PURCHASER_ID`)
    REFERENCES `MusicVenue2`.`PURCHASER` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

