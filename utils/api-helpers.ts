export async function fetchGetJSON(url: string) {
  try {
    const data = await fetch(url).then(res => res.json())
    return data
  } catch (err) {
    throw new Error(err.message)
  }
}

export async function fetchPostJSON(url: string, token: string, data?: {}) {
  try {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data || {}), // body data type must match "Content-Type" header
    })
    let json = await response.json() // parses JSON response into native JavaScript objects
    console.log(json)
    return json;
  } catch (err) {
    console.log(err.message)
    throw new Error(err.message)
  }
}
