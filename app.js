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
    let originalExcelData = null;
    let originalFile = null;
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

    // Función para guardar el progreso en Excel
    function guardarProgreso() {
        if (!originalExcelData || !checklistData || !originalFile) {
            alert('No hay datos para guardar');
            return;
        }

        try {
            const workbook = XLSX.utils.book_new();
            const data = [];
            const headers = ['Checked', 'Tipo', 'Título', 'Tipo validación', 'Herramienta', 'Equipos', 'Norma', 'Nivel', 'Criterio'];
            
            // Obtenemos todos los elementos checkbox en el DOM
            const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
            const checkedMap = {};
            
            // Creamos un mapa de los checkboxes marcados
            checkboxes.forEach(checkbox => {
                checkedMap[checkbox.id] = checkbox.checked;
            });
            
            // Para cada grupo e item, verificamos si su checkbox correspondiente está marcado
            checklistData.forEach(grupo => {
                grupo.items.forEach(item => {
                    const rowData = {};
                    // Usamos un ID único para cada fila
                    const elementId = `item_${item.uniqueId}`;
                    
                    // Verificamos si este elemento específico está marcado
                    rowData['Checked'] = checkedMap[elementId] ? 'X' : '';
                    
                    rowData['Tipo'] = grupo.tipo;
                    rowData['Título'] = item.titulo;
                    rowData['Tipo validación'] = item.tipoValidacion;
                    rowData['Herramienta'] = item.herramienta;
                    rowData['Equipos'] = item.equipos;
                    rowData['Norma'] = item.norma;
                    rowData['Nivel'] = item.nivel;
                    rowData['Criterio'] = item.criterio;
                    data.push(rowData);
                });
            });
            
            const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Progress');
            XLSX.writeFile(workbook, 'progress.xlsx');
            alert('Archivo guardado como: progress.xlsx');
        } catch (error) {
            console.error('Error al guardar:', error);
            alert('Error al guardar el archivo. Por favor, intenta de nuevo.');
        }
    }

    // Procesar archivo Excel
    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            originalFile = file;
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            // Guardar datos originales
            originalExcelData = jsonData;

            // Limpiar localStorage primero para quitar checkboxes anteriores
            clearCheckboxStorage();

            // Asignar IDs únicos a cada fila
            jsonData.forEach((row, index) => {
                row.uniqueId = `row_${index}`;
            });
            
            // Procesar datos y agrupar por tipo
            checklistData = procesarDatosExcel(jsonData);
            
            // Si hay columna Checked, restaurar estado
            if (jsonData[0] && ('Checked' in jsonData[0] || 'checked' in jsonData[0])) {
                const checkedKey = 'Checked' in jsonData[0] ? 'Checked' : 'checked';
                
                jsonData.forEach(row => {
                    const isChecked = row[checkedKey] === 'X';
                    localStorage.setItem(`item_${row.uniqueId}`, isChecked ? 'true' : 'false');
                });
            }

            fileName.textContent = file.name;
            
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

    // Función para limpiar localStorage de checkboxes anteriores
    function clearCheckboxStorage() {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('item_')) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
    }

    // Función para exportar el progreso como Excel
    function exportarProgreso() {
        if (!originalExcelData || !checklistData) {
            alert('No hay datos para exportar');
            return;
        }

        // Crear una copia de los datos originales
        const excelData = originalExcelData.map(row => ({...row}));

        // Crear un mapa de checkboxes marcados
        const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
        const checkedMap = {};
        
        checkboxes.forEach(checkbox => {
            checkedMap[checkbox.id] = checkbox.checked;
        });

        // Marcar las filas activas con 'X'
        let index = 0;
        excelData.forEach(row => {
            const uniqueId = `row_${index}`;
            row.Checked = checkedMap[`item_${uniqueId}`] ? 'X' : '';
            index++;
        });

        // Crear un nuevo libro de Excel
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(excelData);

        // Añadir la hoja al libro
        XLSX.utils.book_append_sheet(wb, ws, "Checklist");

        // Generar nombre del archivo sin _TEMP
        const originalName = fileName.textContent.replace('.xlsx', '');
        const exportName = `${originalName}_${new Date().toISOString().slice(0, 10)}.xlsx`;

        // Guardar el archivo
        XLSX.writeFile(wb, exportName);
    }

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
                uniqueId: row.uniqueId, // Usar el ID único ya asignado
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
        const completedItems = document.querySelectorAll('.checklist-item.checked').length;
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
                
                // Usar el ID único para cada item
                const itemId = `item_${item.uniqueId}`;
                
                if (localStorage.getItem(itemId) === 'true') {
                    itemDiv.classList.add('checked');
                }

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = itemId; // Usar el ID único
                checkbox.checked = localStorage.getItem(itemId) === 'true';
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

    // Crear botón de guardar progreso
    const actionButtons = document.createElement('div');
    actionButtons.className = 'action-buttons';
    actionButtons.style.cssText = 'margin-top: 1rem; display: flex; gap: 1rem;';

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Guardar Progreso';
    saveButton.className = 'action-button';
    saveButton.addEventListener('click', guardarProgreso);

    actionButtons.appendChild(saveButton);
    document.querySelector('header').appendChild(actionButtons);

    // Intentar cargar el estado guardado al iniciar
    loadState();
});