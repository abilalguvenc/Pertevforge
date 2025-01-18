document.addEventListener('DOMContentLoaded', function() {
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    const monthNames = [
        "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
        "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    ];

    // Firebase'den etkinlikleri çek
    const events = [
        { date: '2024-04-15', title: 'Unity Workshop', description: '2D oyun geliştirme temelleri' },
        { date: '2024-04-22', title: 'Unreal Engine Eğitimi', description: 'Blueprint sistemleri' },
        { date: '2024-01-22', title: 'Bireysel Proje Ödevi', description: 'Sömestr tatili boyunca geliştirilecek oyun projesi', endDate: '2024-02-04', details: { hedefler: [ 'Unreal Engine kullanarak basit bir oyun geliştirmek', 'Temel oyun mekaniklerini uygulamak', 'Asset ve kaynak yönetimini öğrenmek' ], teslimKriterleri: [ 'Çalışır durumda bir oyun prototipi', 'Kaynak kodların GitHub reposuna yüklenmesi', 'Proje dokümantasyonu', 'Kısa bir sunum/demo videosu' ], sonTeslimTarihi: '4 Şubat 2024, 23:59' } }
    ];

    function updateCalendar() {
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const startingDay = firstDay.getDay() || 7; // Pazartesi 1, Pazar 7
        const totalDays = lastDay.getDate();

        document.getElementById('currentMonth').textContent = 
            `${monthNames[currentMonth]} ${currentYear}`;

        const calendarGrid = document.getElementById('calendarDays');
        calendarGrid.innerHTML = '';

        // Önceki ayın son günleri
        const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
        for (let i = startingDay - 1; i > 0; i--) {
            const dayElement = createDayElement(prevMonthLastDay - i + 1, 'other-month');
            calendarGrid.appendChild(dayElement);
        }

        // Mevcut ayın günleri
        for (let day = 1; day <= totalDays; day++) {
            const dayElement = createDayElement(day, '');
            if (isToday(day)) dayElement.classList.add('today');
            if (hasEvent(day)) {
                dayElement.classList.add('has-event');
                dayElement.appendChild(createEventIndicator());
            }
            calendarGrid.appendChild(dayElement);
        }

        // Sonraki ayın ilk günleri
        const remainingDays = 42 - (startingDay - 1 + totalDays);
        for (let day = 1; day <= remainingDays; day++) {
            const dayElement = createDayElement(day, 'other-month');
            calendarGrid.appendChild(dayElement);
        }

        updateEventsList();
    }

    function createDayElement(day, className) {
        const div = document.createElement('div');
        div.className = `calendar-day ${className}`;
        div.textContent = day;
        
        // Etkinlik varsa tıklanabilir yap
        const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const event = events.find(e => e.date === dateStr);
        
        if (event) {
            div.addEventListener('click', () => showEventDetails(event));
        }
        
        return div;
    }

    function createEventIndicator() {
        const div = document.createElement('div');
        div.className = 'event-indicator';
        return div;
    }

    function isToday(day) {
        const today = new Date();
        return day === today.getDate() && 
               currentMonth === today.getMonth() && 
               currentYear === today.getFullYear();
    }

    function hasEvent(day) {
        const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        return events.some(event => event.date === dateStr);
    }

    function updateEventsList() {
        const eventsList = document.getElementById('eventsList');
        eventsList.innerHTML = '';

        const currentMonthEvents = events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getMonth() === currentMonth && 
                   eventDate.getFullYear() === currentYear;
        });

        currentMonthEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

        currentMonthEvents.forEach(event => {
            const eventDate = new Date(event.date);
            const eventElement = document.createElement('div');
            eventElement.className = 'event-item';
            eventElement.innerHTML = `
                <div class="event-date">
                    <div class="day">${eventDate.getDate()}</div>
                    <div class="month">${monthNames[eventDate.getMonth()].slice(0, 3)}</div>
                </div>
                <div class="event-info">
                    <h4>${event.title}</h4>
                    <p>${event.description}</p>
                </div>
            `;
            eventsList.appendChild(eventElement);
        });
    }

    // Event detayları için modal fonksiyonu
    function showEventDetails(event) {
        const modal = document.createElement('div');
        modal.className = 'event-modal';
        
        let detailsHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>${event.title}</h2>
                <p class="event-date">
                    <i class="fas fa-calendar"></i> 
                    ${new Date(event.date).toLocaleDateString('tr-TR')}
                    ${event.endDate ? ` - ${new Date(event.endDate).toLocaleDateString('tr-TR')}` : ''}
                </p>
                <p>${event.description}</p>
        `;

        if (event.details) {
            detailsHTML += `
                <div class="event-details">
                    <h3>Hedefler</h3>
                    <ul>
                        ${event.details.hedefler.map(h => `<li>${h}</li>`).join('')}
                    </ul>
                    
                    <h3>Teslim Kriterleri</h3>
                    <ul>
                        ${event.details.teslimKriterleri.map(k => `<li>${k}</li>`).join('')}
                    </ul>
                    
                    <p class="deadline">
                        <strong>Son Teslim Tarihi:</strong> ${event.details.sonTeslimTarihi}
                    </p>
                </div>
            `;
        }

        detailsHTML += `</div>`;
        modal.innerHTML = detailsHTML;

        document.body.appendChild(modal);
        
        // Modal kapatma
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    }

    // Event Listeners
    document.getElementById('prevMonth').addEventListener('click', () => {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear--;
        } else {
            currentMonth--;
        }
        updateCalendar();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }
        updateCalendar();
    });

    // İlk yükleme
    updateCalendar();
}); 