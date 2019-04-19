ibmcloud fn action create blog-javascript/getPosts src/getPosts.js --kind nodejs:10 --web true
ibmcloud fn action create blog-javascript/savePost src/savePost.js --kind nodejs:10 --web true
ibmcloud fn action create blog-javascript/updatePost src/updatePost.js --kind nodejs:10 --web true
ibmcloud fn action create blog-javascript/deletePost src/deletePost.js --kind nodejs:10 --web true
