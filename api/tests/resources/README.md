They keys in this folder are only used for automated testing. They do not need to be protected and can be safely checked into version control.  The certificate is a self-signed x509 certificate for including in the jwks file.

To generate more, use the following command:
`openssl req -x509 -newkey rsa:4096 -keyout key1.pem -out key1-cert.pem -sha256 -days 99999 -nodes -subj '/CN=localhost'`
This can be done in the maintenance container.
