// admin.js - Versão completa adaptada para Vercel

const ADMIN_PASSWORD = 'znn2025';

function generateId() {
    return 'news-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

function getCategoryClass(category) {
    const map = {
        'Política': 'category-politics',
        'Economia': 'category-economy',
        'Tecnologia': 'category-tech',
        'Sociedade': 'category-society',
        'Mundo': 'category-world'
    };
    return map[category] || 'category-politics';
}

function markdownToHtml(content) {
    return content;
}

function showModal(message, extraButton = null) {
    const modal = document.getElementById('successModal');
    const content = document.querySelector('.modal-content');
    content.innerHTML = `<h3>✓ Sucesso!</h3><p id="modalMessage">${message}</p>`;
    if (extraButton) content.appendChild(extraButton);
    const btn = document.createElement('button');
    btn.textContent = 'OK';
    btn.className = 'btn-modal';
    btn.onclick = closeModal;
    content.appendChild(btn);
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('successModal').classList.remove('active');
}

// --- Salvar no localStorage (cache) + gerar download ---
function saveNews(newsData) {
    const dateObj = new Date(newsData.date + 'T' + newsData.time);
    newsData.date = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    newsData.time = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
    newsData.rawDate = dateObj;
    newsData.type = 'recent';
    newsData.categoryClass = getCategoryClass(newsData.category);
    newsData.imageText = newsData.category.toUpperCase();

    let allNews = { mainNews: null, secondaryNews: [], olderNews: [] };
    try {
        const stored = localStorage.getItem('znnNews');
        if (stored) allNews = JSON.parse(stored);
    } catch (e) {
        console.warn("Cache local inválido.");
    }

    const idx = allNews.secondaryNews.findIndex(n => n.id === newsData.id);
    if (idx !== -1) {
        allNews.secondaryNews[idx] = newsData;
    } else {
        allNews.secondaryNews.push(newsData);
    }

    localStorage.setItem('znnNews', JSON.stringify(allNews));
    downloadNewsJson(allNews);
}

function updateNews(id, data) {
    saveNews(data);
}

function deleteNews(newsId) {
    if (!confirm('Tem certeza?')) return;
    let allNews = { mainNews: null, secondaryNews: [], olderNews: [] };
    try {
        const stored = localStorage.getItem('znnNews');
        if (stored) allNews = JSON.parse(stored);
    } catch (e) {
        console.warn("Falha ao carregar cache.");
    }
    allNews.secondaryNews = allNews.secondaryNews.filter(n => n.id !== newsId);
    localStorage.setItem('znnNews', JSON.stringify(allNews));
    loadNewsList();
    downloadNewsJson(allNews);
    showModal('Notícia deletada! Baixe o news.json atualizado.');
}

function downloadNewsJson(data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'news.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function loadNewsList() {
    const newsList = document.getElementById('newsList');
    let allNews = { mainNews: null, secondaryNews: [], olderNews: [] };
    try {
        const stored = localStorage.getItem('znnNews');
        if (stored) allNews = JSON.parse(stored);
    } catch (e) {
        console.warn("Falha ao carregar cache.");
    }

    let html = '';
    if (allNews.mainNews) html += createNewsItemHTML(allNews.mainNews, 'Principal');
    allNews.secondaryNews.forEach(n => html += createNewsItemHTML(n, 'Secundária'));
    allNews.olderNews.forEach(n => html += createNewsItemHTML(n, 'Antiga'));

    newsList.innerHTML = html || '<p style="text-align:center;color:#666;padding:40px 0;">Nenhuma notícia publicada ainda</p>';

    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            editNews(btn.dataset.newsId);
        });
    });
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteNews(btn.dataset.newsId);
        });
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

function editNews(newsId) {
    let allNews = { mainNews: null, secondaryNews: [], olderNews: [] };
    try {
        const stored = localStorage.getItem('znnNews');
        if (stored) allNews = JSON.parse(stored);
    } catch (e) {
        console.warn("Falha ao carregar cache.");
    }

    let news = allNews.mainNews?.id === newsId ? allNews.mainNews :
        allNews.secondaryNews.find(n => n.id === newsId) ||
        allNews.olderNews.find(n => n.id === newsId);

    if (!news) {
        alert("Notícia não encontrada.");
        return;
    }

    document.getElementById('editingId').value = news.id;
    document.getElementById('formTitle').textContent = 'Editar Notícia';
    document.getElementById('submitBtn').textContent = 'Atualizar Notícia';
    document.getElementById('title').value = news.title;

    if (news.rawDate) {
        const d = new Date(news.rawDate);
        document.getElementById('date').value = d.toISOString().split('T')[0];
        const h = String(d.getHours()).padStart(2, '0');
        const m = String(d.getMinutes()).padStart(2, '0');
        document.getElementById('time').value = `${h}:${m}`;
    }

    document.getElementById('reporter').value = news.reporter;
    document.getElementById('category').value = news.category;
    document.getElementById('excerpt').value = news.excerpt || '';

    const trix = document.querySelector('trix-editor[input="content"]');
    if (trix && trix.editor) {
        trix.editor.loadHTML(news.content || '');
    } else {
        document.getElementById('content').value = news.content || '';
    }

    if (news.imageUrl) {
        document.getElementById('imageName').value = news.imageUrl.replace('imagens/', '');
    } else {
        document.getElementById('imageName').value = '';
    }

    document.getElementById('imageColor').value = news.imageColor || 'linear-gradient(135deg, #1a1a1a 0%, #2d5016 100%)';
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

function cancelEdit() {
    document.getElementById('editingId').value = '';
    document.getElementById('formTitle').textContent = 'Adicionar Nova Notícia';
    document.getElementById('submitBtn').textContent = 'Publicar Notícia';
    document.getElementById('newsForm').reset();

    const now = new Date();
    document.getElementById('date').value = now.toISOString().split('T')[0];
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('time').value = `${h}:${m}`;
}

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const pwd = document.getElementById('password').value;
            if (pwd === ADMIN_PASSWORD) {
                sessionStorage.setItem('znnAdminAuth', 'true');
                document.getElementById('loginScreen').style.display = 'none';
                document.getElementById('adminPanel').style.display = 'block';
                loadNewsList();
            } else {
                document.getElementById('loginError').textContent = 'Senha incorreta!';
                document.getElementById('password').value = '';
            }
        });
    }

    if (sessionStorage.getItem('znnAdminAuth') === 'true') {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadNewsList();
    }

    const newsForm = document.getElementById('newsForm');
    if (newsForm) {
        newsForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const editingId = document.getElementById('editingId').value;
            const title = document.getElementById('title').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const reporter = document.getElementById('reporter').value;
            const category = document.getElementById('category').value;
            const excerpt = document.getElementById('excerpt').value;
            const contentHtml = document.getElementById('content').value;
            const imageName = document.getElementById('imageName').value.trim();
            const imageColor = document.getElementById('imageColor').value;

            if (!title || !date || !time || !reporter || !category || !contentHtml.trim()) {
                alert("Preencha todos os campos obrigatórios.");
                return;
            }

            const imageUrl = imageName ? `imagens/${imageName}` : '';
            const newsData = {
                id: editingId || generateId(),
                title,
                date,
                time,
                reporter,
                category,
                excerpt: excerpt || title.substring(0, 100) + '...',
                content: markdownToHtml(contentHtml),
                imageUrl,
                imageColor
            };

            if (editingId) {
                updateNews(editingId, newsData);
                cancelEdit();
            } else {
                saveNews(newsData);
                this.reset();
                const now = new Date();
                document.getElementById('date').value = now.toISOString().split('T')[0];
                const h = String(now.getHours()).padStart(2, '0');
                const m = String(now.getMinutes()).padStart(2, '0');
                document.getElementById('time').value = `${h}:${m}`;
            }

            loadNewsList();
            const btn = document.createElement('button');
            btn.textContent = 'Baixar news.json';
            btn.className = 'btn-modal';
            btn.onclick = () => {
                let data = { mainNews: null, secondaryNews: [], olderNews: [] };
                try {
                    const stored = localStorage.getItem('znnNews');
                    if (stored) data = JSON.parse(stored);
                } catch (e) {}
                downloadNewsJson(data);
                closeModal();
            };
            showModal(editingId ? 'Notícia atualizada!' : 'Notícia publicada!', btn);
        });
    }

    const now = new Date();
    document.getElementById('date').value = now.toISOString().split('T')[0];
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('time').value = `${h}:${m}`;
});

function logout() {
    sessionStorage.removeItem('znnAdminAuth');
    location.reload();
}