import { Link } from "react-router-dom";
import { IMAGES } from "../constent/theme";
import BlogBothContent, {
  BlogBothRightContent,
} from "../elements/BlogBothContent";
import CommonBanner from "../elements/CommonBanner";
import { BlogGrid2Arr } from "../elements/JsonData";
import Pagination from "../elements/Pagination";

const BlogBothSidebar = () => {
  return (
    <div className="page-content bg-white">
      <CommonBanner
        img={IMAGES.banner_bnr1}
        title="Blog con Ambos Sidebars"
        subtitle="Blog con Ambos Sidebars"
      />

      <section className="content-inner">
        <div className="container">
          <div className="row">
            <BlogBothContent />
            <div className="col-xl-6 col-lg-7 col-md-12 m-b30 order-lg-2 order-sm-1">
              <div className="row">
                {BlogGrid2Arr.map(({ img2 }, ind) => (
                  <div className="col-xl-12 col-lg-12" key={ind}>
                    <div className="dz-card style-1 blog-half overlay-shine dz-img-effect zoom m-b30">
                      <div className="dz-media">
                        <Link to="/blog-standard">
                          <img src={img2} alt="/" />
                        </Link>
                      </div>
                      <div className="dz-info">
                        <div className="dz-meta">
                          <ul>
                            <li>
                              <Link to={"#"}>
                                <i className="flaticon-calendar-date"></i> 26
                                Jan 2023
                              </Link>
                            </li>
                            <li className="dz-comment">
                              <Link to={"#"}>
                                <i className="flaticon-chat-bubble"></i> 2.5K
                              </Link>
                            </li>
                          </ul>
                        </div>
                        <h5 className="dz-title">
                          <Link to="/blog-standard">
                            Sabor al Paraiso en Platos
                          </Link>
                        </h5>
                        <p>
                          Hay muchas variaciones de pasajes de Lorem Ipsum
                          disponibles, pero la mayoria.
                        </p>
                        <div className="read-btn">
                          <Link
                            to="/blog-standard"
                            className="btn btn-primary btn-hover-2"
                          >
                            Leer Mas
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Pagination />
            </div>
            <BlogBothRightContent />
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogBothSidebar;
