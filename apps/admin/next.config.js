/** @type {import('next').NextConfig} */

module.exports = {
   async headers() {
      return [
         {
            source: '/:path*',
            headers: [
               {
                  key: 'Access-Control-Allow-Origin',
                  value: '*',
               },
               {
                  key: 'Access-Control-Allow-Methods',
                  value: 'GET, POST, OPTIONS',
               },
               {
                  key: 'Access-Control-Allow-Headers',
                  value: 'Content-Type, Authorization',
               },
            ],
         },
      ]
   },
}
