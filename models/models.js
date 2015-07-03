var path=require('path');

//DATABASE_URL = "postgres://tslvylooqsufhf:HPWXywIq9pxZMv9Ej6RxBtpOIR@ec2-54-83-43-118.compute-1.amazonaws.com:5432/dbk956r9tu9ivs";
//SQLite DATABASE_URL =sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name		=	(url[6]|| null);
var user		=	(url[2]|| null);
var pwd			=	(url[3]|| null);
var protocol 	=	(url[1]|| null);
var dialect		=	(url[1]|| null);
var port 		=	(url[5]|| null);
var host 		=	(url[4]|| null);
var storage 	=	 process.env.DATABASE_STORAGE;

//Cargar Modelo ORM
var Sequelize 	= 	require('sequelize');

//Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name,user,pwd,
	{
		dialect: 	protocol,
		protocol: 	protocol,
		port: 		port,
		host: 		host,
		storage: 	storage, //Solo SQLite (.env)
		omitNull: 	true	 //Solo Postgres
	});

//Importar definción de la tabla Quiz
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

//Importar definicion de  la tabla Comment
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

//Modela la relación 1 a N con preguntas
Comment.belongsTo(Quiz); //Modela la parte del 1
Quiz.hasMany(Comment); //Modela la parte del n

exports.Quiz=Quiz;//exportar definición de tabla Quiz
exports.Comment=Comment; //exportar la definición de la tabla Comment

//sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function(){
	//sucess(...) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function(count){
		if (count === 0){ //la tabla se inicializa solo si está vacia
			Quiz.create ({ pregunta: 'Capital de Italia',
						respuesta:'Roma',tema:'humanidades'
						});
			Quiz.create ({ pregunta: 'Capital de Portugal',
							respuesta:'Lisboa',tema:'humanidades'
						})
			.then(function(){console.log('Base de datos inicializada')});
		};	
	});
});