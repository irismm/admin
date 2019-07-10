import Vue from 'vue'
import '../plugins/axios'

const request = Vue.axios

export const GetImformationPage = (data) => {
  return request({
    method: 'post',
    url: '/question/page',
    data
  })
}

export const SelectType = () => {
  return request({
    method: 'post',
    url: '/question/selectType'
  })
}

export const SelectTopic = () => {
  return request({
    method: 'post',
    url: '/question/selectTopic'
  })
}


export const SelectPage = (data) => {
  return request({
    method: 'post',
    url: '/question/selectPage',
    data
  })
}

export const UpdateStatus = (data) => {
  return request({
    method: 'post',
    url: '/question/updateStatus',
    data
  })
}

export const DeleteData = (id) => {
  return request({
    method: 'post',
    url: '/question/delete?getID='+id
  })
}

export const GetDatails = (id) => {
  return request({
    method: 'post',
    url: '/question/details?getId='+id
  })
}

export const DeleteBankOption = (id) => {
  return request({
    method: 'post',
    url: '/question/deleteBankOption?id='+id
  })
}


export const UpdateImformation = (data) => {
  return request({
    method: 'post',
    url: '/question/updateQuestion',
    data
  })
}

export const AddImformation = (data) => {
  return request({
    method: 'post',
    url: '/question/addQuestion',
    data
  })
}
