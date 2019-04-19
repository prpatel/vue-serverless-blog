ibmcloud fn api create -n "Blog Posts" /blog /posts/{_id} get blog-javascript/getPosts --response-type http
ibmcloud fn api create /blog /posts GET blog-javascript/getPosts                       --response-type http
ibmcloud fn api create /blog /posts post blog-javascript/savePost                     --response-type http
ibmcloud fn api create /blog /posts/{_id} put blog-javascript/updatePost                --response-type http
ibmcloud fn api create /blog /posts/{_id} DELETE blog-javascript/deletePost          --response-type json
