document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    const botaoMusica = document.getElementById('playMusicBtnCountdown'); 
    const minhaMusica = document.getElementById('musicaAmor');
    const btnSim = document.getElementById('btn-sim');
    const btnNao = document.getElementById('btn-nao');
    const player = document.getElementById("player");
    const obstacle = document.getElementById("obstacle");
    const scoreElement = document.getElementById("score");
    const highScoreElement = document.getElementById("high-score");
    const overlay = document.getElementById("countdown-overlay");

    let jogoAtivo = true;
    let velocidadeBase = 180; 
    let multiplicadorVelocidade = 1; 
    let posicaoObstaculo = 300;
    let score = 0;
    let highScore = parseInt(localStorage.getItem("monkeyRecorde")) || 0;
    let ultimaAtualizacao = performance.now(); 

    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => preloader.style.display = 'none', 500);
        }, 500);
    }

    if (highScoreElement) highScoreElement.innerText = highScore;

    if (botaoMusica && minhaMusica) {
        botaoMusica.addEventListener('click', () => {
            if (minhaMusica.paused) {
                minhaMusica.play().catch(e => console.log("Erro: ", e));
                botaoMusica.innerHTML = '<span class="heart-icon">♥</span> Pausar música';
            } else {
                minhaMusica.pause();
                botaoMusica.innerHTML = '<span class="heart-icon">♥</span> Clica aqui safado';
            }
        });
    }

    if (btnNao) {
        const fugir = () => {
            const x = Math.random() * (window.innerWidth - btnNao.offsetWidth);
            const y = Math.random() * (window.innerHeight - btnNao.offsetHeight);
            btnNao.style.position = 'fixed';
            btnNao.style.left = `${x}px`;
            btnNao.style.top = `${y}px`;
        };
        btnNao.addEventListener('mouseover', fugir);
        btnNao.addEventListener('touchstart', (e) => { e.preventDefault(); fugir(); });
    }

    if (btnSim) {
        btnSim.addEventListener('click', () => {
            lancarFesta(); 
            alert('Boaaaaa hihihih Eu te amo pra sempre e do tamanho do céuuu ♥ \n\nE como você recompensa, o RE9 JÁ É SEU! Garante aí na pré-venda safado ui 🔥');
            setTimeout(() => {
                window.location.href = "https://www.nuuvem.com/br-pt/item/resident-evil-requiem"; 
            }, 2500); 
        });
    }

    function atualizarContagem() {
        const dataAlvo = new Date('January 25, 2026 00:00:00').getTime();
        const agora = new Date().getTime();
        const diferenca = dataAlvo - agora;
        const countdownOverlay = document.getElementById('countdown-overlay');
        
        if (diferenca <= 0) {
            if (countdownOverlay) countdownOverlay.style.display = 'none';
            document.querySelectorAll('header, main, footer, .game-container').forEach(el => {
                el.style.display = 'block';
            });
            document.querySelectorAll('.photo-item').forEach(el => {
                el.style.display = 'flex';
            });
            return;
        }
        
        const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);
        
        const timerElement = document.getElementById('timer');
        if (timerElement) timerElement.innerHTML = `${dias}d ${horas}h ${minutos}m ${segundos}s`;
    }

    setInterval(atualizarContagem, 1000);
    atualizarContagem();

    window.pular = function() {
        if (jogoAtivo && player && !player.classList.contains("jump")) {
            player.classList.add("jump");
            setTimeout(() => player.classList.remove("jump"), 500);
        }
    };

    function loopDoJogo(tempoAtual) {
        if (!jogoAtivo) return;

        const deltaTime = (tempoAtual - ultimaAtualizacao) / 1000; 
        ultimaAtualizacao = tempoAtual;
        const deltaLimitado = Math.min(deltaTime, 0.1);

        posicaoObstaculo -= (velocidadeBase * multiplicadorVelocidade) * deltaLimitado;
        
        if (posicaoObstaculo < -30) {
            posicaoObstaculo = 300;
            multiplicadorVelocidade += 0.05; 
            score++;
            if (scoreElement) scoreElement.innerText = score;
        }

        if (obstacle) obstacle.style.left = posicaoObstaculo + "px";

        const playerRect = player.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();

        if (
            obstacleRect.left < playerRect.right - 12 &&
            obstacleRect.right > playerRect.left + 12 &&
            playerRect.bottom > obstacleRect.top + 8
        ) {
            morreu();
        } else {
            requestAnimationFrame(loopDoJogo);
        }
    }

    function morreu() {
        jogoAtivo = false;
        document.getElementById("game-area").style.display = "none";
        const gameOverScreen = document.getElementById("game-over-screen");
        if (gameOverScreen) gameOverScreen.style.display = "flex";

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("monkeyRecorde", highScore);
            if (highScoreElement) highScoreElement.innerText = highScore;
        }
    }

    window.reiniciarJogo = function() {
        jogoAtivo = true;
        score = 0; 
        if (scoreElement) scoreElement.innerText = "0";
        multiplicadorVelocidade = 1; 
        posicaoObstaculo = 300;
        ultimaAtualizacao = performance.now(); 
        document.getElementById("game-over-screen").style.display = "none";
        document.getElementById("game-area").style.display = "block";
        requestAnimationFrame(loopDoJogo);
    };

    function lancarFesta() {
        if (typeof confetti === 'function') {
            var end = Date.now() + (5 * 1000);
            (function frame() {
                confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
                confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
                if (Date.now() < end) requestAnimationFrame(frame);
            }());
        }
    }

    requestAnimationFrame(loopDoJogo);

    document.addEventListener("keydown", (e) => { 
        if (e.code === "Space") { 
            e.preventDefault(); 
            window.pular(); 
        } 
    });

    if (overlay) overlay.addEventListener("click", window.pular);
    
    criarCoracoes();
});

function criarCoracoes() {
    const overlay = document.getElementById('countdown-overlay');
    if (!overlay) return;
    for (let i = 0; i < 30; i++) {
        const coracao = document.createElement('span');
        coracao.innerHTML = '♥';
        coracao.className = 'heart-particle';
        coracao.style.left = Math.random() * 100 + '%';
        coracao.style.fontSize = (Math.random() * 20 + 20) + 'px';
        coracao.style.animationDelay = Math.random() * 10 + 's';
        coracao.style.animationDuration = (Math.random() * 10 + 10) + 's';
        overlay.appendChild(coracao);
    }
}