/* BARBEARIA MADERO - JAVASCRIPT ENGINE 2026
   Lógica de Agendamento & Interface Dinâmica - CORRIGIDA
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

// GERA OS DIAS DO CALENDÁRIO SEM DUPLICAR MESES
function renderizarCalendario() {
    const container = document.getElementById('daysContainer');
    if (!container) return;
    
    container.innerHTML = '';
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const mesesNomes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    const hoje = new Date();
    let diasRenderizados = 0;
    let contador = 0;

    while (diasRenderizados < 14) { 
        // Cria uma nova data baseada no 'hoje' somando o contador de dias
        const dataCopia = new Date();
        dataCopia.setDate(hoje.getDate() + contador);
        
        // Pula os domingos
        if (dataCopia.getDay() !== 0) { 
            const diaSemanaNome = diasSemana[dataCopia.getDay()];
            const diaMesNum = dataCopia.getDate();
            const mesNome = mesesNomes[dataCopia.getMonth()];
            const anoAtual = dataCopia.getFullYear();
            
            const dataTextoMensagem = `${diaMesNum} de ${mesNome} de ${anoAtual}`;

            const dayDiv = document.createElement('div');
            // O primeiro dia útil encontrado fica ativo por padrão
            dayDiv.className = `day-card ${diasRenderizados === 0 ? 'active' : ''}`;
            
            if (diasRenderizados === 0) dadosAgendamento.data = dataTextoMensagem;

            dayDiv.onclick = function() { 
                document.querySelectorAll('.day-card').forEach(d => d.classList.remove('active'));
                this.classList.add('active');
                dadosAgendamento.data = dataTextoMensagem;
            };

            dayDiv.innerHTML = `
                <span>${diaSemanaNome}</span><br>
                <strong>${diaMesNum}</strong><br>
                <small style="font-size:0.6rem; opacity:0.7; text-transform:uppercase;">${mesNome.substring(0,3)}</small>
            `;
            container.appendChild(dayDiv);
            diasRenderizados++;
        }
        contador++;
    }
}

// NAVEGAÇÃO DO CALENDÁRIO
window.scrollCalendar = function(direcao) {
    const container = document.getElementById('daysContainer');
    if (container) {
        const scrollAmount = 160; 
        container.scrollBy({ left: scrollAmount * direcao, behavior: 'smooth' });
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
        setTimeout(() => {
            timeSelection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 200);
    }
};

// ENVIO PARA WHATSAPP
window.finishBooking = function(hora) {
    if (!dadosAgendamento.prof) {
        alert("Por favor, selecione um profissional primeiro!");
        return;
    }

    dadosAgendamento.hora = hora;
    const numeroWhatsApp = "5569993609069"; 
    
    const mensagem = `Olá! Gostaria de agendar na *Barbearia Madero*:%0A%0A` +
                     `✂️ *Serviço:* ${dadosAgendamento.servico}%0A` +
                     `👤 *Barbeiro:* ${dadosAgendamento.prof}%0A` +
                     `📅 *Data:* ${dadosAgendamento.data}%0A` +
                     `⏰ *Horário:* ${dadosAgendamento.hora}%0A%0A` +
                     `_Favor confirmar disponibilidade._`;

    window.open(`https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensagem}`, '_blank');
    closeBooking();
};

// RESET DO MODAL
function resetModal() {
    dadosAgendamento.prof = '';
    dadosAgendamento.hora = '';
    const timeSelection = document.getElementById('timeSelection');
    if(timeSelection) timeSelection.style.display = 'none';
    document.querySelectorAll('.prof-item').forEach(p => p.classList.remove('selected'));
    renderizarCalendario();
}

window.onclick = function(event) {
    const modal = document.getElementById('bookingModal');
    if (event.target == modal) closeBooking();
};
