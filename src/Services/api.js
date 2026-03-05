import { base_url } from "./base_url";
import { comonApi } from "./comonApi";

export const signupApi = async (userData) => {
    return await comonApi("POST", `${base_url}/api/user/signup`, userData)
}

export const loginApi = async (userData) => {
    return await comonApi("POST", `${base_url}/api/user/login`, userData)
}

export const verifyTokenApi = async () => {
    return await comonApi("GET", `${base_url}/api/user/verify`, "")
}

export const logoutApi = async () => {
    return await comonApi("POST", `${base_url}/api/user/logout`, {})
}


export const addCategoryApi = async (categoryData) => {
    return await comonApi("POST", `${base_url}/api/product/category/add`, categoryData)
}

export const addSubCategoryApi = async (subCategoryData) => {
    return await comonApi("POST", `${base_url}/api/product/subcategory/add`, subCategoryData)
}

export const addProductApi = async (productData) => {
    return await comonApi("POST", `${base_url}/api/product/add`, productData)
}

export const getProductByIdApi = async (id) => {
    return await comonApi("GET", `${base_url}/api/product/details/${id}`, "")
}

export const getCategoriesApi = async () => {
    return await comonApi("GET", `${base_url}/api/product/category/all`, "")
}

export const getSubCategoriesApi = async (categoryId) => {
    return await comonApi("GET", `${base_url}/api/product/subcategory/${categoryId}`, "")
}

export const getProductsApi = async (params) => {
    const queryString = new URLSearchParams(params).toString();
    return await comonApi("GET", `${base_url}/api/product/all?${queryString}`, "")
}

export const updateProductApi = async (id, productData) => {
    return await comonApi("PUT", `${base_url}/api/product/update/${id}`, productData)
}

export const toggleWishlistApi = async (productId) => {
    return await comonApi("POST", `${base_url}/api/wishlist/toggle`, { productId })
}

export const getWishlistApi = async () => {
    return await comonApi("GET", `${base_url}/api/wishlist/all`, "")
}
