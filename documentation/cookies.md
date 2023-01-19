# Cookies

There are various cookies present on production, ownership of cookies varies. Here are the cookies present and some details about them.

## ARRAffinity

This is a cookie controlled by Microsoft Azure. Its purpose is to direct clients to specific instances. 
[Additional information](https://azure.microsoft.com/en-us/blog/disabling-arrs-instance-affinity-in-windows-azure-web-sites/).
May be controlled in Azure settings at `Settings -> Configuration -> General Settings -> Platform Settings`.

## ARRAffinitySameSite

This cookie is also controlled by Microsoft Azure. It is similar in purpose to `ARRAffinity`, but works with a relatively new `SameSite` browser attribute.

## TS012e8da0

This cookie is security related and is affiliated with F5 load balancers. Validation of cookies, session expiration, and ASM Frame integrity. 
[Additional information](https://support.f5.com/csp/article/K6850).
F5 provides an Application Security Manager (ASM) which is for security purposes, it controls traffic. This belongs to whoever owns the firewall.
[ASM](https://www.f5.com/pdf/products/big-ip-application-security-manager-overview.pdf)
