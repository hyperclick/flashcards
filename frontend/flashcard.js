(async ()=>{
  const api = new Api();
  const frontSide = document.querySelector('.flip-card-front'); 
  const backSide = document.querySelector('.flip-card-back'); 
  const answerTag = backSide.firstElementChild;

  const question = await api.questions.next();
  frontSide.innerHTML = marked.parse(question.question_text);
  answerTag.innerHTML = marked.parse(question.answer_text);
  

  
})();
