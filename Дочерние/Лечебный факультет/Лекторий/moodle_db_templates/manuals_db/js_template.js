document.addEventListener("DOMContentLoaded", function() {
    const rawContainer = document.getElementById('manualRawItems');
    const accordionContainer = document.getElementById('manualsAccordionContainer');
    const rawItems = document.querySelectorAll('.neuro-raw-item');
    
    if (accordionContainer && rawItems.length > 0) {
        let sections = {};
        
        rawItems.forEach(item => {
            try {
                let topicElem = item.querySelector('.raw-topic');
                let topic = topicElem ? topicElem.innerText.trim() : 'Без раздела';
                if (!topic) topic = 'Без раздела';
                
                let titleElem = item.querySelector('.raw-title');
                let title = titleElem ? titleElem.innerText.trim() : 'Без названия';
                
                let fileNode = item.querySelector('.raw-file a');
                let fileUrl = fileNode ? fileNode.href : '';
                
                let urlNode = item.querySelector('.raw-url a');
                let urlTextElem = item.querySelector('.raw-url');
                let externalUrlText = urlTextElem ? urlTextElem.innerText.trim() : '';
                externalUrlText = externalUrlText.replace(/\[\[.*?\]\]/g, '').trim();
                let externalUrl = urlNode ? urlNode.href : externalUrlText;
                
                let moreurlElem = item.querySelector('.raw-moreurl');
                let moreurl = moreurlElem ? moreurlElem.innerText.trim() : '';
                
                let editElem = item.querySelector('.raw-edit');
                let editControl = editElem ? editElem.innerHTML : '';
                
                let deleteElem = item.querySelector('.raw-delete');
                let deleteControl = deleteElem ? deleteElem.innerHTML : '';
                
                if (!sections[topic]) sections[topic] = [];
                
                let targetUrl = '';
                if (fileUrl && fileUrl !== '') {
                    targetUrl = fileUrl;
                } else if (externalUrl && externalUrl !== '') {
                    targetUrl = externalUrl;
                } else {
                    targetUrl = moreurl;
                }
                
                sections[topic].push(`
                    <div class="neuro-list-row">
                        <div class="neuro-row-main">
                            <div class="neuro-row-title">${title}</div>
                        </div>
                        <div class="neuro-row-actions">
                            <a href="${targetUrl}" class="neuro-btn-small" target="_blank">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>
                                </svg>
                                Читать
                            </a>
                            <div class="neuro-admin-controls">${editControl} ${deleteControl}</div>
                        </div>
                    </div>
                `);
                
                item.style.display = 'none';
                item.remove(); // Избегаем дублей, физически удаляя сырой элемент
            } catch (e) {
                console.error("Ошибка парсинга элемента", e);
            }
        });
        
        let html = '';
        for (let topic in sections) {
            html += `
            <details>
                <summary>
                    <span>${topic}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </summary>
                <div class="neuro-content">
                    ${sections[topic].join('')}
                </div>
            </details>
            `;
        }
        
        if (Object.keys(sections).length === 0) {
            html = '<div style="padding: 40px; text-align: center; color: var(--color-text-sub);">В этой базе данных пока нет методических пособий.</div>';
        }
        
        accordionContainer.innerHTML = html;
        
        // Удаляем контейнер после парсинга, чтобы не было пустых блоков снизу
        if (rawContainer) rawContainer.remove();
    }
});
