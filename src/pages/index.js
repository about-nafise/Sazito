import pData from "../assets/pData.json";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroll-component";
import { arrayToChunk } from "@/utils/arrayToChunk";
import Product from "@/components/Product";

export const getServerSideProps = async () => {
  return { props: { pData } };
};

const option = [
  {
    label: "الفبا",
    value: 0,
  },
  {
    label: "پرفروش ترین",
    value: 1,
  },
  {
    label: "جدیدترین",
    value: 2,
  },
];
const categories = [
  {
    label: " انتخاب کنید",
    value: "all",
  },
  {
    label: "squid game",
    value: 0,
  },
  {
    label: "friends",
    value: 1,
  },
  {
    label: "big bang theory",
    value: 2,
  },
  {
    label: "sherlock",
    value: 3,
  },
];

export default function Home({ pData: dataList }) {
  const [data, setData] = useState(dataList.result.products);
  const [filtredData, setFiltredData] = useState(data);
  const [sortData, setSortData] = useState(0);
  const [chunkedData, setChunkedData] = useState([]);
  const [allChunkedData, setAllChunkedData] = useState([]);
  const [index, setIndex] = useState(1);
  const { query, push } = useRouter();

  useEffect(() => {
    setChunkedData([]);
    setAllChunkedData([]);
    setIndex(1);
    const set = arrayToChunk(filtredData, 8);
    setChunkedData(set[0]);
    setAllChunkedData(set);
  }, [filtredData, query, sortData]);

  const fetchMoreData = () => {
    setTimeout(() => {
      if (index <= chunkedData.length / 8) {
        setIndex((p) => p + 1);
        setChunkedData((prevArray) => [...prevArray, ...allChunkedData[index]]);
      }
    }, 1000);
  };

  const sortHandler = (e) => {
    setSortData(+e.target.value);
    push({ query: { sort: +e.target.value } });
  };

  useEffect(() => {
    const sortValueFromQuery = +query.sort || 0;
    setSortData(sortValueFromQuery);
  }, [query]);

  useEffect(() => {
    if (sortData === 0) {
      setFiltredData(chunkedData);
    } else if (sortData === 1) {
      const sortData = [...chunkedData].sort(
        (a, b) => +b.sale_count - +a.sale_count
      );
      setFiltredData(sortData.length === 0 ? chunkedData : sortData);
    } else if (sortData === 2) {
      const sortData = [...chunkedData].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setFiltredData(sortData.length === 0 ? chunkedData : sortData);
    }
  }, [sortData]);

  const categoryHandler = (e) => {
    push({ query: { filter: e.target.value } });
  };

  useEffect(() => {
    const categoryData = data.filter(
      (product) => product.category === +query?.filter
    );
    setFiltredData(categoryData.length === 0 ? data : categoryData);
  }, [query.filter, data]);

  return (
    <main className="flex flex-col items-center justify-between px-24">
      <h1 className="text-indigo-900 text-2xl font-bold my-5">
        استیکر های فیلم-سریال-انیمیشن
      </h1>
      <div className="w-full p-3">
        <div className=" bg-white flex border border-gray-300 rounded-md p-3">
          <div className="flex flex-col w-1/2 px-5 py-2">
            <span>ترتیب نمایش</span>
            <select
              onChange={sortHandler}
              class="bg-gray-50 border border-gray-300 rounded-md w-64 p-2 mt-3"
            >
              {option.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col w-1/2 px-5">
            <span>دسته بندی</span>
            <select
              defaultValue={categories[0].value}
              class="bg-gray-50 border border-gray-600 rounded-md w-64 p-2 mt-3"
              onChange={categoryHandler}
            >
              {categories.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div>
        <InfiniteScroll
          className="flex flex-wrap"
          dataLength={chunkedData.length}
          next={() => fetchMoreData()}
          hasMore={index <= allChunkedData.length - 1}
          loader={<>در حال بارگزاری</>}
        >
          {chunkedData.map((item, id) => {
            return (
              <div className="flex flex-col w-1/4">
                <Product name={item.name} id={id} price={item.price} />
              </div>
            );
          })}
        </InfiniteScroll>
      </div>
    </main>
  );
}
