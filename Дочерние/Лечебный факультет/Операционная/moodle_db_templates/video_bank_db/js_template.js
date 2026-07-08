// === ШАБЛОН JAVASCRIPT ===

document.addEventListener("DOMContentLoaded", function() {
    // 1. Логика для списка (Аккордеоны и Сетка)
    const container = document.getElementById('videoBankContainer');
    const items = document.querySelectorAll('.raw-video-item');
    
    if (container && items.length > 0) {
        const sections = {};
        
        // Собираем данные
        items.forEach(item => {
            let topic = item.querySelector('.raw-topic').innerText.trim() || 'Без раздела';
            let title = item.querySelector('.raw-title').innerHTML;
            let desc = item.querySelector('.raw-desc').innerHTML;
            let author = item.querySelector('.raw-author').innerHTML;
            let moreurl = item.querySelector('.raw-moreurl').innerHTML;
            let editControl = item.querySelector('.raw-edit').innerHTML;
            let deleteControl = item.querySelector('.raw-delete').innerHTML;
            
            if (!sections[topic]) sections[topic] = [];
            
            sections[topic].push(`
                <div class="neuro-grid-card">
                    <div class="neuro-card-content">
                        <h4 class="neuro-card-title">${title}</h4>
                        <div class="neuro-card-desc">${desc}</div>
                        <div class="neuro-card-author">Хирург: ${author}</div>
                    </div>
                    <div class="neuro-card-actions">
                        <a href="${moreurl}" class="neuro-btn-small">Смотреть далее <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></a>
                        <div class="neuro-admin-controls">${editControl} ${deleteControl}</div>
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

    // 2. Логика для видео в single view
    const ytRaw = document.getElementById('raw-yt-url');
    if (ytRaw) {
        let url = ytRaw.innerText.trim();
        const ytDetails = document.getElementById('details-yt');
        const ytIframe = document.getElementById('yt-iframe');
        
        if (!url || url === '') {
            if (ytDetails) ytDetails.style.display = 'none';
        } else if (ytIframe) {
            let embedUrl = url;
            if (url.includes('watch?v=')) {
                embedUrl = 'https://www.youtube.com/embed/' + url.split('watch?v=')[1].split('&')[0];
            } else if (url.includes('youtu.be/')) {
                embedUrl = 'https://www.youtube.com/embed/' + url.split('youtu.be/')[1].split('?')[0];
            } else if (!url.includes('embed') && !url.includes('http')) {
                embedUrl = 'https://www.youtube.com/embed/' + url;
            }
            ytIframe.src = embedUrl;
        }
    }
    
    const rtRaw = document.getElementById('raw-rt-url');
    if (rtRaw) {
        let url = rtRaw.innerText.trim();
        const rtDetails = document.getElementById('details-rt');
        const rtIframe = document.getElementById('rt-iframe');
        
        if (!url || url === '') {
            if (rtDetails) rtDetails.style.display = 'none';
        } else if (rtIframe) {
            let embedUrl = url;
            if (url.includes('rutube.ru/video/')) {
                embedUrl = 'https://rutube.ru/play/embed/' + url.split('rutube.ru/video/')[1].replace('/', '');
            } else if (!url.includes('embed') && !url.includes('http')) {
                embedUrl = 'https://rutube.ru/play/embed/' + url;
            }
            rtIframe.src = embedUrl;
        }
    }
});
