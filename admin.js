// Painel Administrativo - Minha Empresa
// Gerado por WebAI Studio Pro
'use strict';

async function sha256(message) {
  var msgBuffer = new TextEncoder().encode(message);
  var hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  var hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
}

var DEFAULT_ADMIN = {
  email: 'admin@admin.com',
  passwordHash: '240be518fabd2724ddb6f04eeb9d56b5c20e6b90a69946f29fe2ed7e66a5014f',
  name: 'Administrador'
};

function initAdminData() {
  if (!localStorage.getItem('admin_user')) {
    localStorage.setItem('admin_user', JSON.stringify(DEFAULT_ADMIN));
  }
  if (!localStorage.getItem('admin_items')) {
    localStorage.setItem('admin_items', JSON.stringify([
      { id: 1, name: 'Serviço de Automação', description: 'Automatização de processos', price: 'R$ 2.500', status: 'active', image: '' },
      { id: 2, name: 'Consultoria Digital', description: 'Análise estratégica completa', price: 'R$ 1.800', status: 'active', image: '' },
      { id: 3, name: 'Marketing Online', description: 'Campanhas de alto impacto', price: 'R$ 3.200', status: 'inactive', image: '' }
    ]));
  }
  if (!localStorage.getItem('admin_first_login')) {
    localStorage.setItem('admin_first_login', 'true');
  }
  if (!localStorage.getItem('admin_content')) {
    localStorage.setItem('admin_content', JSON.stringify({
      heroTitle: 'Inovação em Tecnologia',
      heroSubtitle: 'Soluções inteligentes para transformar seu negócio',
      aboutText: 'Somos especialistas em tecnologia e automação, entregando soluções de ponta.',
      footerText: 'Tecnologia que transforma.'
    }));
  }
  if (!localStorage.getItem('admin_prompt_history')) {
    localStorage.setItem('admin_prompt_history', '[]');
  }
}

initAdminData();

// LOGIN PAGE
var loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    var email = document.getElementById('email').value.trim();
    var password = document.getElementById('password').value;
    var errorEl = document.getElementById('loginError');
    var admin = JSON.parse(localStorage.getItem('admin_user'));
    var passwordHash = await sha256(password);

    if (email === admin.email && passwordHash === admin.passwordHash) {
      sessionStorage.setItem('admin_logged_in', 'true');
      window.location.href = 'dashboard.html';
    } else {
      errorEl.style.display = 'block';
      errorEl.textContent = 'Email ou senha incorretos.';
    }
  });
}

// DASHBOARD PAGE
if (document.querySelector('.dashboard')) {
  if (sessionStorage.getItem('admin_logged_in') !== 'true') {
    window.location.href = 'login.html';
  }

  var isFirstLogin = localStorage.getItem('admin_first_login');
  var warningBanner = document.getElementById('warningBanner');
  if (isFirstLogin === 'true' && warningBanner) {
    warningBanner.style.display = 'flex';
  }

  // Tab system
  window.switchTab = function(tabId) {
    document.querySelectorAll('.tab-content').forEach(function(el) { el.classList.remove('active'); });
    document.querySelectorAll('.admin-tab').forEach(function(el) { el.classList.remove('active'); });
    document.getElementById('tab-' + tabId).classList.add('active');
    document.querySelector('[data-tab="' + tabId + '"]').classList.add('active');
  };

  // Render items
  function renderItems() {
    var items = JSON.parse(localStorage.getItem('admin_items') || '[]');
    var tbody = document.getElementById('itemsTable');
    if (!tbody) return;

    tbody.innerHTML = items.map(function(item) {
      return '<tr>' +
        '<td>' + item.id + '</td>' +
        '<td><strong>' + item.name + '</strong></td>' +
        '<td>' + item.description + '</td>' +
        '<td>' + item.price + '</td>' +
        '<td><span class="status-' + item.status + '">' + (item.status === 'active' ? 'Ativo' : 'Inativo') + '</span></td>' +
        '<td>' +
          '<button class="btn-action btn-edit" onclick="editItem(' + item.id + ')">Editar</button>' +
          '<button class="btn-action btn-toggle" onclick="toggleItem(' + item.id + ')">' + (item.status === 'active' ? 'Desativar' : 'Ativar') + '</button>' +
          '<button class="btn-action btn-delete" onclick="deleteItem(' + item.id + ')">Excluir</button>' +
        '</td>' +
      '</tr>';
    }).join('');

    var statsEl = document.getElementById('totalItems');
    var activeEl = document.getElementById('activeItems');
    if (statsEl) statsEl.textContent = items.length;
    if (activeEl) activeEl.textContent = items.filter(function(i) { return i.status === 'active'; }).length;
  }

  renderItems();

  // Load content editor
  function loadContent() {
    var content = JSON.parse(localStorage.getItem('admin_content') || '{}');
    var heroTitle = document.getElementById('editHeroTitle');
    var heroSub = document.getElementById('editHeroSubtitle');
    var aboutText = document.getElementById('editAboutText');
    var footerText = document.getElementById('editFooterText');
    if (heroTitle) heroTitle.value = content.heroTitle || '';
    if (heroSub) heroSub.value = content.heroSubtitle || '';
    if (aboutText) aboutText.value = content.aboutText || '';
    if (footerText) footerText.value = content.footerText || '';
  }

  loadContent();

  window.saveContent = function() {
    var content = {
      heroTitle: document.getElementById('editHeroTitle').value,
      heroSubtitle: document.getElementById('editHeroSubtitle').value,
      aboutText: document.getElementById('editAboutText').value,
      footerText: document.getElementById('editFooterText').value
    };
    localStorage.setItem('admin_content', JSON.stringify(content));
    alert('Conteúdo salvo com sucesso!');
  };

  // Prompt system
  window.applyPrompt = function() {
    var promptText = document.getElementById('promptInput').value.trim();
    if (!promptText) return;

    var content = JSON.parse(localStorage.getItem('admin_content') || '{}');
    var changes = [];
    var lower = promptText.toLowerCase();

    if (lower.includes('titulo') || lower.includes('título')) {
      var match = promptText.match(/(?:titulo|título)[:\s]+["']?(.+?)["']?$/i);
      if (match) { content.heroTitle = match[1].trim(); changes.push('Título atualizado'); }
    }
    if (lower.includes('subtitulo') || lower.includes('subtítulo') || lower.includes('slogan')) {
      var match = promptText.match(/(?:subtitulo|subtítulo|slogan)[:\s]+["']?(.+?)["']?$/i);
      if (match) { content.heroSubtitle = match[1].trim(); changes.push('Subtítulo atualizado'); }
    }
    if (lower.includes('sobre') || lower.includes('about')) {
      var match = promptText.match(/(?:sobre|about)[:\s]+["']?(.+?)["']?$/i);
      if (match) { content.aboutText = match[1].trim(); changes.push('Texto sobre atualizado'); }
    }

    if (changes.length === 0 && promptText.length > 3) {
      content.heroTitle = promptText;
      changes.push('Texto aplicado como título');
    }

    localStorage.setItem('admin_content', JSON.stringify(content));
    loadContent();

    var history = JSON.parse(localStorage.getItem('admin_prompt_history') || '[]');
    history.unshift({ prompt: promptText, time: new Date().toLocaleString('pt-BR'), changes: changes.join(', ') });
    if (history.length > 10) history = history.slice(0, 10);
    localStorage.setItem('admin_prompt_history', JSON.stringify(history));
    renderPromptHistory();

    document.getElementById('promptInput').value = '';
    alert('Prompt aplicado: ' + changes.join(', '));
  };

  function renderPromptHistory() {
    var history = JSON.parse(localStorage.getItem('admin_prompt_history') || '[]');
    var container = document.getElementById('promptHistory');
    if (!container) return;
    container.innerHTML = history.map(function(item) {
      return '<div class="prompt-history-item"><span class="time">' + item.time + '</span><br><strong>' + item.prompt + '</strong><br><small>' + item.changes + '</small></div>';
    }).join('');
  }

  renderPromptHistory();

  // CRUD Operations
  window.addItem = function() {
    document.getElementById('modalTitle').textContent = 'Novo Item';
    document.getElementById('itemForm').reset();
    document.getElementById('itemId').value = '';
    document.getElementById('itemModal').classList.add('active');
  };

  window.editItem = function(id) {
    var items = JSON.parse(localStorage.getItem('admin_items') || '[]');
    var item = items.find(function(i) { return i.id === id; });
    if (!item) return;
    document.getElementById('modalTitle').textContent = 'Editar Item';
    document.getElementById('itemId').value = item.id;
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemDesc').value = item.description;
    document.getElementById('itemPrice').value = item.price;
    document.getElementById('itemModal').classList.add('active');
  };

  window.saveItem = function() {
    var items = JSON.parse(localStorage.getItem('admin_items') || '[]');
    var id = document.getElementById('itemId').value;
    var name = document.getElementById('itemName').value;
    var desc = document.getElementById('itemDesc').value;
    var price = document.getElementById('itemPrice').value;

    if (!name || !desc || !price) { alert('Preencha todos os campos.'); return; }

    if (id) {
      var idx = items.findIndex(function(i) { return i.id === parseInt(id); });
      if (idx > -1) { items[idx].name = name; items[idx].description = desc; items[idx].price = price; }
    } else {
      items.push({ id: Date.now(), name: name, description: desc, price: price, status: 'active', image: '' });
    }

    localStorage.setItem('admin_items', JSON.stringify(items));
    closeModal();
    renderItems();
  };

  window.deleteItem = function(id) {
    if (!confirm('Deseja realmente excluir este item?')) return;
    var items = JSON.parse(localStorage.getItem('admin_items') || '[]');
    items = items.filter(function(i) { return i.id !== id; });
    localStorage.setItem('admin_items', JSON.stringify(items));
    renderItems();
  };

  window.toggleItem = function(id) {
    var items = JSON.parse(localStorage.getItem('admin_items') || '[]');
    var item = items.find(function(i) { return i.id === id; });
    if (item) {
      item.status = item.status === 'active' ? 'inactive' : 'active';
      localStorage.setItem('admin_items', JSON.stringify(items));
      renderItems();
    }
  };

  window.closeModal = function() { document.getElementById('itemModal').classList.remove('active'); };

  window.showChangePassword = function() { document.getElementById('passwordModal').classList.add('active'); };

  window.changePassword = async function() {
    var current = document.getElementById('currentPass').value;
    var newPass = document.getElementById('newPass').value;
    var confirm = document.getElementById('confirmPass').value;
    if (!current || !newPass || !confirm) { alert('Preencha todos os campos.'); return; }
    if (newPass !== confirm) { alert('As senhas não conferem.'); return; }
    if (newPass.length < 6) { alert('A nova senha deve ter pelo menos 6 caracteres.'); return; }

    var admin = JSON.parse(localStorage.getItem('admin_user'));
    var currentHash = await sha256(current);
    if (currentHash !== admin.passwordHash) { alert('Senha atual incorreta.'); return; }

    admin.passwordHash = await sha256(newPass);
    localStorage.setItem('admin_user', JSON.stringify(admin));
    localStorage.setItem('admin_first_login', 'false');
    alert('Senha alterada com sucesso!');
    document.getElementById('passwordModal').classList.remove('active');
    var warningBanner = document.getElementById('warningBanner');
    if (warningBanner) warningBanner.style.display = 'none';
  };

  window.logout = function() {
    sessionStorage.removeItem('admin_logged_in');
    window.location.href = 'login.html';
  };
}
