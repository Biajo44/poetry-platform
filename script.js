const poems=[
	{
		title: "Harmonia Celestial",
		author: "Anônimo",
		content: `Nos raios do sol, tua beleza resplandece,
		Uma musa divina, que aos meus olhos aquece.
		Com um sorriso gentil, cativas meu olhar,
		Tua doçura, um doce mel, que em mim faz brotar.

		Teus risos são melodias celestiais,
		Encantando o coração com seus tons angelicais.
		Teu jeito cativante, uma dança no ar,
		Faz o mundo inteiro se curvar e te admirar.

		Oh, garota adorável, como és especial,
		Teu encanto é como uma estrela no céu astral.
		Quero te amar a cada novo amanhecer,
		Pois em teu amor encontro meu ser florescer.

		Que o universo seja testemunha desse destino.

		Em cada palavra, em cada gesto, em cada olhar,
		É o amor que nos une, é o amor que nos faz voar.`
	},

	{
		title: "Caminho Gelado",
		author: "Anônimo",
		content: `No horizonte pálido, a esperança se vai,
		A marcha é pesada, o fardo é mortal.
		Sob o céu cortante, a dor é constante,
		Uma possível vitória se esconde em vão,
		Soldados em fila, mas sem coração.

		O frio devora, a fome é agonia,
		Passos vacilantes em chão de armadilhas.
		Cada sombra avança como um inimigo inteiro,
		E o tempo parece um algoz derradeiro.
		Corações de ferro se quebram em prantos,
		A bravura se perde entre medos e espantos.

		Batalhas perdidas, um grito abafado,
		A honra se torna um fardo pesado.
		Quando a noite cai, o terror se instala
		Na mente das almas que a dor não cala.
		Um império desmorona sob o peso da dor,
		E o riso da vitória se torna só clamor.

		Um campo de cinzas onde sonhos murcharam,
		A glória é mentira que as sombras levaram.
		A derrota amarga se espalha no ar,
		E, na frieza da história,
		Só resta chorar e esperar a morte chegar.`
	},
	{
		title:"Flor Rara do Meu Destino",
		author: "Anônimo",
		content:`No jardim da vida, ela é a flor mais rara,
		Com pétalas de risos que a tristeza não ampara.
		Com fé inabalável e coragem radiante,
		Um laço eterno que ne dois corações em destinos.

		Entre páginas de livros, navega em mares profundos,
		Cada história é m sonho, cada verso, um mundo.
		Com olhos que brilham, como estrelas a brilhar,
		Seu olhar encantador faz o tempo parar.

		Sua beleza transcende as artes imortais,
		Nem Van Gogh com seus girassóis jamais lhe faz iguais.
		Michelangelo em mármore não consegue captar,
		A luz que em seu ser ilumina o meu andar.

		Como Da Vinci em sua tela divina,
		Teu sorriso é a Mona Lisa que ilumina.
		E em cada traço que o mundo pode ver,
		É a essência do amor que faz meu coração viver.

		Ao passear sob o sol, seu riso ecoa leve,
		É como uma melodia que a brisa recebe.
		As flores que ama são reflexo do seu ser,
		Colorindo os dias com seu jeito de viver.

		Seu estilo é poesia em forma de olhar,
		Uma mistura de cores que faz o coração dançar.
		E quando fala com graça, o mundo se ilumina,
		Cada palavra é doce como a mais pura sina.

		Eu admiro essa luz que ela traz!
		Um amor tão sincero que nunca se desfaz.
		Em cada gesto e sorriso, ela espalha calor,
		É um abraço do universo, é a essência do amor. `
	}
];


	//* state *//

let currentPoemIndex=0;
let currentCharIndex=0;
let isTyping=true;
let isPaused=false;
let typingInterval=null;
let waitTimeout=null;
let progressInterval=null;
let progressStartTime=0;
const TYPING_SPEED=50;
const WAIT_TIME=5000;


	//* DOM elements *//

const poemTitleEl=document.getElementById('poem-title');
const poemAuthorEl=document.getElementById('poem-author');
const poemContentEl=document.getElementById('poem-content');
const cursorEl=document.getElementById('cursor');
const indicatorsEl=document.getElementById('poem-indicators');
const progressBarEl=document.getElementById('progress-bar');
const currentPoemNumEl=document.getElementById('current-poem-num');
const totalPoemsEl=document.getElementById('total-poems');
const pauseBtn=document.getElementById('pause-btn');
const prevBtn=document.getElementById('prev-btn');
const nextBtn=document.getElementById('next-btn');
const pauseIcon=document.getElementById('pause-icon');
const playIcon=document.getElementById('play-icon');
const pageTitleEl=document.getElementById('page-title');


	//* default config *//

const defaultConfig={
      page_title: "Versos ao Luar"
    };


    //* initialize indicators *//

    function initIndicators() {
      indicatorsEl.innerHTML = '';
      poems.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = `w-3 h-3 rounded-full transition-all ${index === currentPoemIndex ? 'bg-amber-400 scale-125' : 'bg-slate-600 hover:bg-slate-500'}`;
        dot.setAttribute('aria-label', `Ir para poema ${index + 1}`);
        dot.onclick = () => goToPoem(index);
        indicatorsEl.appendChild(dot);
      });
      totalPoemsEl.textContent = poems.length;
    }


    //* update indicators *//

    function updateIndicators() {
      const dots = indicatorsEl.children;
      for (let i = 0; i < dots.length; i++) {
        dots[i].className = `w-3 h-3 rounded-full transition-all ${i === currentPoemIndex ? 'bg-amber-400 scale-125' : 'bg-slate-600 hover:bg-slate-500'}`;
      }
      currentPoemNumEl.textContent = currentPoemIndex + 1;
    }


    //* start typing effect *//

    function startTyping() {
      const poem = poems[currentPoemIndex];
      poemTitleEl.textContent = poem.title;
      poemAuthorEl.textContent = `— ${poem.author}`;
      poemContentEl.textContent = '';
      currentCharIndex = 0;
      isTyping = true;
      progressBarEl.style.width = '0%';

      clearInterval(typingInterval);
      clearTimeout(waitTimeout);
      clearInterval(progressInterval);

      if (!isPaused) {
        typingInterval = setInterval(typeNextChar, TYPING_SPEED);
      }
    }


    //* type nest character *//

     function typeNextChar() {
      const poem = poems[currentPoemIndex];
      if (currentCharIndex < poem.content.length) {
        poemContentEl.textContent += poem.content[currentCharIndex];
        currentCharIndex++;


    //* update progress during typing *//

         const typingProgress = (currentCharIndex / poem.content.length) * 50;
        progressBarEl.style.width = `${typingProgress}%`;
      } else {
        clearInterval(typingInterval);
        isTyping = false;
        startWaitProgress();
      }
    }


    //* start wait progress after typing *//

    function startWaitProgress() {
      progressStartTime = Date.now();
      progressBarEl.style.width = '50%';
      
      progressInterval = setInterval(() => {
        if (isPaused) return;
        
        const elapsed = Date.now() - progressStartTime;
        const waitProgress = 50 + (elapsed / WAIT_TIME) * 50;
        progressBarEl.style.width = `${Math.min(waitProgress, 100)}%`;
        
        if (elapsed >= WAIT_TIME) {
          clearInterval(progressInterval);
          nextPoem();
        }
      }, 50);
    }



    //* go to nest poem *//

     function nextPoem() {
      currentPoemIndex = (currentPoemIndex + 1) % poems.length;
      updateIndicators();
      startTyping();
    }


    //* Go to previous poem *//

    function prevPoem() {
      currentPoemIndex = (currentPoemIndex - 1 + poems.length) % poems.length;
      updateIndicators();
      startTyping();
    }


    //* Go to specific poem *//

    function goToPoem(index) {
      currentPoemIndex = index;
      updateIndicators();
      startTyping();
    }


    //* Toggle pause *//

    function togglePause() {
      isPaused = !isPaused;
      pauseIcon.classList.toggle('hidden', isPaused);
      playIcon.classList.toggle('hidden', !isPaused);

      if (isPaused) {
        clearInterval(typingInterval);
        clearInterval(progressInterval);
      } else {
        if (isTyping) {
          typingInterval = setInterval(typeNextChar, TYPING_SPEED);
        } else {
          startWaitProgress();
        }
      }
    }


    //* Event listeners *//
    pauseBtn.addEventListener('click', togglePause);
    prevBtn.addEventListener('click', prevPoem);
    nextBtn.addEventListener('click', nextPoem);


    //* Keyboard controls *//

    document.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        togglePause();
      } else if (e.key === 'ArrowRight') {
        nextPoem();
      } else if (e.key === 'ArrowLeft') {
        prevPoem();
      }
    });


    //* Element SDK initialization *//

    const elementSdkHandler = {
      defaultConfig,
      onConfigChange: async (config) => {
        pageTitleEl.textContent = config.page_title || defaultConfig.page_title;
      },
      mapToCapabilities: (config) => ({
        recolorables: [],
        borderables: [],
        fontEditable: undefined,
        fontSizeable: undefined
      }),
      mapToEditPanelValues: (config) => new Map([
        ["page_title", config.page_title || defaultConfig.page_title]
      ])
    };


    //* Initialize *//

    if (window.elementSdk) {
      window.elementSdk.init(elementSdkHandler);
    }
    
    initIndicators();
    startTyping();










