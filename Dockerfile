FROM bitnami/nginx
COPY  ./public /opt/bitnami/nginx/html/vaccancies
COPY ./vhosts/vaccancies-vhost.conf /opt/bitnami/nginx/conf/vhosts/vaccancies-vhost.conf
USER 1001
ENTRYPOINT [ "/entrypoint.sh" ]
CMD [ "/run.sh" ]