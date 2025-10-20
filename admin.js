// Senha do admin (em produção, use autenticação backend)
const ADMIN_PASSWORD = 'znn2025';

// Verificar login
document.getElementById('loginForm').addEventListener('submit', function(e) {
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

// Verificar se já está logado
window.addEventListener('DOMContentLoaded', function() {
    if (sessionStorage.getItem('znnAdminAuth') === 'true') {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadNewsList();
    }
});

// Função de logout
function logout() {
    sessionStorage.removeItem('znnAdminAuth');
    location.reload();
}

// Função para gerar ID único
function generateId() {
    return 'news-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Função para mapear categoria para classe CSS
function getCategoryClass(category) {
    const categoryMap = {
        'Esportes': 'category-sports',
        'Tecnologia': 'category-tech',
        'Entretenimento': 'category-entertainment',
        'Política': 'category-politics',
        'Mundo': 'category-politics',
        'Economia': 'category-politics',
        'Ciência': 'category-tech',
        'Cultura': 'category-entertainment'
    };
    return categoryMap[category] || 'category-politics';
}

// Função para converter texto em parágrafos HTML
function formatContent(text) {
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    return paragraphs.map(p => `<p>${p.trim()}</p>`).join('\n                ');
}

// Função para mostrar modal com suporte a botões extras
function showModal(message, extraButton = null) {
    const modal = document.getElementById('successModal');
    const modalContent = document.querySelector('.modal-content');
    
    // Limpar conteúdo anterior
    modalContent.innerHTML = `<h3>✓ Sucesso!</h3><p id="modalMessage">${message}</p>`;
    
    // Adicionar botão extra (ex: download)
    if (extraButton) {
        modalContent.appendChild(extraButton);
    }
    
    // Botão OK padrão
    const okBtn = document.createElement('button');
    okBtn.textContent = 'OK';
    okBtn.className = 'btn-modal';
    okBtn.onclick = closeModal;
    modalContent.appendChild(okBtn);
    
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('active');
}

// Função para salvar notícia no localStorage
function saveNews(newsData) {
    let allNews = JSON.parse(localStorage.getItem('znnNews')) || {
        mainNews: null,
        sidebarNews: [],
        secondaryNews: []
    };

    if (newsData.type === 'main') {
        allNews.mainNews = newsData;
    } else if (newsData.type === 'sidebar') {
        allNews.sidebarNews.push(newsData);
    } else if (newsData.type === 'secondary') {
        allNews.secondaryNews.push(newsData);
    }

    localStorage.setItem('znnNews', JSON.stringify(allNews));
}

// Função para atualizar notícia existente
function updateNews(newsId, newsData) {
    let allNews = JSON.parse(localStorage.getItem('znnNews')) || {
        mainNews: null,
        sidebarNews: [],
        secondaryNews: []
    };

    // Remover a notícia antiga
    if (allNews.mainNews && allNews.mainNews.id === newsId) {
        allNews.mainNews = null;
    }
    allNews.sidebarNews = allNews.sidebarNews.filter(n => n.id !== newsId);
    allNews.secondaryNews = allNews.secondaryNews.filter(n => n.id !== newsId);

    // Adicionar com novo tipo/dados
    if (newsData.type === 'main') {
        allNews.mainNews = newsData;
    } else if (newsData.type === 'sidebar') {
        allNews.sidebarNews.push(newsData);
    } else if (newsData.type === 'secondary') {
        allNews.secondaryNews.push(newsData);
    }

    localStorage.setItem('znnNews', JSON.stringify(allNews));
}

// Função para deletar notícia
function deleteNews(newsId) {
    if (!confirm('Tem certeza que deseja deletar esta notícia?')) {
        return;
    }

    let allNews = JSON.parse(localStorage.getItem('znnNews')) || {
        mainNews: null,
        sidebarNews: [],
        secondaryNews: []
    };

    if (allNews.mainNews && allNews.mainNews.id === newsId) {
        allNews.mainNews = null;
    }
    allNews.sidebarNews = allNews.sidebarNews.filter(n => n.id !== newsId);
    allNews.secondaryNews = allNews.secondaryNews.filter(n => n.id !== newsId);

    localStorage.setItem('znnNews', JSON.stringify(allNews));
    loadNewsList();

    // Botão de download
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = 'Baixar news.json';
    downloadBtn.className = 'btn-modal';
    downloadBtn.onclick = downloadNewsJson;

    showModal('Notícia deletada com sucesso!', downloadBtn);
}

// Função para baixar o arquivo news.json atualizado
function downloadNewsJson() {
    const allNews = JSON.parse(localStorage.getItem('znnNews')) || {
        mainNews: null,
        sidebarNews: [],
        secondaryNews: []
    };

    const jsonStr = JSON.stringify(allNews, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'news.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    closeModal();
}

// Função para carregar lista de notícias
function loadNewsList() {
    const newsList = document.getElementById('newsList');
    const allNews = JSON.parse(localStorage.getItem('znnNews')) || {
        mainNews: null,
        sidebarNews: [],
        secondaryNews: []
    };

    let html = '';

    if (allNews.mainNews) {
        html += createNewsItemHTML(allNews.mainNews, 'Principal');
    }

    allNews.sidebarNews.forEach(news => {
        html += createNewsItemHTML(news, 'Lateral');
    });

    allNews.secondaryNews.forEach(news => {
        html += createNewsItemHTML(news, 'Secundária');
    });

    if (html === '') {
        newsList.innerHTML = '<p style="text-align: center; color: #666; padding: 40px 0;">Nenhuma notícia publicada ainda</p>';
    } else {
        newsList.innerHTML = html;
    }

    // Adicionar event listeners
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const newsId = this.dataset.newsId;
            editNews(newsId);
        });
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const newsId = this.dataset.newsId;
            deleteNews(newsId);
        });
    });
}

// Função para criar HTML de item de notícia
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

// Função para editar notícia
function editNews(newsId) {
    const allNews = JSON.parse(localStorage.getItem('znnNews')) || {
        mainNews: null,
        sidebarNews: [],
        secondaryNews: []
    };

    let news = null;
    if (allNews.mainNews && allNews.mainNews.id === newsId) {
        news = allNews.mainNews;
    } else {
        news = allNews.sidebarNews.find(n => n.id === newsId) || 
                allNews.secondaryNews.find(n => n.id === newsId);
    }

    if (!news) return;

    document.getElementById('editingId').value = news.id;
    document.getElementById('formTitle').textContent = 'Editar Notícia';
    document.getElementById('submitBtn').textContent = 'Atualizar Notícia';
    document.getElementById('newsType').value = news.type;
    document.getElementById('title').value = news.title;
    
    const dateMatch = news.date.match(/(\d{2}) de (\w+) de (\d{4})/);
    if (dateMatch) {
        const months = {
            'janeiro': '01', 'fevereiro': '02', 'março': '03', 'abril': '04',
            'maio': '05', 'junho': '06', 'julho': '07', 'agosto': '08',
            'setembro': '09', 'outubro': '10', 'novembro': '11', 'dezembro': '12'
        };
        const day = dateMatch[1];
        const month = months[dateMatch[2].toLowerCase()];
        const year = dateMatch[3];
        document.getElementById('date').value = `${year}-${month}-${day}`;
    }
    
    document.getElementById('time').value = news.time;
    document.getElementById('reporter').value = news.reporter;
    document.getElementById('category').value = news.category;
    document.getElementById('excerpt').value = news.excerpt;
    
    const content = news.content.replace(/<p>/g, '').replace(/<\/p>/g, '\n\n').trim();
    document.getElementById('content').value = content;
    
    if (news.imageUrl) {
        const imageName = news.imageUrl.replace('imagens/', '');
        document.getElementById('imageName').value = imageName;
    } else {
        document.getElementById('imageName').value = '';
    }
    
    document.getElementById('imageColor').value = news.imageColor;

    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

// Função para cancelar edição
function cancelEdit() {
    document.getElementById('editingId').value = '';
    document.getElementById('formTitle').textContent = 'Adicionar Nova Notícia';
    document.getElementById('submitBtn').textContent = 'Publicar Notícia';
    document.getElementById('newsForm').reset();
    
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);
    document.getElementById('date').value = dateStr;
    document.getElementById('time').value = timeStr;
}

// Event listener para o formulário
document.getElementById('newsForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const editingId = document.getElementById('editingId').value;
    const newsType = document.getElementById('newsType').value;
    const title = document.getElementById('title').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const reporter = document.getElementById('reporter').value;
    const category = document.getElementById('category').value;
    const excerpt = document.getElementById('excerpt').value;
    const content = document.getElementById('content').value;
    const imageName = document.getElementById('imageName').value;
    const imageColor = document.getElementById('imageColor').value;

    let imageUrl = '';
    if (imageName && imageName.trim()) {
        imageUrl = 'imagens/' + imageName.trim();
    }

    const dateObj = new Date(date + 'T' + time);
    const formattedDate = dateObj.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    const newsData = {
        id: editingId || generateId(),
        type: newsType,
        title: title,
        date: formattedDate,
        time: time,
        reporter: reporter,
        category: category,
        categoryClass: getCategoryClass(category),
        excerpt: excerpt || title.substring(0, 100) + '...',
        content: formatContent(content),
        imageUrl: imageUrl,
        imageColor: imageColor,
        imageText: category.toUpperCase()
    };

    if (editingId) {
        updateNews(editingId, newsData);
        cancelEdit();
    } else {
        saveNews(newsData);
        this.reset();
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);
        document.getElementById('date').value = dateStr;
        document.getElementById('time').value = timeStr;
    }

    loadNewsList();

    // Botão de download
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = 'Baixar news.json';
    downloadBtn.className = 'btn-modal';
    downloadBtn.onclick = downloadNewsJson;

    showModal(editingId ? 'Notícia atualizada com sucesso!' : 'Notícia publicada com sucesso!', downloadBtn);
});

// Definir data e hora atual ao carregar
const now = new Date();
const dateStr = now.toISOString().split('T')[0];
const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);
document.getElementById('date').value = dateStr;
document.getElementById('time').value = timeStr;