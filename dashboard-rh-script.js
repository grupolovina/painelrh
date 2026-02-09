// ============================================
// DADOS DOS CANDIDATOS
// ============================================
// Para adicionar novos candidatos, basta adicionar um novo objeto neste array
// Formato de data: YYYY-MM-DD
const candidatos = [
  {
    nome: "Rennan Rodrigues",
    pretensaoSalarial: "R$ 0.000,00",
    departamento: "Restaurantes",
    cargo: "Atendente",
    curriculo: "https://drive.google.com/file/d/1uq7VqPFIwYAEv-d5IcYbvC53pUUTxYMU/view?usp=sharing",
    dataEnvio: "2026-02-07",
    sexo: "Masculino",
    whatsapp: "5583981987474",
    telefone: "5583981987474",
  },
  {
    nome: "Rennan Rodrigues",
    pretensaoSalarial: "R$ 0.000,00",
    departamento: "Restaurantes",
    cargo: "Motorista",
    curriculo: "https://drive.google.com/file/d/1uq7VqPFIwYAEv-d5IcYbvC53pUUTxYMU/view?usp=sharing",
    dataEnvio: "2026-02-07",
    sexo: "Masculino",
    whatsapp: "5583981987474",
    telefone: "5583981987474",
  },

]

// ============================================
// VARIÁVEIS GLOBAIS
// ============================================
let filteredCandidatos = [...candidatos]
let displayedCount = 0
const itemsPerPage = 10

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  initTheme()
  initNavigation()
  initFilters()
  initStats()
  populateFilterOptions()
  renderCandidatos()
})

// ============================================
// TEMA (MODO ESCURO/CLARO)
// ============================================
function initTheme() {
  const themeToggle = document.getElementById("themeToggle")
  const savedTheme = localStorage.getItem("theme") || "light"

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode")
    themeToggle.innerHTML = '<span class="theme-icon">☀️</span>'
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode")
    const isDark = document.body.classList.contains("dark-mode")
    themeToggle.innerHTML = isDark ? '<span class="theme-icon">☀️</span>' : '<span class="theme-icon">🌙</span>'
    localStorage.setItem("theme", isDark ? "dark" : "light")
  })
}

// ============================================
// NAVEGAÇÃO
// ============================================
function initNavigation() {
  const menuToggle = document.getElementById("menuToggle")
  const closeSidebar = document.getElementById("closeSidebar")
  const sidebar = document.getElementById("sidebar")
  const menuItems = document.querySelectorAll(".menu-item")
  const pageTitle = document.getElementById("pageTitle")

  // Toggle sidebar em mobile
  menuToggle.addEventListener("click", () => {
    sidebar.classList.add("active")
  })

  closeSidebar.addEventListener("click", () => {
    sidebar.classList.remove("active")
  })

  // Navegação entre páginas
  menuItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault()

      // Atualizar menu ativo
      menuItems.forEach((mi) => mi.classList.remove("active"))
      item.classList.add("active")

      // Mostrar página correspondente
      const page = item.dataset.page
      document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"))
      document.getElementById(`${page}Page`).classList.add("active")

      // Atualizar título
      pageTitle.textContent = item.textContent.trim()

      // Fechar sidebar em mobile
      sidebar.classList.remove("active")
    })
  })
}

// ============================================
// ESTATÍSTICAS
// ============================================
function initStats() {
  const totalCandidatos = document.getElementById("totalCandidatos")
  const candidatosMes = document.getElementById("candidatosMes")

  totalCandidatos.textContent = candidatos.length

  // Contar candidatos do mês atual
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const countMes = candidatos.filter((c) => {
    const date = new Date(c.dataEnvio)
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear
  }).length

  candidatosMes.textContent = countMes
}

// ============================================
// FILTROS
// ============================================
function populateFilterOptions() {
  const filterCargo = document.getElementById("filterCargo")

  // Obter cargos únicos
  const cargos = [...new Set(candidatos.map((c) => c.cargo))].sort()

  cargos.forEach((cargo) => {
    const option = document.createElement("option")
    option.value = cargo
    option.textContent = cargo
    filterCargo.appendChild(option)
  })
}

function initFilters() {
  const searchGeral = document.getElementById("searchGeral")
  const filterNome = document.getElementById("filterNome")
  const filterCargo = document.getElementById("filterCargo")
  const filterAno = document.getElementById("filterAno")
  const filterSexo = document.getElementById("filterSexo")
  const clearFilters = document.getElementById("clearFilters")
  const loadMoreBtn = document.getElementById("loadMoreBtn")

  // Busca geral
  searchGeral.addEventListener("input", applyFilters)

  // Filtros individuais
  filterNome.addEventListener("input", applyFilters)
  filterCargo.addEventListener("change", applyFilters)
  filterAno.addEventListener("input", applyFilters)
  filterSexo.addEventListener("change", applyFilters)

  // Limpar filtros
  clearFilters.addEventListener("click", () => {
    searchGeral.value = ""
    filterNome.value = ""
    filterCargo.value = ""
    filterAno.value = ""
    filterSexo.value = ""
    applyFilters()
  })

  // Ver mais
  loadMoreBtn.addEventListener("click", () => {
    displayedCount += itemsPerPage
    renderCandidatos()
  })
}

function applyFilters() {
  const searchGeral = document.getElementById("searchGeral").value.toLowerCase()
  const filterNome = document.getElementById("filterNome").value.toLowerCase()
  const filterCargo = document.getElementById("filterCargo").value
  const filterAno = document.getElementById("filterAno").value
  const filterSexo = document.getElementById("filterSexo").value

  filteredCandidatos = candidatos.filter((candidato) => {
    // Busca geral (pesquisa em todos os campos)
    const matchSearchGeral =
      !searchGeral ||
      candidato.nome.toLowerCase().includes(searchGeral) ||
      candidato.cargo.toLowerCase().includes(searchGeral) ||
      candidato.departamento.toLowerCase().includes(searchGeral) ||
      candidato.dataEnvio.includes(searchGeral) ||
      candidato.sexo.toLowerCase().includes(searchGeral)

    // Filtro por nome
    const matchNome = !filterNome || candidato.nome.toLowerCase().includes(filterNome)

    // Filtro por cargo
    const matchCargo = !filterCargo || candidato.cargo === filterCargo

    // Filtro por ano
    const matchAno = !filterAno || candidato.dataEnvio.startsWith(filterAno)

    // Filtro por sexo
    const matchSexo = !filterSexo || candidato.sexo === filterSexo

    return matchSearchGeral && matchNome && matchCargo && matchAno && matchSexo
  })

  // Resetar contador de exibição
  displayedCount = 0
  renderCandidatos()
}

// ============================================
// RENDERIZAÇÃO
// ============================================
function renderCandidatos() {
  const tbody = document.getElementById("candidatosTableBody")
  const mobileCards = document.getElementById("mobileCards")
  const noResults = document.getElementById("noResults")
  const loadMoreContainer = document.getElementById("loadMoreContainer")
  const loadMoreBtn = document.getElementById("loadMoreBtn")

  // Limpar tabela e cards
  tbody.innerHTML = ""
  mobileCards.innerHTML = ""

  // Verificar se há resultados
  if (filteredCandidatos.length === 0) {
    noResults.style.display = "block"
    loadMoreContainer.style.display = "none"
    return
  }

  noResults.style.display = "none"

  // Determinar quantos candidatos mostrar
  const endIndex = Math.min(displayedCount + itemsPerPage, filteredCandidatos.length)
  const candidatosToShow = filteredCandidatos.slice(0, endIndex)

  // Renderizar candidatos
  candidatosToShow.forEach((candidato, index) => {
    const tr = document.createElement("tr")

    tr.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${candidato.nome}</strong></td>
            <td>${candidato.pretensaoSalarial}</td>
            <td>${candidato.departamento}</td>
            <td>${candidato.cargo}</td>
            <td>
                <a href="${candidato.curriculo}" target="_blank" class="view-icon" title="Ver currículo">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                </a>
            </td>
            <td>${formatDate(candidato.dataEnvio)}</td>
            <td>${candidato.sexo}</td>
            <td>
                <div class="contact-buttons">
                    <a href="https://wa.me/${candidato.whatsapp}" target="_blank" class="contact-btn" title="WhatsApp">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#25D366">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                    </a>
                    <a href="tel:+${candidato.telefone}" class="contact-btn" title="Telefone">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4a94c7">
                            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                        </svg>
                    </a>
                </div>
            </td>
        `

    tbody.appendChild(tr)

    const card = document.createElement("div")
    card.className = "mobile-card"
    card.innerHTML = `
      <div class="mobile-card-header">
        <div>
          <h3>${candidato.nome}</h3>
          <span class="cargo">${candidato.cargo}</span>
        </div>
        <a href="${candidato.curriculo}" target="_blank" class="view-icon" title="Ver currículo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="var(--accent-color)" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
        </a>
      </div>
      <div class="mobile-card-body">
        <div class="mobile-card-row">
          <label>Pretensão Salarial</label>
          <span>${candidato.pretensaoSalarial}</span>
        </div>
        <div class="mobile-card-row">
          <label>Departamento</label>
          <span>${candidato.departamento}</span>
        </div>
        <div class="mobile-card-row">
          <label>Data de Envio</label>
          <span>${formatDate(candidato.dataEnvio)}</span>
        </div>
        <div class="mobile-card-row">
          <label>Sexo</label>
          <span>${candidato.sexo}</span>
        </div>
      </div>
      <div class="mobile-card-footer">
        <a href="https://wa.me/${candidato.whatsapp}" target="_blank" class="btn-whatsapp">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          WhatsApp
        </a>
        <a href="tel:+${candidato.telefone}" class="btn-phone">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
          </svg>
          Ligar
        </a>
      </div>
    `
    mobileCards.appendChild(card)
  })

  // Atualizar contador de exibição
  displayedCount = endIndex

  // Mostrar/ocultar botão "Ver mais"
  if (displayedCount < filteredCandidatos.length) {
    loadMoreContainer.style.display = "flex"
    const remaining = filteredCandidatos.length - displayedCount
    loadMoreBtn.textContent = `Ver mais (${remaining} restante${remaining > 1 ? "s" : ""})`
  } else {
    loadMoreContainer.style.display = "none"
  }
}

// ============================================
// UTILITÁRIOS
// ============================================
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("pt-BR")
}
