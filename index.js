const input = document.querySelector('.input');
const section = document.querySelector('.section');
const result = document.querySelector('.result');

const delay  = (func) => {
  let start;
  return function (){
      clearTimeout(start)
      start = setTimeout(() => {
           func.apply(this, arguments)                   
          }, 500)
  }
};

async function searchRepository(inputValue) {
  try{
    const searchRepository = await fetch(
    `https://api.github.com/search/repositories?q=${inputValue}`
    );
    const searchRepositoryJson = await searchRepository.json();
    return searchRepositoryJson;
  } catch (err){
    console.log(err)
  }
};

input.addEventListener('keyup', delay(async function(e){
  const value = e.target.value.trim();
  if(value.length !== 0){
    const repositories = await searchRepository(value);
    createAutoCompletions (repositories.items) 
  }
}));
function createAutoCompletions (repoResult) {
  if (repoResult.length === 0) {
    alert('Репозиторий не существует')
  } else {
      section.innerHTML='';
      repoResult.forEach(element => {
        let div = document.createElement('div');
        div.className = 'selection';
        div.innerText = element.name;
        section.append(div);
      });
      section.addEventListener('click', function(e) {
        userSelection (e, repoResult)}, { once: true });
    }
};
function userSelection (e, repoResult){ 
  repoResult.forEach(item =>{
    if (item.name == e.target.innerText){
      let div = document.createElement('div');
      let btnClose = document.createElement('button');
      div.className = 'result-selected';
      div.innerText = 'Name: ' + item.name + '\n' + 'Owner: ' + item.owner.login + '\n'+ 'Stars: ' + item.stargazers_count;
      btnClose.className = 'button-close';
      div.append(btnClose);
      result.append(div);
    }
  })
  clearInput();
};

result.addEventListener('click', closeSelected);





function clearInput(){ 
  input.value = '';
  while(section.firstChild){  
    section.removeChild(section.firstChild)
  }
};

function closeSelected (e){
  if (e.srcElement.className == 'button-close'){
    e.target.parentElement.remove();
  }
}