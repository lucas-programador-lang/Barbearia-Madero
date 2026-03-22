/**
 * Barbearia Madero - Core Script 2026
 * Responsável por: Renderização de serviços, Modal de Agendamento e Integração WhatsApp
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Lista de Serviços (Base de dados única)
    const listaServicos = [
        { nome: "Corte (Degradê/Social)", preco: "40,00", tempo: "45 min", destaque: true },
        { nome: "Barba + Toalha Quente", preco: "25,00", tempo: "30 min" },
        { nome: "Corte + Barba", preco: "65,00", tempo: "60 min", destaque: true },
        { nome: "Corte + Barba + Sobrancelha", preco: "75,00", tempo: "70 min" },
        { nome: "Corte + Sobrancelha", preco: "50,00", tempo: "45 min" },
        { nome: "Combo Madero (Completo)", preco: "155,00", tempo: "120 min", obs: "Corte, Barba, Selagem e Sobrancelha" },
        { nome: "Selagem", preco: "80,00", tempo: "60 min", obs: "A partir de" },
        { nome: "Hidratação Profunda", preco: "25,00", tempo: "30 min" },
        { nome: "Pezinho da Barba", preco: "15,00", tempo: "15 min" },
        { nome: "Limpeza de Pele (Black Mask)", preco: "25,00", tempo: "30 min" }
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

    // 3. Renderização Dinâmica (Apenas se estiver na página de serviços)
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
                <button class="btn-book" data-service="${s.nome}">Agendar</button>
            `;
            grid.appendChild(card);
        });

        // Event Delegation para os botões de agendar
        grid.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-book')) {
                const serviceName = e.target.getAttribute('data-service');
                openBooking(serviceName);
            }
        });
    }

    // --- FUNÇÕES DO MODAL ---

    window.openBooking = function(serviceName) {
        dadosAgendamento.servico = serviceName;
        const titleEl = document.getElementById('selectedServiceName');
        if (titleEl) titleEl.innerText = serviceName;
        
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeBooking = function() {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            resetModal();
        }
    };

    window.scrollDays = function(direction) {
        const container = document.getElementById('daysContainer');
        if (container) {
            container.scrollBy({ left: direction === 'left' ? -150 : 150, behavior: 'smooth' });
        }
    };

    window.selectDay = function(el, data) {
        document.querySelectorAll('.day-item').forEach(d => d.classList.remove('active'));
        el.classList.add('active');
        dadosAgendamento.data = data;
    };

    window.selectProf = function(el, nome) {
        document.querySelectorAll('.prof-item').forEach(p => p.classList.remove('active'));
        el.classList.add('active');
        dadosAgendamento.prof = nome;
        
        const timeSelection = document.getElementById('timeSelection');
        const instruction = document.getElementById('bookingInstruction');
        
        if (timeSelection) timeSelection.style.display = 'block';
        if (instruction) instruction.style.display = 'none';
    };

    window.finishBooking = function(hora) {
        dadosAgendamento.hora = hora;
        const telefone = "5569993609069";
        const texto = `Olá! Gostaria de agendar na Barbearia Madero:
        
✂️ *Serviço:* ${dadosAgendamento.servico}
👤 *Barbeiro:* ${dadosAgendamento.prof}
📅 *Data:* ${dadosAgendamento.data}/2026
⏰ *Horário:* ${dadosAgendamento.hora}

Confirmar disponibilidade?`;

        const wpUrl = `https://api.whatsapp.com/send?phone=${telefone}&text=${encodeURIComponent(texto)}`;
        window.open(wpUrl, '_blank');
        closeBooking();
    };

    function resetModal() {
        const timeSelection = document.getElementById('timeSelection');
        const instruction = document.getElementById('bookingInstruction');
        
        if (timeSelection) timeSelection.style.display = 'none';
        if (instruction) instruction.style.display = 'block';
        document.querySelectorAll('.prof-item').forEach(p => p.classList.remove('active'));
    }

    // Fechar modal ao clicar fora
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeBooking();
    });
});
