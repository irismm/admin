import Vue from 'vue'
import '../plugins/axios'

const request = Vue.axios

export const GetAuthorityPage = (data) => {
  return request({
    method: 'post',
    url: '/authority/getAuthorityPage',
    data
  })
}

export const DeleteAuthority = (id) => {
  return request({
    method: 'delete',
    url: '/authority/deleteAuthority/id?id='+id
  })
}

export const GetAuthority = (id) => {
  return request({
    method: 'get',
    url: '/authority/getAuthority/id?id='+id
  })
}

export const UpdateAuthority = (data) => {
  return request({
    method: 'put',
    url: '/authority/updateAuthority',
    data
  })
}

export const AddAuthority = (data) => {
  return request({
    method: 'post',
    url: '/authority/addAuthority',
    data
  })
}

export const GetAuthorityList = () => {
  return request({
    method: 'get',
    url: '/authority/getAuthorityList'
  })
}
