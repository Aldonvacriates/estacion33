import { Link } from "react-router-dom";
import { IMAGES } from "../constent/theme";
import CommentList from "../elements/CommentList";
import CommonBanner2 from "../elements/CommonBanner2";

const BlogGutenberg = () => {
  return (
    <div className="page-content bg-white">
      <CommonBanner2 pages="Blog Gutenberg Abierto" />
      <div className="content-inner overflow-hidden">
        <div className="min-container">
          <div className="blog-single dz-card">
            <div className="post-header">
              <h1 className="dz-title">
                Descubriendo el Sabor de la Tradicion y Celebrando Recetas
                Atemporales
              </h1>
              <div className="dz-meta">
                <ul>
                  <li className="dz-user">
                    <Link to={"#"}>
                      <i className="flaticon-user"></i> Por{" "}
                      <span>KK Sharma</span>
                    </Link>
                  </li>
                  <li className="dz-date">
                    <Link to={"#"}>
                      <i className="flaticon-calendar-date"></i> 26 Ene 2023
                    </Link>
                  </li>
                  <li className="dz-comment">
                    <Link to={"#"}>
                      <i className="flaticon-chat-bubble"></i> 2.5K{" "}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="dz-media alignfullwide">
              <img src={IMAGES.background_pic20} alt="/" />
            </div>
            <div className="dz-info">
              <div className="dz-post-text">
                <p>
                  Lorem Ipsum es simplemente texto de relleno de la industria
                  de la imprenta y la tipografía. Lorem Ipsum ha sido el texto
                  de relleno estándar de la industria desde los años 1500,
                  cuando un impresor desconocido tomo una galera de tipos y la
                  mezclo para hacer un libro de muestras.
                </p>
                <blockquote className="wp-block-quote">
                  <p>
                    Crea una arquitectura de información facil de usar con
                    consideraciones de usabilidad precisas y parciales
                  </p>
                  <cite>Ronald M. Spino</cite>
                  <i className="flaticon-right-quote quotes"></i>
                </blockquote>
                <p>
                  Lorem Ipsum es simplemente texto de relleno de la industria
                  de la imprenta y la tipografía. Lorem Ipsum ha sido el texto
                  de relleno estándar de la industria desde los años 1500,
                  cuando un impresor desconocido tomo una galera de tipos y la
                  mezclo para hacer un libro de muestras. Ha sobrevivido no
                  solo cinco siglos, sino tambien el salto a la composicion
                  electronica, manteniendose esencialmente sin cambios. Se
                  popularizo en los años 60 con la publicación de hojas Letraset
                  que contenian pasajes de Lorem Ipsum, y más recientemente con
                  software de autoedicion como Aldus PageMaker, incluyendo
                  versiones de Lorem Ipsum.{" "}
                </p>
                <figure className="wp-container-5 wp-block-gallery-3 wp-block-gallery has-nested-images columns-3 is-cropped alignwide">
                  <figure className="wp-block-image size-large">
                    <img src={IMAGES.blog_detail_pic3} alt="/" />
                  </figure>
                  <figure className="wp-block-image size-large">
                    <img src={IMAGES.blog_detail_pic4} alt="/" />
                  </figure>
                  <figure className="wp-block-image size-large">
                    <img src={IMAGES.blog_detail_pic5} alt="/" />
                  </figure>
                  <figure className="wp-block-image size-large">
                    <img src={IMAGES.blog_detail_pic6} alt="/" />
                  </figure>
                  <figure className="wp-block-image size-large">
                    <img src={IMAGES.blog_detail_pic7} alt="/" />
                  </figure>
                </figure>
                <p>
                  Lorem Ipsum es simplemente texto de relleno de la industria
                  de la imprenta y la tipografía. Lorem Ipsum ha sido el texto
                  de relleno estándar de la industria desde los años 1500,
                  cuando un impresor desconocido tomo una galera de tipos y la
                  mezclo para hacer un libro de muestras. Ha sobrevivido no
                  solo cinco siglos, sino tambien el salto a la composicion
                  electronica, manteniendose esencialmente sin cambios. Se
                  popularizo en los años 60 con la publicación de hojas Letraset
                  que contenian pasajes de Lorem Ipsum, y más recientemente con
                  software de autoedicion como Aldus PageMaker, incluyendo
                  versiones de Lorem Ipsum.
                </p>

                <div className="alignfullwide">
                  <img src={IMAGES.background_pic21} alt="/" />
                </div>

                <p>
                  Se popularizo en los años 60 con la publicación de hojas
                  Letraset que contenian pasajes de Lorem Ipsum, y más
                  recientemente con software de autoedicion como Aldus
                  PageMaker, incluyendo versiones de Lorem Ipsum.{" "}
                </p>
                <p>
                  Lorem Ipsum es simplemente texto de relleno de la industria
                  de la imprenta y la tipografía. Lorem Ipsum ha sido el texto
                  de relleno estándar de la industria desde los años 1500,
                  cuando un impresor desconocido tomo una galera de tipos y la
                  mezclo para hacer un libro de muestras. Ha sobrevivido no
                  solo cinco siglos, sino tambien el salto a la composicion
                  electronica, manteniendose esencialmente sin cambios.
                </p>

                <div className="author-box m-b30">
                  <div className="author-profile-info">
                    <div className="author-profile-pic">
                      <img src={IMAGES.blog_detail_author} alt="/" />
                    </div>
                    <div className="author-profile-content">
                      <h6>Soy John Doe</h6>
                      <p>Soy jefe senior en Londres</p>
                      <img src={IMAGES.blog_detail_signin} alt="/" />
                      <ul className="social-icon m-b0">
                        <li>
                          <Link
                            to="https://www.facebook.com/dexignzone"
                            target="_blank"
                          >
                            <i className="fa-brands fa-facebook-f"></i>
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="https://www.instagram.com/dexignzone/"
                            target="_blank"
                          >
                            <i className="fa-brands fa-instagram"></i>
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="https://twitter.com/dexignzones"
                            target="_blank"
                          >
                            <i className="fa-brands fa-twitter"></i>
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="https://www.behance.net/dexignzone"
                            target="_blank"
                          >
                            <i className="fa-brands fa-behance"></i>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <p>
                  Lorem Ipsum es simplemente texto de relleno de la industria
                  de la imprenta y la tipografía. Lorem Ipsum ha sido el texto
                  de relleno estándar de la industria desde los años 1500,
                  cuando un impresor desconocido tomo una galera de tipos y la
                  mezclo para hacer un libro de muestras. Ha sobrevivido no
                  solo cinco siglos, sino tambien el salto a la composicion
                  electronica, manteniendose esencialmente sin cambios. Se
                  popularizo en los años 60 con la publicación de hojas Letraset
                  que contenian pasajes de Lorem Ipsum, y más recientemente con
                  software de autoedicion como Aldus PageMaker, incluyendo
                  versiones de Lorem Ipsum.
                </p>

                <ul>
                  <li>Una maravillosa serenidad se ha apoderado.</li>
                  <li>
                    De toda mi alma, como estas dulces mananas de primavera
                    que.
                  </li>
                  <li>Disfruto con todo mi corazón.</li>
                  <li>
                    Este lugar, que fue creado para la dicha de almas como la
                    mia.
                  </li>
                </ul>

                <p>
                  Lorem Ipsum es simplemente texto de relleno de la industria
                  de la imprenta y la tipografía. Lorem Ipsum ha sido el texto
                  de relleno estándar de la industria desde los años 1500,
                  cuando un impresor desconocido tomo una galera de tipos y la
                  mezclo para hacer un libro de muestras. Ha sobrevivido no
                  solo cinco siglos, sino tambien el salto a la composicion
                  electronica, manteniendose esencialmente sin cambios.
                </p>
              </div>
              <div className="dz-share-post">
                <div className="post-tags">
                  <h6 className="font-14 m-b0 m-r10 d-inline">Etiquetas:</h6>
                  <Link to="/product-detail">Pizza Veronese</Link>
                  <Link to="/product-detail">Pollo</Link>
                  <Link to="/product-detail">Pizza</Link>
                  <Link to="/product-detail">Hamburguesa</Link>
                  <Link to="/product-detail">Sandwich</Link>
                </div>
                <div className="dz-social-icon">
                  <ul>
                    <li>
                      <Link
                        target="_blank"
                        className="btn-social btn-sm text-primary"
                        to="https://www.facebook.com/"
                      >
                        <i className="fab fa-facebook-f"></i>
                      </Link>
                    </li>
                    <li>
                      <Link
                        target="_blank"
                        className="btn-social btn-sm text-primary"
                        to="https://twitter.com/"
                      >
                        <i className="fab fa-twitter"></i>
                      </Link>
                    </li>
                    <li>
                      <Link
                        target="_blank"
                        className="btn-social btn-sm text-primary"
                        to="https://www.instagram.com/"
                      >
                        <i className="fab fa-instagram"></i>
                      </Link>
                    </li>
                    <li>
                      <Link
                        target="_blank"
                        className="btn-social btn-sm text-primary"
                        to="https://www.linkedin.com/"
                      >
                        <i className="fa-brands fa-linkedin-in"></i>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <CommentList />
        </div>
      </div>
    </div>
  );
};

export default BlogGutenberg;
