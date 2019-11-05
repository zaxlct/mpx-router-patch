import { stringify } from './querystring'

export function parseUrl(location) {
  if (typeof location === 'string') return location

  const { path, query } = location
  const queryStr = stringify(query)

  if (!queryStr) {
    return path
  }

  return `${path}?${queryStr}`
}

function parseRoute(page) {
  const path = page.route
  return {
    path: `/${path}`,
    params: {},
    query: page.options,
    hash: '',
    fullPath: parseUrl({
      path: `/${path}`,
      query: page.options
    }),
    name: path && path.replace(/\/(\w)/g, ($0, $1) => $1.toUpperCase())
  }
}

function push(location, complete, fail, success) {
  const url = parseUrl(location)
  const params = { url, complete, fail, success }

  if (location.isTab) {
    wx.switchTab(params)
    return
  }
  if (location.reLaunch) {
    wx.reLaunch(params)
    return
  }
  wx.navigateTo(params)
}

function replace(location, complete, fail, success) {
  const url = parseUrl(location)
  wx.redirectTo({ url, complete, fail, success })
}

function go(delta) {
  wx.navigateBack({ delta })
}

function back() {
  wx.navigateBack()
}

export let _Vue

export default function install(Vue) {
  const _router = {
    mode: 'history',
    push,
    replace,
    go,
    back
  }

  Vue.mixin({
    onLoad() {
      this.$route = parseRoute(this)
    },
  }, 'page')

  Object.defineProperty(Vue.prototype, '$router', {
    get() { return _router }
  })
}
