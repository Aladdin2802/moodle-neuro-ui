// === ШАБЛОН JAVASCRIPT ===

document.addEventListener("DOMContentLoaded", function() {
    // Логика для списка (Аккордеоны и Сетка)
    const container = document.getElementById('interactiveCasesContainer');
    const items = document.querySelectorAll('.raw-case-item');
    
    if (container && items.length > 0) {
        const sections = {};
        
        // Собираем данные
        items.forEach(item => {
            let topic = item.querySelector('.raw-topic').innerText.trim() || 'Без раздела';
            let title = item.querySelector('.raw-title').innerHTML;
            let author = item.querySelector('.raw-author').innerHTML;
            let desc = item.querySelector('.raw-desc').innerHTML;
            
            // Парсинг ссылки на кейс
            let caseLinkElement = item.querySelector('.raw-caselink');
            let caseUrl = caseLinkElement.innerText.trim();
            let caseLinkHtml = '';
            
            // Moodle может оборачивать URL в тег <a>, пытаемся извлечь href
            if (caseLinkElement.querySelector('a')) {
                caseUrl = caseLinkElement.querySelector('a').href;
            }
            
            if (caseUrl && caseUrl !== '') {
                caseLinkHtml = `<a href="${caseUrl}" target="_blank" class="neuro-btn-case">Начать кейс <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></a>`;
            } else {
                caseLinkHtml = `<span style="font-size: 13px; color: #94a3b8; font-weight: 500; padding: 16px 20px;">Кейс недоступен</span>`;
            }

            let editControl = item.querySelector('.raw-edit').innerHTML;
            let deleteControl = item.querySelector('.raw-delete').innerHTML;
            
            if (!sections[topic]) sections[topic] = [];
            
            sections[topic].push(`
                <div class="neuro-grid-card">
                    <div class="neuro-card-content">
                        <h4 class="neuro-card-title">${title}</h4>
                        <div class="neuro-card-desc">${desc}</div>
                        <div class="neuro-card-author" style="font-size: 13px; color: #64748b; margin-top: 12px; font-weight: 500;">Автор: ${author}</div>
                    </div>
                    <div class="neuro-card-actions">
                        ${caseLinkHtml}
                    </div>
                    <div class="neuro-admin-controls-card">${editControl} ${deleteControl}</div>
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

    // 2. Умный парсинг ссылки в Single View
    const singleLinkContainer = document.getElementById('single-case-link');
    if (singleLinkContainer) {
        let url = singleLinkContainer.innerText.trim();
        if (singleLinkContainer.querySelector('a')) {
            url = singleLinkContainer.querySelector('a').href;
        }

        const renderTarget = document.getElementById('rendered-case-button');
        if (renderTarget && url && url !== '') {
            renderTarget.innerHTML = `
                <a href="${url}" target="_blank" class="neuro-btn-primary">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polygon points="10 8 16 12 10 16 10 8"></polygon>
                    </svg>
                    Начать интерактивный кейс
                </a>
            `;
        }
    }
});
