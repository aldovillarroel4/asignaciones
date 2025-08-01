// Datos de ejemplo
let asignaciones = [
    {
        id: 1,
        nombre: "Juan Pérez García",
        privilegio: "Anciano",
        designacion: "Superintendente de Circuito",
        sup_depto: "México Norte",
        cgs: true,
        aud: true,
        vid: true,
        mic: false,
        atp: true,
        aco: false,
        pue: true,
        pre_es: true,
        tdb: false,
        pe_e: true,
        nvc: false,
        l_lib: true,
        ebc: false,
        ora: true,
        pre_fs: false,
        l_ata: true,
        d_pub: true,
        d_pub_f: false,
        ultima_asignacion: "Superintendente de Circuito",
        fecha_ult_asignacion: "2024-01-15"
    },
    {
        id: 2,
        nombre: "María López Hernández",
        privilegio: "Siervo Ministerial",
        designacion: "Precursor Regular",
        sup_depto: "Guadalajara",
        cgs: false,
        aud: true,
        vid: false,
        mic: true,
        atp: false,
        aco: true,
        pue: false,
        pre_es: false,
        tdb: true,
        pe_e: false,
        nvc: true,
        l_lib: false,
        ebc: true,
        ora: false,
        pre_fs: true,
        l_ata: false,
        d_pub: true,
        d_pub_f: true,
        ultima_asignacion: "Precursor Regular",
        fecha_ult_asignacion: "2024-02-20"
    }
];

let currentEditId = null;
let sortDirection = {};

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    renderTable();
    document.getElementById('searchInput').addEventListener('input', filterTable);
    document.getElementById('asignacionForm').addEventListener('submit', handleSubmit);
});

function renderTable(data = asignaciones) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.dataset.id = row.id;
        tr.innerHTML = `
            <td class="editable-cell" data-field="nombre">${row.nombre}</td>
            <td class="editable-cell" data-field="privilegio">${row.privilegio}</td>
            <td class="editable-cell" data-field="designacion">${row.designacion}</td>
            <td class="editable-cell" data-field="sup_depto">${row.sup_depto}</td>
            <td class="checkbox-cell editable-cell" data-field="cgs">${row.cgs ? '<i class="fas fa-check"></i>' : ''}</td>
            <td class="checkbox-cell editable-cell" data-field="aud">${row.aud ? '<i class="fas fa-check"></i>' : ''}</td>
            <td class="checkbox-cell editable-cell" data-field="vid">${row.vid ? '<i class="fas fa-check"></i>' : ''}</td>
            <td class="checkbox-cell editable-cell" data-field="mic">${row.mic ? '<i class="fas fa-check"></i>' : ''}</td>
            <td class="checkbox-cell editable-cell" data-field="atp">${row.atp ? '<i class="fas fa-check"></i>' : ''}</td>
            <td class="checkbox-cell editable-cell" data-field="aco">${row.aco ? '<i class="fas fa-check"></i>' : ''}</td>
            <td class="checkbox-cell editable-cell" data-field="pue">${row.pue ? '<i class="fas fa-check"></i>' : ''}</td>
            <td class="checkbox-cell editable-cell" data-field="pre_es">${row.pre_es ? '<i class="fas fa-check"></i>' : ''}</td>
            <td class="checkbox-cell editable-cell" data-field="tdb">${row.tdb ? '<i class="fas fa-check"></i>' : ''}</td>
            <td class="checkbox-cell editable-cell" data-field="pe_e">${row.pe_e ? '<i class="fas fa-check"></i>' : ''}</td>
            <td class="checkbox-cell editable-cell" data-field="nvc">${row.nvc ? '<i class="fas fa-check"></i>' : ''}</td>
            <td class="checkbox-cell editable-cell" data-field="l_lib">${row.l_lib ? '<i class="fas fa-check"></i>' : ''}</td>
            <td class="checkbox-cell editable-cell" data-field="ebc">${row.ebc ? '<i class="fas fa-check"></i>' : ''}</td>
            <td class="checkbox-cell editable-cell" data-field="ora">${row.ora ? '<i class="fas fa-check"></i>' : ''}</td>
            <td class="checkbox-cell editable-cell" data-field="pre_fs">${row.pre_fs ? '<i class="fas fa-check"></i>' : ''}</td>
            <td class="checkbox-cell editable-cell" data-field="l_ata">${row.l_ata ? '<i class="fas fa-check"></i>' : ''}</td>
            <td class="checkbox-cell editable-cell" data-field="d_pub">${row.d_pub ? '<i class="fas fa-check"></i>' : ''}</td>
            <td class="checkbox-cell editable-cell" data-field="d_pub_f">${row.d_pub_f ? '<i class="fas fa-check"></i>' : ''}</td>
            <td class="editable-cell" data-field="ultima_asignacion">${row.ultima_asignacion}</td>
            <td class="action-buttons">
                <button class="edit-btn" onclick="enableEditing(${row.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="save-btn" style="display: none;" onclick="saveEditing(${row.id})" title="Guardar">
                    <i class="fas fa-save"></i>
                </button>
                <button class="delete-btn" onclick="deleteAsignacion(${row.id})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function enableEditing(id) {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (!row) return;

    // Hide edit button and show save button
    row.querySelector('.edit-btn').style.display = 'none';
    row.querySelector('.save-btn').style.display = 'inline-flex';

    const cells = row.querySelectorAll('.editable-cell');
    cells.forEach(cell => {
        const field = cell.dataset.field;
        const currentValue = cell.textContent.trim();
        const asignacion = asignaciones.find(a => a.id === id);

        if (['cgs', 'aud', 'vid', 'mic', 'atp', 'aco', 'pue', 'pre_es', 'tdb', 'pe_e', 'nvc', 'l_lib', 'ebc', 'ora', 'pre_fs', 'l_ata', 'd_pub', 'd_pub_f'].includes(field)) {
            // Checkbox fields
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = asignacion[field];
            checkbox.style.transform = 'scale(1.5)';
            cell.innerHTML = '';
            cell.appendChild(checkbox);
        } else if (field === 'privilegio') {
            const select = document.createElement('select');
            const options = ['Anciano', 'S. Ministerial', 'Publicador', 'Pub. No Bautizado', 'No Asignar'];
            options.forEach(option => {
                const optionEl = document.createElement('option');
                optionEl.value = option;
                optionEl.textContent = option;
                if (option === currentValue) optionEl.selected = true;
                select.appendChild(optionEl);
            });
            cell.innerHTML = '';
            cell.appendChild(select);
        } else if (field === 'designacion') {
            const select = document.createElement('select');
            const options = ['', 'Precursor Auxiliar', 'Precursor Regular'];
            options.forEach(option => {
                const optionEl = document.createElement('option');
                optionEl.value = option;
                optionEl.textContent = option;
                if (option === currentValue) optionEl.selected = true;
                select.appendChild(optionEl);
            });
            cell.innerHTML = '';
            cell.appendChild(select);
        } else if (field === 'sup_depto') {
            const select = document.createElement('select');
            const options = ['', 'Coordinador', 'Secretario', 'S. Servicios', 'Vida y Ministerio', 'Atalaya', 'Consejero Aux.', 'Aux. Vida y Ministerio', 'Publicaciones', 'Territorios', 'Audio-Video', 'Exhibidor', 'Literatura', 'Contabilidad', 'Aux. Contabilidad', 'Aseo / Mantenimiento'];
            options.forEach(option => {
                const optionEl = document.createElement('option');
                optionEl.value = option;
                optionEl.textContent = option;
                if (option === currentValue) optionEl.selected = true;
                select.appendChild(optionEl);
            });
            cell.innerHTML = '';
            cell.appendChild(select);
        } else if (field === 'fecha_ult_asignacion') {
            const input = document.createElement('input');
            input.type = 'date';
            input.value = asignacion[field];
            cell.innerHTML = '';
            cell.appendChild(input);
        } else {
            // Text fields
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentValue;
            input.style.width = '100%';
            input.style.padding = '4px';
            cell.innerHTML = '';
            cell.appendChild(input);
        }
    });
}

function saveEditing(id) {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (!row) return;

    const cells = row.querySelectorAll('.editable-cell');
    const updatedData = { id: id };

    cells.forEach(cell => {
        const field = cell.dataset.field;
        let value;

        if (['cgs', 'aud', 'vid', 'mic', 'atp', 'aco', 'pue', 'pre_es', 'tdb', 'pe_e', 'nvc', 'l_lib', 'ebc', 'ora', 'pre_fs', 'l_ata', 'd_pub', 'd_pub_f'].includes(field)) {
            // Checkbox fields
            const checkbox = cell.querySelector('input[type="checkbox"]');
            value = checkbox.checked;
        } else if (['privilegio', 'designacion', 'sup_depto'].includes(field)) {
            // Select fields
            const select = cell.querySelector('select');
            value = select.value;
        } else if (field === 'fecha_ult_asignacion') {
            const input = cell.querySelector('input[type="date"]');
            value = input.value;
        } else {
            // Text fields
            const input = cell.querySelector('input[type="text"]');
            value = input.value;
        }

        updatedData[field] = value;
    });

    // Update the data
    const index = asignaciones.findIndex(a => a.id === id);
    if (index !== -1) {
        asignaciones[index] = { ...asignaciones[index], ...updatedData };
    }

    // Re-render the table to show the updated data
    renderTable();
}

function filterTable() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filtered = asignaciones.filter(row =>
        row.nombre.toLowerCase().includes(searchTerm) ||
        row.privilegio.toLowerCase().includes(searchTerm) ||
        row.designacion.toLowerCase().includes(searchTerm) ||
        row.sup_depto.toLowerCase().includes(searchTerm)
    );
    renderTable(filtered);
}

function sortTable(columnIndex) {
    const columns = ['nombre', 'privilegio', 'designacion', 'sup_depto'];
    const column = columns[columnIndex];
    
    if (!column) return;

    sortDirection[column] = !sortDirection[column];

    const sorted = [...asignaciones].sort((a, b) => {
        const aVal = a[column].toLowerCase();
        const bVal = b[column].toLowerCase();
        
        if (sortDirection[column]) {
            return aVal.localeCompare(bVal);
        } else {
            return bVal.localeCompare(aVal);
        }
    });

    renderTable(sorted);
}

function openAddModal() {
    currentEditId = null;
    document.getElementById('modalTitle').textContent = 'Nuevo Registro';
    document.getElementById('asignacionForm').reset();
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('asignacionForm').reset();
    currentEditId = null;
}

function editAsignacion(id) {
    const asignacion = asignaciones.find(a => a.id === id);
    if (!asignacion) return;

    currentEditId = id;
    document.getElementById('modalTitle').textContent = 'Editar Asignación';
    
    // Llenar el formulario
    const form = document.getElementById('asignacionForm');
    Object.keys(asignacion).forEach(key => {
        const input = form.elements[key];
        if (input) {
            if (input.type === 'checkbox') {
                input.checked = asignacion[key];
            } else {
                input.value = asignacion[key];
            }
        }
    });

    document.getElementById('modal').style.display = 'block';
}

function deleteAsignacion(id) {
    if (confirm('¿Está seguro de eliminar esta asignación?')) {
        asignaciones = asignaciones.filter(a => a.id !== id);
        renderTable();
    }
}

function handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const asignacion = {};
    
    // Mapear campos del formulario
    const fields = ['nombre', 'privilegio', 'designacion', 'sup_depto', 'ultima_asignacion', 'fecha_ult_asignacion'];
    const checkboxes = ['cgs', 'aud', 'vid', 'mic', 'atp', 'aco', 'pue', 'pre_es', 'tdb', 'pe_e', 'nvc', 'l_lib', 'ebc', 'ora', 'pre_fs', 'l_ata', 'd_pub', 'd_pub_f'];
    
    fields.forEach(field => {
        asignacion[field] = formData.get(field) || '';
    });
    
    checkboxes.forEach(field => {
        asignacion[field] = formData.get(field) === 'on';
    });
    
    if (currentEditId) {
        // Editar
        const index = asignaciones.findIndex(a => a.id === currentEditId);
        asignacion.id = currentEditId;
        asignaciones[index] = asignacion;
    } else {
        // Agregar
        asignacion.id = Math.max(...asignaciones.map(a => a.id)) + 1;
        asignaciones.push(asignacion);
    }
    
    renderTable();
    closeModal();
}

function exportTable() {
    const dataStr = JSON.stringify(asignaciones, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'asignaciones_backup.json';
    link.click();
}

function importTable(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (Array.isArray(importedData)) {
                asignaciones = importedData;
                renderTable();
                alert('Datos cargados correctamente');
            } else {
                alert('El archivo no contiene datos válidos');
            }
        } catch (error) {
            alert('Error al cargar el archivo: formato inválido');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
};