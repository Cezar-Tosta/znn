// script.js - Versão completa adaptada para Vercel (usa data/news.json)

let newsDatabase = { mainNews: null, secondaryNews: [], olderNews: [] };

// --- Carrega notícias de data/news.json ---
async function loadNewsDatabase() {
    console.log("Iniciando loadNewsDatabase...");
    try {
        const response = await fetch('data/news.json');
        if (!response.ok) throw new Error('Arquivo news.json não encontrado');
        const data = await response.json();
        newsDatabase.mainNews = data.mainNews || null;
        newsDatabase.secondaryNews = Array.isArray(data.secondaryNews) ? data.secondaryNews : [];
        newsDatabase.olderNews = Array.isArray(data.olderNews) ? data.olderNews : [];
        console.log("Banco de dados carregado do news.json:", newsDatabase);
    } catch (e) {
        console.error("Erro ao carregar news.json:", e);
        newsDatabase = { mainNews: null, secondaryNews: [], olderNews: [] };
    }
}

// --- Funções de Renderização (mantidas 100% da original) ---
function renderNews() {
    console.log("Iniciando renderNews...");
    const container = document.getElementById('newsContainer');
    if (!container) {
        console.error("Elemento #newsContainer não encontrado.");
        return;
    }

    const allNewsForDisplay = [
        ...(newsDatabase.mainNews ? [newsDatabase.mainNews] : []),
        ...newsDatabase.secondaryNews,
        ...newsDatabase.olderNews
    ];
    console.log("Total de notícias para exibição:", allNewsForDisplay.length);

    if (allNewsForDisplay.length === 0) {
        container.innerHTML = `<div class="empty-state"><h2>Nenhuma notícia publicada</h2><p>O portal está vazio.</p></div>`;
        return;
    }

    // Ordenação (mantida)
    allNewsForDisplay.sort((a, b) => {
        let dateA, dateB;
        if (a.rawDate && b.rawDate) {
            dateA = new Date(a.rawDate);
            dateB = new Date(b.rawDate);
        } else {
            dateA = new Date(`${a.date} ${a.time}`);
            dateB = new Date(`${b.date} ${b.time}`);
        }
        return dateB - dateA;
    });

    let html = '';
    const topFourNews = allNewsForDisplay.slice(0, 4);
    const remainingNews = allNewsForDisplay.slice(4);

    if (topFourNews.length > 0) {
        html += `<div class="top-four-section">`;

        if (topFourNews[0]) {
            const news = topFourNews[0];
            const hasImage = news.imageUrl ? 'has-image' : '';
            const imageStyle = news.imageUrl
                ? `background-image: url('${news.imageUrl}'); background-color: transparent;`
                : `background: ${news.imageColor};`;
            html += `
                <div class="highlight-news-section">
                    <div class="highlight-news" data-news-id="${news.id}">
                        <div class="highlight-news-image ${hasImage}" style="${imageStyle}">
                            ${!news.imageUrl ? news.imageText : ''}
                        </div>
                        <div class="highlight-news-content">
                            <span class="highlight-news-category ${news.categoryClass}">${news.category}</span>
                            <h1 class="highlight-news-title">${news.title}</h1>
                            <p class="highlight-news-excerpt">${news.excerpt}</p>
                            <div class="highlight-news-meta">${news.date} • ${news.time} • Por ${news.reporter}</div>
                        </div>
                    </div>
                </div>
            `;
        }

        const lastThreeNews = topFourNews.slice(1, 4);
        if (lastThreeNews.length > 0) {
            html += `<div class="last-three-news-section"><h2 class="section-title">Últimas Notícias</h2><div class="last-three-news-column">`;
            lastThreeNews.forEach(news => {
                const imageStyle = news.imageUrl
                    ? `background-image: url('${news.imageUrl}'); background-color: transparent;`
                    : `background: ${news.imageColor};`;
                html += `
                    <a href="#" class="last-three-news-card" data-news-id="${news.id}">
                        <div class="last-three-news-card-image" style="${imageStyle}">
                            ${!news.imageUrl ? news.imageText : ''}
                        </div>
                        <div class="last-three-news-card-content">
                            <span class="last-three-news-card-category ${news.categoryClass}">${news.category}</span>
                            <h3 class="last-three-news-card-title">${news.title}</h3>
                            <p class="last-three-news-card-excerpt">${news.excerpt}</p>
                            <div class="last-three-news-card-meta">${news.date} • ${news.time} • Por ${news.reporter}</div>
                        </div>
                    </a>
                `;
            });
            html += `</div></div>`;
        }
        html += `</div>`;
    }

    if (remainingNews.length > 0) {
        html += `<div class="older-news-section"><h2 class="section-title">Notícias Antigas</h2><div class="older-news-grid">`;
        remainingNews.forEach(news => {
            const imageStyle = news.imageUrl
                ? `background-image: url('${news.imageUrl}'); background-color: transparent;`
                : `background: ${news.imageColor};`;
            html += `
                <a href="#" class="older-news-card" data-news-id="${news.id}">
                    <div class="older-news-card-image" style="${imageStyle}">
                        ${!news.imageUrl ? news.imageText : ''}
                    </div>
                    <div class="older-news-card-content">
                        <span class="older-news-card-category ${news.categoryClass}">${news.category}</span>
                        <h4 class="older-news-card-title">${news.title}</h4>
                        <p class="older-news-card-excerpt">${news.excerpt}</p>
                        <div class="older-news-card-meta">${news.date} • ${news.time} • Por ${news.reporter}</div>
                    </div>
                </a>
            `;
        });
        html += `</div></div>`;
    }

    container.innerHTML = html;

    document.querySelectorAll('[data-news-id]').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            showNewsPage(e.currentTarget.dataset.newsId);
        });
    });
}

function findNewsById(newsId) {
    if (newsDatabase.mainNews?.id === newsId) return newsDatabase.mainNews;
    return newsDatabase.secondaryNews.find(n => n.id === newsId) || newsDatabase.olderNews.find(n => n.id === newsId);
}

function showNewsPage(newsId) {
    const news = findNewsById(newsId);
    if (!news) return;

    const container = document.getElementById('newsContainer');
    const dateDisplay = news.date || new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    const reporterDisplay = news.reporter || 'Redação ZNN';
    const imageStyle = news.imageUrl
        ? `background-image: url('${news.imageUrl}'); background-color: transparent;`
        : `background: ${news.imageColor};`;

    let html = `
        <div class="news-page">
            <a href="#" class="back-button" onclick="event.preventDefault(); loadNewsDatabase().then(renderNews);">
                ← Página Inicial
            </a>
            <div class="news-page-header">
                <span class="news-page-category ${news.categoryClass}">${news.category}</span>
                <h1 class="news-page-title">${news.title}</h1>
                <div class="news-page-meta">${dateDisplay} | Por ${reporterDisplay}</div>
            </div>
            <div class="news-page-image" style="${imageStyle}">
                ${!news.imageUrl ? news.imageText : ''}
            </div>
            <div class="news-page-content">
                ${news.content}
            </div>
        </div>
        <div class="news-page-footer">
            <a href="#" class="back-button" onclick="event.preventDefault(); loadNewsDatabase().then(renderNews);">
                ← Página Inicial
            </a>
        </div>
    `;

    container.innerHTML = html;
    window.scrollTo(0, 0);
}

function showCategoryPage(category) {
    const allNews = [
        ...(newsDatabase.mainNews ? [newsDatabase.mainNews] : []),
        ...newsDatabase.secondaryNews,
        ...newsDatabase.olderNews
    ];
    const filteredNews = allNews.filter(news => news.category === category);
    filteredNews.sort((a, b) => {
        let dateA, dateB;
        if (a.rawDate && b.rawDate) {
            dateA = new Date(a.rawDate);
            dateB = new Date(b.rawDate);
        } else {
            dateA = new Date(`${a.date} ${a.time}`);
            dateB = new Date(`${b.date} ${b.time}`);
        }
        return dateB - dateA;
    });

    const container = document.getElementById('newsContainer');
    if (filteredNews.length === 0) {
        container.innerHTML = `<div class="empty-state"><h2>Nenhuma notícia em "${category}"</h2></div>`;
        return;
    }

    let html = `
        <div class="category-header">
            <h1>${category}</h1>
            <p>${filteredNews.length} notícia${filteredNews.length > 1 ? 's' : ''}</p>
        </div>
        <div class="category-news-grid">
    `;
    html += filteredNews.map(news => {
        const imageStyle = news.imageUrl
            ? `background-image: url('${news.imageUrl}'); background-color: transparent;`
            : `background: ${news.imageColor};`;
        return `
            <a href="#" class="category-news-card" data-news-id="${news.id}">
                <div class="category-news-card-image" style="${imageStyle}">
                    ${!news.imageUrl ? news.imageText : ''}
                </div>
                <div class="category-news-card-content">
                    <span class="category-news-card-category ${news.categoryClass}">${news.category}</span>
                    <h3 class="category-news-card-title">${news.title}</h3>
                    <p class="category-news-card-excerpt">${news.excerpt}</p>
                    <div class="category-news-card-meta">${news.date} • ${news.time} • Por ${news.reporter}</div>
                </div>
            </a>
        `;
    }).join('');
    html += `</div>`;
    container.innerHTML = html;

    document.querySelectorAll('.category-news-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            showNewsPage(e.currentTarget.dataset.newsId);
        });
    });
    window.scrollTo(0, 0);
}

// --- Inicialização ---
document.addEventListener('DOMContentLoaded', async function () {
    console.log("DOM Index carregado.");
    await loadNewsDatabase();
    renderNews();

    // Menu mobile
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.getElementById('mainNav');
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
        });

        document.querySelectorAll('nav a[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                mobileMenuToggle.classList.remove('active');
                mainNav.classList.remove('active');

                const page = link.dataset.page;
                if (page === 'home') {
                    loadNewsDatabase().then(renderNews);
                } else {
                    const map = { politica: 'Política', economia: 'Economia', tecnologia: 'Tecnologia', sociedade: 'Sociedade', mundo: 'Mundo' };
                    const cat = map[page];
                    if (cat) showCategoryPage(cat);
                }
            });
        });
    }
});