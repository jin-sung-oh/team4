import { getProductList } from '../../api/productAPI.ts';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IProduct } from '../../types/product.ts';


const initialState = {
  pno: 0,
  pname: '',
  pdesc: '',
  price: 0,
  uploadFileNames: [],
  del_flag: false
}




function ProductListComponent() {

  const navigate = useNavigate()

  const [productList, setProductList] = useState<IProduct[]>([{...initialState}]); // 초기값을 빈 배열로 설정
  const [query, setQuery] = useSearchParams(); // useSearchParams를 추가
  const page = Number(query.get("page")) || 1; // query에서 page 값을 가져옴

  const changePage = (pageNum: number) => {
    query.set("page", String(pageNum));
    setQuery(query);
  };

  const moveToRead = (pno: number | undefined) => {
    navigate({
      pathname: `/product/read/${pno}`
    })
  }

  const moveToAdd = () => {
    navigate({
      pathname: `/product/add`
    })
  }

  useEffect(() => {
    const fetchProductList = async () => {
      const response = await getProductList(page);
      console.log(response);
      setProductList(response.dtoList); // Assuming dtoList is the key holding the products
    };

    fetchProductList();
  }, [page]);

//카테고리 분류 코드
  const [sort, setSort] = useState<string>('ALL');

  const changeSort = (choice:string):void => {
    setSort(choice)
  }

  const filterKind = ():IProduct[] => {

    if(sort === 'ALL'){
      return productList
    }
    return productList.filter(p => {
      if(p.pdesc === sort){
        return p
      }
    })
  }

  return (
      <div className="p-6 rounded-lg bg-white shadow-md">
        <div className="flex justify-between items-center gap-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Product List</h2>

          <button
              onClick={moveToAdd}
              className="bg-primary w-1/12 h-full p-4 text-white font-semibold rounded-lg">
            ADD
          </button>
        </div>

        {/* 카테고리 선택 버튼 */}
        <div className='flex m-4 p-2 justify-center gap-8'>
           <button className='p-2 underline' onClick={() => changeSort('ALL')}>ALL</button>
           <button className='p-2 underline' onClick={() => changeSort('Daily goods')}>Daily goods</button>
           <button className='p-2 underline' onClick={() => changeSort('Electronics')}>Electronics</button>
           <button className='p-2 underline' onClick={() => changeSort('Pharmaceuticals')}>Pharmaceuticals</button>
           <button className='p-2 underline' onClick={() => changeSort('Groceries')}>Groceries</button>
           <button className='p-2 underline' onClick={() => changeSort('Tourisms')}>Tourisms</button>
        </div>

        <table className="min-w-full table-auto">
          <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2 font-semibold text-gray-600">Product</th>
            <th className="px-4 py-2 font-semibold text-gray-600">Product Name</th>
            <th className="px-4 py-2 font-semibold text-gray-600">Category</th>
            <th className="px-4 py-2 font-semibold text-gray-600">Price</th>
          </tr>
          </thead>

          {/* 필터링된 제품 목록 표시 */}
          <tbody>
          {filterKind().length > 0 ? (
              filterKind().map((product) => (
                  <tr onClick={() => moveToRead(product.pno)} key={product.pno} className="border-b border-gray-200">

                    <td className="px-4 py-4 text-gray-700 font-medium w-1/12"><img
                        src={`http://localhost:8089/api/products/view/s_${product.uploadFileNames[0]}`} alt=""/></td>
                    <td className="px-4 py-4 text-gray-700 font-medium w-1/6">{product.pname}</td>
                    <td className="px-4 py-4 text-gray-600 w-1/6">{product.pdesc}</td>
                    <td className="px-4 py-4 text-gray-700 w-1/6">${product.price.toLocaleString()}</td>

                  </tr>
              ))
          ) : (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-500">No products available.</td>
              </tr>
          )}

          </tbody>
        </table>

        {/* Pagination UI */}
        <div className="flex justify-center mt-4">
          <ul className="flex space-x-2">
            {[1, 2, 3].map((pageNum) => (
                <li
                    key={pageNum}
                    className={`px-4 py-2 border rounded-md ${
                        page === pageNum
                            ? "bg-blue-500 text-white"
                            : "bg-white text-blue-500 hover:bg-blue-500 hover:text-white"
                    }`}
                    onClick={() => changePage(pageNum)} // 페이지 번호를 클릭하면 changePage 호출
                    style={{cursor: "pointer"}} // 클릭 가능하도록 스타일 추가
                >
                  {pageNum}
                </li>
            ))}
          </ul>
        </div>
      </div>
  );
}

export default ProductListComponent;
