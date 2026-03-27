/* BARBEARIA MADERO - JAVASCRIPT ENGINE 2026 
   LOGIC: DINAMIC SERVICES & SMART CALENDAR
*/

let dadosAgendamento = {
    servico: '',
    prof: '',
    data: '', 
    hora: ''
};

document.addEventListener('DOMContentLoaded', () => {
    renderizarServicos();
    renderizarCalendario();
});

function renderizarServicos() {
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
}

function renderizarCalendario() {
    const container = document.getElementById('daysContainer');
    const headerInfo = document.getElementById('currentMonthYear');
    if (!container) return;
    
    container.innerHTML = '';
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const mesesNomes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    const hoje = new Date();
    if (headerInfo) headerInfo.innerText = `${mesesNomes[hoje.getMonth()]} ${hoje.getFullYear()}`;

    let diasRenderizados = 0;
    let contador = 0;

    while (diasRenderizados < 14) { 
        const dataCopia = new Date();
        dataCopia.setDate(hoje.getDate() + contador);
        
        // Ignora domingos (getDay 0)
        if (dataCopia.getDay() !== 0) { 
            const diaSemanaNome = diasSemana[dataCopia.getDay()];
            const diaMesNum = dataCopia.getDate();
            const mesNome = mesesNomes[dataCopia.getMonth()];
            const anoAtual = dataCopia.getFullYear();
            
            const dataTextoMensagem = `${diaMesNum} de ${mesNome} de ${anoAtual}`;

            const dayDiv = document.createElement('div');
            dayDiv.className = `day-card`;
            
            // Seleciona o primeiro dia por padrão
            if (diasRenderizados === 0) {
                dayDiv.classList.add('active');
                dadosAgendamento.data = dataTextoMensagem;
            }

            dayDiv.onclick = function() { 
                document.querySelectorAll('.day-card').forEach(d => d.classList.remove('active'));
                this.classList.add('active');
                dadosAgendamento.data = dataTextoMensagem;
                if (headerInfo) headerInfo.innerText = `${mesNome} ${anoAtual}`;
            };

            dayDiv.innerHTML = `
                <span>${diaSemanaNome}</span>
                <strong>${diaMesNum}</strong>
                <small>${mesNome.substring(0,3)}</small>
            `;
            container.appendChild(dayDiv);
            diasRenderizados++;
        }
        contador++;
    }
}

window.scrollCalendar = function(direcao) {
    const container = document.getElementById('daysContainer');
    if (container) {
        const scrollAmount = 200; 
        container.scrollBy({ left: scrollAmount * direcao, behavior: 'smooth' });
    }
};

window.openBooking = function(serviceName) {
    const modal = document.getElementById('bookingModal');
    dadosAgendamento.servico = serviceName;
    const titleElement = document.getElementById('selectedServiceName');
    if (titleElement) titleElement.innerText = serviceName.toUpperCase();
    
    if (modal) {
        modal.style.display = 'flex'; // Mudado para flex para alinhar ao centro
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

window.selectProf = function(el, nome) {
    document.querySelectorAll('.prof-item').forEach(p => p.classList.remove('selected'));
    el.classList.add('selected');
    dadosAgendamento.prof = nome;
    
    const timeSelection = document.getElementById('timeSelection');
    if(timeSelection) {
        timeSelection.style.display = 'block';
        // Pequeno delay para o navegador processar o display:block antes do scroll
        setTimeout(() => {
            timeSelection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 50);
    }
};

window.finishBooking = function(hora) {
    if (!dadosAgendamento.prof) {
        alert("Por favor, selecione um barbeiro!");
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

function resetModal() {
    dadosAgendamento.prof = '';
    dadosAgendamento.hora = '';
    const timeSelection = document.getElementById('timeSelection');
    if(timeSelection) timeSelection.style.display = 'none';
    document.querySelectorAll('.prof-item').forEach(p => p.classList.remove('selected'));
    renderizarCalendario(); // Reseta a data para o dia atual
}

// Fecha o modal ao clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById('bookingModal');
    if (event.target == modal) closeBooking();
};
