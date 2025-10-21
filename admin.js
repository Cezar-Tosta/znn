// Senha do admin
const ADMIN_PASSWORD = 'znn2025';

// --- Funções Auxiliares ---
function generateId() {
    return 'news-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

function getCategoryClass(category) {
    const categoryMap = {
        'Política': 'category-politics',
        'Economia': 'category-economy',
        'Tecnologia': 'category-tech',
        'Sociedade': 'category-society',
        'Mundo': 'category-world'
    };
    return categoryMap[category] || 'category-politics';
}

// --- Função para converter conteúdo para HTML ---
// Como o conteúdo agora vem do editor WYSIWYG como HTML, esta função é um pass-through.
function markdownToHtml(contentOrHtml) {
    // Retorna o conteúdo HTML diretamente
    // Se for um texto puro, ele será tratado como um bloco de texto.
    console.log("Conteúdo HTML recebido do editor WYSIWYG.");
    return contentOrHtml;
}

// --- Modal ---
function showModal(message, extraButton = null) {
    const modal = document.getElementById('successModal');
    const modalContent = document.querySelector('.modal-content');
    modalContent.innerHTML = `<h3>✓ Sucesso!</h3><p id="modalMessage">${message}</p>`;
    if (extraButton) modalContent.appendChild(extraButton);
    const okBtn = document.createElement('button');
    okBtn.textContent = 'OK';
    okBtn.className = 'btn-modal';
    okBtn.onclick = closeModal;
    modalContent.appendChild(okBtn);
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('successModal').classList.remove('active');
}

// --- CRUD LocalStorage - SAVE NEWS ---
function saveNews(newsData) {
    console.log("Iniciando saveNews para:", newsData.title);

    // --- CORREÇÃO 1: Garantir data/hora consistentes ---
    // Cria um objeto Date a partir dos inputs do formulário
    const dateObj = new Date(newsData.date + 'T' + newsData.time);
    console.log("Objeto Date criado:", dateObj);

    // Formata a data para exibição (string)
    const formattedDate = dateObj.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long', // Nome completo do mês
        year: 'numeric'
    });
    console.log("Data formatada para exibição:", formattedDate);

    // Formata a hora para exibição (string)
    const formattedTime = dateObj.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // Formato 24h
    });
    console.log("Hora formatada para exibição:", formattedTime);

    // Atualiza o objeto newsData com as datas formatadas e a data bruta
    newsData.date = formattedDate;
    newsData.time = formattedTime;
    newsData.rawDate = dateObj; // Propriedade crucial para ordenação precisa

    // Define um tipo padrão (não usado mais para layout, mas salvo por compatibilidade)
    newsData.type = 'recent';

    // --- Fim da Correção 1 ---

    let allNews = JSON.parse(localStorage.getItem('znnNews')) || { mainNews: null, secondaryNews: [], olderNews: [] };

    // Verifica se a notícia já existe (edição)
    const existingIndex = allNews.secondaryNews.findIndex(n => n.id === newsData.id);

    if (existingIndex !== -1) {
        // Atualiza a notícia existente
        console.log("Atualizando notícia existente:", newsData.title);
        allNews.secondaryNews[existingIndex] = newsData;
    } else {
        // Adiciona nova notícia
        console.log("Adicionando nova notícia:", newsData.title);
        allNews.secondaryNews.push(newsData);
    }

    try {
        localStorage.setItem('znnNews', JSON.stringify(allNews));
        console.log("Notícia salva/atualizada no localStorage com sucesso.");
    } catch (e) {
        console.error("Erro ao salvar dados no localStorage:", e);
        alert("Erro ao salvar a notícia. O armazenamento local pode estar cheio.");
    }
}

// --- CRUD LocalStorage - UPDATE NEWS ---
function updateNews(newsId, newsData) {
    console.log("Iniciando updateNews para ID:", newsId);
    // updateNews agora simplesmente chama saveNews, que lida com a lógica de criação/edição
    saveNews(newsData);
}

// --- CRUD LocalStorage - DELETE NEWS ---
function deleteNews(newsId) {
    if (!confirm('Tem certeza que deseja deletar esta notícia?')) return;
    console.log("Iniciando deleteNews para ID:", newsId);
    let allNews = JSON.parse(localStorage.getItem('znnNews')) || { mainNews: null, secondaryNews: [], olderNews: [] };

    // Remove da lista de notícias secundárias (onde todas são salvas agora)
    allNews.secondaryNews = allNews.secondaryNews.filter(n => n.id !== newsId);

    try {
        localStorage.setItem('znnNews', JSON.stringify(allNews));
        console.log("Notícia deletada do localStorage com sucesso.");
        loadNewsList(); // Recarrega a lista no painel admin

        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = 'Baixar news.json';
        downloadBtn.className = 'btn-modal';
        downloadBtn.onclick = downloadNewsJson;
        showModal('Notícia deletada com sucesso!', downloadBtn);
    } catch (e) {
        console.error("Erro ao deletar dados no localStorage:", e);
        alert("Erro ao deletar a notícia.");
    }
}

// --- Download do news.json ---
function downloadNewsJson() {
    console.log("Iniciando download do news.json...");
    const allNews = JSON.parse(localStorage.getItem('znnNews')) || { mainNews: null, secondaryNews: [], olderNews: [] };
    const blob = new Blob([JSON.stringify(allNews, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'news.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    closeModal();
    console.log("Download do news.json concluído.");
}

// --- Interface Admin - Load News List ---
function loadNewsList() {
    console.log("Iniciando loadNewsList...");
    const newsList = document.getElementById('newsList');
    if (!newsList) {
        console.error("Elemento #newsList não encontrado.");
        return;
    }

    let allNews = JSON.parse(localStorage.getItem('znnNews')) || { mainNews: null, secondaryNews: [], olderNews: [] };
    console.log("Dados brutos do localStorage ('znnNews'):", allNews);

    // Inicializa com a estrutura padrão
    const defaultStructure = { mainNews: null, secondaryNews: [], olderNews: [] };

    // Se `allNews` for inválido após o parse, usa a estrutura padrão
    if (!allNews || typeof allNews !== 'object') {
        console.warn("'znnNews' no localStorage é inválido ou ausente. Usando estrutura padrão.");
        allNews = defaultStructure;
    } else {
        // Mescla com a estrutura padrão para garantir que todas as propriedades existam
        allNews = Object.assign({}, defaultStructure, allNews);
        // Garante arrays válidos
        if (!Array.isArray(allNews.secondaryNews)) {
            console.warn("'secondaryNews' não é um array. Inicializando como array vazio.");
            allNews.secondaryNews = [];
        }
        if (!Array.isArray(allNews.olderNews)) {
            console.warn("'olderNews' não é um array. Inicializando como array vazio.");
            allNews.olderNews = [];
        }
    }

    console.log("Estrutura final de allNews:", allNews);

    let html = '';

    // Verifica e adiciona a notícia principal
    if (allNews.mainNews) {
        console.log("Adicionando notícia principal:", allNews.mainNews.title);
        html += createNewsItemHTML(allNews.mainNews, 'Principal');
    } else {
        console.log("Nenhuma notícia principal encontrada.");
    }

    // Itera pelas notícias recentes/secundárias
    console.log(`Iterando por ${allNews.secondaryNews.length} notícias secundárias.`);
    allNews.secondaryNews.forEach((news, index) => {
        console.log(`  Adicionando notícia secundária ${index + 1}: ${news.title} (${news.date} ${news.time})`);
        html += createNewsItemHTML(news, 'Secundária');
    });

    // Itera pelas notícias antigas
    console.log(`Iterando por ${allNews.olderNews.length} notícias antigas.`);
    allNews.olderNews.forEach((news, index) => {
        console.log(`  Adicionando notícia antiga ${index + 1}: ${news.title} (${news.date} ${news.time})`);
        html += createNewsItemHTML(news, 'Antiga');
    });

    // Define o conteúdo HTML ou uma mensagem padrão
    if (html === '') {
        newsList.innerHTML = '<p style="text-align:center;color:#666;padding:40px 0;">Nenhuma notícia publicada ainda</p>';
        console.log("Lista de notícias estava vazia. Mensagem padrão exibida.");
    } else {
        newsList.innerHTML = html;
        console.log("Lista de notícias atualizada com sucesso.");
    }

    // Adicionar event listeners após carregar a lista
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita conflito com o clique no card pai
            const newsId = e.target.dataset.newsId;
            console.log("Botão Editar clicado para ID:", newsId);
            editNews(newsId);
        });
    });
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita conflito com o clique no card pai
            const newsId = e.target.dataset.newsId;
            console.log("Botão Deletar clicado para ID:", newsId);
            deleteNews(newsId);
        });
    });
    console.log("Event listeners para editar/deletar adicionados.");
}

function createNewsItemHTML(news, typeLabel) {
    return `
        <div class="news-item">
            <div class="news-item-header">
                <span class="news-item-type">${typeLabel}</span>
                <div class="news-item-actions">
                    <button class="btn-edit" data-news-id="${news.id}">Editar</button>
                    <button class="btn-delete" data-news-id="${news.id}">Deletar</button>
                </div>
            </div>
            <h4 class="news-item-title">${news.title}</h4>
            <div class="news-item-meta">
                <strong>${news.category}</strong> | ${news.date} ${news.time} | Por ${news.reporter}
            </div>
        </div>
    `;
}

// --- Interface Admin - Edit News ---
function editNews(newsId) {
    console.log("Iniciando editNews para ID:", newsId);
    const allNews = JSON.parse(localStorage.getItem('znnNews')) || { mainNews: null, secondaryNews: [], olderNews: [] };

    // Procura em todas as listas
    let news = allNews.mainNews?.id === newsId ? allNews.mainNews :
        allNews.secondaryNews.find(n => n.id === newsId) ||
        allNews.olderNews.find(n => n.id === newsId);

    if (!news) {
        console.error("Notícia não encontrada para edição:", newsId);
        alert("Notícia não encontrada.");
        return;
    }

    console.log("Notícia encontrada para edição:", news.title);

    document.getElementById('editingId').value = news.id;
    document.getElementById('formTitle').textContent = 'Editar Notícia';
    document.getElementById('submitBtn').textContent = 'Atualizar Notícia';

    // Preenche os campos do formulário
    document.getElementById('title').value = news.title;

    // --- CORREÇÃO 2: Usar rawDate para preencher campos de data/hora ---
    if (news.rawDate) {
        const rawDateObj = new Date(news.rawDate);
        console.log("Usando rawDate para preencher campos:", rawDateObj);
        document.getElementById('date').value = rawDateObj.toISOString().split('T')[0];
        // Formata a hora para 'HH:MM' (garantindo dois dígitos)
        const hours = String(rawDateObj.getHours()).padStart(2, '0');
        const minutes = String(rawDateObj.getMinutes()).padStart(2, '0');
        document.getElementById('time').value = `${hours}:${minutes}`;
    } else {
        // Fallback: tenta parsear a string formatada (menos preciso)
        console.warn("rawDate não encontrado, usando string formatada para preencher campos.");
        const dateMatch = news.date.match(/(\d{2}) de (\w+) de (\d{4})/);
        if (dateMatch) {
            const months = { 'janeiro': '01', 'fevereiro': '02', 'março': '03', 'abril': '04', 'maio': '05', 'junho': '06', 'julho': '07', 'agosto': '08', 'setembro': '09', 'outubro': '10', 'novembro': '11', 'dezembro': '12' };
            const day = dateMatch[1];
            const month = months[dateMatch[2].toLowerCase()];
            const year = dateMatch[3];
            if (month) { // Só define se o mês foi mapeado
                document.getElementById('date').value = `${year}-${month}-${day}`;
            }
        }
        document.getElementById('time').value = news.time; // Assume que a hora está no formato HH:MM
    }
    // --- Fim da Correção 2 ---

    document.getElementById('reporter').value = news.reporter;
    document.getElementById('category').value = news.category;
    document.getElementById('excerpt').value = news.excerpt;

    // Converter HTML de volta para texto simples para edição
    const content = news.content
        .replace(/<p>/g, '')
        .replace(/<\/p>/g, '\n\n')
        .replace(/<br>/g, '\n')
        .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
        .replace(/<em>(.*?)<\/em>/g, '*$1*')
        .replace(/<a href="(.*?)" target="_blank">(.*?)<\/a>/g, '[$2]($1)')
        .replace(/<img src="(.*?)" alt="(.*?)" class="inline-image">/g, '![$2]($1)')
        .replace(/<h3>(.*?)<\/h3>/g, '### $1')
        .replace(/<h2>(.*?)<\/h2>/g, '## $1')
        .replace(/<h1>(.*?)<\/h1>/g, '# $1');
    document.getElementById('content').value = content;

    if (news.imageUrl) {
        const imageName = news.imageUrl.replace('imagens/', '');
        document.getElementById('imageName').value = imageName;
    } else {
        document.getElementById('imageName').value = '';
    }

    document.getElementById('imageColor').value = news.imageColor;

    // Role para o formulário
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

// --- Interface Admin - Cancel Edit ---
function cancelEdit() {
    console.log("Cancelando edição...");
    document.getElementById('editingId').value = '';
    document.getElementById('formTitle').textContent = 'Adicionar Nova Notícia';
    document.getElementById('submitBtn').textContent = 'Publicar Notícia';
    document.getElementById('newsForm').reset();

    // Reconfigura data/hora atual
    const now = new Date();
    document.getElementById('date').value = now.toISOString().split('T')[0];
    document.getElementById('time').value = now.toTimeString().split(' ')[0].substring(0, 5);

    console.log("Edição cancelada. Formulário resetado.");
}

// --- Eventos ---
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM Admin totalmente carregado e analisado.");

    // --- Login ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            console.log("Evento de submit do formulário de login acionado.");
            e.preventDefault();
            const password = document.getElementById('password').value;
            const errorElement = document.getElementById('loginError');
            if (password === ADMIN_PASSWORD) {
                sessionStorage.setItem('znnAdminAuth', 'true');
                document.getElementById('loginScreen').style.display = 'none';
                document.getElementById('adminPanel').style.display = 'block';
                loadNewsList();
            } else {
                errorElement.textContent = 'Senha incorreta!';
                document.getElementById('password').value = '';
            }
        });
    } else {
        console.error("Formulário de login não encontrado.");
    }

    if (sessionStorage.getItem('znnAdminAuth') === 'true') {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadNewsList();
    }

    // --- Submissão do Formulário de Notícias ---
    const newsForm = document.getElementById('newsForm');
    if (newsForm) {
        newsForm.addEventListener('submit', function (e) {
            console.log("Evento de submit do formulário de notícias acionado.");
            e.preventDefault();

            const editingId = document.getElementById('editingId').value;
            // const newsType = document.getElementById('newsType').value; // Removido
            const title = document.getElementById('title').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const reporter = document.getElementById('reporter').value;
            const category = document.getElementById('category').value;
            const excerpt = document.getElementById('excerpt').value;
            // --- Obter conteúdo HTML do editor WYSIWYG ---
            let contentHtml = '';
            if (typeof tinymce !== 'undefined' && tinymce.get('content')) {
                // Se o TinyMCE estiver carregado e o editor estiver ativo
                contentHtml = tinymce.get('content').getContent();
                console.log("Conteúdo HTML obtido do TinyMCE:", contentHtml);
            } else {
                // Fallback: pega o valor do textarea (caso o TinyMCE falhe)
                contentHtml = document.getElementById('content').value;
                console.warn("TinyMCE não encontrado ou não inicializado. Usando valor do textarea.");
            }
            // --- Fim da obtenção do conteúdo ---
            const imageName = document.getElementById('imageName').value;
            const imageColor = document.getElementById('imageColor').value;

            // Validação simples - CORRIGIDO: usar contentHtml em vez de contentText
            if (!title || !date || !time || !reporter || !category || !contentHtml.trim()) {
                alert("Por favor, preencha todos os campos obrigatórios.");
                return;
            }

            let imageUrl = '';
            if (imageName && imageName.trim()) {
                imageUrl = 'imagens/' + imageName.trim();
            }

            // --- CORREÇÃO 3: Passar date/time diretamente para saveNews ---
            // saveNews agora é responsável por formatar e criar rawDate
            const newsData = {
                id: editingId || generateId(),
                // type: newsType || 'recent', // Removido o uso de newsType para layout
                title: title,
                date: date, // String ISO 'YYYY-MM-DD'
                time: time, // String 'HH:MM'
                reporter: reporter,
                category: category,
                categoryClass: getCategoryClass(category),
                excerpt: excerpt || title.substring(0, 100) + '...',
                content: markdownToHtml(contentHtml), // markdownToHtml agora é um pass-through
                imageUrl: imageUrl,
                imageColor: imageColor,
                imageText: category.toUpperCase()
            };
            // --- Fim da Correção 3 ---

            if (editingId) {
                updateNews(editingId, newsData); // Chama saveNews internamente
                cancelEdit();
            } else {
                saveNews(newsData); // saveNews lida com a criação
                this.reset();
                // Reconfigura data/hora atual após reset
                const now = new Date();
                document.getElementById('date').value = now.toISOString().split('T')[0];
                document.getElementById('time').value = now.toTimeString().split(' ')[0].substring(0, 5);
            }

            loadNewsList();

            const downloadBtn = document.createElement('button');
            downloadBtn.textContent = 'Baixar news.json';
            downloadBtn.className = 'btn-modal';
            downloadBtn.onclick = downloadNewsJson;
            showModal(editingId ? 'Notícia atualizada com sucesso!' : 'Notícia publicada com sucesso!', downloadBtn);
        });
    } else {
        console.error("Formulário de notícias não encontrado.");
    }

    // Configura data/hora atual nos campos de data e hora
    const setInitialDateTime = () => {
        const now = new Date();
        const dateInput = document.getElementById('date');
        const timeInput = document.getElementById('time');
        if (dateInput) dateInput.value = now.toISOString().split('T')[0];
        if (timeInput) {
            // Formata a hora para 'HH:MM' (garantindo dois dígitos)
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            timeInput.value = `${hours}:${minutes}`;
        }
    };
    setInitialDateTime(); // Chama ao carregar
    console.log("Data/hora inicial configurada.");
});

function logout() {
    console.log("Realizando logout...");
    sessionStorage.removeItem('znnAdminAuth');
    location.reload();
}

// --- Inicializar o Editor WYSIWYG (TinyMCE) ---
document.addEventListener('DOMContentLoaded', function () {
    // Inicializa o TinyMCE no campo com id 'content'
    if (typeof tinymce !== 'undefined') {
        tinymce.init({
            selector: '#content', // ID do textarea
            height: 500, // Altura do editor
            menubar: false, // Esconde a barra de menus principal
            plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | blocks | ' +
                'bold italic forecolor backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help | link image',
            content_style: 'body { font-family:Georgia, serif; font-size:16px }',
            // Configuração para imagens (opcional, pode exigir backend para upload)
            // images_upload_url: 'postAcceptor.php', 
            // images_upload_handler: example_image_upload_handler // Função customizada
        });
        console.log("TinyMCE inicializado com sucesso.");
    } else {
        console.warn("TinyMCE não foi carregado. Usando textarea padrão.");
    }
});