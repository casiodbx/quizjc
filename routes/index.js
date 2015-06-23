var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors:[]});
});
/*GET autores*/
router.get('/autor', function(req, res) {
  res.render('autor', { autor: 'Juan Carlos Álvarez Martín' });
});

//Autoload de comandos con :quizId
router.param('quizId',quizController.load); //autoload :quizId

//Definíción de rutas de /quizes
router.get('/quizes',								quizController.index);
router.get('/quizes/search',						quizController.listQuestion);
router.get('/quizes/:quizId(\\d+)',					quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',			quizController.answer);
router.get('/quizes/new',							quizController.new);
router.post('/quizes/create',						quizController.create);

module.exports = router;
