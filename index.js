var quiz = {
  questions: [
    {
      text: "In what year was Spider-Man first published?",
      choices: ["1959", "1962", "1967", "1970"],
      answerIndex: 1
    },
    {
      text: "Who was Peter Parker's first girlfriend?",
      choices: ["Gwen Stacy", "Black Cat", "Mary Jane Watson", "Betty Brant"],
      answerIndex: 3
    },
    {
      text: "Who was the first super villain Spider-Man ever fought?",
      choices: ["The Chameleon", "Venom", "Dr. Octopus", "Green Goblin"],
      answerIndex: 0
    },
    {
      text: "Who was the first superhero from DC Comics to fight Spider-Man?",
      choices: ["Batman", "Wonder Woman", "Superman", "Green Arrow"],
      answerIndex: 2
    },
    {
      text: "In 2012, which super villain succeeded in killing Spider-Man?",
      choices: ["Venom", "Dr. Octopus", "Kraven the Hunter", "Carnage"],
      answerIndex: 1
    }],

    good: [
      "Way to go, web-slinger!",
      "Nice work!"],

    wrong: [
      "Nope.",
      "That's the wrong answer!"],

    score: 0,
    currentQuestionIndex: 0,
    path: 'Start',
    lastAnswerCorrect: false,
    feedbackRandom: 0,
};

function setPath(quiz, path) {
  quiz.path = path;
}

function resetGame(quiz) {
  quiz.score = 0;
  quiz.currentQuestionIndex = 0;
  setPath(quiz, 'Start');
}

function answerQuestion(quiz, answer) {
  var currentQuestion = quiz.questions[quiz.currentQuestionIndex];
  quiz.lastAnswerCorrect = currentQuestion.answerIndex === answer;
  if (quiz.lastAnswerCorrect) {
    quiz.score++;
  }
  selectFeedback(quiz);
  setPath(quiz, 'answer-feedback');
}

function selectFeedback(quiz) {
  quiz.feedbackRandom = Math.random();
}

function advance(quiz) {
  quiz.currentQuestionIndex++;
  if (quiz.currentQuestionIndex === quiz.questions.length) {
    setPath(quiz, 'final-feedback');
  } else {
    setPath(quiz, 'question');
  }
}

function renderQuiz(quiz, elements) {
  Object.keys(elements).forEach(function(path) {
    elements[path].hide();
  });
  elements[quiz.path].show();
  if (quiz.path === 'Start') {
    // renderStartPage(quiz, elements[quiz.path]);
  } else if (quiz.path === 'question') {
    renderQuestionPage(quiz, elements[quiz.path]);
  } else if (quiz.path === 'answer-feedback') {
    renderAnswerFeedbackPage(quiz, elements[quiz.path]);
  } else if (quiz.path === 'final-feedback') {
    renderFinalFeedbackPage(quiz, elements[quiz.path]);
  }
}

/* function renderStartPage(quiz, element) {
  // Nothing needs to go in here.
} */

function renderQuestionPage(quiz, element) {
  renderQuestionCount(quiz, element.find('.question-count'));
  renderQuestionText(quiz, element.find('.question-text'));
  renderChoices(quiz, element.find('.choices'));
}

function renderAnswerFeedbackPage(quiz, element) {
  renderAnswerFeedbackHeader(quiz, element.find('.feedback-header'));
  renderAnswerFeedbackText(quiz, element.find('.feedback-text'));
  renderNextButtonText(quiz, element.find('.see-next'));
}

function renderFinalFeedbackPage(quiz, element) {
  renderFinalFeedbackText(quiz, element.find('.results-text'));
}

function renderQuestionCount(quiz, element) {
  var text = (quiz.currentQuestionIndex + 1) + "/" + quiz.questions.length;
  element.text(text);
}

function renderQuestionText(quiz, element) {
  var currentQuestion = quiz.questions[quiz.currentQuestionIndex];
  element.text(currentQuestion.text);
}

function renderChoices(quiz, element) {
  var currentQuestion = quiz.questions[quiz.currentQuestionIndex];
  var choices = currentQuestion.choices.map(function(choice, index) {
    return (
      '<li>' +
      '<input type="radio" name="user-answer" value="' + index + '" required>' +
      '<label>' + choice + '</label>' +
      '</li>'
      );
  });
  element.html(choices);
}

function renderAnswerFeedbackHeader(quiz, element) {
  var html = quiz.lastAnswerCorrect ?
  "<h1>Correct</h1>" :
  "<h1>Incorrect</h1>";
  element.html(html);
}

function renderAnswerFeedbackText(quiz, element) {
  var choices = quiz.lastAnswerCorrect ? quiz.good : quiz.wrong;
  var text = choices[Math.floor(quiz.feedbackRandom * choices.length)];
  element.text(text);
}

function renderNextButtonText(quiz, element) {
  var text = quiz.currentQuestionIndex < quiz.questions.length - 1 ?
  "Next" : "Continue";
  element.text(text);
}

function renderFinalFeedbackText(quiz, element) {
  var text = "You got " + quiz.score + " out of " + quiz.questions.length + " questions right!";
  element.text(text);
}

var PAGE_ELEMENTS = {
	'Start': $('.start-page'),
	'question': $('.questions-page'),
	'answer-feedback': $('.answer-feedback-page'),
	'final-feedback': $('.final-feedback-page'),
};


$(".game-start").submit(function(event) {
	event.preventDefault();
	setPath(quiz, 'question');
	renderQuiz(quiz, PAGE_ELEMENTS);
});

$('.restart-game').click(function(event) {
	event.preventDefault();
	resetGame(quiz);
	renderQuiz(quiz, PAGE_ELEMENTS);
});

$("form[name='current-question']").submit(function(event) {
	event.preventDefault();
	var answer = $("input[name='user-answer']:checked").val();
	answer = parseInt(answer, 10);
	answerQuestion(quiz, answer);
	renderQuiz(quiz, PAGE_ELEMENTS);
});

$('.see-next').click(function(event) {
	advance(quiz);
	renderQuiz(quiz, PAGE_ELEMENTS);
});


$(function() {
	renderQuiz(quiz, PAGE_ELEMENTS);
});
