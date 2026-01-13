import { Link } from "react-router-dom";
import { IMAGES } from "../constent/theme";
import CommonBanner from "../elements/CommonBanner";
import { BlogGrid2Arr } from "../elements/JsonData";
import { useState } from "react";

interface ArrType {
  img: string;
  title: string;
}
const BlogGrid2 = () => {
  const [data, setData] = useState<ArrType[]>(BlogGrid2Arr);

  const loadMore = () => {
    const newData = [...data]; 

    for (let i = 0; i < 2; i++) {
      const key = Math.floor(Math.random() * BlogGrid2Arr.length);
      const newElement = {
        img: BlogGrid2Arr[key].img,
        title: BlogGrid2Arr[key].title,
      }; 

      newData.push(newElement); 
    }

    setData(newData);
  };

  return (
    <div className="page-content bg-white">
      <CommonBanner
        img={IMAGES.banner_bnr1}
        title="Blog Cuadricula 2"
        subtitle="Blog Cuadricula 2"
      />
      <section className="content-inner-1">
        <div className="min-container">
          <div className="row loadmore-content">
            {data.map(({ img, title }, ind) => (
              <div className="col-lg-6 col-md-6" key={ind}>
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
                          <Link to="#">
                            <i className="flaticon-calendar-date"></i> 26 Jan
                            2023
                          </Link>
                        </li>
                        <li className="dz-comment">
                          <Link to="#">
                            <i className="flaticon-chat-bubble"></i> 2.5K{" "}
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <h5 className="dz-title">
                      <Link to="/blog-standard">{title}</Link>
                    </h5>
                    <p>
                      Hay muchas variaciones de pasajes de Lorem Ipsum
                      disponibles.
                    </p>
                    <Link
                      to="/blog-standard"
                      className="btn btn-primary btn-hover-2"
                    >
                      Leer Mas
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center m-t10">
            <Link
              className="btn btn-primary dz-load-more btn-hover-2"
              to={"#"}
              onClick={loadMore}
            >
              Cargar Mas
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogGrid2;
