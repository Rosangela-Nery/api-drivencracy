const status_code = Object.freeze({
    ok: 200,
    created: 201,
    bad_request: 400,
    unauthorized: 401,
    forbidden: 403,
    not_found: 404,
    conflict: 409,
    unprocessable_entity: 422,
    server_error: 500,
});

export { status_code }