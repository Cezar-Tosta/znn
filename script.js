// Banco de dados de notícias
const newsDatabase = {
    mainNews: {
        title: "Brasil se classifica para final da Copa do Mundo de Futebol Feminino após vitória histórica",
        bullets: [
            "Seleção vence Inglaterra por 2 a 1 em partida emocionante no Estádio Nacional",
            "Marta marca gol histórico e se torna maior artilheira de Copas do Mundo",
            "Final será disputada contra Espanha no próximo domingo às 16h em São Paulo",
            "Presidente declara ponto facultativo na segunda-feira para comemoração nacional"
        ],
        imageColor: "linear-gradient(135deg, #10b981 0%, #059669 100%)"
    },
    
    sidebarNews: [
        {
            category: "Esportes",
            categoryClass: "category-sports",
            title: "Seleção Brasileira vence amistoso por 3 a 1 e mantém invencibilidade",
            imageColor: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            imageText: "ESPORTES"
        },
        {
            category: "Tecnologia",
            categoryClass: "category-tech",
            title: "Startup brasileira desenvolve IA capaz de prever desastres naturais",
            imageColor: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            imageText: "TECNOLOGIA"
        },
        {
            category: "Entretenimento",
            categoryClass: "category-entertainment",
            title: "Nova temporada de série brasileira estreia com recorde de audiência",
            imageColor: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            imageText: "ENTRETENIMENTO"
        }
    ],
    
    secondaryNews: [
        {
            title: "Dólar fecha em queda após anúncio do Banco Central",
            imageColor: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
            imageText: "ECONOMIA"
        },
        {
            title: "Novas medidas de segurança são implementadas em aeroportos",
            imageColor: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
            imageText: "BRASIL"
        },
        {
            title: "Cientistas descobrem nova espécie na Amazônia",
            imageColor: "linear-gradient(135deg, #84cc16 0%, #65a30d 100%)",
            imageText: "CIÊNCIA"
        },
        {
            title: "Previsão indica chuvas fortes para região Sul nos próximos dias",
            imageColor: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
            imageText: "CLIMA"
        },
        {
            title: "Mercado de trabalho registra menor taxa de desemprego em 5 anos",
            imageColor: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
            imageText: "ECONOMIA"
        },
        {
            title: "Festival de cinema nacional bate recorde de público",
            imageColor: "linear-gradient(135deg, #a855f7 0%, #9333ea 100%)",
            imageText: "CULTURA"
        }
    ]
};

// Função para renderizar as notícias
function renderNews() {
    const container = document.getElementById('newsContainer');
    
    const html = `
        <div class="main-news">
            <div class="main-news-image" style="background: ${newsDatabase.mainNews.imageColor}">
                NOTÍCIA PRINCIPAL
            </div>
            <div class="main-news-content">
                <h1 class="main-news-title">${newsDatabase.mainNews.title}</h1>
                <ul class="news-bullets">
                    ${newsDatabase.mainNews.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
                </ul>
            </div>
        </div>

        <div class="sidebar">
            ${newsDatabase.sidebarNews.map(news => `
                <div class="news-card">
                    <div class="news-card-image" style="background: ${news.imageColor}">
                        ${news.imageText}
                    </div>
                    <div class="news-card-content">
                        <span class="category-tag ${news.categoryClass}">${news.category}</span>
                        <h3 class="news-card-title">${news.title}</h3>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="secondary-news">
            ${newsDatabase.secondaryNews.map(news => `
                <div class="secondary-card">
                    <div class="secondary-card-image" style="background: ${news.imageColor}">
                        ${news.imageText}
                    </div>
                    <div class="secondary-card-content">
                        <h4 class="secondary-card-title">${news.title}</h4>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    container.innerHTML = html;
}

// Função para adicionar nova notícia (exemplo de uso da arquitetura)
function addNews(type, newsData) {
    if (type === 'main') {
        newsDatabase.mainNews = newsData;
    } else if (type === 'sidebar') {
        newsDatabase.sidebarNews.push(newsData);
    } else if (type === 'secondary') {
        newsDatabase.secondaryNews.push(newsData);
    }
    renderNews();
}

// Event listeners para navegação
document.addEventListener('DOMContentLoaded', function() {
    // Renderizar notícias ao carregar a página
    renderNews();
    
    // Adicionar event listeners aos links de navegação
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Navegando para:', e.target.dataset.page);
            // Aqui você pode implementar lógica para carregar diferentes conjuntos de notícias
        });
    });
});

// Exemplo de como adicionar uma nova notícia secundária (descomente para testar)
/*
setTimeout(() => {
    addNews('secondary', {
        title: "Nova notícia adicionada dinamicamente",
        imageColor: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
        imageText: "URGENTE"
    });
}, 3000);
*/