import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProductDetails } from "./index";
import { GB_CURRENCY } from "../utils/constants";
import { callAPI } from "../utils/CallApi";
import { addItem } from "../store/cartSlice";
import service from '../appwrite/services'

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isInCart, setIsInCart] = useState(false); // Track if item is in cart
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const  userData  = useSelector((state) => state.auth.userData || {}); // Get logged-in userId
  console.log(userData);
  const userId = (Object.keys(userData).length==0 ? "" : userData.$id);
  console.log(userId);

  const navigate = useNavigate(); // For navigation


  // Fetch the product
  const getProduct = () => {
    callAPI("data/products.json").then((productResults) => {
      setProduct(productResults[id]);
    });
  };

  // Check if the item is already in the cart
  const checkCart = async () => {
      const inCart = await service.getCartItem({ userId, itemId: id });
      console.log(inCart);
      setIsInCart(inCart);
  };

  // Add item to the cart
  const handleAddToCart = async () => {
    if (!authStatus) {
      navigate("/login"); // Redirect to login if not logged in
      return;
    }
    if (!isInCart) {
      const itemToAdd = {
        userId: userId, 
        itemId: id,
        price: product.price,
        quantity: 1,
    };

      // Call Appwrite service to add the item to the cart
      await service.addToCart({
        userId: userId, 
        itemId: id,
        price: product.price,
      })

      // Dispatch to Redux store
      dispatch(addItem(itemToAdd));

      // Set the item as "added to cart"
      setIsInCart(true);
    }
  };

  useEffect(() => {
    getProduct();
    checkCart();
  },[]);

  if (!product?.title) return <h1>Loading Product ...</h1>;

  return (
    product && (
      <div className="h-screen bg-amazonclone-background">
        <div className="min-w-[1000px] max-w-[1500px] m-auto p-4">
          <div className="grid grid-cols-10 gap-2">
            {/* Left */}
            <div className="col-span-3 p-8 rounded bg-white m-auto">
              <img src={`${product.image}`} alt="Main product" />
            </div>
            {/* Middle */}
            <div className="col-span-5 p-4 rounded bg-white divide-y divide-gray-400">
              <div className="mb-3">
                <ProductDetails product={product} ratings={true} />
              </div>
              <div className="text-base xl:text-lg mt-3">
                {product.description}
              </div>
            </div>
            {/* Right */}
            <div className="col-span-2 p-4 rounded bg-white">
              <div className="text-xl xl:text-2xl text-red-700 text-right font-semibold">
                {GB_CURRENCY.format(product.price)}
              </div>
              <div className="text-base xl:text-lg text-gray-500 text-right font-semibold">
                RRP:{" "}
                <span className="line-through">
                  {GB_CURRENCY.format(product.oldPrice)}
                </span>
              </div>
              <div className="text-sm xl:text-base text-blue-500 font-semibold mt-3">
                FREE Returns
              </div>
              <div className="text-sm xl:text-base text-blue-500 font-semibold mt-1">
                FREE Delivery
              </div>
              <div className="text-base xl:text-lg text-green-700 font-semibold mt-1">
                In Stock
              </div>

              {/* Conditionally Render Add to Cart Button */}
              {authStatus ? (
                <button
                  onClick={handleAddToCart}
                  className="btn"
                  disabled={isInCart} // Disable button if already added
                >
                  {isInCart ? "Added to Cart" : "Add to Cart"}
                </button>
              ) : (
                <div className="text-red-500 font-semibold">
                  Please log in to add items to your cart.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ProductPage;
