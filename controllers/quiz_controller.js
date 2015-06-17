var models = require('../models/models.js');

//GET /quizes/:id
exports.show = function (req,res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		res.render('render/show'), {quiz:quiz});

	})
};

//GET /quizes/answer
exports.answer = function (req,res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		if(req.query.respuesta===quiz.respuesta){
			res.render('quizes/answer',{quiz:quiz, respuesta:'Correcto'});
		}else{
			res.render('quiz/answer',{quiz:quiz, respuesta:'Incorrecto'});
		}
	})
};