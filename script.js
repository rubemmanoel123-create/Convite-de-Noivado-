document.addEventListener('DOMContentLoaded', () => {
    // Chave para armazenar o status no LocalStorage
    const SUBMITTED_KEY = 'rsvpSubmitted';
    
    // Referências aos elementos do DOM
    const video = document.getElementById('background-video');
    const playButtonContainer = document.getElementById('play-button-container');
    const playButton = document.getElementById('play-button');
    const rsvpFormContainer = document.getElementById('rsvp-form-container');
    const rsvpForm = document.getElementById('rsvp-form');
    const successContainer = document.getElementById('already-submitted-container');

    // --- FUNÇÕES DE ESTADO DA PÁGINA ---

    // Função para exibir a tela de sucesso e ocultar as outras
    const showSuccessScreen = () => {
        // Esconde o botão e o formulário
        playButtonContainer.classList.add('hidden');
        rsvpFormContainer.classList.add('hidden');
        
        // Exibe a tela de sucesso
        successContainer.classList.remove('hidden');
        void successContainer.offsetWidth; 
        successContainer.classList.add('fade-in');
        
        // Tenta garantir que o vídeo esteja rodando
        video.play().catch(e => {
            console.log("Falha ao tentar iniciar vídeo (Celular): ", e);
        });
    };

    // Função para exibir o botão "CONTINUAR"
    const showPlayButtonScreen = () => {
        rsvpFormContainer.classList.add('hidden');
        successContainer.classList.add('hidden');
        
        playButtonContainer.classList.remove('hidden');
        playButtonContainer.classList.add('fade-in'); 
        
        // Tenta garantir que o vídeo esteja rodando
        video.play().catch(e => {
            console.log("Falha ao tentar iniciar vídeo (Celular): ", e);
        });
    };
    
    // --- LÓGICA DE INICIALIZAÇÃO (CHECA O LOCALSTORAGE) ---
    
    // Verifica o estado no LocalStorage (garante que não preencha duas vezes)
    if (localStorage.getItem(SUBMITTED_KEY) === 'true') {
        showSuccessScreen();
        
    } else {
        showPlayButtonScreen(); 
    }

    // --- EVENT LISTENERS ---

    // Lógica do Botão "Continuar" (Transição para o Formulário)
    playButton.addEventListener('click', () => {
        // Fade Out do botão
        playButtonContainer.classList.remove('fade-in');
        
        // Pausa o vídeo enquanto o formulário está na frente
        video.pause(); 
        
        setTimeout(() => {
            playButtonContainer.classList.add('hidden');
            rsvpFormContainer.classList.remove('hidden');
            
            // Fade In do Formulário
            void rsvpFormContainer.offsetWidth; 
            rsvpFormContainer.classList.add('fade-in');
            
        }, 500); 
    });

    // CORREÇÃO: Lógica do Formulário (RESTABELECIDA COM FETCH E LOCALSTORAGE)
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede o envio padrão (para usar o Fetch)
        
        const submitButton = rsvpForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
        
        // Envia o formulário usando Fetch (o que garante o controle)
        fetch(rsvpForm.action, {
            method: rsvpForm.method,
            body: new FormData(rsvpForm),
            headers: { 'Accept': 'application/json' }
        })
        .then(response => {
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar Confirmação';

            if (response.ok) {
                // SUCESSO: Define a flag no LocalStorage
                localStorage.setItem(SUBMITTED_KEY, 'true'); 
                
                // Fade Out do Formulário
                rsvpFormContainer.classList.remove('fade-in');
                
                setTimeout(() => {
                    // Transiciona para a tela de sucesso
                    showSuccessScreen();
                }, 500); 
                
            } else {
                // ERRO
                alert("Ocorreu um erro ao enviar a confirmação. Por favor, tente novamente.");
            }
        })
        .catch(error => {
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar Confirmação';
            alert("Erro de conexão. Verifique sua rede e tente novamente.");
            console.error('Erro de rede:', error);
        });
    });
});
