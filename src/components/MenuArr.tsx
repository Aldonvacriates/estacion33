export const MenuArr = [
  {
    menu: "Inicio",
    className: "sub-menu-down",
    ulClassName: "sub-menu",
    submenu: [
      { child: "Inicio 01", to: "/home-3" },
      { child: "Inicio 02", to: "/home-2" },
      { child: "Inicio 03", to: "/" },
    ],
  },
  {
    menu: "Paginas",
    className: "has-mega-menu",
    ulClassName: "mega-menu",
    submenu: [
      {
        child: "Paginas",
        subchild: [
          { children: "Nosotros", to: "/about-us" },
          { children: "Preguntas", to: "/faq" },
          { children: "Equipo", to: "/team" },
          { children: "Detalle del Equipo", to: "/team-detail" },
          { children: "Testimonios", to: "/testimonial" },
        ],
      },
      {
        child: "Paginas",
        subchild: [
          { children: "Servicios", to: "/services" },
          { children: "Detalle del Servicio", to: "/service-detail" },
          { children: "Error 404", to: "/error-404" },
          { children: "Proximamente", to: "/coming-soon" },
          { children: "En Mantenimiento", to: "/under-maintenance" },
          { children: "Galeria de Recursos", to: "/assets-gallery" },
        ],
      },
      {
        child: "Nuestros Menus",
        subchild: [
          { children: "Menu Estilo 1", to: "/our-menu-1" },
          { children: "Menu Estilo 2", to: "/our-menu-2" },
          { children: "Menu Estilo 3", to: "/our-menu-3" },
          { children: "Menu Estilo 4", to: "/our-menu-4" },
          { children: "Menu Estilo 5", to: "/our-menu-5" },
        ],
      },
    ],
  },
  {
    menu: "Tienda",
    className: "sub-menu-down",
    ulClassName: "sub-menu",
    submenu: [
      { child: "Tienda Estilo 1", to: "/shop-style-1" },
      { child: "Tienda Estilo 2", to: "/shop-style-2" },
      { child: "Carrito", to: "/shop-cart" },
      { child: "Favoritos", to: "/shop-wishlist" },
      { child: "Finalizar Compra", to: "/shop-checkout" },
      { child: "Detalle del Producto", to: "/product-detail" },
    ],
  },
  {
    menu: "Blog",
    className: "has-mega-menu",
    ulClassName: "mega-menu",
    submenu: [
      {
        child: "Blog en Cuadricula",
        subchild: [
          { children: "Blog Cuadricula 2", to: "/blog-grid-2" },
          { children: "Blog Cuadricula 3", to: "/blog-grid-3" },
          { children: "Cuadricula con Sidebar Izq.", to: "/blog-grid-left-sidebar" },
          {
            children: "Cuadricula con Sidebar Der.",
            to: "/blog-grid-right-sidebar",
          },
        ],
      },
      {
        child: "Blog en Lista",
        subchild: [
          { children: "Lista de Blog", to: "/blog-list" },
          {
            children: "Lista con Sidebar Izq.",
            to: "/blog-list-left-sidebar",
          },
          {
            children: "Lista con Sidebar Der.",
            to: "/blog-list-right-sidebar",
          },
          { children: "Lista con Ambos Sidebars", to: "/blog-both-sidebar" },
        ],
      },
      {
        child: "Blog Individual",
        subchild: [
          { children: "Detalle del Blog", to: "/blog-standard" },
          { children: "Blog Gutenberg Abierto", to: "/blog-open-gutenberg" },
          {
            children: "Detalle con Sidebar Izq.",
            to: "/blog-detail-left-sidebar",
          },
          {
            children: "Detalle con Sidebar Der.",
            to: "/blog-detail-right-sidebar",
          },
        ],
      },
      {
        child: "Blog en Mosaico",
        subchild: [
          { children: "Mosaico 3 Columnas", to: "/blog-grid-3-masonary" },
          { children: "Mosaico 4 Columnas", to: "/blog-grid-4-masonary" },
          { children: "Lista Ancha con Sidebar", to: "/blog-wide-list-sidebar" },
          { children: "Cuadricula Ancha con Sidebar", to: "/blog-wide-grid-sidebar" },
        ],
      },
    ],
  },
  { menu: "Contacto", to: "/contact-us" },
];
