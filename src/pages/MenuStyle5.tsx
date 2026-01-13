import { Link } from "react-router-dom";
import { IMAGES } from "../constent/theme";
import CommonBanner from "../elements/CommonBanner";
import { useContext, useRef, useState } from "react";
import { MenuStyle5Arr } from "../elements/JsonData";
import { Context } from "../context/AppContext";
import OurMenuFilter from "../elements/OurMenuFilter";

const Buttons = [
  { icon: "flaticon-fast-food", title: "TODAS" },
  { icon: "flaticon-cocktail", title: "BEBIDAS FRÍAS" },
  { icon: "flaticon-pizza-slice", title: "PIZZA" },
  { icon: "flaticon-salad", title: "ENSALADA" },
  { icon: "flaticon-cupcake", title: "DULCES" },
  { icon: "flaticon-chili-pepper", title: "PICANTE" },
  { icon: "flaticon-hamburger-1", title: "HAMBURGUESA" },
];

interface MenuFile {
  img: string;
  categery: string;
  name: string;
  price: string;
}

const MenuStyle5 = () => {
  const [active, setActive] = useState<number>(0);
  const [hoverActive, setHoverActive] = useState<number>();
  const [data, setData] = useState<MenuFile[]>(MenuStyle5Arr);
  const cardRef = useRef<HTMLLIElement[]>([]);
  const { setShowCategeryFilter } = useContext(Context);

  const filterGallery = (name: string) => {
    if (cardRef.current) {
      cardRef.current.forEach((ele) => {
        if (ele) {
          ele.style.transform = "scale(0)";
        }
      });

      const updateItems = MenuStyle5Arr.filter((el: MenuFile) =>
        el.categery.includes(name)
      );

   
      setData(updateItems);

      setTimeout(() => {
        cardRef.current.forEach((ele) => {
          if (ele) {
            ele.style.transform = "scale(1)";
          }
        });
      }, 100);
    }
  };

  return (
    <div className="page-content bg-white">
      <CommonBanner
        img={IMAGES.images_bnr5}
        title="Nuestro Menú 5"
        subtitle="Nuestro Menú 5"
      />

      <section className="content-inner">
        <div className="container">
          <div className="row">
            <div className="col-xl-10 col-lg-9 col-md-12">
              <div className="site-filters style-1 clearfix">
                <ul className="filters">
                  {Buttons.map(({ icon, title }, ind) => (
                    <li
                      className={active === ind ? "active" : ""}
                      key={ind}
                      onClick={() => {
                        setActive(ind);
                        filterGallery(title);
                      }}
                    >
                      <Link to="#">
                        <span>
                          <i className={icon}></i>
                        </span>
                        {title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-xl-2 col-lg-3 col-md-12 text-lg-end mb-lg-0 m-b30 d-flex d-lg-block align-items-center justify-content-between">
              <strong className="filter-item-show d-lg-none">
                51,740 artículos
              </strong>
              <Link
                to={"#"}
                className="btn btn-primary filter-btn btn-hover-2"
                onClick={() => {
                  setShowCategeryFilter(true);
                }}
              >
                Filtrar{" "}
                <span>
                  <i className="icon-filter m-l5"></i>
                </span>
              </Link>
            </div>
            <OurMenuFilter />
          </div>

          <ul id="masonry" className="row">
            {data.map(({ img, name, price }, ind) => (
              <li
                className="card-container col-lg-3 col-md-6 col-sm-6 m-b30"
                style={{ transition: "all .2s" }}
                key={ind}
                ref={(node) => {
                  if (node) {
                    cardRef.current.push(node);
                  }
                }}
              >
                <div
                  className={`dz-img-box style-2 box-hover ${
                    hoverActive === ind ? "active" : ""
                  }`}
                  onMouseEnter={() => {
                    setHoverActive(ind);
                  }}
                >
                  <div className="dz-media">
                    <img src={img} alt="/" />
                  </div>
                  <div className="dz-content">
                    <h4 className="dz-title">
                      <Link to="/product-detail">{name}</Link>
                    </h4>
                    <p>Texto de ejemplo para la descripción.</p>
                    <h5 className="dz-price text-primary">{price}</h5>
                    <Link
                      to="/shop-cart"
                      className="btn btn-primary btn-hover-2"
                    >
                      {" "}
                      Agregar al Carrito
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default MenuStyle5;
