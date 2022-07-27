import { AxiosRequestConfig } from 'axios'

import { mapObjectToQueryParams, TValue } from '@/lib/helpers'
import { ApiResponse, TPaginatedData } from '@/types/common'

import { client } from '../api'
import { TModuleName } from '../modules'

// Get single asset by slug
interface IGetAssetBySlugArgs {
  moduleName: TModuleName
  slug: string
  token?: string
}

export async function getAssetBySlug<DataType>({
  moduleName,
  slug,
  token,
}: IGetAssetBySlugArgs) {
  const config: AxiosRequestConfig = token
    ? { headers: { 'x-auth-token': token } }
    : {}

  const { data } = await client.get<ApiResponse<DataType>>(
    `/${moduleName}/by-slug/${slug}`,
    config,
  )

  return data.data
}

// Get data list
export async function getDataList<DataType>(
  moduleName: TModuleName,
): Promise<DataType[]> {
  const { data } = await client.get<ApiResponse<DataType[]>>(
    `/${moduleName}/list`,
  )
  return data.data
}

// Get paginated data
export async function getPaginatedData<
  ParamsType extends Record<string, TValue>,
  DataType,
>(params: ParamsType, moduleName: TModuleName) {
  const query = mapObjectToQueryParams(params)
  const { data } = await client.get<ApiResponse<TPaginatedData<DataType>>>(
    `/${moduleName}?${query}`,
  )
  return data.data
}

// Create new document
export async function createDocument<CreateDto, ReturnType>(
  input: CreateDto,
  moduleName: TModuleName,
): Promise<ApiResponse<ReturnType>> {
  const { data } = await client.post<ApiResponse<ReturnType>>(
    `/${moduleName}`,
    input,
  )
  return data
}

// Update document
export async function updateDocument<UpdateDto, ReturnType>(
  id: number,
  input: UpdateDto,
  moduleName: TModuleName,
): Promise<ApiResponse<ReturnType>> {
  const { data } = await client.patch<ApiResponse<ReturnType>>(
    `/${moduleName}/${id}`,
    input,
  )
  return data
}

// Delete document
export async function deleteDocument<ReturnType>(
  id: number,
  moduleName: TModuleName,
): Promise<ApiResponse<ReturnType>> {
  const { data } = await client.delete<ApiResponse<ReturnType>>(
    `/${moduleName}/${id}`,
  )
  return data
}

// Like document
export async function likeDocument<ReturnType>(
  id: number,
  moduleName: TModuleName,
): Promise<ApiResponse<ReturnType>> {
  const { data } = await client.post<ApiResponse<ReturnType>>(
    `/like-${moduleName}/${id}`,
  )
  return data
}

// Unlike document
export async function unlikeDocument<ReturnType>(
  id: number,
  moduleName: TModuleName,
): Promise<ApiResponse<ReturnType>> {
  const { data } = await client.delete<ApiResponse<ReturnType>>(
    `/like-${moduleName}/${id}`,
  )
  return data
}
