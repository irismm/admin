import Vue from 'vue'
import '../plugins/axios'

const request = Vue.axios

export const GetStatus = () => {
  return request({
    method: 'get',
    url: '/common/getAdmin'
  })
}

export const GetLabel = () => {
  return request({
    method: 'get',
    url: '/common/getLabel'
  })
}

export const GetByAreaParentCode = (code) => {
  return request({
    method: 'get',
    url: '/common/getByAreaParentCode/code?code='+code
  })
}

export const GetAreaCode = (code) => {
  return request({
    method: 'get',
    url: '/common/getAreaCode/code?code='+code
  })
}
export const AddLabel = (value) => {
  return request({
    method: 'get',
    url: '/common/addLabel/name?name='+value
  })
}
