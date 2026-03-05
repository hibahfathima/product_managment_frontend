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

export const getCategoriesApi = async () => {
    return await comonApi("GET", `${base_url}/api/product/category/all`, "")
}

export const getSubCategoriesApi = async (categoryId) => {
    return await comonApi("GET", `${base_url}/api/product/subcategory/${categoryId}`, "")
}

export const getProductsApi = async (subCategoryId) => {
    return await comonApi("GET", `${base_url}/api/product/${subCategoryId}`, "")
}

