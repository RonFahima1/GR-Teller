if (typeof global.Request === 'undefined') {
  global.Request = function () {};
}
if (typeof global.Response === 'undefined') {
  global.Response = function () {};
  global.Response.json = function () {};
}
if (typeof global.NextResponse === 'undefined') {
  global.NextResponse = {
    json: (data, init) => ({
      status: (init && init.status) || 200,
      json: () => Promise.resolve(data),
    }),
  };
} 