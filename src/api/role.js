import Vue from 'vue'
import '../plugins/axios'

const request = Vue.axios

export const GetRolePage = (data) => {
  return request({
    method: 'post',
    url: '/role/getRolePage',
    data
  })
}

export const GetRoleList = () => {
  return request({
    method: 'get',
    url: '/role/getRoleList'
  })
}

export const DeleteRole = (id) => {
  return request({
    method: 'delete',
    url: 'role/deleteRole/id?id='+id
  })
}

export const GetRole = (id) => {
  return request({
    method: 'get',
    url: '/role/getRole/id?id='+id
  })
}

export const UpdateRole = (data) => {
  return request({
    method: 'put',
    url: '/role/updateRole',
    data
  })
}

export const AddRole = (data) => {
  return request({
    method: 'put',
    url: '/role/addRole',
    data
  })
}
