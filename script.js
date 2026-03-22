/**
 * Barbearia Madero - Core Script 2026
 * Responsável por: Renderização de serviços, Modal de Agendamento e Integração WhatsApp
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Lista Completa de Serviços
    const listaServicos = [
        { nome: "Barba", preco: "25,00", tempo: "30 min" },
        { nome: "Barba + Pezinho", preco: "35,00", tempo: "30 min" },
        { nome: "Black Mask (Limpeza Facial)", preco: "25,00", tempo: "30 min" },
        { nome: "Coloração", preco: "40,00", tempo: "45 min" },
        { nome: "Corte (Degradê/Social)", preco: "40,00", tempo: "45 min", destaque: true },
        { nome: "Corte Máquina (2 pentes)", preco: "35,00", tempo: "30 min" },
        { nome: "Corte + Barba", preco: "65,00", tempo: "60 min", destaque: true },
        { nome: "Corte + Barba + Selagem", preco: "145,00", tempo: "120 min" },
        { nome: "Corte + Barba + Selagem + Sobrancelha", preco: "155,00", tempo: "120 min", destaque: true },
        { nome: "Corte + Barba + Sobrancelha", preco: "75,00", tempo: "60 min" },
        { nome: "Corte + Hidratação", preco: "65,00", tempo: "75 min" },
        { nome: "Corte + Sobrancelha", preco: "50,00", tempo: "45 min" },
        { nome: "Hidratação", preco: "25,00", tempo: "30 min" },
        { nome: "Pacote 165", preco: "165,00", tempo: "60 min", obs: "A partir de" },
        { nome: "Penteado", preco: "25,00", tempo: "30 min" },
        { nome: "Penteado + Pezinho", preco: "35,00", tempo: "30 min" },
        { nome: "Pezinho da Barba", preco: "15,00", tempo: "15 min" },
        { nome: "Pezinho do Cabelo", preco: "10,00", tempo: "15 min" },
        { nome: "Raspar na Lâmina", preco: "30,00", tempo: "30 min" },
        { nome: "Raspar na Máquina", preco: "20,00", tempo: "15 min" },
        { nome: "Selagem", preco: "80,00", tempo: "60 min", obs: "A partir de" }
    ];

    // 2. Estado do Agendamento
    let dadosAgendamento = {
        servico: '',
        prof: '',
        data: '23/03', // Data padrão inicial
        hora: ''
    };

    const grid = document.getElementById('servicesGrid');
    const modal = document.getElementById('bookingModal');

    // 3. Renderização Dinâmica dos Cards
    if (grid) {
        listaServicos.forEach(s => {
            const card = document.createElement('div');
            card.className = `service-card ${s.destaque ? 'highlight' : ''}`;
            card.innerHTML = `
                <div class="service-info">
                    <h3>${s.nome}</h3>
                    <span class="price">${s.obs ? `<small style="font-size:0.6rem; display:block; opacity:0.6">${s.obs}</small>` : ''} R$ ${s.preco}</span>
                    <span class="time"><i class="far fa-clock"></i> ${s.tempo}</span>
                </div>
                <button class="btn-book" onclick="openBooking('${s.nome}')">Agendar</button>
            `;
            grid.appendChild(card);
        });
    }

    // --- FUNÇÕES DO MODAL ---

    // Abrir Modal
    window.openBooking = function(serviceName) {
        dadosAgendamento.servico = serviceName;
        
        const titleEl = document.getElementById('selectedServiceName');
        if (titleEl) titleEl.innerText = serviceName.toUpperCase();
        
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    };

    // Fechar Modal
    window.closeBooking = function() {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            resetModal();
        }
    };

    // Navegação dos dias (SETAS CORRIGIDAS)
    window.scrollDays = function(direction) {
        const container = document.getElementById('daysContainer');
        if (container) {
            const scrollAmount = 180; // Ajustado para rolar 2 a 3 itens por vez
            if (direction === 'left') {
                container.scrollLeft -= scrollAmount;
            } else {
                container.scrollLeft += scrollAmount;
            }
        }
    };

    // Selecionar o dia
    window.selectDay = function(el, data) {
        document.querySelectorAll('.day-item').forEach(d => d.classList.remove('active'));
        el.classList.add('active');
        dadosAgendamento.data = data;
    };

    // Selecionar o Barbeiro
    window.selectProf = function(el, nome) {
        document.querySelectorAll('.prof-item').forEach(p => p.classList.remove('active'));
        el.classList.add('active');
        dadosAgendamento.prof = nome;
        
        const timeSelection = document.getElementById('timeSelection');
        const instruction = document.getElementById('bookingInstruction');
        
        if (timeSelection) {
            timeSelection.style.display = 'block';
            // Scroll suave para os horários no mobile
            setTimeout(() => {
                timeSelection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
        if (instruction) instruction.style.display = 'none';
    };

    // Finalizar e enviar para o WhatsApp
    window.finishBooking = function(hora) {
        dadosAgendamento.hora = hora;
        const telefone = "5569993609069";
        
        const texto = `Olá! Gostaria de realizar um agendamento:
        
✂️ *Serviço:* ${dadosAgendamento.servico}
👤 *Profissional:* ${dadosAgendamento.prof}
📅 *Data:* ${dadosAgendamento.data}/2026
⏰ *Horário:* ${dadosAgendamento.hora}

_Aguardo confirmação da disponibilidade._`;

        const wpUrl = `https://api.whatsapp.com/send?phone=${telefone}&text=${encodeURIComponent(texto)}`;
        window.open(wpUrl, '_blank');
        closeBooking();
    };

    // Reseta o modal
    function resetModal() {
        const timeSelection = document.getElementById('timeSelection');
        const instruction = document.getElementById('bookingInstruction');
        
        if (timeSelection) timeSelection.style.display = 'none';
        if (instruction) instruction.style.display = 'block';
        document.querySelectorAll('.prof-item').forEach(p => p.classList.remove('active'));
        
        // Resetar para o primeiro dia por padrão se desejar
        const days = document.querySelectorAll('.day-item');
        days.forEach(d => d.classList.remove('active'));
        if(days[0]) days[0].classList.add('active');
        dadosAgendamento.data = '23/03';
    }

    // Fecha ao clicar fora
    window.onclick = function(event) {
        if (event.target == modal) {
            closeBooking();
        }
    };
});
