document.addEventListener('DOMContentLoaded', function() {
    
    // ==================================================
    // 1. NAVEGAÇÃO DAS SECÇÕES & LIGHTBOX
    // ==================================================
    
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const header = document.querySelector('header'); // Captura o header

    // Elementos do Lightbox
    const lightbox = document.getElementById('lightbox');
    const imgAmpliada = document.getElementById('img-ampliada');
    const captionText = document.getElementById('caption');
    const closeBtn = document.querySelector('.close-btn');
    const galleryImages = document.querySelectorAll('.gallery img');

    /**
     * Função REVISADA para mostrar uma secção e ocultar as outras.
     * Deixa o CSS tratar das animações (opacity, transform)
     * ao adicionar/remover a classe .hidden.
     */
    function showSection(targetId) {
        let sectionToShow = null;
        // Se o header existir, pega a altura, senão, usa 0.
        const headerHeight = header ? header.offsetHeight : 0;

        contentSections.forEach(section => {
            if (section.dataset.sectionId === targetId) {
                section.classList.remove('hidden');
                sectionToShow = section; // Armazena a secção que será exibida

                // Inicia o quiz QUANDO a secção do quiz for mostrada
                if (targetId === 'quiz-content' && typeof startQuiz === 'function') {
                    startQuiz();
                }
            } else {
                section.classList.add('hidden');
            }
        });
        
        // Atualiza a classe 'active' nos links de navegação
        navLinks.forEach(link => {
            if (link.dataset.target === targetId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Scroll suave para a secção exibida, se ela for encontrada
        if (sectionToShow) {
            window.scrollTo({
                top: sectionToShow.offsetTop - headerHeight, // Desconta a altura do header
                behavior: 'smooth'
            });
        }
    }

    // Adiciona evento de clique aos links de navegação
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); 
            const targetId = this.dataset.target;
            showSection(targetId);
        });
    });

    // --- Lógica do Lightbox ---
    galleryImages.forEach(image => {
        image.addEventListener('click', () => {
            const fullSizeSrc = image.dataset.fullsizeSrc || image.src;
            const altText = image.alt;
            
            if (imgAmpliada) imgAmpliada.src = fullSizeSrc;
            if (captionText) captionText.innerHTML = altText;
            if (lightbox) lightbox.classList.add('active');
        });
    });

    // Função para fechar o lightbox
    function closeLightbox() {
        if (lightbox) lightbox.classList.remove('active');
    }

    // Eventos para fechar o lightbox (com verificação se os elementos existem)
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (lightbox) lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) { // Fecha só se clicar no fundo
            closeLightbox();
        }
    });

    // --- Carregamento Inicial ---
    const initialSectionId = window.location.hash ? window.location.hash.substring(1).replace('-section', '-content') : 'historia-content';
    showSection(initialSectionId);

    // Ajuste do link "Saiba Mais" do hero (com verificação)
    const heroBtn = document.querySelector('#hero .btn');
    if (heroBtn) {
        heroBtn.addEventListener('click', function(event) {
            event.preventDefault();
            showSection('historia-content');
        });
    }

    // ==================================================
    // 2. LÓGICA DO QUIZ (COM EXPLICAÇÕES)
    // ==================================================
    
    // BANCO DE PERGUNTAS ATUALIZADO COM EXPLICAÇÕES
    const questions = [
        {
            question: "Situação 1: A Abordagem. Numa área de classe média, a polícia aborda e revista apenas dois jovens negros. Outros jovens brancos passam e não são parados. Houve preconceito?",
            answers: [
                { text: "Sim", correct: true },
                { text: "Não", correct: false }
            ],
            explanation: "Sim. Isso é um exemplo de racismo estrutural. A suspeição baseada na cor da pele (perfilamento racial) é uma prática discriminatória e desigual."
        },
        {
            question: "Situação 2: O Cabelo. Uma diretora de escola pede a uma aluna negra para prender seu cabelo crespo (black power), dizendo que 'não faz parte do uniforme' e 'chama muita atenção'. Houve preconceito?",
            answers: [
                { text: "Sim", correct: true },
                { text: "Não", correct: false }
            ],
            explanation: "Sim. Isso é racismo. O cabelo crespo é um traço de identidade racial. Exigir que ele seja 'controlado' para se adequar a um padrão de 'ordem' (geralmente branco-europeu) é discriminatório."
        },
        {
            question: "Situação 3: A Vaga. Um comerciante não contrata um candidato qualificado após descobrir que ele pratica Candomblé, alegando 'não se sentir confortável'. Houve preconceito?",
            answers: [
                { text: "Sim", correct: true },
                { text: "Não", correct: false }
            ],
            explanation: "Sim. Isso é racismo religioso (ou intolerância religiosa). Discriminar alguém com base em sua fé, especialmente religiões de matriz africana, é preconceito e ilegal."
        },
        {
            question: "Situação 4: A Aula. Um professor de história ensina sobre o Brasil Colônia e só menciona pessoas negras no contexto da escravidão, ignorando reinos africanos ou a resistência (Quilombos). Isto é uma forma de preconceito?",
            answers: [
                { text: "Sim", correct: true },
                { text: "Não", correct: false }
            ],
            explanation: "Sim. Embora sutil, isso é parte do racismo estrutural. O 'apagamento histórico' retira a agência, a cultura e a história de resistência do povo negro, reforçando o estereótipo de passividade."
        },
        {
            question: "Situação 5: A Vaga de Emprego. Uma empresa abre uma vaga 'exclusiva para pessoas negras'. Um candidato branco reclama, dizendo que isso é 'racismo reverso'. A reclamação é válida?",
            answers: [
                { text: "Não", correct: true },
                { text: "Sim", correct: false }
            ],
            explanation: "Não, a reclamação não é válida. 'Racismo reverso' não existe, pois racismo é um sistema de opressão histórica e estrutural. Vagas afirmativas são ferramentas legais para corrigir desigualdades históricas."
        },
        {
            question: "Situação 6: A Expressão. Alguém usa a palavra 'denegrir' para falar mal de algo. Um colega aponta que o termo é racista. A primeira pessoa diz: 'É só uma palavra, não tem nada a ver'. Ignorar a origem da palavra é problemático?",
            answers: [
                { text: "Sim", correct: true },
                { text: "Não", correct: false }
            ],
            explanation: "Sim. A palavra 'denegrir' significa literalmente 'tornar negro' e é usada com sentido negativo. Manter o uso de expressões racistas, mesmo sem a 'intenção', ajuda a perpetuar o racismo estrutural."
        },
        {
            question: "Situação 7: As Cotas. Um estudante diz: 'Cotas raciais são injustas porque dão vagas fáceis para pessoas negras, enquanto eu tive que estudar muito'. Esse argumento está correto?",
            answers: [
                { text: "Não", correct: true },
                { text: "Sim", correct: false }
            ],
            explanation: "Não. Esse argumento ignora séculos de desigualdade estrutural. As cotas não são 'vagas fáceis', mas uma política de reparação para tentar garantir que pessoas negras tenham acesso a espaços que lhes foram historicamente negados."
        },
        {
            question: "Situação 8: O Colorismo. Em uma família negra, uma avó elogia o neto de pele mais clara por 'ter um bom cabelo' e diz à neta de pele mais escura para 'não tomar sol'. Isso é preconceito?",
            answers: [
                { text: "Sim", correct: true },
                { text: "Não", correct: false }
            ],
            explanation: "Sim. Isso é colorismo, uma forma de preconceito onde pessoas negras de pele mais clara são tratadas de forma mais favorável do que pessoas negras de pele mais escura (retinta). É um resquício direto da ideologia do branqueamento."
        },
        {
            question: "Situação 9: O 'Amigo Negro'. Em um debate, uma pessoa branca diz: 'Eu não sou racista, eu até tenho um amigo negro'. Esse argumento prova que a pessoa não pode ser racista?",
            answers: [
                { text: "Não", correct: true },
                { text: "Sim", correct: false }
            ],
            explanation: "Não. Ter amigos ou familiares negros não isenta ninguém de cometer atos ou ter pensamentos racistas. O racismo é estrutural, e esse argumento é frequentemente usado para encerrar uma discussão sobre privilégio branco."
        },
        {
            question: "Situação 10: Apropriação Cultural. Uma marca de roupa lança uma coleção com estampas de símbolos sagrados do Candomblé, sem nenhuma ligação ou autorização da comunidade religiosa. Isso é problemático?",
            answers: [
                { text: "Sim", correct: true },
                { text: "Não", correct: false }
            ],
            explanation: "Sim. Isso é apropriação cultural. Ela ocorre quando um grupo dominante adota elementos de uma cultura oprimida, esvaziando-os de seu significado original e, muitas vezes, lucrando com isso, sem dar o devido crédito ou respeito."
        }
    ];

    // Elementos do DOM do Quiz
    const quizContainer = document.getElementById('quiz-container');
    const quizResultsContainer = document.getElementById('quiz-results');
    const questionText = document.getElementById('question-text');
    const answerButtons = document.getElementById('answer-buttons');
    const quizFeedback = document.getElementById('quiz-feedback');
    const nextBtn = document.getElementById('next-btn');
    const restartBtn = document.getElementById('restart-btn');
    const quizProgress = document.getElementById('quiz-progress');
    const quizScoreText = document.getElementById('quiz-score-text');

    let currentQuestionIndex = 0;
    let score = 0;
    let shuffledQuestions = [];

    // Adiciona evento de Próxima e Reiniciar (com verificação)
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentQuestionIndex++;
            if (currentQuestionIndex < shuffledQuestions.length) {
                showQuestion();
            } else {
                showResults();
            }
        });
    }

    if (restartBtn) {
        restartBtn.addEventListener('click', startQuiz);
    }

    // Função para iniciar/reiniciar o quiz
    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        shuffledQuestions = questions.sort(() => Math.random() - 0.5);
        
        if (quizResultsContainer) quizResultsContainer.classList.add('hidden');
        if (quizContainer) quizContainer.classList.remove('hidden');
        if (nextBtn) nextBtn.classList.add('hidden');
        
        showQuestion();
    }

    // Função para limpar o estado anterior e mostrar a nova pergunta
    function resetState() {
        if (quizFeedback) quizFeedback.innerHTML = ''; // Limpa o HTML interno
        if (nextBtn) nextBtn.classList.add('hidden');
        
        if (answerButtons) {
            while (answerButtons.firstChild) {
                answerButtons.removeChild(answerButtons.firstChild);
            }
        }
    }

    // Função para mostrar a pergunta atual
    function showQuestion() {
        resetState();
        
        const currentQuestion = shuffledQuestions[currentQuestionIndex];
        
        if (questionText) questionText.textContent = currentQuestion.question;
        if (quizProgress) quizProgress.textContent = `Pergunta ${currentQuestionIndex + 1} de ${shuffledQuestions.length}`;

        currentQuestion.answers.forEach(answer => {
            const button = document.createElement('button');
            button.textContent = answer.text;
            button.classList.add('btn', 'btn-answer');
            
            if (answer.correct) {
                button.dataset.correct = true;
            }
            
            button.addEventListener('click', selectAnswer);
            if (answerButtons) answerButtons.appendChild(button);
        });
    }

    /**
     * FUNÇÃO 'selectAnswer' ATUALIZADA
     * Agora exibe a explicação detalhada
     */
    function selectAnswer(e) {
        const selectedButton = e.target;
        const isCorrect = selectedButton.dataset.correct === 'true';
        const explanation = shuffledQuestions[currentQuestionIndex].explanation;

        // Limpa o feedback anterior
        if (quizFeedback) quizFeedback.innerHTML = ''; 

        // Cria o título (Correto/Incorreto)
        const feedbackTitle = document.createElement('strong');
        
        if (isCorrect) {
            selectedButton.classList.add('correct');
            feedbackTitle.textContent = 'Resposta Correta!';
            feedbackTitle.style.color = 'green';
            score++;
        } else {
            selectedButton.classList.add('incorrect');
            feedbackTitle.textContent = 'Resposta Incorreta.';
            feedbackTitle.style.color = 'red';
        }

        // Cria o parágrafo de explicação
        const explanationText = document.createElement('p');
        explanationText.textContent = explanation;
        explanationText.classList.add('quiz-explanation'); // Adiciona classe para estilizar

        // Adiciona os elementos ao div de feedback
        if (quizFeedback) {
            quizFeedback.appendChild(feedbackTitle);
            quizFeedback.appendChild(explanationText);
        }

        // Desabilita todos os botões e destaca a correta
        if (answerButtons) {
            Array.from(answerButtons.children).forEach(button => {
                if (button.dataset.correct === 'true') {
                    button.classList.add('correct');
                }
                button.disabled = true;
            });
        }

        if (nextBtn) nextBtn.classList.remove('hidden');
    }

    // Função para mostrar os resultados finais
    function showResults() {
        if (quizContainer) quizContainer.classList.add('hidden');
        if (quizResultsContainer) quizResultsContainer.classList.remove('hidden');
        
        if (quizScoreText) quizScoreText.textContent = `Você acertou ${score} de ${shuffledQuestions.length} perguntas.`;
    }

});