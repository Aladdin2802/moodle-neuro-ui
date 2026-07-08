document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('presAccordionContainer');
    const items = document.querySelectorAll('.raw-pres-item');
    
    if (container && items.length > 0) {
        const sections = {};
        
        items.forEach(item => {
            try {
                let topicElem = item.querySelector('.raw-topic');
                let topic = topicElem ? topicElem.innerText.trim() : 'Без раздела';
                if (!topic || topic.includes('[[')) topic = 'Без раздела';
                
                let titleElem = item.querySelector('.raw-title');
                let title = titleElem ? titleElem.innerHTML : 'Без названия';
                
                let authorElem = item.querySelector('.raw-author');
                let author = authorElem ? authorElem.innerHTML : 'Не указан';
            
            // Moodle генерирует <a> тег для файлов
            let fileNode = item.querySelector('.raw-file a');
            let fileUrl = fileNode ? fileNode.href : '';
            
            // Moodle генерирует <a> тег для URL поля
            let urlNode = item.querySelector('.raw-url a');
            let externalUrlText = item.querySelector('.raw-url').innerText.trim();
            externalUrlText = externalUrlText.replace(/\[\[.*?\]\]/g, '').trim();
            let externalUrl = urlNode ? urlNode.href : externalUrlText;
            
            let moreurl = item.querySelector('.raw-moreurl').innerText.trim();
            let editControl = item.querySelector('.raw-edit').innerHTML;
            let deleteControl = item.querySelector('.raw-delete').innerHTML;
            
            if (!sections[topic]) sections[topic] = [];
            
            // Если есть файл - берем его. Если нет - берем ссылку. Если и ее нет - ведем на подробную страницу.
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
                        <div class="neuro-row-author">Автор: ${author}</div>
                    </div>
                    <div class="neuro-row-actions">
                        <a href="${targetUrl}" class="neuro-btn-small" target="_blank">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                            Открыть
                        </a>
                        <div class="neuro-admin-controls">${editControl} ${deleteControl}</div>
                    </div>
                </div>
            `);
            
            
            item.style.display = 'none';
            item.remove();
            } catch (e) {
                console.error("Ошибка парсинга записи: ", e);
            }
        });
        
        let html = '';
        for (const [topic, rows] of Object.entries(sections)) {
            html += `
            <details>
                <summary>
                    <span>${topic}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </summary>
                <div class="neuro-content">
                    ${rows.join('')}
                </div>
            </details>
            `;
        }
        
        container.innerHTML = html;
    }
});
