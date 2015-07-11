var models = require('../models/models.js');
var temas = ["otro","humanidades","ocio","ciencia","tecnologia"];

// Autoload :id
exports.load = function(req, res, next, quizId) {
  models.Quiz.find({
            where: {
                id: Number(quizId)
            },
            include: [{
                model: models.Comment
            }]
        }).then(function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else{next(new Error('No existe quizId=' + quizId))}
    }
  ).catch(function(error){next(error)});
};


//GET /quizes
exports.index= function(req, res){	
	res.render('quizes/index', {errors:[]});	
};

//GET /quizes:search
exports.listQuestion= function(req, res){
  if(req.query.search) {
     var filtro  = (req.query.search || '').replace(" ", "%");
     models.Quiz.findAll({where:["pregunta like ?", '%'+filtro+'%'],order:'pregunta ASC'}).then(function(quizes){
       res.render('quizes/listQuestion', {quizes: quizes,errors:[]});
     }).catch(function(error) { next(error);});

  } else {

   models.Quiz.findAll().then(function(quizes){
       res.render('quizes/listQuestion', {quizes: quizes,errors:[]});
       }).catch(function(error) { next(error);});
  }
};


//GET /quizes/:id
exports.show = function (req,res){
	res.render('quizes/show', {quiz:req.quiz,errors:[]});	
};

//GET /quizes/answer
exports.answer = function (req,res){
		var resultado='Incorrecto';
		if(req.query.respuesta===req.quiz.respuesta){
			resultado='Correcto';
		}
		res.render('quizes/answer',{quiz:req.quiz, respuesta:resultado,errors:[]});
};

//GET /quizes/new
exports.new = function(req, res){
	var quiz = models.Quiz.build(//crea objeto quiz
		{pregunta:"Pregunta", respuesta:"Respuesta",tema:"otro"}
	);	
	res.render('quizes/new', {quiz:quiz,temas:temas,errors:[]});
};

//GET /quizes/create
exports.create = function(req, res){
	var quiz = models.Quiz.build( req.body.quiz );

	var errors = quiz.validate();//ya qe el objeto errors no tiene then(
	if (errors || (typeof errors === 'undefined') ) 
		{
			var i=0; 
			var errores=new Array();//se convierte en [] con la propiedad message por compatibilida con layout
			for (var prop in errors) 
				errores[i++]={message: errors[prop]};
			res.render('quizes/new', {quiz: quiz, errors: errores});
		} else {
			quiz // save: guarda en DB campos pregunta y respuesta de quiz
			.save({fields: ["pregunta", "respuesta","tema"]})
			.then( function(){ res.redirect('/quizes')}) ;
		}
};

//GET /quizes/:id/edit
exports.edit = function(req,res){
	var quiz= req.quiz;//autoload de instancia quiz
	res.render('quizes/edit',{quiz:quiz,temas:temas,errors:[]});
};

//PUT /quizes:id
exports.update = function(req,res){
	req.quiz.pregunta=req.body.quiz.pregunta;
	req.quiz.respuesta=req.body.quiz.respuesta;
	req.quiz.tema=req.body.quiz.tema;
	var errors = req.quiz.validate();//ya qe el objeto errors no tiene then(
	if (errors)
		{
			var i=0; var errores=new Array();//se convierte en [] con la propiedad message por compatibilida con layout
			for (var prop in errors) errores[i++]={message: errors[prop]};
			res.render('quizes/edit', {quiz: req.quiz, errors: errores});
		} else {
			req.quiz // save: guarda en DB campos pregunta y respuesta de quiz
			.save({fields: ["pregunta", "respuesta", "tema"]})
			.then( function(){ res.redirect('/quizes')}) ;
		}
};

//DELETE /quizes/:id
exports.destroy= function(req, res){
	req.quiz.destroy(). then( function(){
		res.redirect('/quizes');
	}).catch(function(error){next(error)});	
};

//Para la estadísticas de la base de datos
exports.statistics=function(req, res){
	var statistics={ n_preguntas: ' -- ',
             n_comentarios: ' -- ',
                 promedio_comentarios: ' -- ',
                 preg_sin_com: ' -- ',
                 preg_con_com: ' -- ',
                 comentarios_no_pub: '--'
                };

    models.sequelize.query('SELECT count(*) AS n FROM "Quizzes"').then(function(cuenta) {//nº de preguntas
        statistics.n_preguntas=cuenta[0].n;
        models.sequelize.query('SELECT count(*) AS n FROM "Comments"').then(function(cuenta) {//nº de comentarios
            statistics.n_comentarios=cuenta[0].n;
            if(+statistics.n_preguntas>0) statistics.promedio_comentarios=cuenta[0].n/statistics.n_preguntas;//si es 0 el número de preguntas no está definido
            models.sequelize.query('SELECT count(*) AS n FROM "Quizzes" WHERE "id" IN (SELECT DISTINCT "QuizId" FROM "Comments")').then(function(cuenta) {//nº de preguntas con comentario
                statistics.preg_con_com=cuenta[0].n;
                statistics.preg_sin_com=+statistics.n_preguntas-cuenta[0].n;
                models.sequelize.query('SELECT count(*) AS n FROM "Comments" WHERE NOT "publicado"').then(function(cuenta) {//nº de comentarios no publicados
                    statistics.comentarios_no_pub=cuenta[0].n;
                    res.render('statistics', {statistics: statistics, errors: []});
                });
            });
        });
      });
};