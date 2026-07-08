// === ШАБЛОН JAVASCRIPT ===

document.addEventListener("DOMContentLoaded", function() {
    
    // 1. ЛОГИКА ДЛЯ СПИСКА (ПАРСИНГ РЕГИОНОВ, ЗАТЕМ АККОРДЕОНОВ И ССЫЛОК)
    const container = document.getElementById('guidelinesAccordionContainer');
    const items = document.querySelectorAll('.raw-guideline-item');
    
    if (container && items.length > 0) {
        const regions = {};
        
        items.forEach(item => {
            let topic = item.querySelector('.raw-topic').innerText.trim() || 'Без раздела';
            let region = item.querySelector('.raw-region').innerText.trim() || 'Без региона';
            let title = item.querySelector('.raw-title').innerHTML;
            let moreurl = item.querySelector('.raw-moreurl').innerText.trim();
            let editControl = item.querySelector('.raw-edit').innerHTML;
            let deleteControl = item.querySelector('.raw-delete').innerHTML;
            let approveControl = item.querySelector('.raw-approve').innerHTML;
            
            // Пытаемся достать прямую ссылку на документ
            let urlWrapper = item.querySelector('.raw-url');
            let linkElem = urlWrapper ? urlWrapper.querySelector('a') : null;
            let href = linkElem ? linkElem.getAttribute('href') : (urlWrapper ? urlWrapper.innerText.trim() : '');
            
            // Если прямой ссылки нет, кидаем на страницу Moodle
            if (!href || href === '') {
                href = moreurl;
            }

            if (!regions[region]) regions[region] = {};
            if (!regions[region][topic]) regions[region][topic] = [];
            
            // Добавляем запись в виде строчки-ссылки
            regions[region][topic].push(`
                <div class="neuro-link-item">
                    <div class="neuro-row-main">
                        <a href="${href}" target="_blank" class="neuro-doc-link">
                            <span class="neuro-doc-title">${title}</span>
                        </a>
                    </div>
                    <div class="neuro-row-actions">
                        <div class="neuro-admin-controls">
                            ${editControl} ${deleteControl} ${approveControl}
                        </div>
                    </div>
                </div>
            `);
            
            item.style.display = 'none';
            item.remove();
        });
        
        // Сортируем регионы (чтобы "Российские" были выше/слева)
        const sortedRegions = Object.keys(regions).sort((a, b) => {
            if (a.toLowerCase().includes('росс')) return -1;
            if (b.toLowerCase().includes('росс')) return 1;
            return a.localeCompare(b);
        });
        
        // 2. ГЕНЕРАЦИЯ HTML
        let html = '<div class="neuro-regions-grid">';
        
        // Перебираем регионы
        for (const region of sortedRegions) {
            let badgeClass = '';
            let badgeText = '';
            if (region.toLowerCase().includes('росс')) {
                badgeClass = 'ru';
                badgeText = 'RU';
            } else if (region.toLowerCase().includes('межд') || region.toLowerCase().includes('зарубеж')) {
                badgeClass = 'int';
                badgeText = 'INT';
            }

            let headerHtml = badgeText ? `<span class="neuro-header-badge ${badgeClass}">${badgeText}</span> ${region} рекомендации` : `${region} рекомендации`;

            html += `<div class="neuro-region-table-container">
                        <table class="neuro-region-table">
                            <thead>
                                <tr>
                                    <th>${headerHtml}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="neuro-region-accordions" style="padding: 10px;">`;
            
            // Перебираем разделы внутри региона
            const sortedTopics = Object.keys(regions[region]).sort();
            for (const topic of sortedTopics) {
                html += `
                    <details>
                        <summary>
                            ${topic}
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </summary>
                        <div class="neuro-accordion-content">
                            <div class="neuro-links-list">
                                ${regions[region][topic].join('')}
                            </div>
                        </div>
                    </details>`;
            }
            
            html += `               </td>
                                </tr>
                            </tbody>
                        </table>
                      </div>`;
        }
        
        html += '</div>';
        
        container.innerHTML = html;
        
        // Автоматически открываем первый раздел в каждом регионе
        const regionBlocks = container.querySelectorAll('.neuro-region-block');
        regionBlocks.forEach(block => {
            const firstDetail = block.querySelector('details');
            if (firstDetail) firstDetail.setAttribute('open', '');
        });
    }

    // 2. ЛОГИКА ДЛЯ ОДИНОЧНОЙ ЗАПИСИ (АНИМИРОВАННАЯ КНОПКА ФАЙЛА/ССЫЛКИ)
    const fileWrapper = document.querySelector('.neuro-file-wrapper');
    const btnContainer = document.querySelector('.neuro-file-btn-container');

    if (fileWrapper && btnContainer) {
        const originalLink = fileWrapper.querySelector('a');
        let href = '';
        
        if (originalLink) {
            href = originalLink.getAttribute('href');
        } else {
            href = fileWrapper.innerText.trim();
        }
        
        if (href && href !== '') {
            const actionBtn = document.createElement('a');
            actionBtn.href = href;
            actionBtn.target = '_blank';
            actionBtn.className = 'neuro-btn-primary';
            actionBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="12" y1="18" x2="12" y2="12"></line>
                    <line x1="9" y1="15" x2="15" y2="15"></line>
                </svg>
                Открыть документ
            `;
            btnContainer.appendChild(actionBtn);
        } else {
            btnContainer.innerHTML = '<span style="color: var(--color-text-sub); font-style: italic;">Документ не загружен</span>';
        }
    }
});
