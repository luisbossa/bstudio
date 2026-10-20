/* ==========================================================================
   BStudio dashboard
   Builds the editing forms from SECTIONS, keeps the content in memory, renders
   a live preview and saves through the /api/content endpoints.
   ========================================================================== */

/*----------------- SCHEMA ----------------*/

const ICON_OPTIONS = [
  { value: "github", label: "GitHub" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "dribbble", label: "Dribbble" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "mail", label: "Email" },
  { value: "phone", label: "Teléfono" },
  { value: "pin", label: "Ubicación" },
];

const CROP_OPTIONS = [
  { value: "", label: "Sin recorte (video normal)" },
  { value: "mockup-500", label: "Quitar mockup · video de 500 px" },
  { value: "mockup-1080", label: "Quitar mockup · video de 1080 px" },
];

const RICH_HINT = "Pon *asteriscos* alrededor de las palabras que quieras resaltar.";

// Each section: fields with a `path` into the content. List fields describe
// their items with `fields` (keys relative to each item).
const SECTIONS = [
  {
    id: "general",
    title: "General",
    description: "Título de la pestaña, logo, favicon y CV descargable.",
    anchor: "#top",
    fields: [
      { path: "site.title", label: "Título de la pestaña" },
      { path: "site.description", label: "Descripción para Google", type: "textarea", rows: 2 },
      { path: "site.logo", label: "Logo (imagen opcional)", type: "image", hint: "Vacío: se muestra el logotipo de texto con el nombre de la marca." },
      { path: "site.favicon", label: "Favicon", type: "image" },
      { path: "site.cv", label: "CV (PDF)", type: "file", accept: "application/pdf" },
      { path: "footer.brand", label: "Nombre de la marca (pie de página)" },
      { path: "footer.backToTop", label: "Texto del botón “volver arriba”" },
    ],
  },
  {
    id: "theme",
    title: "Colores",
    description: "Los colores principales del sitio. Se aplican en toda la página.",
    anchor: "#top",
    fields: [
      { path: "theme.orange", label: "Acento (naranja)", type: "color" },
      { path: "theme.mate", label: "Tinta (oscuro)", type: "color" },
      { path: "theme.blue", label: "Fondo (azul claro)", type: "color" },
      { path: "theme.cream", label: "Crema", type: "color" },
      { path: "theme.light", label: "Papel (blanco)", type: "color" },
    ],
  },
  {
    id: "nav",
    title: "Menú",
    description: "Enlaces del menú superior.",
    anchor: "#top",
    fields: [
      {
        path: "nav",
        type: "list",
        itemName: "enlace",
        itemTitle: (item) => item.label,
        fields: [
          { key: "label", label: "Texto" },
          { key: "href", label: "Destino", hint: "#about, #experience, #projects, #tools, #process, #contact o una URL" },
          { key: "cta", label: "Mostrar como botón naranja", type: "checkbox" },
        ],
      },
    ],
  },
  {
    id: "intro",
    title: "Portada",
    description: "Título principal, tarjetas del hero y foto.",
    anchor: "#top",
    fields: [
      { path: "intro.eyebrow", label: "Etiqueta superior" },
      { path: "intro.title", label: "Título grande", hint: "Las palabras entre *asteriscos* van sobre la etiqueta naranja." },
      { path: "intro.headline", label: "Titular de la tarjeta", type: "textarea", rows: 2, hint: RICH_HINT },
      { path: "intro.paragraphs", label: "Párrafos", type: "strings", itemName: "párrafo" },
      { path: "intro.primaryButton", label: "Botón “ver proyectos”" },
      { path: "intro.cvButton", label: "Botón “descargar CV”" },
      { path: "intro.ctaText", label: "Texto de la tarjeta clara", type: "textarea", rows: 2 },
      { path: "intro.ctaButton", label: "Botón de contacto" },
      { path: "intro.statValue", label: "Número destacado" },
      { path: "intro.statLabel", label: "Texto del número" },
      { path: "intro.photo", label: "Foto", type: "image" },
      { path: "intro.photoAlt", label: "Descripción de la foto (accesibilidad)" },
      { path: "intro.bubble", label: "Globo de diálogo sobre la foto", hint: "Déjalo vacío para ocultarlo." },
      { path: "intro.badgeText", label: "Texto del sello giratorio", hint: "Termina con “•” para que el círculo cierre bien. Vacío para ocultarlo." },
      { path: "intro.followLabel", label: "Texto “síguenos”" },
      { path: "marquee.text", label: "Texto de la cinta naranja" },
    ],
  },
  {
    id: "about",
    title: "Sobre mí",
    anchor: "#about",
    fields: [
      { path: "about.title", label: "Título" },
      { path: "about.paragraphs", label: "Párrafos", type: "strings", multiline: true, itemName: "párrafo", hint: RICH_HINT },
      { path: "about.signature", label: "Firma", type: "image" },
    ],
  },
  {
    id: "experience",
    title: "Experiencia",
    anchor: "#experience",
    fields: [
      { path: "experienceSection.title", label: "Título de la sección" },
      { path: "experienceSection.nextLabel", label: "Botón al final de la línea", hint: "Vacío para ocultarlo." },
      {
        path: "experience",
        label: "Trabajos",
        type: "list",
        itemName: "trabajo",
        itemTitle: (item) => [item.year, item.role].filter(Boolean).join(" · "),
        fields: [
          { key: "role", label: "Puesto" },
          { key: "year", label: "Año" },
          { key: "company", label: "Empresa" },
          { key: "focus", label: "Especialidad (etiqueta)" },
          { key: "text", label: "Descripción", type: "textarea", rows: 4 },
        ],
      },
    ],
  },
  {
    id: "projects",
    title: "Proyectos",
    anchor: "#projects",
    fields: [
      { path: "projectsSection.title", label: "Título de la sección" },
      { path: "projectsSection.previewLabel", label: "Etiqueta sobre el video", hint: "Vacío para ocultarla." },
      {
        path: "projects",
        label: "Proyectos",
        type: "list",
        itemName: "proyecto",
        itemTitle: (item) => item.title,
        fields: [
          { key: "title", label: "Título" },
          { key: "label", label: "Texto del botón principal" },
          { key: "url", label: "Enlace al sitio" },
          { key: "repo", label: "Enlace a GitHub", hint: "Vacío para ocultar el botón." },
          { key: "video", label: "Video", type: "video" },
          { key: "videoCrop", label: "Recorte del video", type: "select", options: CROP_OPTIONS, hint: "Usa “quitar mockup” si la grabación ya trae su propia ventana de navegador." },
          { key: "mobileImage", label: "Imagen para móvil", type: "image", hint: "Se muestra en lugar del video en pantallas pequeñas." },
          { key: "points", label: "Puntos destacados", type: "strings", itemName: "punto" },
        ],
      },
    ],
  },
  {
    id: "technologies",
    title: "Tecnologías",
    anchor: "#tools",
    fields: [
      { path: "technologiesSection.title", label: "Título de la sección" },
      {
        path: "technologies",
        label: "Logos",
        type: "list",
        compact: true,
        itemName: "tecnología",
        itemTitle: (item) => item.name,
        fields: [
          { key: "name", label: "Nombre" },
          { key: "image", label: "Logo", type: "image" },
        ],
      },
    ],
  },
  {
    id: "process",
    title: "Proceso",
    anchor: "#process",
    fields: [
      { path: "processSection.title", label: "Título de la sección" },
      {
        path: "processSteps",
        label: "Pasos",
        type: "list",
        itemName: "paso",
        itemTitle: (item) => item.title,
        fields: [
          { key: "title", label: "Título" },
          { key: "text", label: "Texto", type: "textarea", rows: 3 },
        ],
      },
    ],
  },
  {
    id: "contact",
    title: "Contacto",
    anchor: "#contact",
    fields: [
      { path: "contactSection.title", label: "Título" },
      { path: "contactSection.lead", label: "Subtítulo" },
      { path: "contactSection.sticker", label: "Sticker del formulario", hint: "Vacío para ocultarlo." },
      { path: "contactSection.nameLabel", label: "Etiqueta “nombre”" },
      { path: "contactSection.namePlaceholder", label: "Ejemplo “nombre”" },
      { path: "contactSection.emailLabel", label: "Etiqueta “email”" },
      { path: "contactSection.emailPlaceholder", label: "Ejemplo “email”" },
      { path: "contactSection.messageLabel", label: "Etiqueta “mensaje”" },
      { path: "contactSection.messagePlaceholder", label: "Ejemplo “mensaje”" },
      { path: "contactSection.submitLabel", label: "Botón enviar" },
      { path: "contact.email", label: "Email (pie de página)" },
      { path: "contact.phone", label: "Teléfono visible" },
      { path: "contact.phoneHref", label: "Enlace del teléfono", hint: "Formato tel:+50600000000" },
      { path: "contact.address", label: "Dirección" },
      { path: "contact.mapsUrl", label: "Enlace a Google Maps" },
    ],
  },
  {
    id: "social",
    title: "Redes sociales",
    anchor: ".site-footer",
    fields: [
      {
        path: "social",
        type: "list",
        itemName: "red",
        itemTitle: (item) => item.name,
        fields: [
          { key: "name", label: "Nombre" },
          { key: "icon", label: "Ícono", type: "select", options: ICON_OPTIONS },
          { key: "url", label: "Enlace" },
          { key: "hero", label: "Mostrar en la portada", type: "checkbox" },
          { key: "footer", label: "Mostrar en el pie de página", type: "checkbox" },
          { key: "menu", label: "Mostrar en el menú móvil", type: "checkbox" },
        ],
      },
    ],
  },
];

/*----------------- STATE ----------------*/

const state = {
  content: null,
  defaults: null,
  section: SECTIONS[0].id,
  dirty: false,
  saving: false,
  openItems: new Set(),
};

const $ = (selector, root = document) => root.querySelector(selector);

// Always a fresh array: callers (setAt) mutate it.
const toPath = (path) => (Array.isArray(path) ? [...path] : path.split("."));

const getAt = (obj, path) => toPath(path).reduce((acc, key) => (acc == null ? acc : acc[key]), obj);

const setAt = (obj, path, value) => {
  const keys = toPath(path);
  const last = keys.pop();
  const target = keys.reduce((acc, key) => acc[key], obj);
  target[last] = value;
};

const pathKey = (path) => toPath(path).join(".");

// Empty item shaped like the first default item of a list.
const blankLike = (sample) => {
  if (typeof sample === "string") return "";
  if (typeof sample === "boolean") return false;
  if (Array.isArray(sample)) return [];
  if (sample && typeof sample === "object") {
    return Object.fromEntries(Object.entries(sample).map(([k, v]) => [k, blankLike(v)]));
  }
  return "";
};

/*----------------- HELPERS ----------------*/

const el = (tag, attrs = {}, ...children) => {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined || value === null || value === false) continue;
    if (key === "class") node.className = value;
    else if (key === "text") node.textContent = value;
    else if (key.startsWith("on")) node.addEventListener(key.slice(2), value);
    else node.setAttribute(key, value === true ? "" : value);
  }
  for (const child of children.flat()) {
    if (child == null || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(child));
  }
  return node;
};

let uid = 0;
const nextId = () => `f${++uid}`;

const toast = (message, type = "info") => {
  const item = el("div", { class: `toast toast--${type}`, role: "status" }, message);
  $("#toasts").append(item);
  setTimeout(() => item.classList.add("is-leaving"), 3200);
  setTimeout(() => item.remove(), 3600);
};

const api = async (url, options = {}) => {
  const response = await fetch(url, { credentials: "same-origin", ...options });
  if (response.status === 401) {
    window.location.href = "/dashboard/login";
    throw new Error("Sesión expirada");
  }
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await response.json() : await response.text();
  if (!response.ok) throw new Error(body?.error || body || `Error ${response.status}`);
  return body;
};

/*----------------- SAVE STATUS ----------------*/

const STATUS_TEXT = {
  loading: "Cargando…",
  saved: "Todo guardado",
  dirty: "Cambios sin guardar",
  saving: "Guardando…",
  error: "Error al guardar",
};

const setStatus = (status) => {
  const node = $("#save-status");
  node.dataset.state = status;
  node.textContent = STATUS_TEXT[status];
  $("#save-button").disabled = status === "saved" || status === "saving" || status === "loading";
};

const markDirty = () => {
  state.dirty = true;
  setStatus("dirty");
  schedulePreview();
};

/*----------------- FIELDS ----------------*/

const fieldShell = (def, id, control) =>
  el(
    "div",
    { class: `field${def.type === "checkbox" ? " field--checkbox" : ""}` },
    def.type === "checkbox" ? null : el("label", { class: "field__label", for: id }, def.label),
    control,
    def.hint ? el("p", { class: "field__hint" }, def.hint) : null
  );

const textField = (def, path) => {
  const id = nextId();
  const multiline = def.type === "textarea";
  const input = el(multiline ? "textarea" : "input", {
    id,
    class: "field__input",
    rows: multiline ? def.rows || 3 : undefined,
    type: multiline ? undefined : "text",
    placeholder: def.placeholder,
  });
  input.value = getAt(state.content, path) ?? "";
  input.addEventListener("input", () => {
    setAt(state.content, path, input.value);
    markDirty();
    if (def.onTitle) def.onTitle();
  });
  return fieldShell(def, id, input);
};

const checkboxField = (def, path) => {
  const id = nextId();
  const input = el("input", { id, type: "checkbox", class: "toggle__input" });
  input.checked = Boolean(getAt(state.content, path));
  input.addEventListener("change", () => {
    setAt(state.content, path, input.checked);
    markDirty();
  });
  return fieldShell(
    def,
    id,
    el("label", { class: "toggle", for: id }, input, el("span", { class: "toggle__track", "aria-hidden": "true" }), def.label)
  );
};

const selectField = (def, path) => {
  const id = nextId();
  const current = getAt(state.content, path) ?? "";
  const select = el(
    "select",
    { id, class: "field__input" },
    def.options.map((option) => el("option", { value: option.value }, option.label))
  );
  // Keep unknown saved values selectable instead of silently changing them.
  if (!def.options.some((o) => o.value === current)) {
    select.append(el("option", { value: current }, current || "—"));
  }
  select.value = current;
  select.addEventListener("change", () => {
    setAt(state.content, path, select.value);
    markDirty();
  });
  return fieldShell(def, id, select);
};

const colorField = (def, path) => {
  const id = nextId();
  const value = getAt(state.content, path) || "#000000";
  const picker = el("input", { id, type: "color", class: "color__picker", value });
  const hex = el("input", { type: "text", class: "field__input color__hex", value, maxlength: 7, "aria-label": `${def.label} (hex)` });
  const update = (color) => {
    setAt(state.content, path, color);
    markDirty();
  };
  picker.addEventListener("input", () => {
    hex.value = picker.value;
    update(picker.value);
  });
  hex.addEventListener("input", () => {
    if (/^#[0-9a-f]{6}$/i.test(hex.value)) {
      picker.value = hex.value;
      update(hex.value);
    }
  });
  return fieldShell(def, id, el("div", { class: "color" }, picker, hex));
};

const ACCEPT = {
  image: "image/webp,image/png,image/jpeg,image/gif,image/avif",
  video: "video/mp4,video/webm",
  file: "application/pdf",
};

const mediaPreview = (type, url) => {
  if (!url) return el("span", { class: "media__empty" }, "Sin archivo");
  if (type === "image") return el("img", { src: url, alt: "" });
  if (type === "video") return el("video", { src: `${url}#t=0.1`, muted: true, preload: "metadata" });
  return el("a", { href: url, target: "_blank", rel: "noopener" }, "Abrir archivo ↗");
};

const mediaField = (def, path) => {
  const id = nextId();
  const type = def.type;
  const preview = el("div", { class: `media__preview media__preview--${type}` });
  const input = el("input", { id, type: "text", class: "field__input", placeholder: "/ruta/o/https://…" });
  const fileInput = el("input", { type: "file", accept: def.accept || ACCEPT[type], hidden: true });
  const button = el("button", { type: "button", class: "btn btn--light btn--small" }, "Subir archivo");

  const show = () => preview.replaceChildren(mediaPreview(type, input.value));

  input.value = getAt(state.content, path) ?? "";
  show();

  input.addEventListener("change", () => {
    setAt(state.content, path, input.value.trim());
    show();
    markDirty();
  });

  button.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    if (!file) return;
    button.disabled = true;
    button.textContent = "Subiendo…";
    try {
      const body = new FormData();
      body.append("file", file);
      const { url } = await api("/api/upload", { method: "POST", body });
      input.value = url;
      setAt(state.content, path, url);
      show();
      markDirty();
      toast("Archivo subido", "success");
    } catch (error) {
      toast(`No se pudo subir: ${error.message}`, "error");
    } finally {
      button.disabled = false;
      button.textContent = "Subir archivo";
      fileInput.value = "";
    }
  });

  return fieldShell(
    def,
    id,
    el("div", { class: "media" }, preview, el("div", { class: "media__controls" }, input, button, fileInput))
  );
};

// List of plain strings (paragraphs, bullet points).
const stringsField = (def, path) => {
  const wrapper = el("div", { class: "field" });
  const render = () => {
    const items = getAt(state.content, path) || [];
    wrapper.replaceChildren(
      el("p", { class: "field__label" }, def.label),
      el(
        "div",
        { class: "strings" },
        items.map((value, index) => {
          const input = el(def.multiline ? "textarea" : "input", {
            class: "field__input",
            rows: def.multiline ? 3 : undefined,
            type: def.multiline ? undefined : "text",
            "aria-label": `${def.itemName} ${index + 1}`,
          });
          input.value = value;
          input.addEventListener("input", () => {
            items[index] = input.value;
            markDirty();
          });
          return el(
            "div",
            { class: "strings__row" },
            input,
            itemActions(items, index, render, def.itemName)
          );
        })
      ),
      el(
        "button",
        {
          type: "button",
          class: "btn btn--dashed",
          onclick: () => {
            items.push("");
            setAt(state.content, path, items);
            markDirty();
            render();
            wrapper.querySelector(".strings__row:last-child .field__input")?.focus();
          },
        },
        `+ Añadir ${def.itemName}`
      ),
      def.hint ? el("p", { class: "field__hint" }, def.hint) : null
    );
  };
  render();
  return wrapper;
};

// Move up / down / delete buttons shared by both list types.
const itemActions = (items, index, rerender, itemName, onMove) => {
  const move = (delta) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    [items[index], items[target]] = [items[target], items[index]];
    onMove?.(index, target);
    markDirty();
    rerender();
  };
  return el(
    "div",
    { class: "item-actions" },
    el("button", { type: "button", class: "icon-btn", title: "Subir", "aria-label": `Subir ${itemName}`, disabled: index === 0, onclick: (e) => { e.preventDefault(); move(-1); } }, "↑"),
    el("button", { type: "button", class: "icon-btn", title: "Bajar", "aria-label": `Bajar ${itemName}`, disabled: index === items.length - 1, onclick: (e) => { e.preventDefault(); move(1); } }, "↓"),
    el(
      "button",
      {
        type: "button",
        class: "icon-btn icon-btn--danger",
        title: "Eliminar",
        "aria-label": `Eliminar ${itemName}`,
        onclick: (e) => {
          e.preventDefault();
          if (!confirm(`¿Eliminar este ${itemName}?`)) return;
          items.splice(index, 1);
          markDirty();
          rerender();
        },
      },
      "✕"
    )
  );
};

// List of objects (projects, jobs, links...): one collapsible card per item.
const listField = (def, path) => {
  const wrapper = el("div", { class: `list${def.compact ? " list--compact" : ""}` });
  const key = pathKey(path);

  const render = () => {
    const items = getAt(state.content, path) || [];
    const cards = items.map((item, index) => {
      const openKey = `${key}.${index}`;
      const title = el("span", { class: "list-item__title" });
      const updateTitle = () => {
        title.textContent = def.itemTitle?.(item) || `${def.itemName} ${index + 1}`;
      };
      updateTitle();

      const details = el(
        "details",
        { class: "list-item", open: state.openItems.has(openKey) },
        el(
          "summary",
          { class: "list-item__summary" },
          el("span", { class: "list-item__index" }, String(index + 1).padStart(2, "0")),
          title,
          itemActions(items, index, render, def.itemName, (from, to) => {
            // Keep the open/closed state attached to the moved items.
            const a = state.openItems.has(`${key}.${from}`);
            const b = state.openItems.has(`${key}.${to}`);
            state.openItems[b ? "add" : "delete"](`${key}.${from}`);
            state.openItems[a ? "add" : "delete"](`${key}.${to}`);
          })
        ),
        el(
          "div",
          { class: "list-item__body" },
          def.fields.map((field) =>
            renderField({ ...field, onTitle: updateTitle }, [...toPath(path), index, field.key])
          )
        )
      );
      details.addEventListener("toggle", () => {
        state.openItems[details.open ? "add" : "delete"](openKey);
      });
      return details;
    });

    wrapper.replaceChildren(
      def.label ? el("p", { class: "field__label list__label" }, `${def.label} (${items.length})`) : null,
      ...cards,
      el(
        "button",
        {
          type: "button",
          class: "btn btn--dashed",
          onclick: () => {
            const sample = getAt(state.defaults, path)?.[0] ?? {};
            items.push(blankLike(sample));
            setAt(state.content, path, items);
            state.openItems.add(`${key}.${items.length - 1}`);
            markDirty();
            render();
            wrapper.querySelector(".list-item:last-of-type .field__input")?.focus();
          },
        },
        `+ Añadir ${def.itemName}`
      )
    );
  };

  render();
  return wrapper;
};

const renderField = (def, path) => {
  switch (def.type) {
    case "list":
      return listField(def, path);
    case "strings":
      return stringsField(def, path);
    case "checkbox":
      return checkboxField(def, path);
    case "select":
      return selectField(def, path);
    case "color":
      return colorField(def, path);
    case "image":
    case "video":
    case "file":
      return mediaField(def, path);
    default:
      return textField(def, path);
  }
};

/*----------------- SECTIONS ----------------*/

const renderNav = () => {
  $("#section-nav").replaceChildren(
    ...SECTIONS.map((section) =>
      el(
        "li",
        {},
        el(
          "button",
          {
            type: "button",
            class: `sidebar__link${section.id === state.section ? " is-active" : ""}`,
            "aria-current": section.id === state.section ? "page" : undefined,
            onclick: () => openSection(section.id),
          },
          section.title
        )
      )
    )
  );
};

const renderSection = () => {
  const section = SECTIONS.find((s) => s.id === state.section);
  $("#editor").replaceChildren(
    el(
      "header",
      { class: "editor__header" },
      el("h1", { class: "editor__title" }, section.title),
      section.description ? el("p", { class: "editor__description" }, section.description) : null
    ),
    el(
      "div",
      { class: "editor__card" },
      section.fields.map((field) => renderField(field, field.path))
    )
  );
};

const openSection = (id) => {
  state.section = id;
  history.replaceState(null, "", `#${id}`);
  renderNav();
  renderSection();
  $("#editor").scrollTop = 0;
  document.body.classList.remove("sidebar-open");
  $("#sidebar-toggle").setAttribute("aria-expanded", "false");
  scrollPreviewTo(SECTIONS.find((s) => s.id === id).anchor);
};

/*----------------- LIVE PREVIEW ----------------*/

const frame = $("#preview-frame");
let previewTimer = null;
let pendingAnchor = "#top";
let lastScroll = 0;

const isPreviewOpen = () => document.body.dataset.previewOpen === "true";

const refreshPreview = async () => {
  if (!isPreviewOpen() || !state.content) return;
  try {
    lastScroll = frame.contentWindow?.scrollY || lastScroll;
    const html = await api("/dashboard/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state.content),
    });
    frame.srcdoc = html;
  } catch (error) {
    toast(`Vista previa: ${error.message}`, "error");
  }
};

const schedulePreview = () => {
  clearTimeout(previewTimer);
  previewTimer = setTimeout(refreshPreview, 500);
};

const jumpInFrame = (doc, anchor) => {
  doc.documentElement.style.scrollBehavior = "auto";
  if (anchor === "#top") return frame.contentWindow.scrollTo(0, 0);
  const target = doc.querySelector(anchor);
  if (target) target.scrollIntoView({ block: "start" });
};

frame.addEventListener("load", () => {
  const doc = frame.contentDocument;
  // The initial about:blank load has an empty body: wait for the real page.
  if (!doc?.body?.childElementCount) return;
  if (pendingAnchor) {
    jumpInFrame(doc, pendingAnchor);
    pendingAnchor = null;
  } else {
    doc.documentElement.style.scrollBehavior = "auto";
    frame.contentWindow.scrollTo(0, lastScroll);
  }
  // Links inside the preview open in a new tab instead of replacing it.
  doc.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link) return;
    const href = link.getAttribute("href");
    if (href.startsWith("#")) {
      event.preventDefault();
      jumpInFrame(doc, href);
      return;
    }
    event.preventDefault();
    window.open(link.href, "_blank", "noopener");
  });
});

const scrollPreviewTo = (anchor) => {
  const doc = frame.contentDocument;
  if (doc?.body && doc.body.childElementCount) jumpInFrame(doc, anchor);
  else pendingAnchor = anchor;
};

// Scale the preview so a desktop-width page fits the panel.
const fitPreview = () => {
  const stage = $("#preview-stage");
  const width = stage.dataset.device === "mobile" ? 390 : 1280;
  const scale = Math.min(1, stage.clientWidth / width);
  frame.style.width = `${width}px`;
  frame.style.height = `${stage.clientHeight / scale}px`;
  frame.style.transform = `scale(${scale})`;
};

new ResizeObserver(fitPreview).observe($("#preview-stage"));

document.querySelectorAll("[data-device]").forEach((button) => {
  if (button.tagName !== "BUTTON") return;
  button.addEventListener("click", () => {
    $("#preview-stage").dataset.device = button.dataset.device;
    document.querySelectorAll("button[data-device]").forEach((b) => b.classList.toggle("is-active", b === button));
    fitPreview();
  });
});

$("#preview-toggle").addEventListener("click", () => {
  const open = !isPreviewOpen();
  document.body.dataset.previewOpen = String(open);
  $("#preview-toggle").setAttribute("aria-pressed", String(open));
  if (open) {
    fitPreview();
    refreshPreview();
  }
});

/*----------------- SAVE / RESET ----------------*/

const save = async () => {
  if (state.saving || !state.dirty) return;
  state.saving = true;
  setStatus("saving");
  try {
    const { content } = await api("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state.content),
    });
    state.content = content;
    state.dirty = false;
    setStatus("saved");
    toast("¡Cambios publicados!", "success");
  } catch (error) {
    setStatus("error");
    toast(`No se pudo guardar: ${error.message}`, "error");
  } finally {
    state.saving = false;
  }
};

$("#save-button").addEventListener("click", save);

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
    event.preventDefault();
    save();
  }
});

$("#reset-button").addEventListener("click", async () => {
  if (!confirm("Esto borra todos tus cambios guardados y vuelve al contenido original. ¿Continuar?")) return;
  try {
    const { content } = await api("/api/content", { method: "DELETE" });
    state.content = content;
    state.dirty = false;
    setStatus("saved");
    renderSection();
    refreshPreview();
    toast("Contenido restaurado", "success");
  } catch (error) {
    toast(`No se pudo restaurar: ${error.message}`, "error");
  }
  $(".more").open = false;
});

window.addEventListener("beforeunload", (event) => {
  if (state.dirty) event.preventDefault();
});

/*----------------- SIDEBAR (MOBILE) ----------------*/

$("#sidebar-toggle").addEventListener("click", () => {
  const open = document.body.classList.toggle("sidebar-open");
  $("#sidebar-toggle").setAttribute("aria-expanded", String(open));
});

/*----------------- INIT ----------------*/

const init = async () => {
  // Narrow screens start with the preview closed.
  if (window.matchMedia("(max-width: 1100px)").matches) {
    document.body.dataset.previewOpen = "false";
    $("#preview-toggle").setAttribute("aria-pressed", "false");
  }

  try {
    const { content, defaults } = await api("/api/content");
    state.content = content;
    state.defaults = defaults;
    const fromHash = window.location.hash.slice(1);
    if (SECTIONS.some((s) => s.id === fromHash)) {
      state.section = fromHash;
      pendingAnchor = SECTIONS.find((s) => s.id === fromHash).anchor;
    }
    setStatus("saved");
    renderNav();
    renderSection();
    fitPreview();
    refreshPreview();
  } catch (error) {
    $("#editor").replaceChildren(el("p", { class: "alert alert--error" }, `No se pudo cargar el contenido: ${error.message}`));
    setStatus("error");
  }
};

init();
