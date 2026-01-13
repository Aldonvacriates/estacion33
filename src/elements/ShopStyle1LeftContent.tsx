import { Link } from "react-router-dom";
import RangeSlider from "rsuite/RangeSlider";

const ShopStyle1LeftContent = () => {
  return (
    <div className="col-lg-3">
      <aside className="side-bar left sticky-top">
        <div className="shop-filter">
          <div className="widget widget_tag_cloud ">
            <div className="d-flex justify-content-between">
              <div className="widget-title">
                <h4 className="title">Búsqueda Actual</h4>
              </div>
              <Link to="#" className="panel-close-btn">
                <i className="fa-solid fa-xmark"></i>
              </Link>
            </div>
            <div className="tagcloud">
              <Link to="/product-detail">Hamburguesa</Link>
              <Link to="/product-detail">Restaurante</Link>
              <Link to="/product-detail">Pizza</Link>
            </div>
          </div>
          <div className="widget dz-widget_services">
            <div className="widget-title">
              <h4 className="title">Refinar por Categorías</h4>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="productCheckBox-01"
              />
              <label className="form-check-label" htmlFor="productCheckBox-01">
                Pizza
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="productCheckBox-02"
              />
              <label className="form-check-label" htmlFor="productCheckBox-02">
                Hamburguesa
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="productCheckBox-03"
              />
              <label className="form-check-label" htmlFor="productCheckBox-03">
                Bebidas Frías
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="productCheckBox-04"
              />
              <label className="form-check-label" htmlFor="productCheckBox-04">
                Sandwich
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="productCheckBox-05"
              />
              <label className="form-check-label" htmlFor="productCheckBox-05">
                Muffin
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="productCheckBox-06"
              />
              <label className="form-check-label" htmlFor="productCheckBox-06">
                Burrito
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="productCheckBox-07"
              />
              <label className="form-check-label" htmlFor="productCheckBox-07">
                Taco
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="productCheckBox-08"
              />
              <label className="form-check-label" htmlFor="productCheckBox-08">
                Perro Caliente
              </label>
            </div>
          </div>
          <div className="widget">
            <div className="widget-title">
              <h4 className="title">Rango de Precio</h4>
            </div>
            <RangeSlider
              defaultValue={[10.0, 70.0]}
              tooltip={true}
              step={0.01}
              className="slider-style-1"
            />
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ShopStyle1LeftContent;
