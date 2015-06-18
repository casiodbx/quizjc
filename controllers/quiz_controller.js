var models = require('../models/models.js');

//GET /quizes/:id
exports.show = function (req,res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
<<<<<<< HEAD
		res.render('quizes/show'), {quiz:quiz});
=======
		res.render('render/show'), {quiz:quiz});

>>>>>>> 5c906477af2eb106013325a24b8aa4c482a59116
	})
};

//GET /quizes/answer
exports.answer = function (req,res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		if(req.query.respuesta===quiz.respuesta){
			res.render('quizes/answer',{quiz:quiz, respuesta:'Correcto'});
		}else{
<<<<<<< HEAD
			res.render('quizes/answer',{quiz:quiz, respuesta:'Incorrecto'});
		}
	})
};

//GET /quizes
exports.index= function(req, res){
	models.Quiz.findAll().then(function(quizes) {
		res.render('quizes/quizes.ejs', {quizes: quizes});	
=======
			res.render('quiz/answer',{quiz:quiz, respuesta:'Incorrecto'});
		}
>>>>>>> 5c906477af2eb106013325a24b8aa4c482a59116
	})
};