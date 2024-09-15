type RedirectFnOptions = {
  defaultPath: string
  url: URL
}

export function redirectFn(options: RedirectFnOptions) {
  const { defaultPath, url } = options

  return (path: string = defaultPath) => {
    return new Response(null, {
      status: 303,
      headers: {
        Location: `${url.origin}/${path}`,
        'Cache-Control': 'no-cache',
      },
    })
  }
}
