import { Link } from "react-router-dom";
import { IMAGES } from "../constent/theme";
import { useRef } from "react";

const Footer = () => {
  const heartRef = useRef<HTMLSpanElement | null>(null);
  return (
    <>
      <footer className="site-footer  style-1 bg-dark" id="footer">
        <div className="footer-top">
          <div className="container">
            <div className="row">
              <div className="col-xl-5 col-lg-5 col-md-12">
                <div className="dz-form-card bg-primary">
                  <div className="section-head">
                    <h4 className="title m-0">Contáctanos</h4>
                    <p className="m-t10">
                      Lorem Ipsum es simplemente texto de relleno de la
                      industria de la imprenta y la tipografía.
                    </p>
                  </div>
                  <form className="dzForm dezPlaceAni">
                    <input
                      type="hidden"
                      className="form-control"
                      name="dzToDo"
                      value="Contact"
                    />
                    <input
                      type="hidden"
                      className="form-control"
                      name="reCaptchaEnable"
                      value="0"
                    />
                    <div className="dzFormMsg"></div>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <div className="input-group input-line">
                          <input
                            name="dzName"
                            required
                            type="text"
                            className="form-control"
                            placeholder="Tu Nombre"
                          />
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="input-group input-line">
                          <input
                            name="dzEmail"
                            required
                            type="text"
                            className="form-control"
                            placeholder="Correo Electrónico"
                          />
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="input-group input-line">
                          <input
                            name="dzOther[Subject]"
                            required
                            type="text"
                            className="form-control"
                            placeholder="Asunto"
                          />
                        </div>
                      </div>
                      <div className="col-sm-12 ">
                        <div className="input-group input-line">
                          <textarea
                            name="dzMessage"
                            required
                            className="form-control"
                            placeholder="Mensaje"
                          ></textarea>
                        </div>
                      </div>
                      <div className="col-sm-12">
                        <button
                          type="button"
                          name="submit"
                          value="submit"
                          className="btn btn-md btn-white btn-hover-1"
                        >
                          <span>Enviar Mensaje</span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-5 wow fadeInUp">
                <div className="widget widget_getintuch">
                  <h5 className="footer-title">Contacto</h5>
                  <ul>
                    <li>
                      <i className="flaticon-placeholder"></i>
                      <p>
                        1247/Plot No. 39, 15th Phase, Colony, Kkatpally,
                        Hyderabad
                      </p>
                    </li>
                    <li>
                      <i className="flaticon-telephone"></i>
                      <p>
                        +91 987-654-3210
                        <br />
                        +91 123-456-7890
                      </p>
                    </li>
                    <li>
                      <i className="flaticon-email-1"></i>
                      <p>
                        info@example.com
                        <br />
                        info@example.com
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-2 col-lg-2 col-md-3 col-6 wow fadeInUp">
                <div className="widget widget_services">
                  <h5 className="footer-title">Nuestros Enlaces</h5>
                  <ul>
                    <li>
                      <Link to="/">
                        <span>Inicio</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/about-us">
                        <span>Nosotros</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/services">
                        <span>Servicios</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/team">
                        <span>Equipo</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/blog-standard">
                        <span>Blog</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-2 col-lg-2 col-md-3 col-6 wow fadeInUp">
                <div className="widget widget_services">
                  <h5 className="footer-title">Centro de Ayuda</h5>
                  <ul>
                    <li>
                      <Link to="/faq">
                        <span>Preguntas</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop-style-1">
                        <span>Tienda</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop-style-2">
                        <span>Filtro de Categorías</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/testimonial">
                        <span>Testimonios</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/contact-us">
                        <span>Contacto</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="footer-bottom">
            <div className="row">
              <div className="col-xl-6 col-md-6 text-md-start">
                <p>© 2023 Todos los derechos reservados.</p>
              </div>
              <div className="col-xl-6 col-md-6 text-md-end">
                <span className="copyright-text">
                  Hecho Con{" "}
                  <span
                    className="heart"
                    ref={heartRef}
                    onClick={() => {
                      heartRef.current?.classList.toggle("heart-blast");
                    }}
                  ></span>{" "}
                  por{" "}
                  <Link to="https://dexignzone.com/" target="_blank">
                    DexignZone
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
        <img className="bg1 dz-move" src={IMAGES.background_pic5} alt="/" />
        <img className="bg2 dz-move" src={IMAGES.background_pic6} alt="/" />
      </footer>
    </>
  );
};

export default Footer;
