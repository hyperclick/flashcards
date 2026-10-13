(async ()=>{
  const api = new Api();
  const frontSide = document.querySelector('.flip-card-front'); 
  const backSide = document.querySelector('.flip-card-back'); 
  const answerTag = backSide.firstElementChild;

  const question = await api.questions.next();
  frontSide.textContent = question.question_text;
  answerTag.textContent = question.answer_text;
  

  
})();
