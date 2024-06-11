FROM mcr.microsoft.com/appsvc/php:8.2-fpm-xdebug_20230908.3.tuxprod

# once we upgrade to buildkit we can use heredocs: https://www.docker.com/blog/introduction-to-heredocs-in-dockerfiles/
RUN printf ' \n\
server {                                                               \n\
    listen 8001;                                                       \n\
    root /home/site/wwwroot;                                           \n\
    index index.php                                                    \n\
    server_name localhost;                                             \n\
    port_in_redirect off;                                              \n\
                                                                       \n\
    location ~* {                                                      \n\
        fastcgi_pass 127.0.0.1:9000;                                   \n\
        include fastcgi_params;                                        \n\
        fastcgi_param SCRIPT_FILENAME $document_root/public/index.php; \n\
    }                                                                  \n\
} ' > /etc/nginx/sites-available/default
