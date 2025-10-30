document.addEventListener('DOMContentLoaded', () => {
    // Chave que usaremos no LocalStorage
    const SUBMITTED_KEY = 'rsvp_submitted';

    // Referências aos elementos do DOM
    const video = document.getElementById('background-video');
    const playButtonContainer = document.getElementById('play-button-container');
    const playButton = document.getElementById('play-button');
    const rsvpFormContainer = document.getElementById('rsvp-form-container');
    const alreadySubmittedContainer = document.getElementById('already-submitted-container');

    // --- 1. Lógica de Verificação de Sucesso (APÓS ENVIO) ---
    const urlParams = new URLSearchParams(window.location.search);

    // Checa se a URL possui o parâmetro de sucesso (vindo do FormSubmit)
    if (urlParams.get('submitted') === 'true') {
        // Marca no LocalStorage que o formulário foi enviado com sucesso
        localStorage.setItem(SUBMITTED_KEY, 'true');

        // Limpa o parâmetro da URL IMEDIATAMENTE.
        // O estado de sucesso será mantido pela verificação do LocalStorage abaixo.
        history.replaceState(null, '', window.location.pathname);
    }
    
    // --- 2. Lógica para Persistência de Estado (EM TODA RECARGA) ---
    // Verifica se o formulário já foi enviado (via LocalStorage)
    if (localStorage.getItem(SUBMITTED_KEY) === 'true') {
        // Se já foi enviado, esconde TUDO o que não é a mensagem de sucesso
        playButtonContainer.classList.add('hidden');
        rsvpFormContainer.classList.add('hidden');
        
        // E exibe SOMENTE a mensagem de presença confirmada
        alreadySubmittedContainer.classList.remove('hidden');
        
        // Aplica o fade-in para a mensagem
        void alreadySubmittedContainer.offsetWidth; 
        alreadySubmittedContainer.classList.add('fade-in');

        // Impede que o restante do script seja executado (botão "Continuar")
        return; 
    }


    // --- 3. Lógica para a Primeira Visita (NÃO ENVIADO) ---
    // (O restante do código que lida com o vídeo e o botão "Continuar")
    
    // Função para mostrar o botão "Continuar" (COM FADE IN)
    const showPlayButton = () => {
        // Verifica se o botão ainda não está em exibição
        if (playButtonContainer.classList.contains('hidden') || !playButtonContainer.classList.contains('fade-in')) {
            
            // 1. Remove 'hidden' para exibir o elemento
            playButtonContainer.classList.remove('hidden');
            
            // 2. Truque para forçar o navegador a renderizar as mudanças de CSS
            void playButtonContainer.offsetWidth; 
            
            // 3. Adiciona 'fade-in' para disparar a transição suave
            playButtonContainer.classList.add('fade-in');

            video.pause(); // Pausa o vídeo
        }
    };

    // --- Lógica de Transição do Vídeo ---
    video.addEventListener('ended', showPlayButton);
    
    // Fallback de 3 segundos (Útil se o vídeo falhar ou for muito curto)
    const fallbackTimeout = setTimeout(showPlayButton, 3000); 
    video.addEventListener('canplay', () => {
        // Se o vídeo carregar, remove o fallback, pois o 'ended' cuidará da exibição
        clearTimeout(fallbackTimeout);
    });

    // --- Lógica do Botão "Continuar" (COM FADE OUT e FADE IN) ---
    playButton.addEventListener('click', () => {
        // 1. Inicia o FADE OUT do botão atual
        playButtonContainer.classList.remove('fade-in');
        
        // 2. Após 500ms, esconde o botão e inicia o FADE IN do formulário
        setTimeout(() => {
            // Esconde o container do botão (DOM)
            playButtonContainer.classList.add('hidden');
            
            // Exibe o container do formulário (DOM)
            rsvpFormContainer.classList.remove('hidden');
            
            // Truque para forçar o navegador a reconhecer o elemento
            void rsvpFormContainer.offsetWidth; 
            
            // 3. Aplica o FADE IN ao formulário
            rsvpFormContainer.classList.add('fade-in');
            
        }, 500); // O tempo aqui (500ms) deve ser igual ao tempo de transição no CSS
    });
});
