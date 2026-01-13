import { useRef } from "react";
import { IMAGES } from "../constent/theme";
import { Link } from "react-router-dom";

const Footer4 = () => {
  const heartRef = useRef<HTMLSpanElement | null>(null);
  return (
    <footer className="site-footer style-1 bg-dark" id="footer">
      <div className="footer-top">
        <div className="container">
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
              <div className="widget widget_getintuch">
                <h5 className="footer-title">Contacto</h5>
                <ul>
                  <li>
                    <i className="flaticon-placeholder"></i>
                    <p>
                      1247/Plot No. 39, 15th Phase, Colony, Kkatpally, Hyderabad
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
            <div className="col-xl-3 col-lg-2 col-md-6 col-sm-6">
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
            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
              <div className="widget widget_services">
                <h5 className="footer-title">NUESTROS SERVICIOS</h5>
                <ul>
                  <li>
                    <Link to="/blog-open-gutenberg">
                      <span>Estrategia y Investigacion</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/services">
                      <span>Entrega Rapida</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact-us">
                      <span>Reserva de Asientos</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop-style-1">
                      <span>Recoger en Tienda</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/our-menu-1">
                      <span>Nuestro Menu</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6	">
              <div className="widget widget_services">
                <h5 className="footer-title">Centro de Ayuda</h5>
                <ul>
                  <li>
                    <Link to="/faq">
                      <span>FAQ</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop-style-1">
                      <span>Tienda</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop-style-2">
                      <span>Filtro de Categorias</span>
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
              <p>Copyright 2023 Todos los derechos reservados.</p>
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
  );
};

export default Footer4;
