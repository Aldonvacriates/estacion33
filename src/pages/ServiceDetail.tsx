import { Link } from "react-router-dom";
import { IMAGES } from "../constent/theme";
import CommonBanner from "../elements/CommonBanner";

const ServiceDetail = () => {
  return (
    <div className="page-content bg-white">
      <CommonBanner
        img={IMAGES.banner_bnr2}
        title="Detalle de Servicios"
        subtitle="Detalle de Servicios"
      />
      <section className="content-inner">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 order-lg-1 order-2">
              <aside className="side-bar left sticky-top">
                <div className="widget search-bx">
                  <div className="widget-title">
                    <h5 className="title m-b30">Buscar</h5>
                  </div>
                  <form role="search" method="post">
                    <div className="input-group">
                      <div className="input-side">
                        <input
                          name="text"
                          className="form-control"
                          placeholder="Buscar"
                          type="text"
                        />
                        <div className="input-group-btn">
                          <button type="reset" className="btn btn-primary">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9.58366 17.5001C13.9559 17.5001 17.5003 13.9557 17.5003 9.58342C17.5003 5.21116 13.9559 1.66675 9.58366 1.66675C5.21141 1.66675 1.66699 5.21116 1.66699 9.58342C1.66699 13.9557 5.21141 17.5001 9.58366 17.5001Z"
                                stroke="#ffffff"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M18.3337 18.3334L16.667 16.6667"
                                stroke="#ffffff"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="widget recent-posts-entry">
                  <div className="widget-title">
                    <h5 className="title m-b30">Publicación Reciente</h5>
                  </div>
                  <div className="widget-post-bx style-1">
                    <div className="widget-post clearfix">
                      <div className="dz-media">
                        <img src={IMAGES.blog_recent_pic4} alt="/" />
                      </div>
                      <div className="dz-info">
                        <div className="dz-meta">
                          <ul>
                            <li>
                              <Link to={"#"}>ESTÁNDAR</Link>
                            </li>
                            <li className="date">
                              <Link to={"#"}>10 Dic 2023</Link>
                            </li>
                          </ul>
                        </div>
                        <h6 className="title">
                          <Link to="/blog-standard">
                            Ven a Comer con Nosotros!
                          </Link>
                        </h6>
                      </div>
                    </div>
                  </div>
                  <div className="widget-post-bx style-1">
                    <div className="widget-post clearfix">
                      <div className="dz-media">
                        <img src={IMAGES.blog_recent_pic5} alt="/" />
                      </div>
                      <div className="dz-info">
                        <div className="dz-meta">
                          <ul>
                            <li>
                              <Link to={"#"}>ESTÁNDAR</Link>
                            </li>
                            <li className="date">
                              <Link to={"#"}>12 May 2023</Link>
                            </li>
                          </ul>
                        </div>
                        <h6 className="title">
                          <Link to="/blog-standard">
                            Da un Mordisco a la Vida
                          </Link>
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="widget widget_categories">
                  <div className="widget-title">
                    <h4 className="title">Categorías</h4>
                  </div>
                  <ul>
                    <li className="cat-item">
                      <Link to="/blog-standard">Todos los Servicios</Link>
                    </li>
                    <li className="cat-item">
                      <Link to="/blog-standard">Agua</Link>
                    </li>
                    <li className="cat-item">
                      <Link to="/blog-standard">Limpieza Residencial</Link>
                    </li>
                    <li className="cat-item">
                      <Link to="/blog-standard">Pizza de Verano</Link>
                    </li>
                    <li className="cat-item">
                      <Link to="/blog-standard">Soporte Gratis</Link>
                    </li>
                  </ul>
                </div>
              </aside>
            </div>
            <div className="col-lg-8 order-lg-2 order-1 m-b30">
              <div className="blog-single dz-card sidebar mb-0">
                <div className="dz-media rounded-md">
                  <img src={IMAGES.blog_detail_pic2} alt="/" />
                </div>
                <div className="dz-info">
                  <h2 className="title">Servicios de Entrega en el Mundo de Hoy</h2>
                  <div className="dz-meta">
                    <ul>
                      <li className="dz-user">
                        <Link to={"#"}>
                          <i className="fa-solid fa-user"></i>
                          Por <span>KK Sharma</span>
                        </Link>
                      </li>
                      <li className="dz-comment">
                        <Link to={"#"}>
                          <i className="fa-solid fa-message"></i>
                          24 Comentarios
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="dz-post-text style-1">
                    <p className="m-b10">
                      Lorem Ipsum es texto de relleno de la industria de la
                      impresión y la tipografía. Lorem Ipsum ha sido el texto
                      estándar desde la década de 1500, cuando un impresor
                      desconocido tomo una galera de tipos y los mezclo para
                      hacer un libro de muestras.
                    </p>
                    <p>
                      Lorem Ipsum es texto de relleno de la industria de la
                      impresión y la tipografía. Lorem Ipsum ha sido el texto
                      estándar desde la década de 1500,
                    </p>
                  </div>
                  <blockquote className="wp-block-quote style-1">
                    <i className="flaticon-right-quote quotes"></i>
                    <p>
                      Fragmentos collings mauris sit amet nibh. Donec sodales
                      sagittis magna. Sed consequat,
                    </p>
                    <cite>Ronald M. Spino</cite>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
