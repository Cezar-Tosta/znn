// Banco de dados de notícias
const newsDatabase = { mainNews: null, secondaryNews: [], olderNews: [] };

// --- Funções de Carregamento ---
function loadNewsDatabase() {
    console.log("Iniciando loadNewsDatabase...");
    const savedNews = localStorage.getItem('znnNews');
    if (savedNews) {
        try {
            const parsed = JSON.parse(savedNews);
            console.log("Dados brutos do localStorage ('znnNews'):", parsed);
            newsDatabase.mainNews = parsed.mainNews || null;
            newsDatabase.secondaryNews = parsed.secondaryNews || [];
            newsDatabase.olderNews = parsed.olderNews || [];
            console.log("Banco de dados carregado:", newsDatabase);
        } catch (e) {
            console.error("Erro ao parsear dados do localStorage ('znnNews'):", e);
            // Em caso de erro, mantém o banco vazio
        }
    } else {
        console.log("Nenhum dado encontrado no localStorage ('znnNews').");
    }
}

// --- Funções de Renderização ---
function renderNews() {
    console.log("Iniciando renderNews...");
    const container = document.getElementById('newsContainer');
    if (!container) {
        console.error("Elemento #newsContainer não encontrado.");
        return;
    }

    // Combinar todas as notícias para exibição unificada
    // Agora, todas as notícias novas/vindas do admin vão para secondaryNews
    const allNewsForDisplay = [...newsDatabase.secondaryNews];
    console.log("Total de notícias para exibição:", allNewsForDisplay.length);

    const hasNews = allNewsForDisplay.length > 0;
    if (!hasNews) {
        container.innerHTML = `<div class="empty-state"><h2>Nenhuma notícia publicada</h2><p>O portal está vazio.</p></div>`;
        console.log("Nenhuma notícia para renderizar.");
        return;
    }

    // --- CORREÇÃO 1: Ordenar TODAS as notícias da mais recente para a mais antiga ---
    console.log("Ordenando notícias...");
    allNewsForDisplay.sort((a, b) => {
        let dateA, dateB;

        // --- CORREÇÃO 2: Priorizar rawDate (objeto Date) se disponível ---
        if (a.rawDate && b.rawDate) {
            // Se ambas têm rawDate, use-as diretamente para comparação precisa
            dateA = new Date(a.rawDate);
            dateB = new Date(b.rawDate);
            console.log(`Ordenando por rawDate: ${a.title} (${dateA}) vs ${b.title} (${dateB})`);
        } else {
            // Fallback: criar objetos Date a partir de string formatada
            // Isso pode ser menos preciso se o formato for ambíguo
            dateA = new Date(`${a.date} ${a.time}`);
            dateB = new Date(`${b.date} ${b.time}`);
            console.log(`Ordenando por string formatada: ${a.title} (${dateA}) vs ${b.title} (${dateB})`);
        }
        // Ordem decrescente (mais recente primeiro)
        return dateB - dateA;
    });
    console.log("Notícias ordenadas:", allNewsForDisplay.map(n => `${n.title} (${n.date} ${n.time})`));
    // --- Fim das Correções 1 e 2 ---

    let html = '';

    // --- Grade Unificada de Notícias (3 colunas) ---
    html += `<div class="news-grid-section"><h2 class="section-title">Todas as Notícias</h2><div class="news-grid">`;

    allNewsForDisplay.forEach((news, index) => {
        console.log(`Renderizando notícia #${index + 1} (Ordem: ${index + 1}ª mais recente): ${news.title}`);
        const imageStyle = news.imageUrl
            ? `background-image: url('${news.imageUrl}'); background-color: transparent;`
            : `background: ${news.imageColor};`;
        html += `
            <a href="#" class="news-grid-card" data-news-id="${news.id}">
                <div class="news-grid-card-image" style="${imageStyle}">
                    ${!news.imageUrl ? news.imageText : ''}
                </div>
                <div class="news-grid-card-content">
                    <span class="news-grid-card-category ${news.categoryClass}">${news.category}</span>
                    <h3 class="news-grid-card-title">${news.title}</h3>
                    <p class="news-grid-card-excerpt">${news.excerpt}</p>
                    <div class="news-grid-card-meta">${news.date} • ${news.time} • Por ${news.reporter}</div>
                </div>
            </a>
        `;
    });

    html += `</div></div>`; // Fecha .news-grid e .news-grid-section

    container.innerHTML = html;
    console.log("HTML da página principal atualizado.");

    // Adicionar event listeners aos cards de notícias
    document.querySelectorAll('[data-news-id]').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const newsId = e.currentTarget.dataset.newsId;
            console.log(`Card de notícia clicado (ID: ${newsId}). Abrindo página.`);
            showNewsPage(newsId);
        });
    });
}

function findNewsById(newsId) {
    console.log("Procurando notícia por ID:", newsId);
    if (newsDatabase.mainNews?.id === newsId) return newsDatabase.mainNews;
    return newsDatabase.secondaryNews.find(n => n.id === newsId) || newsDatabase.olderNews.find(n => n.id === newsId);
}

function showNewsPage(newsId) {
    console.log("Abrindo página de notícia para ID:", newsId);
    const news = findNewsById(newsId);
    if (!news) {
        console.error("Notícia não encontrada para ID:", newsId);
        // Talvez exibir uma página de erro 404
        return;
    }

    const container = document.getElementById('newsContainer');
    const dateDisplay = news.date || new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const reporterDisplay = news.reporter || 'Redação ZNN';
    const imageStyle = news.imageUrl
        ? `background-image: url('${news.imageUrl}'); background-color: transparent;`
        : `background: ${news.imageColor};`;

    container.innerHTML = `
        <div class="news-page">
            <a href="#" class="back-button" onclick="event.preventDefault(); loadNewsDatabase(); renderNews();">
                ← Página Inicial
            </a>

            <div class="news-page-header">
                <span class="news-page-category ${news.categoryClass}">${news.category}</span>
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
    console.log("Página de notícia renderizada.");
}

function showCategoryPage(category) {
    console.log("Abrindo página de categoria:", category);
    const container = document.getElementById('newsContainer');

    // Combinar todas as notícias
    const allNews = [
        ...(newsDatabase.mainNews ? [newsDatabase.mainNews] : []),
        ...newsDatabase.secondaryNews,
        ...newsDatabase.olderNews
    ];

    // Filtrar pela categoria
    const filteredNews = allNews.filter(news => news.category === category);

    // Ordenar por data (mais recente primeiro) - MESMA LÓGICA DA PÁGINA PRINCIPAL
    filteredNews.sort((a, b) => {
        let dateA, dateB;
        if (a.rawDate && b.rawDate) {
            dateA = new Date(a.rawDate);
            dateB = new Date(b.rawDate);
        } else {
            dateA = new Date(`${a.date} ${a.time}`);
            dateB = new Date(`${b.date} ${b.time}`);
        }
        return dateB - dateA; // Ordem decrescente
    });

    if (filteredNews.length === 0) {
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
            <p>${filteredNews.length} notícia${filteredNews.length > 1 ? 's' : ''} encontrada${filteredNews.length > 1 ? 's' : ''}</p>
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

    // Adicionar event listeners aos cards
    document.querySelectorAll('.category-news-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const newsId = e.currentTarget.dataset.newsId;
            showNewsPage(newsId);
        });
    });

    window.scrollTo(0, 0);
}

// --- Eventos DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM Index totalmente carregado.");

    // Carregar notícias do localStorage
    loadNewsDatabase();

    // Renderizar notícias ao carregar a página
    renderNews();

    // --- Menu Mobile Toggle ---
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.getElementById('mainNav');

    if (mobileMenuToggle && mainNav) {
        console.log("Elementos de menu encontrados.");

        const toggleMenu = () => {
            mobileMenuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
            console.log("Estado do menu toggled.");
        };

        mobileMenuToggle.addEventListener('click', toggleMenu);

        // Fechar menu ao clicar em um link de navegação
        document.querySelectorAll('nav a[data-page]').forEach(link => {
            link.addEventListener('click', () => {
                console.log(`Link do menu '${link.textContent}' clicado.`);
                // Fechar menu mobile se estiver aberto
                mobileMenuToggle.classList.remove('active');
                mainNav.classList.remove('active');

                // --- Navegação por Categoria ou Home ---
                const page = link.getAttribute('data-page');
                if (page === 'home') {
                    console.log("Navegando para a página inicial.");
                    loadNewsDatabase(); // Recarrega todas as notícias
                    renderNews();       // Re-renderiza com todas
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
                        console.log(`Filtrando por categoria: ${category}`);
                        showCategoryPage(category);
                    }
                }
            });
        });

        // Fechar menu ao clicar *fora* dele (opcional, mas bom para UX)
        document.addEventListener('click', (e) => {
            if (!mobileMenuToggle.contains(e.target) && !mainNav.contains(e.target) && (mobileMenuToggle.classList.contains('active') || mainNav.classList.contains('active'))) {
                console.log("Clique fora do menu detectado. Fechando menu.");
                mobileMenuToggle.classList.remove('active');
                mainNav.classList.remove('active');
            }
        });

    } else {
        console.warn("Elementos de menu (#mobileMenuToggle ou #mainNav) não encontrados.");
    }

    // Adicionar event listeners aos links de navegação (caso o menu mobile não funcione)
    document.querySelectorAll('nav a[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            // Este listener é um fallback e pode ser redundante com o de cima
            // mas garante funcionamento em alguns cenários
            console.log("Listener de fallback para link de navegação acionado.");
            // A lógica real já está no listener acima.
        });
    });
});