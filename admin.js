// Senha do admin
const ADMIN_PASSWORD = 'znn2025';

// Login
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

window.addEventListener('DOMContentLoaded', function() {
    if (sessionStorage.getItem('znnAdminAuth') === 'true') {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadNewsList();
    }
});

function logout() {
    sessionStorage.removeItem('znnAdminAuth');
    location.reload();
}

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

// Função para converter Markdown para HTML (simples)
function markdownToHtml(md) {
    let html = md;
    // Converter quebras de linha em <br>
    html = html.replace(/\n/g, '<br>');
    // Converter **texto** em <strong>texto</strong>
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Converter *texto* em <em>texto</em>
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Converter ![alt](url) em <img src="url" alt="alt">
    html = html.replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="inline-image">');
    // Converter [texto](url) em <a href="url">$texto</a>
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    // Converter ### título em <h3>título</h3>
    html = html.replace(/^###\s+(.*)$/gm, '<h3>$1</h3>');
    html = html.replace(/^##\s+(.*)$/gm, '<h2>$1</h2>');
    html = html.replace(/^#\s+(.*)$/gm, '<h1>$1</h1>');
    // Converter parágrafos (linhas vazias)
    html = html.replace(/<br><br>/g, '</p><p>');
    html = `<p>${html}</p>`;
    html = html.replace(/<p><br>/g, '<p>');
    html = html.replace(/<br><\/p>/g, '</p>');
    return html;
}

// Mostrar modal com botão de download
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

// Salvar no localStorage
function saveNews(newsData) {
    let allNews = JSON.parse(localStorage.getItem('znnNews')) || { mainNews: null, secondaryNews: [] };
    if (newsData.type === 'main') allNews.mainNews = newsData;
    else if (newsData.type === 'secondary') allNews.secondaryNews.push(newsData);
    localStorage.setItem('znnNews', JSON.stringify(allNews));
}

// Atualizar notícia
function updateNews(newsId, newsData) {
    let allNews = JSON.parse(localStorage.getItem('znnNews')) || { mainNews: null, secondaryNews: [] };
    if (allNews.mainNews && allNews.mainNews.id === newsId) allNews.mainNews = null;
    allNews.secondaryNews = allNews.secondaryNews.filter(n => n.id !== newsId);
    if (newsData.type === 'main') allNews.mainNews = newsData;
    else if (newsData.type === 'secondary') allNews.secondaryNews.push(newsData);
    localStorage.setItem('znnNews', JSON.stringify(allNews));
}

// Deletar notícia
function deleteNews(newsId) {
    if (!confirm('Tem certeza que deseja deletar esta notícia?')) return;
    let allNews = JSON.parse(localStorage.getItem('znnNews')) || { mainNews: null, secondaryNews: [] };
    if (allNews.mainNews && allNews.mainNews.id === newsId) allNews.mainNews = null;
    allNews.secondaryNews = allNews.secondaryNews.filter(n => n.id !== newsId);
    localStorage.setItem('znnNews', JSON.stringify(allNews));
    loadNewsList();

    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = 'Baixar news.json';
    downloadBtn.className = 'btn-modal';
    downloadBtn.onclick = downloadNewsJson;
    showModal('Notícia deletada com sucesso!', downloadBtn);
}

// Download do news.json
function downloadNewsJson() {
    const allNews = JSON.parse(localStorage.getItem('znnNews')) || { mainNews: null, secondaryNews: [] };
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
}

// Carregar lista
function loadNewsList() {
    const newsList = document.getElementById('newsList');
    const allNews = JSON.parse(localStorage.getItem('znnNews')) || { mainNews: null, secondaryNews: [] };
    let html = '';
    if (allNews.mainNews) html += createNewsItemHTML(allNews.mainNews, 'Principal');
    allNews.secondaryNews.forEach(news => html += createNewsItemHTML(news, 'Secundária'));
    newsList.innerHTML = html || '<p style="text-align:center;color:#666;padding:40px 0;">Nenhuma notícia publicada ainda</p>';

    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', e => editNews(e.target.dataset.newsId));
    });
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', e => deleteNews(e.target.dataset.newsId));
    });
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

// Editar notícia
function editNews(newsId) {
    const allNews = JSON.parse(localStorage.getItem('znnNews')) || { mainNews: null, secondaryNews: [] };
    let news = allNews.mainNews?.id === newsId ? allNews.mainNews : allNews.secondaryNews.find(n => n.id === newsId);
    if (!news) return;

    document.getElementById('editingId').value = news.id;
    document.getElementById('formTitle').textContent = 'Editar Notícia';
    document.getElementById('submitBtn').textContent = 'Atualizar Notícia';
    document.getElementById('newsType').value = news.type;
    document.getElementById('title').value = news.title;
    
    const dateMatch = news.date.match(/(\d{2}) de (\w+) de (\d{4})/);
    if (dateMatch) {
        const months = {'janeiro':'01','fevereiro':'02','março':'03','abril':'04','maio':'05','junho':'06','julho':'07','agosto':'08','setembro':'09','outubro':'10','novembro':'11','dezembro':'12'};
        const day = dateMatch[1], month = months[dateMatch[2].toLowerCase()], year = dateMatch[3];
        document.getElementById('date').value = `${year}-${month}-${day}`;
    }
    
    document.getElementById('time').value = news.time;
    document.getElementById('reporter').value = news.reporter;
    document.getElementById('category').value = news.category;
    document.getElementById('excerpt').value = news.excerpt;
    // Converter HTML de volta para texto simples para edição
    const content = news.content.replace(/<p>/g, '').replace(/<\/p>/g, '\n\n').replace(/<br>/g, '\n').replace(/<strong>/g, '**').replace(/<\/strong>/g, '**').replace(/<em>/g, '*').replace(/<\/em>/g, '*').replace(/<a href="(.*?)" target="_blank">(.*?)<\/a>/g, '[$2]($1)').replace(/<img src="(.*?)" alt="(.*?)" class="inline-image">/g, '![$2]($1)');
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

function cancelEdit() {
    document.getElementById('editingId').value = '';
    document.getElementById('formTitle').textContent = 'Adicionar Nova Notícia';
    document.getElementById('submitBtn').textContent = 'Publicar Notícia';
    document.getElementById('newsForm').reset();
    const now = new Date();
    document.getElementById('date').value = now.toISOString().split('T')[0];
    document.getElementById('time').value = now.toTimeString().split(' ')[0].substring(0, 5);
}

// Submissão do formulário
document.getElementById('newsForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const editingId = document.getElementById('editingId').value;
    const newsType = document.getElementById('newsType').value;
    const title = document.getElementById('title').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const reporter = document.getElementById('reporter').value;
    const category = document.getElementById('category').value;
    const excerpt = document.getElementById('excerpt').value;
    const contentText = document.getElementById('content').value;
    const imageName = document.getElementById('imageName').value;
    const imageColor = document.getElementById('imageColor').value;

    // Converter Markdown para HTML
    const contentHtml = markdownToHtml(contentText);

    let imageUrl = '';
    if (imageName && imageName.trim()) {
        imageUrl = 'imagens/' + imageName.trim();
    }

    const dateObj = new Date(date + 'T' + time);
    const formattedDate = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

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
        content: contentHtml,
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

// Data/hora atual
const now = new Date();
document.getElementById('date').value = now.toISOString().split('T')[0];
document.getElementById('time').value = now.toTimeString().split(' ')[0].substring(0, 5);