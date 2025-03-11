document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('excelFile');
    const fileName = document.getElementById('fileName');
    const filterType = document.getElementById('filterType');
    const filterLevel = document.getElementById('filterLevel');
    const checklistContainer = document.getElementById('checklist');
    const initialMessage = document.getElementById('initial-message');
    const checklistContent = document.getElementById('checklist-container');
    const filters = document.querySelector('.filters');
    
    let checklistData = [];
    const STORAGE_KEY = 'accessibilityChecklist';

    // Función para guardar el estado completo
    function saveState() {
        const state = {
            checklistData,
            filters: {
                type: filterType.value,
                level: filterLevel.value
            },
            lastUpdate: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    // Función para cargar el estado guardado
    function loadState() {
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) {
            const state = JSON.parse(savedState);
            checklistData = state.checklistData;
            
            if (checklistData && checklistData.length > 0) {
                initialMessage.style.display = 'none';
                checklistContent.style.display = 'block';
                filters.style.display = 'flex';
                
                cargarFiltros();
                
                // Restaurar filtros
                if (state.filters) {
                    filterType.value = state.filters.type;
                    filterLevel.value = state.filters.level;
                }
                
                renderizarChecklist(filterType.value, filterLevel.value);
                return true;
            }
        }
        return false;
    }

    // Función para exportar el progreso
    function exportarProgreso() {
        const progress = {};
        document.querySelectorAll('.checklist-item input[type="checkbox"]').forEach(checkbox => {
            if (checkbox.checked) {
                progress[checkbox.id] = true;
            }
        });

        const data = {
            checklistData,
            progress,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'checklist-progress.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Función para importar el progreso
    async function importarProgreso(file) {
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            
            if (data.checklistData && data.progress) {
                checklistData = data.checklistData;
                
                // Limpiar localStorage actual
                const keysToKeep = new Set(Object.keys(data.progress));
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (!keysToKeep.has(key) && key !== STORAGE_KEY) {
                        localStorage.removeItem(key);
                    }
                }
                
                // Restaurar progreso
                Object.entries(data.progress).forEach(([key, value]) => {
                    localStorage.setItem(key, value);
                });
                
                initialMessage.style.display = 'none';
                checklistContent.style.display = 'block';
                filters.style.display = 'flex';
                
                cargarFiltros();
                renderizarChecklist();
                
                saveState();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error al importar:', error);
            return false;
        }
    }

    // Procesar archivo Excel
    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        fileName.textContent = file.name;
        
        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            // Procesar datos y agrupar por tipo
            checklistData = procesarDatosExcel(jsonData);
            
            // Mostrar la interfaz del checklist
            initialMessage.style.display = 'none';
            checklistContent.style.display = 'block';
            filters.style.display = 'flex';

            // Cargar filtros y renderizar checklist
            cargarFiltros();
            renderizarChecklist();
            
            // Guardar estado
            saveState();
        } catch (error) {
            console.error('Error al procesar el archivo:', error);
            alert('Error al procesar el archivo Excel. Por favor, verifica el formato del archivo.');
        }
    });

    // Procesar datos del Excel y agrupar por tipo
    function procesarDatosExcel(jsonData) {
        const groupedData = {};

        jsonData.forEach(row => {
            const tipo = row.Tipo || 'Sin categoría';
            if (!groupedData[tipo]) {
                groupedData[tipo] = {
                    tipo: tipo,
                    items: []
                };
            }

            groupedData[tipo].items.push({
                titulo: row.Título || '',
                tipoValidacion: row['Tipo validación'] || '',
                herramienta: row.Herramienta || '',
                equipos: row.Equipos || '',
                norma: row.Norma || '',
                nivel: row.Nivel || '',
                criterio: row.Criterio || ''
            });
        });

        return Object.values(groupedData);
    }

    // Cargar filtros
    function cargarFiltros() {
        filterType.innerHTML = '<option value="todos">Todos los tipos</option>';
        filterLevel.innerHTML = '<option value="todos">Todos los niveles</option>';

        const tipos = [...new Set(checklistData.map(group => group.tipo))];
        tipos.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo;
            option.textContent = tipo;
            filterType.appendChild(option);
        });

        const niveles = new Set();
        checklistData.forEach(group => {
            group.items.forEach(item => {
                if (item.nivel) niveles.add(item.nivel);
            });
        });

        [...niveles].forEach(nivel => {
            const option = document.createElement('option');
            option.value = nivel;
            option.textContent = nivel;
            filterLevel.appendChild(option);
        });
    }

    // Actualizar progreso
    function actualizarProgreso() {
        const totalItems = document.querySelectorAll('.checklist-item').length;
        const completedItems = document.querySelectorAll('.checklist-item input[type="checkbox"]:checked').length;
        const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
        
        document.querySelector('.progress').style.width = `${progress}%`;
        document.querySelector('.progress-text').textContent = `${Math.round(progress)}% completado`;
    }

    // Renderizar checklist
    function renderizarChecklist(tipoFiltro = 'todos', nivelFiltro = 'todos') {
        while (checklistContainer.firstChild) {
            checklistContainer.removeChild(checklistContainer.firstChild);
        }
        
        checklistData.forEach(grupo => {
            if (tipoFiltro !== 'todos' && grupo.tipo !== tipoFiltro) return;

            const itemsFiltrados = grupo.items.filter(item => 
                (nivelFiltro === 'todos' || item.nivel === nivelFiltro)
            );

            if (itemsFiltrados.length === 0) return;

            const grupoDiv = document.createElement('div');
            grupoDiv.className = 'checklist-group';
            
            const titulo = document.createElement('h2');
            titulo.textContent = grupo.tipo;
            grupoDiv.appendChild(titulo);

            itemsFiltrados.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'checklist-item';
                if (localStorage.getItem(item.criterio) === 'true') {
                    itemDiv.classList.add('checked');
                }

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = item.criterio;
                checkbox.checked = localStorage.getItem(item.criterio) === 'true';
                itemDiv.appendChild(checkbox);

                const contentDiv = document.createElement('div');
                contentDiv.className = 'item-content';

                const titleDiv = document.createElement('div');
                titleDiv.className = 'item-title';
                const pre = document.createElement('pre');
                pre.style.cssText = 'margin: 0; padding: 0; font-family: inherit; background: none; border: none; white-space: pre-wrap; font-size: inherit; color: inherit;';
                pre.textContent = item.titulo;
                titleDiv.appendChild(pre);
                contentDiv.appendChild(titleDiv);

                const metaDiv = document.createElement('div');
                metaDiv.className = 'item-meta';

                if (item.nivel) {
                    const tag = document.createElement('span');
                    tag.className = 'tag';
                    tag.textContent = item.nivel;
                    metaDiv.appendChild(tag);
                }

                if (item.tipoValidacion) {
                    const tag = document.createElement('span');
                    tag.className = 'tag';
                    tag.textContent = item.tipoValidacion;
                    metaDiv.appendChild(tag);
                }

                if (item.herramienta) {
                    const tag = document.createElement('span');
                    tag.className = 'tag';
                    tag.textContent = item.herramienta;
                    metaDiv.appendChild(tag);
                }

                if (item.criterio) {
                    const tag = document.createElement('span');
                    tag.className = 'tag';
                    tag.textContent = item.criterio;
                    metaDiv.appendChild(tag);
                }

                contentDiv.appendChild(metaDiv);
                itemDiv.appendChild(contentDiv);
                grupoDiv.appendChild(itemDiv);

                // Añadir event listener para el checkbox
                checkbox.addEventListener('change', (e) => {
                    localStorage.setItem(e.target.id, e.target.checked);
                    itemDiv.classList.toggle('checked', e.target.checked);
                    actualizarProgreso();
                    saveState();
                });
            });

            checklistContainer.appendChild(grupoDiv);
        });

        actualizarProgreso();
    }

    // Event listeners para filtros
    filterType.addEventListener('change', () => {
        renderizarChecklist(filterType.value, filterLevel.value);
        saveState();
    });

    filterLevel.addEventListener('change', () => {
        renderizarChecklist(filterType.value, filterLevel.value);
        saveState();
    });

    // Crear botones de exportar/importar
    const actionButtons = document.createElement('div');
    actionButtons.className = 'action-buttons';
    actionButtons.style.cssText = 'margin-top: 1rem; display: flex; gap: 1rem;';

    const exportButton = document.createElement('button');
    exportButton.textContent = 'Exportar Progreso';
    exportButton.className = 'action-button';
    exportButton.addEventListener('click', exportarProgreso);

    const importLabel = document.createElement('label');
    importLabel.className = 'action-button';
    importLabel.textContent = 'Importar Progreso';
    importLabel.style.cursor = 'pointer';

    const importInput = document.createElement('input');
    importInput.type = 'file';
    importInput.accept = '.json';
    importInput.style.display = 'none';
    importInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            const success = await importarProgreso(file);
            if (success) {
                alert('Progreso importado correctamente');
            } else {
                alert('Error al importar el progreso. Verifica el formato del archivo.');
            }
        }
    });

    importLabel.appendChild(importInput);
    actionButtons.appendChild(exportButton);
    actionButtons.appendChild(importLabel);
    document.querySelector('header').appendChild(actionButtons);

    // Intentar cargar el estado guardado al iniciar
    loadState();
});
