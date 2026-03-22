let dadosAgendamento = {
    servico: '',
    prof: '',
    data: '',
    hora: ''
};

document.addEventListener('DOMContentLoaded', () => {
    renderizarCalendario();

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

    const grid = document.getElementById('servicesGrid');
    if (grid) {
        grid.innerHTML = '';
        listaServicos.forEach(s => {
            const card = document.createElement('div');
            card.className = `service-card ${s.destaque ? 'highlight' : ''}`;
            card.innerHTML = `
                <div class="service-info">
                    <h3>${s.nome}</h3>
                    <span class="price">${s.obs ? `<small style="font-size:0.6rem; display:block; opacity:0.6">${s.obs}</small>` : ''} R$ ${s.preco}</span>
                    <span class="time"><i class="far fa-clock"></i> ${s.tempo}</span>
                </div>
                <button class="btn-main" onclick="openBooking('${s.nome}')">Agendar Agora</button>
            `;
            grid.appendChild(card);
        });
    }
});

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
            const mes = (dataCopia.getMonth() + 1).toString().padStart(2, '0');
            const dataFormatada = `${diaMes}/${mes}`;

            const dayDiv = document.createElement('div');
            dayDiv.className = `day-item ${diasRenderizados === 0 ? 'active' : ''}`;
            if (diasRenderizados === 0) dadosAgendamento.data = dataFormatada;

            dayDiv.onclick = function() { 
                document.querySelectorAll('.day-item').forEach(d => d.classList.remove('active'));
                this.classList.add('active');
                dadosAgendamento.data = dataFormatada;
            };
            dayDiv.innerHTML = `<span>${diaNome}</span><strong>${diaMes}</strong>`;
            container.appendChild(dayDiv);
            diasRenderizados++;
        }
        i++;
    }
}

window.openBooking = function(serviceName) {
    const modal = document.getElementById('bookingModal');
    dadosAgendamento.servico = serviceName;
    document.getElementById('selectedServiceName').innerText = serviceName.toUpperCase();
    if (modal) {
        modal.style.display = 'flex';
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
    document.querySelectorAll('.prof-item').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
    dadosAgendamento.prof = nome;
    document.getElementById('timeSelection').style.display = 'block';
    document.getElementById('bookingInstruction').style.display = 'none';
};

window.scrollDays = function(direction) {
    const container = document.getElementById('daysContainer');
    if (container) container.scrollBy({ left: direction === 'left' ? -150 : 150, behavior: 'smooth' });
};

window.finishBooking = function(hora) {
    dadosAgendamento.hora = hora;
    const texto = `Olá! Gostaria de realizar um agendamento na Barbearia Madero:%0A%0A✂️ *Serviço:* ${dadosAgendamento.servico}%0A👤 *Barbeiro:* ${dadosAgendamento.prof}%0A📅 *Data:* ${dadosAgendamento.data}/2026%0A⏰ *Horário:* ${dadosAgendamento.hora}`;
    window.open(`https://api.whatsapp.com/send?phone=5569993609069&text=${texto}`, '_blank');
    closeBooking();
};

function resetModal() {
    document.getElementById('timeSelection').style.display = 'none';
    document.getElementById('bookingInstruction').style.display = 'block';
    document.querySelectorAll('.prof-item').forEach(p => p.classList.remove('active'));
}
