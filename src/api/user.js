import Vue from 'vue'
import '../plugins/axios'

const request = Vue.axios

export const GetUserPage = (data) => {
  return request({
    method: 'post',
    url: '/userManagement/page',
    data
  })
}

export const UpdatePassword = (data) => {
  return request({
    method: 'post',
    url: '/userManagement/updatePassword',
    data
  })
}

export const UpdateStatus = (data) => {
  return request({
    method: 'post',
    url: '/userManagement/status',
    data
  })
}

export const DeleteUser = (id) => {
  return request({
    method: 'post',
    url: '/userManagement/deleteManagement?id='+id
  })
}

export const GetUser = (id) => {
  return request({
    method: 'post',
    url: '/userManagement/details?id='+id
  })
}

export const UpdateUser = (data) => {
  return request({
    method: 'post',
    url: '/userManagement/updateManagement',
    data
  })
}

export const AddUser = (data) => {
  return request({
    method: 'post',
    url: '/userManagement/add',
    data
  })
}
