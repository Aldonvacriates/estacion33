import { useState } from "react";
import { IMAGES } from "../constent/theme";
import Rate from "rsuite/Rate";

const navItems = [
  { icon: "icon-globe", title: "Descripción" },
  { icon: "icon-image", title: "Información Adicional" },
  { icon: "icon-settings", title: "Reseñas del Producto" },
];

const ProductDetailTabs = () => {
  const [tabActive, setTabActive] = useState<number>(0);
  return (
    <div className="content-inner pt-0">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <ul className="nav nav-tabs tabs-style-1">
              {navItems.map(({ icon, title }, ind) => (
                <li className="nav-item" key={ind}>
                  <button
                    onClick={() => {
                      setTabActive(ind);
                    }}
                    className={`nav-link ${tabActive === ind ? "active" : ""}`}
                  >
                    <i className={icon}></i>
                    <span className="d-none d-md-inline-block m-l10">
                      {title}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="tab-content">
              {tabActive === 0 && <TabOne />}
              {tabActive === 1 && <TabTwo />}
              {tabActive === 2 && <TabThree />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailTabs;

export function TabOne() {
  return (
    <>
      <div id="web-design-1" className="tab-pane active">
        <p className="m-b10">
          Hay muchas variaciones de pasajes de Lorem Ipsum disponibles, pero la
          mayoria han sufrido alteraciones de alguna forma, por humor insertado
          o palabras aleatorias que no parecen ni un poco creibles. Si vas a
          usar un pasaje de Lorem Ipsum, necesitas asegurarte de que no haya
          nada escondido en medio del texto.
        </p>
        <p>
          Texto de ejemplo para describir el producto y sus principales
          características. Puedes reemplazar este párrafo con información real
          del menú.
        </p>
        <ul className="list-check primary">
          <li>
            Debo explicarte como surgio esta idea equivocada de denunciar el
            placer y elogiar el dolor, y te dare un relato completo del
            sistema, y{" "}
          </li>
          <li>
            Lorem Ipsum es texto de relleno de la industria de la impresión y
            la tipografía. Lorem Ipsum ha sido el texto estándar desde la
            década de 1500, cuando un impresor desconocido tomo una galera de
            tipos y los mezclo para hacer un libro de muestras.{" "}
          </li>
        </ul>
      </div>
    </>
  );
}
export function TabTwo() {
  return (
    <>
      <div
        id="graphic-design-1"
        className="tab-pane active show"
        role="tabpanel"
      >
        <table className="table-bordered check-tbl">
          <tbody>
            <tr>
              <td>Hamburguesa con Queso</td>
              <td>Pequena, Mediana y Grande</td>
            </tr>
            <tr>
              <td>Aderezos</td>
              <td>Cebolla, Tomate, Aceitunas</td>
            </tr>
            <tr>
              <td>Calificación</td>
              <td>
                <span className="rating-bx">
                  <i className="fas  fa-star m-r5 text-secondary"></i>
                  <i className="fas  fa-star m-r5 text-secondary"></i>
                  <i className="fas  fa-star m-r5 text-secondary"></i>
                  <i className="fas  fa-star m-r5 text-secondary"></i>
                  <i className="far  fa-star m-r5 text-secondary"></i>
                </span>
              </td>
            </tr>
            <tr>
              <td>Costo de Envío</td>
              <td>Envío Gratis</td>
            </tr>
            <tr>
              <td>Agregar Más</td>
              <td>Coca Cola, Queso, Lava de Chocolate</td>
            </tr>
            <tr>
              <td>Tiempo de Entrega</td>
              <td>30 min</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
export function TabThree() {
  return (
    <>
      <div id="developement-1" className="tab-pane active">
        <div className="comments-area" id="comments">
          <ul className="comment-list">
            <li className="comment">
              <div className="comment-body">
                <div className="comment-author vcard">
                  <img
                    className="avatar photo"
                    src={IMAGES.testimonial_mini_pic1}
                    alt="/"
                  />
                  <cite className="fn">Monsur Rahman Lito</cite>
                </div>
                <div className="star-rating">
                  <i className="fas fa-star m-r5 text-secondary"></i>
                  <i className="fas fa-star m-r5 text-secondary"></i>
                  <i className="far fa-star m-r5 text-secondary"></i>
                  <i className="far fa-star m-r5 text-secondary"></i>
                  <i className="far fa-star text-secondary"></i>
                </div>
                <p>
                  Lorem Ipsum es texto de relleno de la industria de la
                  impresión y la tipografía. Lorem Ipsum ha sido el texto
                  estándar desde la década de 1500, cuando un impresor
                  desconocido tomo una galera de tipos y los mezclo para hacer
                  un libro de muestras.
                </p>
              </div>
            </li>
            <li className="comment">
              <div className="comment-body">
                <div className="comment-author vcard">
                  <img
                    className="avatar photo"
                    src={IMAGES.testimonial_mini_pic2}
                    alt="/"
                  />
                  <cite className="fn">Jake Johnson</cite>
                </div>
                <div className="star-rating" data-rating="3">
                  <i className="fas  fa-star m-r5 text-secondary"></i>
                  <i className="fas  fa-star m-r5 text-secondary"></i>
                  <i className="fas  fa-star m-r5 text-secondary"></i>
                  <i className="far  fa-star m-r5 text-secondary"></i>
                  <i className="far  fa-star m-r5 text-secondary"></i>
                </div>
                <p>
                  Lorem Ipsum es texto de relleno de la industria de la
                  impresión y la tipografía. Lorem Ipsum ha sido el texto
                  estándar desde la década de 1500, cuando un impresor
                  desconocido tomo una galera de tipos y los mezclo para hacer
                  un libro de muestras.
                </p>
              </div>
            </li>
            <li className="comment">
              <div className="comment-body">
                <div className="comment-author vcard">
                  <img
                    className="avatar photo"
                    src={IMAGES.testimonial_mini_pic3}
                    alt="/"
                  />
                  <cite className="fn">John Doe</cite>
                </div>
                <div className="star-rating" data-rating="4">
                  <i className="fas  fa-star m-r5 text-secondary"></i>
                  <i className="fas  fa-star m-r5 text-secondary"></i>
                  <i className="fas  fa-star m-r5 text-secondary"></i>
                  <i className="fas  fa-star m-r5 text-secondary"></i>
                  <i className="far  fa-star m-r5 text-secondary"></i>
                </div>
                <p>
                  Lorem Ipsum es texto de relleno de la industria de la
                  impresión y la tipografía. Lorem Ipsum ha sido el texto
                  estándar desde la década de 1500, cuando un impresor
                  desconocido tomo una galera de tipos y los mezclo para hacer
                  un libro de muestras.
                </p>
              </div>
            </li>
          </ul>
        </div>
        <div className="comment-respond style-1" id="respond">
          <h3 className="comment-reply-title mb-4" id="reply-title">
            Agregar una reseña
          </h3>
          <form className="comment-form" id="commentform" method="post">
            <p className="comment-form-author">
              <label htmlFor="author">
                Nombre <span className="required">*</span>
              </label>
              <input
                type="text"
                name="dzName"
                placeholder="Autor"
                id="author"
              />
            </p>
            <p className="comment-form-email">
              <label htmlFor="email">
                Correo <span className="required">*</span>
              </label>
              <input
                type="text"
                placeholder="Correo"
                name="dzEmail"
                id="email"
              />
            </p>
            <div className="comment-form-rating d-flex p-lr10">
              <label className="pull-left m-r10 m-b20">Tu Calificación</label>
              <div className="rating-widget">
                <div className="rating-stars">
                  <Rate
                    style={{ fontSize: "20px" }}
                    defaultValue={0}
                    color="yellow"
                    onChange={(data) => {
                      alert(`Gracias! Calificaste con ${data} estrellas.`);
                    }}
                  />
                </div>
              </div>
            </div>
            <p className="comment-form-comment">
              <label htmlFor="comment">Comentario</label>
              <textarea
                rows={4}
                name="comment"
                placeholder="Escribe tu reseña aquí"
                id="comment"
              ></textarea>
            </p>
            <p className="form-submit">
              <button
                type="reset"
                className="btn btn-primary btn-hover-2"
                id="submit"
              >
                Enviar Ahora
              </button>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
