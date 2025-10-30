document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos do DOM
    const video = document.getElementById('background-video');
    const playButtonContainer = document.getElementById('play-button-container');
    const playButton = document.getElementById('play-button');
    const rsvpFormContainer = document.getElementById('rsvp-form-container');
    const alreadySubmittedContainer = document.getElementById('already-submitted-container');

    // --- Lógica de Verificação de Sucesso (APÓS ENVIO) ---
    const urlParams = new URLSearchParams(window.location.search);

    // CORREÇÃO: Verifica se o parâmetro 'submitted=true' está na URL
    if (urlParams.get('submitted') === 'true') {
        // Se houver o parâmetro de sucesso na URL, exibe a mensagem de confirmação
        playButtonContainer.classList.add('hidden');
        rsvpFormContainer.classList.add('hidden');
        alreadySubmittedContainer.classList.remove('hidden');

        // Adiciona a classe de fade-in para a mensagem de sucesso
        // Truque para forçar o navegador a renderizar as mudanças de CSS
        void alreadySubmittedContainer.offsetWidth; 
        alreadySubmittedContainer.classList.add('fade-in');

        // Limpa o parâmetro da URL para que a página não fique sempre em estado de sucesso
        history.replaceState(null, '', window.location.pathname);
        
        // Não executa o resto do script (vídeo/botão inicial)
        return; 
    }

    // Função para mostrar o botão "Continuar" (COM FADE IN)
    const showPlayButton = () => {
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
    // Adiciona um listener para o evento 'canplay' ou 'loadeddata' para garantir o início correto
    video.addEventListener('canplay', () => {
        // Se o vídeo carregar, remove o fallback, pois o 'ended' cuidará da exibição
        clearTimeout(fallbackTimeout);
    });
    
    // Fallback de 3 segundos (Útil se o vídeo falhar ou for muito curto)
    const fallbackTimeout = setTimeout(showPlayButton, 3000); 

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
