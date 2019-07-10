import Vue from 'vue'
import '../plugins/axios'

const request = Vue.axios

export const GetCodePage = (data) => {
  return request({
    method: 'post',
    url: '/codes/page',
    data
  })
}

export const UpdateStatus = (data) => {
  return request({
    method: 'post',
    url: '/codes/updateStatus',
    data
  })
}

export const DeleteCode = (id) => {
  return request({
    method: 'post',
    url: '/codes/delete?getId='+id
  })
}

export const Codedetails = (id) => {
  return request({
    method: 'post',
    url: '/codes/details?getId='+id
  })
}

export const UpdateCode = (data) => {
  return request({
    method: 'post',
    url: '/codes/update',
    data
  })
}

export const AddCode = (data) => {
  return request({
    method: 'post',
    url: '/codes/add',
    data
  })
}
