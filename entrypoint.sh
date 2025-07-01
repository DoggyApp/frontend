#!/bin/sh

cat <<EOF > /usr/share/nginx/html/assets/config.js
window._env_ = {
  LOAD_BALANCER_URL: "$LOAD_BALANCER_URL"
};
EOF

# Start Nginx
exec nginx -g "daemon off;"