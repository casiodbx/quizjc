var models = require('../models/models.js');
//Autoload -factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId){
	models.Quiz.find(quizId).then(
		function(quiz){
			if (quiz){
				req.quiz=quiz;
				next();
			}else{next(new Error('No existe quizId='+quizId)); }
		}
	).catch(function(error){next(error);});
};


//GET /quizes
exports.index= function(req, res){
	res.render('quizes/index', {});	
};

//GET /quizes:search
exports.listQuestion= function(req, res){
	var filtro  = (req.query.search || '').replace(" ", "%");
	models.Quiz.findAll({where:["pregunta like ?", '%'+filtro+'%'],order:'pregunta ASC'}).then(function(quizes) {
		res.render('quizes/listQuestion', {quizes: quizes});	
	}
  ).catch(function(error){ next(error);})
};


//GET /quizes/:id
exports.show = function (req,res){
	res.render('quizes/show', {quiz:req.quiz});	
};

//GET /quizes/answer
exports.answer = function (req,res){
		var resultado='Incorrecto';
		if(req.query.respuesta===req.quiz.respuesta){
			resultado='Correcto';
		}
		res.render('quizes/answer',{quiz:req.quiz, respuesta:resultado});
};
//GET /quizes/new
exports.new= function(req, res){
	var quiz = models.Quiz.build(//crea objeto quiz
		{pregunta:"Pregunta", respuesta:"Respuesta"}
	);

	res.render('new', {quiz:quiz});
};

//GET /quizes/create
exports.create = function(req, res){
	var quiz = models.Quiz.build(req.body.quiz);
	//Guarda en DB los camos pregunta y respuesta de quiz
	quiz.save({fields:["pregunta", "respuesta"]}).then(function(){
		res.redirect('/quizes');
	})// Redirección HTTP (URL relativo) lista de preguntas
};