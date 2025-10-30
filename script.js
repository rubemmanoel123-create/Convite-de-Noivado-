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

    // Função para exibir a tela de sucesso
    const showSuccessScreen = () => {
        // Esconde o botão e o formulário
        playButtonContainer.classList.add('hidden');
        rsvpFormContainer.classList.add('hidden');
        
        // Exibe a tela de sucesso
        successContainer.classList.remove('hidden');
        void successContainer.offsetWidth; 
        successContainer.classList.add('fade-in');
        
        video.play().catch(e => {
            console.log("Falha ao tentar iniciar vídeo: ", e);
        });
        
        // Garante que o localStorage seja setado
        localStorage.setItem(SUBMITTED_KEY, 'true'); 
    };

    // Função para exibir o botão "CONTINUAR"
    const showPlayButtonScreen = () => {
        rsvpFormContainer.classList.add('hidden');
        successContainer.classList.add('hidden');
        
        playButtonContainer.classList.remove('hidden');
        playButtonContainer.classList.add('fade-in'); 
        
        video.play().catch(e => {
            console.log("Falha ao tentar iniciar vídeo: ", e);
        });
    };
    
    // --- LÓGICA DE INICIALIZAÇÃO (CHECA LOCALSTORAGE E URL) ---
    
    const urlParams = new URLSearchParams(window.location.search);
    
    if (localStorage.getItem(SUBMITTED_KEY) === 'true' || urlParams.has('submitted')) {
        // Se já submeteu antes (localStorage) OU se acabou de ser redirecionado (URL parameter)
        showSuccessScreen();
        // Limpa o parâmetro 'submitted' da URL (para não ficar feio no endereço)
        history.replaceState(null, null, window.location.pathname);
    } else {
        showPlayButtonScreen(); 
    }

    // --- EVENT LISTENERS ---

    // Lógica do Botão "Continuar"
    playButton.addEventListener('click', () => {
        // Fade Out do botão
        playButtonContainer.classList.remove('fade-in');
        video.pause(); 
        
        setTimeout(() => {
            playButtonContainer.classList.add('hidden');
            rsvpFormContainer.classList.remove('hidden');
            // Fade In do Formulário
            void rsvpFormContainer.offsetWidth; 
            rsvpFormContainer.classList.add('fade-in');
        }, 500); 
    });

    // Lógica do Formulário (Apenas desabilita o botão para evitar cliques duplos durante o envio nativo)
    rsvpForm.addEventListener('submit', (e) => {
        // NÃO USAMOS e.preventDefault()
        
        const submitButton = rsvpForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
        
        // O navegador enviará a requisição POST e será redirecionado pelo FormSubmit.
        // O script será reiniciado na nova página e mostrará a tela de sucesso.
    });
});
