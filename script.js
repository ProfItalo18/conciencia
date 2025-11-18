document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const quizForm = document.getElementById('quiz-form');
    const quizResults = document.getElementById('quiz-results');

    const correctAnswers = {
        q1: 'B', // Zumbi
        q2: 'B', // Lei 10.639/03
        q3: 'C'  // Rubem Valentim
    };

    // Função para mostrar uma seção e ocultar as outras
    function showSection(targetId) {
        contentSections.forEach(section => {
            if (section.dataset.sectionId === targetId) {
                section.classList.remove('hidden');
                // Forçar reflow para reiniciar a transição (se necessário)
                void section.offsetWidth; 
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
                section.style.height = 'auto'; // Permitir que o conteúdo determine a altura
                section.style.paddingTop = '60px';
                section.style.paddingBottom = '60px';
                section.style.marginBottom = '20px';
            } else {
                section.classList.add('hidden');
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
                section.style.height = '0'; // Esconde completamente
                section.style.paddingTop = '0';
                section.style.paddingBottom = '0';
                section.style.marginBottom = '0';
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

        // Scroll para a seção exibida
        const sectionToShow = document.querySelector(`[data-section-id="${targetId}"]`);
        if (sectionToShow) {
            sectionToShow.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Adiciona evento de clique aos links de navegação
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Impede o comportamento padrão de link
            const targetId = this.dataset.target; // Pega o ID da seção alvo
            showSection(targetId);
        });
    });

    // Lógica do Quiz
    quizForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        let score = 0;
        let resultsHTML = '<h3>Seus Resultados:</h3>';

        for (const questionId in correctAnswers) {
            const userAnswer = document.querySelector(`input[name="${questionId}"]:checked`);
            const correctAnswer = correctAnswers[questionId];
            const questionElement = document.querySelector(`#quiz-section .question-block:has(input[name="${questionId}"]) p`); // Mais específico
            const questionText = questionElement ? questionElement.textContent : `Questão ${questionId}`;

            resultsHTML += `<p><strong>${questionText}</strong></p>`;

            if (userAnswer) {
                if (userAnswer.value === correctAnswer) {
                    score++;
                    resultsHTML += `<p class="correct">Você acertou! Sua resposta: ${userAnswer.labels[0].textContent}</p>`;
                } else {
                    const correctLabel = document.querySelector(`input[name="${questionId}"][value="${correctAnswer}"]`).labels[0].textContent;
                    resultsHTML += `<p class="incorrect">Você errou. Sua resposta: ${userAnswer.labels[0].textContent}. A resposta correta era: ${correctLabel}</p>`;
                }
            } else {
                const correctLabel = document.querySelector(`input[name="${questionId}"][value="${correctAnswer}"]`).labels[0].textContent;
                resultsHTML += `<p class="incorrect">Você não respondeu. A resposta correta era: ${correctLabel}</p>`;
            }
            resultsHTML += '<hr>'; // Linha separadora entre as perguntas
        }

        resultsHTML += `<h4>Você acertou ${score} de ${Object.keys(correctAnswers).length} perguntas!</h4>`;
        
        quizResults.innerHTML = resultsHTML;
        quizResults.style.display = 'block'; // Mostra os resultados

        // Scroll para os resultados
        quizResults.scrollIntoView({ behavior: 'smooth' });
    });

    // Ao carregar a página, mostra a seção de História por padrão
    // Verifica se há um hash na URL para decidir qual seção mostrar primeiro
    const initialSectionId = window.location.hash ? window.location.hash.substring(1).replace('-section', '-content') : 'historia-content';
    showSection(initialSectionId);

    // Ajusta o link "Saiba Mais" do hero para a nova lógica
    const heroBtn = document.querySelector('#hero .btn');
    if (heroBtn) {
        heroBtn.addEventListener('click', function(event) {
            event.preventDefault();
            showSection('historia-content');
        });
    }

});