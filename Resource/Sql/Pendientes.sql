CREATE TABLE IF NOT EXISTS tipo_documento (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(50) NULL,
  `descripcion` VARCHAR(2000) NULL,
  PRIMARY KEY (`id`));


CREATE TABLE IF NOT EXISTS departmento (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(50) NULL,
  `descripcion` VARCHAR(2000) NULL,
  PRIMARY KEY (`id`));


CREATE TABLE IF NOT EXISTS municipio (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(50) NULL,
  descripcion VARCHAR(2000) NULL,
  iddepartmento INT,
  PRIMARY KEY (id),
  foreign key (iddepartmento) references departmento(id)
);

create table estudiante(
  id INT NOT NULL AUTO_INCREMENT,
  primer_nombre VARCHAR(50) NULL,
  segundo_nombre VARCHAR(50) NULL,
  primer_apellido VARCHAR(50) NULL,
  segundo_apellido VARCHAR(50) NULL,
  id_tipo_documento int NOT NULL,
  numero_documento varchar(15),
  fecha_nacimiento date,
  id_municipio int NOT NULL,
  primary key(id),
  foreign key(id_tipo_documento) references tipo_documento(id) ON DELETE SET NULL ON UPDATE CASCADE,
  foreign key(id_municipio) references minicipio(id) ON DELETE SET NULL ON UPDATE CASCADE
);