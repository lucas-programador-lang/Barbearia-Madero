/* BARBEARIA MADERO - JAVASCRIPT ENGINE 2026
    Lógica de Agendamento & Interface Dinâmica
*/

let dadosAgendamento = {
    servico: '',
    prof: '',
    data: '',
    hora: ''
};

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o calendário assim que a página carregar
    renderizarCalendario();

    // Banco de Dados de Serviços
    const listaServicos = [
        { nome: "Corte (Degradê/Social)", preco: "40,00", tempo: "45 min", destaque: true },
        { nome: "Corte + Barba", preco: "65,00", tempo: "60 min", destaque: true },
        { nome: "Barba", preco: "25,00", tempo: "30 min" },
        { nome: "Barba + Pezinho", preco: "35,00", tempo: "30 min" },
        { nome: "Black Mask (Limpeza Facial)", preco: "25,00", tempo: "30 min" },
        { nome: "Coloração", preco: "40,00", tempo: "45 min" },
        { nome: "Corte Máquina (2 pentes)", preco: "35,00", tempo: "30 min" },
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

    const grid = document.getElementById('servicesGrid');
    
    // Renderiza os cards na tela
    if (grid) {
        grid.innerHTML = '';
        listaServicos.forEach(s => {
            const card = document.createElement('div');
            // Adiciona classe de destaque se houver
            card.className = `service-card ${s.destaque ? 'highlight' : ''}`;
            
            card.innerHTML = `
                <div class="service-info">
                    <h3>${s.nome}</h3>
                    <div class="service-meta">
                        <span class="price">
                            ${s.obs ? `<small style="font-size:0.6rem; display:block; opacity:0.6">${s.obs}</small>` : ''} 
                            R$ ${s.preco}
                        </span>
                        <span class="time"><i class="far fa-clock"></i> ${s.tempo}</span>
                    </div>
                </div>
                <button class="btn-main" onclick="openBooking('${s.nome}')">Agendar Agora</button>
            `;
            grid.appendChild(card);
        });
    }
});

// GERA OS DIAS DO CALENDÁRIO (Próximos 7 dias, pulando domingo)
function renderizarCalendario() {
    const container = document.getElementById('daysContainer');
    if (!container) return;
    
    container.innerHTML = '';
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const hoje = new Date();
    let diasRenderizados = 0;
    let i = 0;

    while (diasRenderizados < 7) {
        const dataCopia = new Date(hoje);
        dataCopia.setDate(hoje.getDate() + i);
        
        // Pula Domingos (getDay 0)
        if (dataCopia.getDay() !== 0) {
            const diaNome = diasSemana[dataCopia.getDay()];
            const diaMes = dataCopia.getDate();
            const mesNum = (dataCopia.getMonth() + 1).toString().padStart(2, '0');
            const dataParaAgendamento = `${diaMes}/${mesNum}`;

            const dayDiv = document.createElement('div');
            dayDiv.className = `day-item ${diasRenderizados === 0 ? 'active' : ''}`;
            
            // Define o primeiro dia como padrão
            if (diasRenderizados === 0) {
                dadosAgendamento.data = dataParaAgendamento;
            }

            dayDiv.onclick = function() { 
                document.querySelectorAll('.day-item').forEach(d => d.classList.remove('active'));
                this.classList.add('active');
                dadosAgendamento.data = dataParaAgendamento;
            };

            dayDiv.innerHTML = `<span>${diaNome}</span><strong>${diaMes}</strong>`;
            container.appendChild(dayDiv);
            diasRenderizados++;
        }
        i++;
    }
}

// ABRE O MODAL DE AGENDAMENTO
window.openBooking = function(serviceName) {
    const modal = document.getElementById('bookingModal');
    dadosAgendamento.servico = serviceName;
    
    const titleEl = document.getElementById('selectedServiceName');
    if(titleEl) titleEl.innerText = serviceName.toUpperCase();
    
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Trava o scroll do fundo
    }
};

// FECHA O MODAL
window.closeBooking = function() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetModal();
    }
};

// SELECIONA O PROFISSIONAL
window.selectProf = function(el, nome) {
    // Remove ativo de todos e coloca no clicado
    document.querySelectorAll('.prof-item').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
    
    dadosAgendamento.prof = nome;
    
    // Mostra a grade de horários
    const timeSelection = document.getElementById('timeSelection');
    if(timeSelection) timeSelection.style.display = 'block';
    
    // Opcional: Esconde instrução inicial se houver
    const instruction = document.getElementById('bookingInstruction');
    if(instruction) instruction.style.display = 'none';
};

// ROLAGEM DOS DIAS NO CELULAR
window.scrollDays = function(direction) {
    const container = document.getElementById('daysContainer');
    if (container) {
        const scrollAmount = direction === 'left' ? -150 : 150;
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
};

// FINALIZA E ENVIA PARA O WHATSAPP
window.finishBooking = function(hora) {
    if (!dadosAgendamento.prof) {
        alert("Por favor, selecione um profissional primeiro!");
        return;
    }

    dadosAgendamento.hora = hora;
    
    const numeroWhatsApp = "5569993609069"; // Porto Velho - RO
    const mensagem = `Olá! Gostaria de realizar um agendamento na *Barbearia Madero*:%0A%0A` +
                     `✂️ *Serviço:* ${dadosAgendamento.servico}%0A` +
                     `👤 *Barbeiro:* ${dadosAgendamento.prof}%0A` +
                     `📅 *Data:* ${dadosAgendamento.data}/2026%0A` +
                     `⏰ *Horário:* ${dadosAgendamento.hora}%0A%0A` +
                     `_Confirmar disponibilidade?_`;

    const url = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensagem}`;
    
    window.open(url, '_blank');
    closeBooking();
};

// RESET DO MODAL AO FECHAR
function resetModal() {
    dadosAgendamento.prof = '';
    dadosAgendamento.hora = '';
    
    const timeSelection = document.getElementById('timeSelection');
    if(timeSelection) timeSelection.style.display = 'none';
    
    document.querySelectorAll('.prof-item').forEach(p => p.classList.remove('active'));
}
