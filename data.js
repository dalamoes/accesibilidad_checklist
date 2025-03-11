const checklistData = [
    {
        tipo: "Contenidos",
        items: [
            {
                titulo: "Utilice un lenguaje sencillo y evite figuras retóricas, modismos y metáforas complicadas.",
                tipoValidacion: "Manual",
                norma: "WCAG",
                nivel: "AAA",
                criterio: "3.1.5 Reading Level"
            },
            {
                titulo: "Asegúrese de que el contenido de los elementos <button>, <a> y <label> sea único.",
                tipoValidacion: "Automatizado",
                herramienta: "IBM",
                equipos: "Contenidos",
                norma: "WCAG",
                nivel: "A",
                criterio: "1.3.1 Info and Relationships"
            },
            {
                titulo: "Asegúrese que existan técnicas para dar información a lectores de pantalla",
                tipoValidacion: "Automatizado",
                herramienta: "IBM",
                equipos: "Maqueta",
                norma: "WCAG",
                nivel: "A",
                criterio: "1.3.1 Info and Relationships"
            },
            {
                titulo: "Asegúrese de que el contenido de los elementos <button>, <a> y <label> sea descriptivo.",
                tipoValidacion: "Manual",
                herramienta: "IBM",
                equipos: "Contenidos",
                norma: "WCAG",
                nivel: "A",
                criterio: "1.3.1 Info and Relationships"
            },
            {
                titulo: "Utilice texto alineado a la izquierda para idiomas de izquierda a derecha (LTR) y texto alineado a la derecha para idiomas de derecha a izquierda (RTL).",
                tipoValidacion: "Manual",
                norma: "WCAG",
                nivel: "AAA",
                criterio: "1.4.8 Visual Presentation"
            },
            {
                titulo: "Asegúrese que una línea de texto no contenga más de 80 caracteres.",
                tipoValidacion: "Manual",
                norma: "WCAG",
                nivel: "AAA",
                criterio: "1.4.8 Visual Presentation"
            }
        ]
    },
    {
        tipo: "Código",
        items: [
            {
                titulo: "Valide su HTML.",
                tipoValidacion: "Automatizado",
                norma: "WCAG",
                nivel: "DEPRECATED",
                criterio: "4.1.1 Parsing"
            },
            {
                titulo: "Utilice un atributo lang en el elemento html.",
                tipoValidacion: "Automatizado",
                norma: "WCAG",
                nivel: "A",
                criterio: "3.1.1 Language of Page"
            },
            {
                titulo: "Idioma del contenido",
                tipoValidacion: "Manual",
                norma: "WCAG",
                nivel: "AA",
                criterio: "3.1.1 Language of Parts"
            },
            {
                titulo: "Proporcione un título único para cada página o vista.",
                tipoValidacion: "Manual",
                equipos: "Contenidos",
                norma: "WCAG",
                nivel: "A",
                criterio: "2.4.2 Page Titled"
            },
            {
                titulo: "Asegúrese de que el zoom del viewport no esté deshabilitado.",
                tipoValidacion: "Manual",
                norma: "WCAG",
                nivel: "AA",
                criterio: "1.4.4 Resize text"
            },
            {
                titulo: "Utilice etiquetas semánticas de manera precisa y coherente.",
                tipoValidacion: "Automatizado",
                norma: "WCAG",
                nivel: "A",
                criterio: "4.1.2 Name, Role, Value"
            }
        ]
    },
    {
        tipo: "Teclado",
        items: [
            {
                titulo: "Asegúrese de que haya un estilo de enfoque visible para los elementos interactivos a los que se accede mediante la entrada del teclado.",
                tipoValidacion: "Manual",
                norma: "WCAG",
                nivel: "AA",
                criterio: "2.4.7 Focus Visible"
            },
            {
                titulo: "Verifique que el orden de enfoque del teclado coincida con el diseño visual.",
                tipoValidacion: "Manual",
                norma: "WCAG",
                nivel: "A",
                criterio: "1.3.2 Meaningful Sequence"
            },
            {
                titulo: "Asegúrese que elementos que estén invisibles no puedan recibir el foco.",
                tipoValidacion: "Manual",
                norma: "WCAG",
                nivel: "A",
                criterio: "2.4.3 Focus Order"
            }
        ]
    },
    {
        tipo: "Imágenes",
        items: [
            {
                titulo: "Asegúrese de que todos los elementos img tengan un atributo alt.",
                tipoValidacion: "Automatizado",
                norma: "WCAG",
                nivel: "A",
                criterio: "1.1.1 Non-text Content"
            },
            {
                titulo: "Asegúrese de que la imagen alt no decorativa tenga valor correcto para su contexto.",
                tipoValidacion: "Manual",
                norma: "WCAG",
                nivel: "A",
                criterio: "1.1.1 Non-text Content"
            },
            {
                titulo: "Asegúrese de que las imágenes decorativas utilicen valores de atributo alt vacíos.",
                tipoValidacion: "Manual",
                norma: "WCAG",
                nivel: "A",
                criterio: "1.1.1 Non-text Content"
            }
        ]
    },
    {
        tipo: "Formularios",
        items: [
            {
                titulo: "Todas los <input> de un <form> están asociados un <label>.",
                tipoValidacion: "Automatizado",
                norma: "WCAG",
                nivel: "A",
                criterio: "3.2.2 On Input"
            },
            {
                titulo: "Utilice los elementos <fieldset> y <legend> cuando sea apropiado.",
                tipoValidacion: "Automatizado",
                herramienta: "IBM",
                norma: "WCAG",
                nivel: "A",
                criterio: "1.3.1 Info and Relationships"
            },
            {
                titulo: "Utiliza autocompletar en <input> cuando sea apropiado.",
                tipoValidacion: "Manual",
                norma: "WCAG",
                nivel: "AA",
                criterio: "1.3.5 Identify Input Purpose"
            }
        ]
    },
    {
        tipo: "Contraste colores",
        items: [
            {
                titulo: "Verifique el contraste para todo el texto de tamaño normal.",
                tipoValidacion: "Automatizado",
                equipos: "Maqueta",
                norma: "WCAG",
                nivel: "AA",
                criterio: "1.4.3 Contrast"
            },
            {
                titulo: "Verifique el contraste para todo el texto de tamaño grande.",
                tipoValidacion: "Automatizado",
                equipos: "Maqueta",
                norma: "WCAG",
                nivel: "AA",
                criterio: "1.4.3 Contrast"
            },
            {
                titulo: "Verifique el contraste de todos los íconos.",
                tipoValidacion: "Automatizado",
                equipos: "Maqueta",
                norma: "WCAG",
                nivel: "AA",
                criterio: "1.4.11 Non-text Contrast"
            }
        ]
    },
    {
        tipo: "Mobile & Touch",
        items: [
            {
                titulo: "Verifique que el sitio pueda rotarse a cualquier orientación.",
                tipoValidacion: "Manual",
                equipos: "Maqueta",
                norma: "WCAG",
                nivel: "AA",
                criterio: "1.3.4 Orientation"
            },
            {
                titulo: "Eliminar scroll horizontal.",
                tipoValidacion: "Manual",
                equipos: "Maqueta",
                norma: "WCAG",
                nivel: "AA",
                criterio: "1.4.10 Reflow"
            },
            {
                titulo: "Asegúrese de que los íconos de botones y enlaces se puedan activar con facilidad.",
                tipoValidacion: "Manual",
                equipos: "Diseño",
                norma: "WCAG",
                nivel: "AAA",
                criterio: "2.5.5 Target Size (enhanced)"
            }
        ]
    }
];

// Función para obtener todos los tipos únicos
function getTiposUnicos() {
    return [...new Set(checklistData.map(group => group.tipo))];
}

// Función para obtener todos los niveles únicos
function getNivelesUnicos() {
    const niveles = new Set();
    checklistData.forEach(group => {
        group.items.forEach(item => {
            if (item.nivel) niveles.add(item.nivel);
        });
    });
    return [...niveles];
}
