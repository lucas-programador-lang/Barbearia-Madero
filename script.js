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
    if (grid) {
        grid.innerHTML = '';
        listaServicos.forEach(s => {
            const card = document.createElement('div');
            card.className = `service-card`;
            if(s.destaque) card.style.borderColor = "var(--gold)";
            
            card.innerHTML = `
                <div class="service-info">
                    <h3>${s.nome}</h3>
                    <span class="price">
                        ${s.obs ? `<small style="font-size:0.7rem; display:block; opacity:0.6; font-weight:400; margin-bottom:2px;">${s.obs}</small>` : ''} 
                        R$ ${s.preco}
                    </span>
                    <span class="time"><i class="far fa-clock"></i> ${s.tempo}</span>
                </div>
                <button class="btn-main" onclick="openBooking('${s.nome}')">Agendar Agora</button>
            `;
            grid.appendChild(card);
        });
    }
});

// GERA OS DIAS DO CALENDÁRIO (Pula domingos)
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
        
        if (dataCopia.getDay() !== 0) { 
            const diaNome = diasSemana[dataCopia.getDay()];
            const diaMes = dataCopia.getDate();
            const mesNum = (dataCopia.getMonth() + 1).toString().padStart(2, '0');
            const dataParaAgendamento = `${diaMes}/${mesNum}`;

            const dayDiv = document.createElement('div');
            dayDiv.className = `day-card ${diasRenderizados === 0 ? 'active' : ''}`;
            
            if (diasRenderizados === 0) dadosAgendamento.data = dataParaAgendamento;

            dayDiv.onclick = function() { 
                document.querySelectorAll('.day-card').forEach(d => d.classList.remove('active'));
                this.classList.add('active');
                dadosAgendamento.data = dataParaAgendamento;
            };

            dayDiv.innerHTML = `<span>${diaNome}</span><br><strong>${diaMes}</strong>`;
            container.appendChild(dayDiv);
            diasRenderizados++;
        }
        i++;
    }
}

// FUNÇÃO DA SETA: Rola o calendário para a direita
window.scrollCalendar = function() {
    const container = document.getElementById('daysContainer');
    if (container) {
        container.scrollBy({ left: 120, behavior: 'smooth' });
    }
};

// CONTROLE DO MODAL
window.openBooking = function(serviceName) {
    const modal = document.getElementById('bookingModal');
    dadosAgendamento.servico = serviceName;
    document.getElementById('selectedServiceName').innerText = serviceName.toUpperCase();
    
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
};

window.closeBooking = function() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetModal();
    }
};

// SELEÇÃO DE PROFISSIONAL
window.selectProf = function(el, nome) {
    document.querySelectorAll('.prof-item').forEach(p => p.classList.remove('selected'));
    el.classList.add('selected');
    dadosAgendamento.prof = nome;
    
    const timeSelection = document.getElementById('timeSelection');
    if(timeSelection) {
        timeSelection.style.display = 'block';
        // Scroll suave até os horários
        setTimeout(() => {
            timeSelection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
};

// ENVIO PARA WHATSAPP
window.finishBooking = function(hora) {
    if (!dadosAgendamento.prof) {
        alert("Por favor, selecione um especialista!");
        return;
    }

    dadosAgendamento.hora = hora;
    const numeroWhatsApp = "5569993609069"; 
    const mensagem = `Olá! Gostaria de agendar na *Barbearia Madero*:%0A%0A` +
                     `✂️ *Serviço:* ${dadosAgendamento.servico}%0A` +
                     `👤 *Barbeiro:* ${dadosAgendamento.prof}%0A` +
                     `📅 *Data:* ${dadosAgendamento.data}/2026%0A` +
                     `⏰ *Horário:* ${dadosAgendamento.hora}%0A%0A` +
                     `_Favor confirmar agendamento._`;

    window.open(`https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensagem}`, '_blank');
    closeBooking();
};

function resetModal() {
    dadosAgendamento.prof = '';
    dadosAgendamento.hora = '';
    const timeSelection = document.getElementById('timeSelection');
    if(timeSelection) timeSelection.style.display = 'none';
    document.querySelectorAll('.prof-item').forEach(p => p.classList.remove('selected'));
}
