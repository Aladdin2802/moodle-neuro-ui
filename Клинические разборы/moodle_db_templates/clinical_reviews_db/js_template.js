// === ШАБЛОН JAVASCRIPT ===

document.addEventListener("DOMContentLoaded", function() {
    // Функция перевода текстовых дат
    const monthDict = {
        "January": "Января", "February": "Февраля", "March": "Марта", "April": "Апреля", 
        "May": "Мая", "June": "Июня", "July": "Июля", "August": "Августа", 
        "September": "Сентября", "October": "Октября", "November": "Ноября", "December": "Декабря"
    };

    function translateDateStr(str) {
        if (!str) return str;
        for (let eng in monthDict) {
            if (str.includes(eng)) {
                str = str.replace(eng, monthDict[eng]);
            }
        }
        return str;
    }

    // 1. Логика для списка (Аккордеоны и Сетка)
    const container = document.getElementById('clinicalReviewsContainer');
    const items = document.querySelectorAll('.raw-review-item');
    
    if (container && items.length > 0) {
        const sections = {};
        
        // Собираем данные
        items.forEach(item => {
            let topic = item.querySelector('.raw-topic').innerText.trim() || 'Без раздела';
            let title = item.querySelector('.raw-title').innerHTML;
            let speaker = item.querySelector('.raw-speaker').innerText.trim();
            let date = translateDateStr(item.querySelector('.raw-date').innerText.trim());
            let moreurl = item.querySelector('.raw-moreurl').innerHTML;
            let editControl = item.querySelector('.raw-edit').innerHTML;
            let deleteControl = item.querySelector('.raw-delete').innerHTML;
            
            // Если докладчик и дата пустые, не выводим их
            let metaHtml = '';
            if (speaker || date) {
                metaHtml = `<div class="neuro-card-meta" style="margin-bottom: 0;">`;
                if (date) metaHtml += `<span class="neuro-meta-date">${date}</span>`;
                if (speaker) metaHtml += `<span class="neuro-meta-speaker">Докладчик: ${speaker}</span>`;
                metaHtml += `</div>`;
            }

            if (!sections[topic]) sections[topic] = [];
            
            sections[topic].push(`
                <div class="neuro-grid-card">
                    <div class="neuro-card-content">
                        <h4 class="neuro-card-title">${title}</h4>
                        ${metaHtml}
                    </div>
                    <div class="neuro-card-actions">
                        <a href="${moreurl.replace(/<[^>]+>/g, '').trim()}" class="neuro-btn-small">Перейти к файлу <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></a>
                        <div class="neuro-admin-controls-card">${editControl} ${deleteControl}</div>
                    </div>
                </div>
            `);
            
            // ЖЕСТКОЕ УДАЛЕНИЕ СЫРЫХ ДАННЫХ
            item.style.display = 'none';
            item.remove();
        });
        
        // Рендерим аккордеоны с сеткой внутри
        let html = '';
        for (const [topic, cards] of Object.entries(sections)) {
            html += `
            <details class="neuro-topic-accordion" open>
                <summary>
                    <span>${topic}</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </summary>
                <div class="neuro-accordion-content">
                    <div class="neuro-cards-grid">
                        ${cards.join('')}
                    </div>
                </div>
            </details>
            `;
        }
        
        container.innerHTML = html;
    }

    // 2. Парсинг файлов (до 3 файлов)
    const renderedFiles = document.getElementById('rendered-files');
    if (renderedFiles) {
        function parseFile(containerId) {
            const fileContainer = document.getElementById(containerId);
            if (fileContainer) {
                const linkElement = fileContainer.querySelector('a');
                if (linkElement && linkElement.href) {
                    let fileName = linkElement.innerText || 'Скачать файл';
                    const a = document.createElement('a');
                    a.href = linkElement.href;
                    a.className = 'neuro-btn-primary';
                    a.target = '_blank';
                    a.style.marginBottom = '24px';
                    a.innerHTML = `
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="12" y1="18" x2="12" y2="12"></line>
                            <line x1="9" y1="15" x2="15" y2="15"></line>
                        </svg>
                        ${fileName}
                    `;
                    renderedFiles.appendChild(a);
                }
            }
        }
        
        parseFile('raw-file-1');
        parseFile('raw-file-2');
        parseFile('raw-file-3');
    }

    // 3. Принудительный перевод месяцев на русский язык (для формы)
    const monthsRu = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];
    document.querySelectorAll('.date-cell-wrapper select option').forEach(opt => {
        let val = parseInt(opt.value);
        if (val >= 1 && val <= 12 && !isNaN(val) && opt.innerText.length > 2) {
            opt.innerText = monthsRu[val - 1];
        }
    });

    // 4. Перевод даты в одиночной записи
    const singleDateSpan = document.querySelector('.single-raw-date');
    if (singleDateSpan) {
        singleDateSpan.innerText = translateDateStr(singleDateSpan.innerText);
    }
});
