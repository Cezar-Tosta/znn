// Banco de dados de notícias
const newsDatabase = {
    mainNews: {
        id: "main-copa-feminina",
        title: "Brasil se classifica para final da Copa do Mundo de Futebol Feminino após vitória histórica",
        category: "Esportes",
        excerpt: "Seleção vence Inglaterra por 2 a 1 em partida emocionante no Estádio Nacional. Marta marca gol histórico e se torna maior artilheira de Copas do Mundo.",
        imageColor: "linear-gradient(135deg, #1a1a1a 0%, #2d5016 100%)",
        imageText: "BREAKING NEWS",
        content: `
            <p>A Seleção Brasileira feminina conquistou uma das maiores vitórias de sua história ao derrotar a Inglaterra por 2 a 1 na semifinal da Copa do Mundo, garantindo vaga na grande final do torneio. A partida, disputada no Estádio Nacional diante de mais de 80 mil torcedores, foi marcada por grande emoção e dramaticidade.</p>
            
            <p>Marta, aos 38 anos, voltou a brilhar no palco mundial ao marcar o gol da vitória aos 43 minutos do segundo tempo, tornando-se a maior artilheira da história das Copas do Mundo, ultrapassando a marca de 17 gols. O primeiro gol brasileiro foi marcado por Kerolin, aos 28 minutos do primeiro tempo.</p>
            
            <p>A Inglaterra havia empatado com Lauren Hemp aos 35 minutos da etapa inicial, mas não conseguiu superar a determinação da equipe brasileira, que mostrou grande solidez defensiva e eficiência no contra-ataque sob o comando da técnica Pia Sundhage.</p>
            
            <p>A final será disputada no próximo domingo, às 16h, no Estádio do Morumbi em São Paulo, contra a Espanha, que eliminou a França na outra semifinal. O governo federal anunciou ponto facultativo na segunda-feira para que todo o país possa celebrar a campanha histórica da seleção.</p>
            
            <p>Esta é a primeira vez que o Brasil alcança a final de uma Copa do Mundo feminina desde 2007, quando ficou com o vice-campeonato ao perder para a Alemanha. A conquista do título representaria um marco definitivo para o futebol feminino brasileiro.</p>
        `
    },
    
    sidebarNews: [
        {
            id: "esportes-selecao",
            category: "Esportes",
            categoryClass: "category-sports",
            title: "Seleção Brasileira vence Argentina e mantém invencibilidade",
            excerpt: "Vitória por 3 a 1 no Maracanã consolida Brasil como favorito nas Eliminatórias",
            imageColor: "linear-gradient(135deg, #1a1a1a 0%, #2d5016 100%)",
            imageText: "ESPORTES",
            content: `
                <p>A Seleção Brasileira masculina de futebol venceu a Argentina por 3 a 1 em partida amistosa realizada no Maracanã, na noite de ontem. O resultado mantém a equipe invicta há 10 jogos sob o comando do técnico Dorival Júnior.</p>
                
                <p>Os gols brasileiros foram marcados por Vinicius Jr., aos 23 minutos do primeiro tempo, Rodrygo, aos 38, e Richarlison, já nos acréscimos do segundo tempo. A Argentina descontou com Lautaro Martinez aos 15 minutos da etapa final.</p>
                
                <p>O técnico Dorival Júnior destacou a evolução da equipe em entrevista após a partida: "Estamos construindo um time sólido, com identidade própria. A sequência de vitórias mostra que estamos no caminho certo para as próximas competições."</p>
                
                <p>Com o resultado, o Brasil assume a liderança isolada do ranking FIFA sul-americano e se consolida como favorito para as Eliminatórias da Copa do Mundo de 2026.</p>
                
                <p>O próximo compromisso da Seleção será contra o Uruguai, em Montevidéu, no dia 15 de novembro, válido pelas Eliminatórias.</p>
            `
        },
        {
            id: "tech-ia-desastres",
            category: "Tecnologia",
            categoryClass: "category-tech",
            title: "IA brasileira prevê desastres naturais com 72 horas de antecedência",
            excerpt: "Sistema PreventIA alcança precisão de 87% e recebe investimento internacional",
            imageColor: "linear-gradient(135deg, #0f172a 0%, #1e40af 100%)",
            imageText: "TECNOLOGIA",
            content: `
                <p>Uma startup brasileira sediada em São Paulo desenvolveu um sistema de inteligência artificial capaz de prever desastres naturais com até 72 horas de antecedência. A tecnologia, batizada de "PreventIA", já está sendo testada em parceria com a Defesa Civil em cinco estados brasileiros.</p>
                
                <p>O sistema utiliza dados meteorológicos, geológicos e históricos para identificar padrões que precedem eventos como enchentes, deslizamentos de terra e tempestades severas. Segundo os desenvolvedores, a precisão do modelo chega a 87% nos testes realizados.</p>
                
                <p>"Nossa IA analisa milhões de dados em tempo real e consegue identificar anomalias que passariam despercebidas por análises convencionais", explica Marina Santos, CEO da startup. "O objetivo é salvar vidas e dar tempo para que as autoridades preparem a população."</p>
                
                <p>A tecnologia chamou atenção de investidores internacionais. A empresa acaba de receber um aporte de R$ 50 milhões liderado por um fundo de venture capital do Vale do Silício, nos Estados Unidos.</p>
                
                <p>O Ministério da Ciência e Tecnologia anunciou que estuda a possibilidade de implementar o PreventIA em nível nacional até 2026, integrando o sistema aos órgãos de defesa civil de todo o país.</p>
            `
        },
        {
            id: "entretenimento-serie",
            category: "Entretenimento",
            categoryClass: "category-entertainment",
            title: "Série brasileira bate recorde global de audiência",
            excerpt: "Cidades Invisíveis conquista 8 milhões de visualizações em 24 horas",
            imageColor: "linear-gradient(135deg, #7f1d1d 0%, #dc2626 100%)",
            imageText: "ENTRETENIMENTO",
            content: `
                <p>A terceira temporada da série "Cidades Invisíveis" estreou na última sexta-feira batendo todos os recordes de audiência da plataforma de streaming. Segundo dados divulgados pela produtora, mais de 8 milhões de espectadores assistiram ao primeiro episódio nas primeiras 24 horas.</p>
                
                <p>A produção brasileira, que mistura elementos de folclore nacional com ficção científica, conquistou fãs em mais de 40 países. A nova temporada traz participações especiais de Marco Pigossi e Taís Araújo, além do elenco principal.</p>
                
                <p>"É gratificante ver uma produção 100% brasileira alcançando esse sucesso global", comenta o diretor Carlos Manga Jr. "Mostramos que nossas histórias e nossa cultura têm potencial para conquistar o mundo."</p>
                
                <p>A série já foi renovada para uma quarta temporada, prevista para 2026. Os produtores prometem explorar ainda mais as lendas urbanas brasileiras e expandir o universo da narrativa.</p>
                
                <p>Críticos de todo o mundo elogiaram a qualidade técnica e o roteiro da nova temporada, destacando os efeitos especiais e as atuações do elenco brasileiro.</p>
            `
        }
    ],
    
    secondaryNews: [
        {
            id: "economia-dolar",
            title: "Dólar registra maior queda em três anos após medidas do BC",
            category: "Economia",
            excerpt: "Moeda americana fecha cotada a R$ 4,85 com desvalorização de 2,3% no dia",
            imageColor: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
            imageText: "ECONOMIA",
            categoryClass: "category-politics",
            content: `
                <p>O dólar comercial encerrou o pregão desta quinta-feira cotado a R$ 4,85, registrando queda de 2,3% em relação ao fechamento anterior. A valorização do real veio após o Banco Central anunciar novas medidas para controlar a inflação e estabilizar a moeda nacional.</p>
                
                <p>Em coletiva de imprensa, o presidente do BC, Roberto Campos Neto, destacou que as ações incluem ajustes na taxa Selic e intervenções no mercado de câmbio. "Estamos comprometidos em manter a estabilidade econômica e o poder de compra da população", afirmou.</p>
                
                <p>Analistas do mercado financeiro avaliam que a tendência é de continuidade na queda do dólar nas próximas semanas, beneficiando importadores e consumidores que adquirem produtos estrangeiros.</p>
            `
        },
        {
            id: "brasil-aeroportos",
            title: "Revolução tecnológica transforma segurança em aeroportos brasileiros",
            category: "Brasil",
            excerpt: "ANAC investe R$ 800 milhões em sistemas de IA e reconhecimento facial",
            imageColor: "linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%)",
            imageText: "BRASIL",
            categoryClass: "category-politics",
            content: `
                <p>A Agência Nacional de Aviação Civil (ANAC) anunciou nesta quarta-feira a implementação de novos protocolos de segurança em todos os aeroportos brasileiros. As medidas entram em vigor a partir do próximo mês.</p>
                
                <p>Entre as principais mudanças estão a instalação de scanners corporais de última geração, reconhecimento facial integrado e sistema de inteligência artificial para detecção de comportamentos suspeitos.</p>
                
                <p>Segundo a ANAC, os investimentos totalizam R$ 800 milhões e vão beneficiar mais de 50 aeroportos em todo o país, reforçando a segurança dos passageiros e colocando o Brasil em linha com os padrões internacionais mais avançados.</p>
            `
        },
        {
            id: "ciencia-amazonia",
            title: "Nova espécie de primata descoberta em expedição na Amazônia",
            category: "Ciência",
            excerpt: "Callicebus znn é encontrado em área remota próxima à fronteira com o Peru",
            imageColor: "linear-gradient(135deg, #14532d 0%, #15803d 100%)",
            imageText: "CIÊNCIA",
            categoryClass: "category-tech",
            content: `
                <p>Uma equipe de biólogos brasileiros e internacionais descobriu uma nova espécie de primata na região amazônica. O animal, batizado de "Callicebus znn" em homenagem ao portal de notícias, foi encontrado em uma área remota da floresta, próximo à fronteira com o Peru.</p>
                
                <p>A descoberta foi publicada na revista científica Nature e é considerada uma das mais importantes dos últimos anos. A nova espécie possui características únicas, incluindo uma coloração avermelhada distinta e hábitos alimentares específicos.</p>
                
                <p>"Esta descoberta reforça a importância da preservação da Amazônia. Ainda há muito a ser descoberto sobre a biodiversidade da região", afirma a Dra. Juliana Ferreira, líder da expedição.</p>
            `
        },
        {
            id: "clima-sul",
            title: "Alerta máximo: tempestades severas ameaçam região Sul",
            category: "Clima",
            excerpt: "Inmet prevê acumulados superiores a 150mm nos próximos cinco dias",
            imageColor: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
            imageText: "CLIMA",
            categoryClass: "category-politics",
            content: `
                <p>O Instituto Nacional de Meteorologia (Inmet) emitiu alerta de chuvas intensas para os estados da região Sul do Brasil nos próximos cinco dias. A previsão indica acumulados que podem ultrapassar 150mm em algumas áreas.</p>
                
                <p>As Defesas Civis dos três estados sulinos estão em alerta e orientam a população a evitar áreas de risco e acompanhar as atualizações meteorológicas. Há possibilidade de alagamentos, deslizamentos e transtornos no trânsito.</p>
                
                <p>Segundo os meteorologistas, o fenômeno é causado pela combinação de uma frente fria com um corredor de umidade vindo da Amazônia, criando condições favoráveis para tempestades severas.</p>
            `
        },
        {
            id: "economia-emprego",
            title: "Taxa de desemprego atinge menor nível em cinco anos",
            category: "Economia",
            excerpt: "IBGE registra 7,8% de desemprego e criação de 2,5 milhões de vagas",
            imageColor: "linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)",
            imageText: "ECONOMIA",
            categoryClass: "category-politics",
            content: `
                <p>O Instituto Brasileiro de Geografia e Estatística (IBGE) divulgou nesta sexta-feira os dados do mercado de trabalho referentes ao último trimestre. A taxa de desemprego caiu para 7,8%, o menor índice registrado desde 2020.</p>
                
                <p>Os números mostram que mais de 2,5 milhões de postos de trabalho foram criados nos últimos 12 meses, com destaque para os setores de serviços, comércio e tecnologia. O rendimento médio do trabalhador também apresentou crescimento real de 3,2%.</p>
                
                <p>Especialistas atribuem os resultados positivos à retomada da atividade econômica pós-pandemia e às políticas de incentivo ao empreendedorismo implementadas pelo governo federal nos últimos anos.</p>
            `
        },
        {
            id: "cultura-festival",
            title: "Festival de Cinema do Brasil conquista público recorde",
            category: "Cultura",
            excerpt: "Evento atrai 250 mil pessoas e movimenta R$ 45 milhões na economia",
            imageColor: "linear-gradient(135deg, #581c87 0%, #9333ea 100%)",
            imageText: "CULTURA",
            categoryClass: "category-entertainment",
            content: `
                <p>O Festival Internacional de Cinema do Brasil encerrou sua 28ª edição com público recorde de 250 mil pessoas. O evento, realizado em São Paulo, exibiu mais de 200 produções nacionais e internacionais durante dez dias.</p>
                
                <p>O grande vencedor foi o longa-metragem "Sertão Digital", dirigido por Karim Aïnouz, que levou os prêmios de Melhor Filme, Melhor Direção e Melhor Roteiro. A produção brasileira também ganhou destaque internacional ao ser selecionada para representar o país no Oscar 2026.</p>
                
                <p>Segundo os organizadores, o festival movimentou cerca de R$ 45 milhões na economia local e consolidou São Paulo como importante polo do cinema mundial, atraindo produtores e distribuidores de diversos países.</p>
            `
        }
    ]
};

// Função para renderizar as notícias no estilo moderno
function renderNews() {
    const container = document.getElementById('newsContainer');
    
    const html = `
        <div class="hero-section">
            <div class="main-news" data-news-id="${newsDatabase.mainNews.id}">
                <div class="main-news-image" style="background: ${newsDatabase.mainNews.imageColor}">
                    ${newsDatabase.mainNews.imageText}
                </div>
                <div class="main-news-content">
                    <span class="main-news-category">${newsDatabase.mainNews.category}</span>
                    <h1 class="main-news-title">${newsDatabase.mainNews.title}</h1>
                    <p class="main-news-excerpt">${newsDatabase.mainNews.excerpt}</p>
                </div>
            </div>

            <div class="sidebar">
                ${newsDatabase.sidebarNews.map(news => `
                    <a href="#" class="news-card" data-news-id="${news.id}">
                        <div class="news-card-image" style="background: ${news.imageColor}">
                            ${news.imageText}
                        </div>
                        <div class="news-card-content">
                            <span class="category-tag ${news.categoryClass}">${news.category}</span>
                            <h3 class="news-card-title">${news.title}</h3>
                            <p class="news-card-excerpt">${news.excerpt}</p>
                        </div>
                    </a>
                `).join('')}
            </div>
        </div>

        <div class="featured-section">
            <h2 class="section-title">Latest Stories</h2>
            <div class="secondary-news">
                ${newsDatabase.secondaryNews.map(news => `
                    <a href="#" class="secondary-card" data-news-id="${news.id}">
                        <div class="secondary-card-image" style="background: ${news.imageColor}">
                            ${news.imageText}
                        </div>
                        <div class="secondary-card-content">
                            <span class="secondary-card-category">${news.category}</span>
                            <h4 class="secondary-card-title">${news.title}</h4>
                            <p class="secondary-card-excerpt">${news.excerpt}</p>
                        </div>
                    </a>
                `).join('')}
            </div>
        </div>
    `;
    
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

// Função para adicionar nova notícia
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

// Função para encontrar uma notícia por ID
function findNewsById(newsId) {
    // Procurar na notícia principal
    if (newsDatabase.mainNews.id === newsId) {
        return newsDatabase.mainNews;
    }
    
    // Procurar na sidebar
    let news = newsDatabase.sidebarNews.find(n => n.id === newsId);
    if (news) return news;
    
    // Procurar nas notícias secundárias
    news = newsDatabase.secondaryNews.find(n => n.id === newsId);
    return news;
}

// Função para exibir página individual da notícia
function showNewsPage(newsId) {
    const news = findNewsById(newsId);
    if (!news) return;
    
    const container = document.getElementById('newsContainer');
    const currentDate = new Date().toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    container.innerHTML = `
        <div class="news-page">
            <a href="#" class="back-button" onclick="event.preventDefault(); renderNews();">
                ← Back to Home
            </a>
            
            <div class="news-page-header">
                <span class="news-page-category">${news.category}</span>
                <h1 class="news-page-title">${news.title}</h1>
                <div class="news-page-meta">
                    ${currentDate} | Por Redação ZNN
                </div>
            </div>
            
            <div class="news-page-image" style="background: ${news.imageColor}">
                ${news.imageText}
            </div>
            
            <div class="news-page-content">
                ${news.content}
            </div>
        </div>
    `;
    
    // Rolar para o topo
    window.scrollTo(0, 0);
}

// Event listeners para navegação
document.addEventListener('DOMContentLoaded', function() {
    // Renderizar notícias ao carregar a página
    renderNews();
    
    // Adicionar event listeners aos links de navegação
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.dataset.page;
            
            if (page === 'home') {
                renderNews();
            } else {
                console.log('Navegando para:', page);
                // Aqui você pode implementar lógica para carregar diferentes conjuntos de notícias
            }
        });
    });
});

// Exemplo de como adicionar uma nova notícia
/*
setTimeout(() => {
    addNews('secondary', {
        id: "nova-noticia-urgente",
        title: "Breaking: Nova descoberta revoluciona a ciência",
        category: "Ciência",
        excerpt: "Pesquisadores anunciam avanço que pode mudar o futuro da humanidade",
        imageColor: "linear-gradient(135deg, #7f1d1d 0%, #dc2626 100%)",
        imageText: "URGENTE",
        categoryClass: "category-tech",
        content: `
            <p>Conteúdo completo da notícia aqui...</p>
            <p>Mais parágrafos com informações detalhadas...</p>
        `
    });
}, 3000);
*/