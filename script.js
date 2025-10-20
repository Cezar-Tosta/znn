// Estrutura inicial do banco de dados de notícias
const newsDatabase = {
    mainNews: null,
    sidebarNews: [],
    secondaryNews: []
};

// Carregar notícias do arquivo data/news.json
async function loadNewsDatabase() {
    try {
        const response = await fetch('data/news.json');
        if (response.ok) {
            const data = await response.json();
            newsDatabase.mainNews = data.mainNews || null;
            newsDatabase.sidebarNews = Array.isArray(data.sidebarNews) ? data.sidebarNews : [];
            newsDatabase.secondaryNews = Array.isArray(data.secondaryNews) ? data.secondaryNews : [];
        } else {
            console.warn('Arquivo data/news.json não encontrado. Usando banco vazio.');
        }
    } catch (error) {
        console.error('Erro ao carregar data/news.json:', error);
        // Mantém o estado vazio em caso de erro
    }
}

// Função para renderizar as notícias
function renderNews() {
    const container = document.getElementById('newsContainer');
    
    const hasNews = newsDatabase.mainNews || 
                    newsDatabase.sidebarNews.length > 0 || 
                    newsDatabase.secondaryNews.length > 0;
    
    if (!hasNews) {
        container.innerHTML = `
            <div class="empty-state">
                <h2>Nenhuma notícia publicada</h2>
                <p>O portal está vazio. Adicione notícias através do painel administrativo.</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    // Hero Section (apenas se houver notícia principal OU notícias na sidebar)
    if (newsDatabase.mainNews || newsDatabase.sidebarNews.length > 0) {
        html += '<div class="hero-section">';
        
        // Notícia Principal
        if (newsDatabase.mainNews) {
            const hasImage = newsDatabase.mainNews.imageUrl ? 'has-image' : '';
            const imageStyle = newsDatabase.mainNews.imageUrl 
                ? `background-image: url('${newsDatabase.mainNews.imageUrl}'); background-color: transparent;` 
                : `background: ${newsDatabase.mainNews.imageColor};`;
            
            html += `
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
            `;
        }
        
        // Sidebar
        if (newsDatabase.sidebarNews.length > 0) {
            html += `
                <div class="sidebar">
                    ${newsDatabase.sidebarNews.map(news => {
                        const imageStyle = news.imageUrl 
                            ? `background-image: url('${news.imageUrl}'); background-color: transparent;` 
                            : `background: ${news.imageColor};`;
                        return `
                        <a href="#" class="news-card" data-news-id="${news.id}">
                            <div class="news-card-image" style="${imageStyle}">
                                ${!news.imageUrl ? news.imageText : ''}
                            </div>
                            <div class="news-card-content">
                                <span class="category-tag ${news.categoryClass}">${news.category}</span>
                                <h3 class="news-card-title">${news.title}</h3>
                                <p class="news-card-excerpt">${news.excerpt}</p>
                            </div>
                        </a>
                    `}).join('')}
                </div>
            `;
        }
        
        html += '</div>';
    }
    
    // Featured Section
    if (newsDatabase.secondaryNews.length > 0) {
        html += `
            <div class="featured-section">
                <h2 class="section-title">Latest Stories</h2>
                <div class="secondary-news">
                    ${newsDatabase.secondaryNews.map(news => {
                        const imageStyle = news.imageUrl 
                            ? `background-image: url('${news.imageUrl}'); background-color: transparent;` 
                            : `background: ${news.imageColor};`;
                        return `
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
                    `}).join('')}
                </div>
            </div>
        `;
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

// Função para encontrar uma notícia por ID
function findNewsById(newsId) {
    if (newsDatabase.mainNews && newsDatabase.mainNews.id === newsId) {
        return newsDatabase.mainNews;
    }
    
    let news = newsDatabase.sidebarNews.find(n => n.id === newsId);
    if (news) return news;
    
    news = newsDatabase.secondaryNews.find(n => n.id === newsId);
    return news;
}

// Função para exibir página individual da notícia
function showNewsPage(newsId) {
    const news = findNewsById(newsId);
    if (!news) return;
    
    const container = document.getElementById('newsContainer');
    
    const dateDisplay = news.date || new Date().toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const reporterDisplay = news.reporter || 'Redação ZNN';
    
    const imageStyle = news.imageUrl 
        ? `background-image: url('${news.imageUrl}'); background-color: transparent;` 
        : `background: ${news.imageColor};`;
    
    container.innerHTML = `
        <div class="news-page">
            <a href="#" class="back-button" onclick="event.preventDefault(); loadNewsDatabase().then(renderNews);">
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
    
    window.scrollTo(0, 0);
}

// Event listeners para navegação
document.addEventListener('DOMContentLoaded', async function() {
    // Carregar notícias do arquivo JSON
    await loadNewsDatabase();
    
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
                loadNewsDatabase().then(renderNews);
            } else {
                console.log('Navegando para categoria:', page);
                // Futuramente, você pode filtrar notícias por categoria aqui
            }
        });
    });
});