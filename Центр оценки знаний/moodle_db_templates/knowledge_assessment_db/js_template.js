// === ШАБЛОН JAVASCRIPT ===

document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Логика для списка
    const container = document.getElementById('knowledgeAssessmentContainer');
    const items = document.querySelectorAll('.raw-assessment-item');
    
    if (container && items.length > 0) {
        let tozHtml = '';
        const sections = {};
        
        // Собираем данные
        items.forEach(item => {
            let topic = item.querySelector('.raw-topic').innerText.trim() || 'Без раздела';
            let title = item.querySelector('.raw-title').innerHTML;
            let desc = item.querySelector('.raw-desc').innerHTML;
            
            let urlLink = item.querySelector('.raw-url a');
            let rawUrlText = item.querySelector('.raw-url').innerText.trim();
            
            let url = '';
            if (urlLink) {
                url = urlLink.getAttribute('href');
            } else if (rawUrlText && !rawUrlText.includes('##') && rawUrlText.startsWith('http')) {
                url = rawUrlText;
            }
            
            // Очистка пустых ссылок
            if (url.includes('##') || !url.trim()) url = '';
            
            let editControl = item.querySelector('.raw-edit').innerHTML;
            let deleteControl = item.querySelector('.raw-delete').innerHTML;
            let moreControl = item.querySelector('.raw-more').innerHTML;
            
            // Извлекаем чистую ссылку на single view из ##more##
            let singleViewUrl = '#';
            if (moreControl) {
                let match = moreControl.match(/href="([^"]+)"/);
                if (match && match[1]) {
                    singleViewUrl = match[1];
                }
            }

            let btnHtml = '';
            let isInactive = url ? '' : 'style="opacity: 0.6;"';

            if (url) {
                btnHtml = `<a href="${url}" class="neuro-btn-primary">Начать тест</a>`;
            } else {
                btnHtml = `<div class="neuro-btn-disabled">В разработке</div>`;
            }

            if (topic === 'ТОЗ') {
                tozHtml += `
                <div class="neuro-toz-card" ${isInactive}>
                    <div class="neuro-toz-content">
                        <h2 class="neuro-toz-title">${title}</h2>
                        <div class="neuro-toz-desc">${desc}</div>
                    </div>
                    <div class="neuro-toz-actions">
                        ${btnHtml}
                        <div class="neuro-admin-controls-card">
                            <a href="${singleViewUrl}" title="Посмотреть запись" class="neuro-view-icon">👁</a>
                            ${editControl} ${deleteControl}
                        </div>
                    </div>
                </div>`;
            } else {
                if (!sections[topic]) sections[topic] = [];
                
                sections[topic].push(`
                <div class="neuro-grid-card" ${isInactive}>
                    <div class="neuro-card-content">
                        <h4 class="neuro-card-title">${title}</h4>
                        <div class="neuro-card-desc">${desc}</div>
                    </div>
                    <div class="neuro-card-actions">
                        ${btnHtml}
                        <div class="neuro-admin-controls-card">
                            <a href="${singleViewUrl}" title="Посмотреть запись" class="neuro-view-icon">👁</a>
                            ${editControl} ${deleteControl}
                        </div>
                    </div>
                </div>`);
            }
            
            // ЖЕСТКОЕ УДАЛЕНИЕ СЫРЫХ ДАННЫХ
            item.style.display = 'none';
            item.remove();
        });
        
        // Рендерим ТОЗ и Аккордеоны
        let html = '';
        
        if (tozHtml) {
            html += `<div class="neuro-toz-wrapper">${tozHtml}</div>`;
        }

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
            </details>`;
        }
        
        container.innerHTML = html;
    }

    // 2. Логика для одиночной записи
    const rawSingleUrlSpan = document.querySelector('.raw-single-url');
    const singleBtnContainer = document.getElementById('singleBtnContainer');
    
    if (rawSingleUrlSpan && singleBtnContainer) {
        let urlLink = rawSingleUrlSpan.querySelector('a');
        let rawUrlText = rawSingleUrlSpan.innerText.trim();
        
        let url = '';
        if (urlLink) {
            url = urlLink.getAttribute('href');
        } else if (rawUrlText && !rawUrlText.includes('##') && rawUrlText.startsWith('http')) {
            url = rawUrlText;
        }

        if (url) {
            singleBtnContainer.innerHTML = `<a href="${url}" class="neuro-btn-primary">Начать тест</a>`;
        } else {
            singleBtnContainer.innerHTML = `<div class="neuro-btn-disabled">В разработке</div>`;
        }
    }
});
