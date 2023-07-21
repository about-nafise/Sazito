import Image from "next/image";
import product1 from "../assets/images/product1.jpg";

const Product = ({ id, name, price }) => {
  return (
    <div
      className=" bg-white m-3 border border-gray-400 rounded-md text-center"
      id="product"
      key={id}
    >
      <div className=" rounded-md ">
        <Image src={product1} alt="product-image" />
      </div>
      <h2 className="font-semibold truncate py-2">{name}</h2>
      <span className="block mb-2">{price} تومان</span>
    </div>
  );
};

export default Product;
