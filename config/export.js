import axios from 'axios'
import store from '@/store'
export function exportXls(params, url, file_name) {
  const new_headers = { 'Authorization': 'bearer ' + store.getters.token }
  axios({ url: url,
    method: 'get',
    headers: new_headers,
    params: params,
    responseType: 'blob' })
    .then(res => {
      console.log(res)
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', file_name)
      document.body.appendChild(link)
      link.click()
    }).catch(res => {
      alert(res)
    })
}
