import { Link } from "react-router-dom";
import { IMAGES } from "../constent/theme";
import BlogGridLeftContent from "../elements/BlogGridLeftContent";
import CommonBanner from "../elements/CommonBanner";
import { BlogGrid3Arr } from "../elements/JsonData";
import Pagination from "../elements/Pagination";

const BlogWideGridSidebar = () => {
  return (
    <div className="page-content bg-white">
      <CommonBanner
        img={IMAGES.images_bnr5}
        title="Blog Cuadrícula Ancha con Sidebar"
        subtitle="Blog Cuadrícula Ancha con Sidebar"
      />
      <section className="content-inner">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-9 col-lg-8 m-b30">
              <div className="row">
                {BlogGrid3Arr.map(({ img }, ind) => (
                  <div className="col-xl-4 col-md-6" key={ind}>
                    <div className="dz-card style-1 overlay-shine dz-img-effect zoom m-b30">
                      <div className="dz-media">
                        <Link to="/blog-standard">
                          <img src={img} alt="/" />
                        </Link>
                      </div>
                      <div className="dz-info">
                        <div className="dz-meta">
                          <ul>
                            <li>
                              <Link to={"#"}>
                                <i className="flaticon-calendar-date"></i> 26
                                Ene 2023
                              </Link>
                            </li>
                            <li className="dz-comment">
                              <Link to={"#"}>
                                <i className="flaticon-chat-bubble"></i> 2.5K{" "}
                              </Link>
                            </li>
                          </ul>
                        </div>
                        <h5 className="dz-title">
                          <Link to="/blog-standard">
                            Sabor Paraiso de Platos
                          </Link>
                        </h5>
                        <p>
                          Hay muchas variaciones de pasajes de Lorem Ipsum
                          disponibles, pero la mayoria.
                        </p>
                        <Link
                          to="/blog-standard"
                          className="btn btn-primary btn-hover-2"
                        >
                          Leer Más
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Pagination />
            </div>
            <div className="col-xl-3 col-lg-4">
              <BlogGridLeftContent />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogWideGridSidebar;
