const newsDatabase = { mainNews: null, secondaryNews: [] };

function loadNewsDatabase() {
    const savedNews = localStorage.getItem('znnNews');
    if (savedNews) {
        const parsed = JSON.parse(savedNews);
        newsDatabase.mainNews = parsed.mainNews || null;
        newsDatabase.secondaryNews = parsed.secondaryNews || [];
    }
}

function renderNews() {
    const container = document.getElementById('newsContainer');
    const hasNews = newsDatabase.mainNews || newsDatabase.secondaryNews.length > 0;
    if (!hasNews) {
        container.innerHTML = `<div class="empty-state"><h2>Nenhuma notícia publicada</h2><p>O portal está vazio.</p></div>`;
        return;
    }

    // Separar notícias secundárias em recentes e antigas
    const allSecondary = [...newsDatabase.secondaryNews];
    // Ordenar por data (mais recente primeiro)
    allSecondary.sort((a, b) => {
        const dateA = new Date(a.date + ' ' + a.time);
        const dateB = new Date(b.date + ' ' + b.time);
        return dateB - dateA;
    });

    // Pegar as 3 mais recentes para o meio
    const recentNews = allSecondary.slice(0, 3);
    // O restante são as antigas
    const olderNews = allSecondary.slice(3);

    let html = '';

    // Matéria Principal (topo)
    if (newsDatabase.mainNews) {
        const hasImage = newsDatabase.mainNews.imageUrl ? 'has-image' : '';
        const imageStyle = newsDatabase.mainNews.imageUrl 
            ? `background-image: url('${newsDatabase.mainNews.imageUrl}'); background-color: transparent;` 
            : `background: ${newsDatabase.mainNews.imageColor};`;
        html += `
            <div class="main-news-top">
                <div class="main-news" data-news-id="${newsDatabase.mainNews.id}">
                    <div class="main-news-image ${hasImage}" style="${imageStyle}">
                        ${!newsDatabase.mainNews.imageUrl ? newsDatabase.mainNews.imageText : ''}
                    </div>
                    <div class="main-news-content">
                        <span class="main-news-category">${newsDatabase.mainNews.category}</span>
                        <h1 class="main-news-title">${newsDatabase.mainNews.title}</h1>
                        <p class="main-news-excerpt">${newsDatabase.mainNews.excerpt}</p>
                    </div>
                </div>
            </div>
        `;
    }

    // Notícias Secundárias (meio)
    if (recentNews.length > 0) {
        html += `<div class="secondary-news-middle"><h2 class="section-title">Notícias Recentes</h2><div class="secondary-news-grid">`;
        recentNews.forEach(news => {
            const imageStyle = news.imageUrl 
                ? `background-image: url('${news.imageUrl}'); background-color: transparent;` 
                : `background: ${news.imageColor};`;
            html += `
                <a href="#" class="secondary-card" data-news-id="${news.id}">
                    <div class="secondary-card-image" style="${imageStyle}">
                        ${!news.imageUrl ? news.imageText : ''}
                    </div>
                    <div class="secondary-card-content">
                        <span class="secondary-card-category">${news.category}</span>
                        <h4 class="secondary-card-title">${news.title}</h4>
                        <p class="secondary-card-excerpt">${news.excerpt}</p>
                    </div>
                </a>
            `;
        });
        html += `</div></div>`;
    }

    // Notícias Antigas (fundo)
    if (olderNews.length > 0) {
        html += `<div class="older-news-bottom"><h2 class="section-title">Notícias Anteriores</h2><div class="older-news-grid">`;
        olderNews.forEach(news => {
            const imageStyle = news.imageUrl 
                ? `background-image: url('${news.imageUrl}'); background-color: transparent;` 
                : `background: ${news.imageColor};`;
            html += `
                <a href="#" class="older-news-card" data-news-id="${news.id}">
                    <div class="older-news-card-image" style="${imageStyle}">
                        ${!news.imageUrl ? news.imageText : ''}
                    </div>
                    <div class="older-news-card-content">
                        <span class="older-news-card-category">${news.category}</span>
                        <h4 class="older-news-card-title">${news.title}</h4>
                        <p class="older-news-card-excerpt">${news.excerpt}</p>
                    </div>
                </a>
            `;
        });
        html += `</div></div>`;
    }

    container.innerHTML = html;

    // Adicionar event listeners aos cards de notícias
    document.querySelectorAll('[data-news-id]').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const newsId = e.currentTarget.dataset.newsId;
            showNewsPage(newsId);
        });
    });
}

function findNewsById(newsId) {
    if (newsDatabase.mainNews?.id === newsId) return newsDatabase.mainNews;
    return newsDatabase.secondaryNews.find(n => n.id === newsId);
}

function showNewsPage(newsId) {
    const news = findNewsById(newsId);
    if (!news) return;

    const container = document.getElementById('newsContainer');
    const dateDisplay = news.date || new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const reporterDisplay = news.reporter || 'Redação ZNN';
    const imageStyle = news.imageUrl 
        ? `background-image: url('${news.imageUrl}'); background-color: transparent;` 
        : `background: ${news.imageColor};`;

    container.innerHTML = `
        <div class="news-page">
            <a href="#" class="back-button" onclick="event.preventDefault(); loadNewsDatabase(); renderNews();">
                ← Back to Home
            </a>
            
            <div class="news-page-header">
                <span class="news-page-category">${news.category}</span>
                <h1 class="news-page-title">${news.title}</h1>
                <div class="news-page-meta">
                    ${dateDisplay} | Por ${reporterDisplay}
                </div>
            </div>
            
            <div class="news-page-image" style="${imageStyle}">
                ${!news.imageUrl ? news.imageText : ''}
            </div>
            
            <div class="news-page-content">
                ${news.content}
            </div>
        </div>
    `;
    
    // Rolar para o topo
    window.scrollTo(0, 0);
}

function showCategoryPage(category) {
    const container = document.getElementById('newsContainer');
    const allNews = [
        ...(newsDatabase.mainNews ? [newsDatabase.mainNews] : []),
        ...newsDatabase.secondaryNews
    ].filter(news => news.category === category);

    // Ordenar por data (mais recente primeiro)
    allNews.sort((a, b) => {
        const dateA = new Date(a.date + ' ' + a.time);
        const dateB = new Date(b.date + ' ' + b.time);
        return dateB - dateA; // Decrescente
    });

    if (allNews.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h2>Nenhuma notícia encontrada em "${category}"</h2>
                <p>Volte mais tarde ou explore outras categorias.</p>
            </div>
        `;
        return;
    }

    let html = `
        <div class="category-header">
            <h1>${category}</h1>
            <p>${allNews.length} notícia${allNews.length > 1 ? 's' : ''} encontrada${allNews.length > 1 ? 's' : ''}</p>
        </div>
        <div class="category-grid">
    `;

    html += allNews.map(news => {
        const imageStyle = news.imageUrl 
            ? `background-image: url('${news.imageUrl}'); background-color: transparent;` 
            : `background: ${news.imageColor};`;
        
        return `
            <a href="#" class="category-card" data-news-id="${news.id}">
                <div class="category-card-image" style="${imageStyle}">
                    ${!news.imageUrl ? news.imageText : ''}
                </div>
                <div class="category-card-content">
                    <span class="category-tag ${news.categoryClass}">${news.category}</span>
                    <h3 class="category-card-title">${news.title}</h3>
                    <p class="category-card-excerpt">${news.excerpt}</p>
                    <div class="category-card-meta">
                        ${news.date} • ${news.time} • Por ${news.reporter}
                    </div>
                </div>
            </a>
        `;
    }).join('');

    html += `</div>`;

    container.innerHTML = html;

    // Adicionar event listeners aos cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const newsId = e.currentTarget.dataset.newsId;
            showNewsPage(newsId);
        });
    });

    // Rolar para o topo
    window.scrollTo(0, 0);
}

// Event listeners para navegação
document.addEventListener('DOMContentLoaded', function() {
    // Carregar notícias do localStorage
    loadNewsDatabase();
    
    // Renderizar notícias ao carregar a página
    renderNews();
    
    // Menu mobile toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.getElementById('mainNav');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
        
        // Fechar menu ao clicar em um link
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                mainNav.classList.remove('active');
            });
        });
        
        // Fechar menu ao clicar fora
        document.addEventListener('click', function(e) {
            if (!mobileMenuToggle.contains(e.target) && !mainNav.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                mainNav.classList.remove('active');
            }
        });
    }
    
    // Adicionar event listeners aos links de navegação
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.dataset.page;
            
            if (page === 'home') {
                loadNewsDatabase();
                renderNews();
            } else {
                // Mapeamento de página para categoria
                const categoryMap = {
                    'politica': 'Política',
                    'economia': 'Economia',
                    'tecnologia': 'Tecnologia',
                    'sociedade': 'Sociedade',
                    'mundo': 'Mundo'
                };
                
                const category = categoryMap[page];
                if (category) {
                    showCategoryPage(category);
                }
            }
        });
    });
});