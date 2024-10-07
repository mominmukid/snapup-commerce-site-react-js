
import React, { useEffect, useState } from "react";
import "./HomePage.scss";
import HeaderSlider from "../../components/Slider/HeaderSlider";
import { useSelector, useDispatch } from "react-redux";
import { getAllCategories } from "../../store/categorySlice";
import ProductList from "../../components/ProductList/ProductList";
import {
  fetchAsyncProducts,
  getAllProducts,
  getAllProductsStatus,
} from "../../store/productSlice";
import Loader from "../../components/Loader/Loader";
import { STATUS } from "../../utils/status";

const HomePage = () => {
  const dispatch = useDispatch();
  const categories = useSelector(getAllCategories);
  const products = useSelector(getAllProducts);
  const productStatus = useSelector(getAllProductsStatus);
  const [loading, setLoading] = useState(true);
  const [tempProducts, setTempProducts] = useState([]);
  const [catProductsOne, setCatProductsOne] = useState([]);
  const [catProductsTwo, setCatProductsTwo] = useState([]);
  const [catProductsThree, setCatProductsThree] = useState([]);
  const [catProductsFour, setCatProductsFour] = useState([]);
  const [catNames, setCatNames] = useState({
    catOne: "",
    catTwo: "",
    catThree: "",
    catFour: "",
  });

  // Fetch products on mount
  useEffect(() => {
    dispatch(fetchAsyncProducts(50));
  }, [dispatch]);

  // Set categories when categories are loaded
  useEffect(() => {
    if (categories.length > 0) {
      setCatNames({
        catOne: categories[0].name.toLowerCase(),
        catTwo: categories[1].name.toLowerCase(),
        catThree: categories[2].name.toLowerCase(),
        catFour: categories[3].name.toLowerCase(),
      });
    }
  }, [categories]);

  // Randomize products
  useEffect(() => {
    if (products.length > 0) {
      const shuffledProducts = [];
      const usedIndices = new Set();
      
      while (shuffledProducts.length < products.length) {
        let randomIndex = Math.floor(Math.random() * products.length);
        
        if (!usedIndices.has(randomIndex)) {
          shuffledProducts.push(products[randomIndex]);
          usedIndices.add(randomIndex);
        }
      }
      setTempProducts(shuffledProducts);
    }
  }, [products]);

  // Set products by category when products and categories are available
  useEffect(() => {
    if (products.length > 0 && categories.length > 0) {
      setCatProductsOne(products.filter((product) => product.category.toLowerCase() === catNames.catOne));
      setCatProductsTwo(products.filter((product) => product.category.toLowerCase() === catNames.catTwo));
      setCatProductsThree(products.filter((product) => product.category.toLowerCase() === catNames.catThree));
      setCatProductsFour(products.filter((product) => product.category.toLowerCase() === catNames.catFour));
    }
  }, [products, categories, catNames]);

  // Set loading flag based on product status and categories loading
  useEffect(() => {
    if (productStatus !== STATUS.LOADING && categories.length > 0) {
      setLoading(false);
    }
  }, [productStatus, categories]);

  if (loading) {
    return <Loader />;
  }

  return (
    <main>
      <div className="slider-wrapper">
        <HeaderSlider />
      </div>
      <div className="main-content bg-whitesmoke">
        <div className="container">
          <div className="categories py-5">
            <div className="categories-item">
              <div className="title-md">
                <h3>See our products</h3>
              </div>
              <ProductList products={tempProducts} />
            </div>

            <div className="categories-item">
              <div className="title-md">
                <h3>{catNames.catOne}</h3>
              </div>
              <ProductList products={catProductsOne} />
            </div>

            <div className="categories-item">
              <div className="title-md">
                <h3>{catNames.catTwo}</h3>
              </div>
              <ProductList products={catProductsTwo} />
            </div>

            <div className="categories-item">
              <div className="title-md">
                <h3>{catNames.catThree}</h3>
              </div>
              <ProductList products={catProductsThree} />
            </div>

            <div className="categories-item">
              <div className="title-md">
                <h3>{catNames.catFour}</h3>
              </div>
              <ProductList products={catProductsFour} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;

