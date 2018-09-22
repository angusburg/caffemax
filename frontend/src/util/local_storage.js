function createLocalStorageObject(namespace, fields) {
  const wrapper = fields.reduce((object, key) => {
    object[key] = localStorage.getItem(`${namespace}_${key}`)
    return object
  }, {})

  function set(key, value) {
    wrapper[key] = value
    localStorage.setItem(`${namespace}_${key}`, value)
  }

  function clear() {
    fields.forEach(key => {
      wrapper[key] = null
      localStorage.removeItem(`${namespace}_${key}`)
    })
  }

  return {...wrapper, set, clear}
}

export {createLocalStorageObject}
