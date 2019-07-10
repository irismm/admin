import Vue from 'vue'
import '../plugins/axios'

const request = Vue.axios

export const GetEnterprisePage = (data) => {
  return request({
    method: 'post',
    url: '/enterprise/getEnterprisePage',
    data
  })
}

export const UpdateStatus = (data) => {
  return request({
    method: 'put',
    url: '/enterprise/deleteEnterprise',
    data
  })
}

export const DeleteEnterprise = (id) => {
  return request({
    method: 'delete',
    url: '/enterprise/deleteEnterprise?id='+id
  })
}

export const GetEnterprise = (id) => {
  return request({
    method: 'get',
    url: '/enterprise/getEnterprise/id?id='+id
  })
}

export const UpdateEnterprise = (data) => {
  return request({
    method: 'put',
    url: '/enterprise/updateEnterprise',
    data
  })
}

export const AddEnterprise = (data) => {
  return request({
    method: 'post',
    url: '/enterprise/addEnterprise',
    data
  })
}

export const GetEnterpriseList = () => {
  return request({
    method: 'get',
    url: '/enterprise/getEnterpriseList'
  })
}
