import Vue from 'vue'
import '../plugins/axios'

const request = Vue.axios

export const GetAdminPage = (data) => {
  return request({
    method: 'post',
    url: '/admin/getAdminPage',
    data
  })
}

export const UpdatePassword = (data) => {
  return request({
    method: 'put',
    url: '/admin/updatePassword',
    data
  })
}

export const UpdateStatus = (data) => {
  return request({
    method: 'put',
    url: '/admin/updateStatus',
    data
  })
}

export const DeleteAdmin = (id) => {
  return request({
    method: 'delete',
    url: '/admin/deleteAdmin/id?id='+id
  })
}

export const GetAdmin = (id) => {
  return request({
    method: 'get',
    url: '/admin/getAdmin/id?id='+id
  })
}

export const UpdateAdmin = (data) => {
  return request({
    method: 'put',
    url: '/admin/updateAdmin',
    data
  })
}

export const AddAdmin = (data) => {
  return request({
    method: 'post',
    url: '/admin/addAdmin',
    data
  })
}
