/***************** CAMBIOS 27/01/2017*******************************************/

CREATE TABLE IF NOT EXISTS tipo_documento (
  id INT(11) NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(50) NULL,
  descripcion VARCHAR(2000) NULL,
  PRIMARY KEY (id))Engine=InnoDB;


CREATE TABLE IF NOT EXISTS departmento (
  id INT(11) NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(50) NULL,
  descripcion VARCHAR(2000) NULL,
  PRIMARY KEY (id))Engine=InnoDB;


CREATE TABLE IF NOT EXISTS municipio (
  id INT(11) NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(50) NULL,
  descripcion VARCHAR(2000) NULL,
  iddepartmento INT(11),
  PRIMARY KEY (id),
  foreign key (iddepartmento) references departmento(id) ON DELETE SET NULL ON UPDATE CASCADE
)Engine=InnoDB;

create table estudiante(
  id INT(11) NOT NULL AUTO_INCREMENT,
  primer_nombre VARCHAR(50) NULL,
  segundo_nombre VARCHAR(50) NULL,
  primer_apellido VARCHAR(50) NULL,
  segundo_apellido VARCHAR(50) NULL,
  id_tipo_documento INT(11),
  numero_documento VARCHAR(15) NOT NULL,
  fecha_nacimiento DATE NULL,
  id_municipio INT(11),
  primary key(id),
  foreign key(id_tipo_documento) references tipo_documento(id) ON DELETE SET NULL ON UPDATE CASCADE,
  foreign key(id_municipio) references municipio(id) ON DELETE SET NULL ON UPDATE CASCADE
)Engine=InnoDB;


/*****************FIN CAMBIOS 27/01/2017*******************************************/